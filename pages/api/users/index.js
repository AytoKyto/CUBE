import clientPromise from "../../../lib/mongodb";

export default function users(req, res) {
  const connect = async () => {
    const client = await clientPromise;
    const db = await client.db(process.env.MONGO_DB_NAME);
    return db;
  };

  const userRoleAssignation = async (user) => {
    try {
      const db = await connect();
      const userRole = await db
        .collection("roles")
        .findOne({ type: user.role });
      user.role = userRole._id;
      return user;
    } catch (err) {
      console.log("Error in role assignation");
      console.log(err);
    }
  };

  const getUsers = async (db, res) => {
    try {
      const users = await db.collection("users").find({}).toArray();
      return res.status(200).json({ users });
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const addUser = async (db, res, user) => {
    //assign the appropriate role
    user = await userRoleAssignation(user);
    try {
      const client = await clientPromise;
      const db = await client.db(process.env.MONGO_DB_NAME);
      const newUser = await db.collection("users").insertOne(user);
      return res.status(201).json({ newUser });
    } catch (err) {
      console.log("POST USER ERROR");
      console.log(err);
      return res.status(404).json({ err });
    }
  };

  const getRoute = async (method, req, res) => {
    const db = await connect();

    switch (method) {
      case "GET": {
        return await getUsers(db, res);
      }
      case "POST": {
        const user = req.body;
        return await addUser(db, res, user);
      }
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  return getRoute(req.method, req, res);
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: uuid
 *           description: la description de l'erreur retournée.
 *           example: 61e165463d88f191f3f4e0d4
 *         createdAt:
 *           type: date
 *           description: La date de création de la ressource.
 *           example: 1630792800
 *         updatedAt:
 *           type: date
 *           description: La date de mise à jour de la ressource.
 *           example: 1630792800
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: uuid
 *           description: l'id de l'utilisateur.
 *           example: 61e165463d88f191f3f4e0d4
 *         lastName:
 *           type: string
 *           description: Le nom de l'utilisateur.
 *           example: Levasseur
 *         firstName:
 *           type: string
 *           description: Le prénom de l'utilisateur.
 *           example: Alain
 *         email:
 *           type: string
 *           description: L'adresse mail utilisée pour l'inscription.
 *           example: alain.levasseur@dayrep.com
 *         password:
 *           type: string
 *           description: Le hash du mot de passe.
 *           example: 8745de6abbc5a0b632fccdae08e53b3f
 *         isReported:
 *           type: boolean
 *           description: L'utilisateur a été signalé comme problématiaue.
 *           example: true
 *         profilePic:
 *           type: string
 *           description: Le hash du mot de passe.
 *           example: https://media.giphy.com/media/HoM16cP7vaYU/giphy.gif
 *         seen:
 *           type: array
 *           description: Je sais pas ce que c'est.
 *           example: ["61e165463d88f191f3f4e0d4"]
 *         hasEvents:
 *           type: array
 *           description: Les evenements auxquels l'utilisateur participe.
 *           example: ["61e165463d88f191f3f4e0d4"]
 *         hasEventsCreated:
 *           type: array
 *           description: Les evenements crées par l'utilisateur.
 *           example: ["61e165463d88f191f3f4e0d4"]
 *         likes:
 *           type: array
 *           description: Les ressources favorites de l'utilisateur.
 *           example: ["61e165463d88f191f3f4e0d4"]
 *         conversations:
 *           type: array
 *           description: Les conversations liées à l'utilisateur.
 *           example: ["61e165463d88f191f3f4e0d4"]
 *         role:
 *           type: string
 *           description: Le rôle de l'utilisateur.
 *           example: 8745de6abbc5a0b632fccdae08e53b3f
 *         validationStatus:
 *           type: boolean
 *           description: Le compte de l'utilisateur a été confirmé.
 *           example: true
 *         createdAt:
 *           type: date
 *           description: La date de création de la ressource.
 *           example: 1630792800
 *         updatedAt:
 *           type: date
 *           description: La date de mise à jour de la ressource.
 *           example: 1630792800
 *         confirmationCode:
 *           type: string
 *           description: le code de confirmation a l'inscription
 *           example: 61e165463d88f191f3f4e0d4
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags : [users]
 *     description: Retrouve la liste des utilisateurs.
 *     responses:
 *       200:
 *         description: L'ensemble des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No user found"
 *   post:
 *     tags : [users]
 *     description: Créé une nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: La catégorie nouvellement crée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No user found"
 */
