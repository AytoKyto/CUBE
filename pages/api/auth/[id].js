import clientPromise from "../../../lib/mongodb";
import sendConfirmationEmail from "../../../lib/nodemailer";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import { getPaperUtilityClass } from "@mui/material";

export default function auth(req, res) {
  const connect = async () => {
    const client = await clientPromise;
    const db = await client.db(process.env.MONGO_DB_NAME);
    return db;
  };

  //TODO - Ptite refacto la
  const signIn = async (credentials, refetchInterval) => {
    try {
      const { email, password } = credentials;
      const db = await connect();
      const user = await db
        .collection("users")
        .find({ email, password })
        .toArray();

      if (user.length !== 0 && user[0].validationStatus) {
        const { firstName, lastName, role, _id } = user.shift();
        const token = jwt.sign(
          { data: { id: _id, firstName, lastName, role } },
          process.env.JWT_SECRET,
          {
            expiresIn: refetchInterval,
          }
        );
        res.status(200).json({
          token,
        });
      } else {
        if (!user[0].validationStatus) {
          return res.status(401).json({
            message: "Vous devez vérifier votre compte avant de vous connecter",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .json({ message: "Adresse mail ou mot de passe incorrect" });
    }
  };

  const signUp = async (user) => {
    try {
      const newUser = generateUserModel(user);
      const db = await connect();
      const { email } = user;
      const isEmailUnique = await db
        .collection("users")
        .find({ email })
        .toArray();

      const emailIsValid = await validateEmail(email);
      if (isEmailUnique.length === 0 && emailIsValid.email === email) {
        await db.collection("users").insertOne(newUser);

        sendConfirmationEmail(
          newUser.lastName,
          newUser.firstName,
          newUser.email,
          newUser.confirmationCode
        );

        return res.status(201).json({ newUser });
      } else {
        if (emailIsValid !== email) {
          return res
            .status(400)
            .json({ message: "Une adresse email valide est requise" });
        } else {
          return res
            .status(409)
            .json({ message: "Cette adresse email est deja utilisée" });
        }
      }
    } catch (err) {
      console.log("POST USER ERROR");
      console.log(err);
      return res.status(404).json({ err });
    }
  };

  // Bon, dans un monde parfait, c'est dans un middleware mais bon hein
  const validateEmail = async (email) => {
    const emailSchema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    });

    try {
      return await emailSchema.validateAsync({ email });
    } catch (err) {
      return err;
    }
  };

  const generateConfimationCode = () => uuidv4();

  const generateUserModel = (user) => {
    const { lastName, firstName, email, password } = user;
    const newUser = {
      lastName,
      firstName,
      email,
      password,
      profilePic: "",
      seen: [],
      hasEvents: [],
      hasEventsCreated: [],
      likes: [],
      conversations: [],
      role: ObjectId("61e165463d88f191f3f4e0d4"),
      validationStatus: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      confirmationCode: generateConfimationCode(),
      isReported: false,
    };

    return newUser;
  };

  const confirmSignUp = async (id) => {
    try {
      const db = await connect();
      const confirmationCode = id;
      const filter = { confirmationCode };
      const updatedUser = {
        $set: {
          confirmationCode: "",
          validationStatus: true,
          updatedAt: Date.now(),
        },
      };
      const update = await db
        .collection("users")
        .updateOne(filter, updatedUser);

      res.writeHead(302, {
        Location: "/welcome",
      });

      return res.end();
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const checkToken = async (token) => {
    // Verifie si le token est valide
    jwt.verify(token, process.env.JWT_SECRET, function (err) {
      if (err) {
        return res.status(401).json({
          name: err.name,
          expiredAt: err.expiredAt,
        });
      }
    });
    // Faire expirer le token a la deco
    return res.status(200).json();
  };

  const getPermissions = async (id) => {
    try {
      const db = await connect();
      const userRole = await db
        .collection("roles")
        .find({ _id: ObjectId(id.trim()) })
        .toArray();
      return res.status(200).json({ userRole });
    } catch (err) {
      return res.status(404).json({ message: "Aucun rôle trouvé" });
    }
  };

  const getRoute = async (req, res) => {
    const id = req.query.id;
    const token = req.body.headers?.Authorization
      ? req.body.headers.Authorization
      : null;

    switch (id) {
      case "signIn":
        const { credentials, refetchInterval } = req.body;
        return await signIn(credentials, refetchInterval);
      case "signUp":
        const { user } = req.body;
        return await signUp(user);
      case "checkToken":
        return await checkToken(token);
      case "confirm":
        const code = req.query.code;
        return await confirmSignUp(code);
      case "permissions":
        return await getPermissions(req.body.id);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };

  return getRoute(req, res);
}

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     tags : [users, auth]
 *     description: Permet à un utilisateur de s'inscrire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *     responses:
 *       201:
 *         description: L'utilisateur a été crée
 *       404:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur lors de l'inscription"
 * /auth/signIn:
 *   post:
 *     tags : [users, auth]
 *     description: Permet à un utilisateur de se connecter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credentials:
 *                 type: object
 *                 schema:
 *                 $ref: '#/components/schemas/Credentials'
 *               refetchInterval:
 *                 type: string
 *                 example: "1d"
 *     responses:
 *       200:
 *         description: L'utilisateur a été crée
 *       401:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Adresse mail ou mot de passe incorrect"
 * /auth/getPermissions:
 *   post:
 *     tags : [users, auth]
 *     description: Permet à un utilisateur de se connecter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "61e165463d88f191f3f4e0d4"
 *     responses:
 *       200:
 *         description: Le rôle de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Aucun rôle n'a été trouvé"
 *
 *
 */
