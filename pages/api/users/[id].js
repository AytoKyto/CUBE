import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default function userId(req, res) {
  const connect = async () => {
    const client = await clientPromise;
    const db = await client.db(process.env.MONGO_DB_NAME);
    return db;
  };

  const getUser = async (id, db, res) => {
    try {
      const user = await db
        .collection("users")
        .find({ _id: ObjectId(id) })
        .toArray();
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const deleteUser = async (id) => {
    try {
      const client = await clientPromise;
      const db = await client.db(process.env.MONGO_DB_NAME);
      const user = await db.collection("users").deleteOne({
        _id: ObjectId(id),
      });
      // [server_logs] confirm 200 from db
      console.log(`[200] DELETE user with id : ${id}`);
      // [server_logs] confirm if the item has been deleted ifnot show a warning
      user.result.n > 0
        ? console.log(`[SUCCESS] deletion confirmed`)
        : console.log(`[WARNING] No item deleted. Bad userId ? (${id})`);
      return res.status(200).json({ user });
    } catch (err) {
      // [server_logs]
      console.log(`[FAILED] DELETE user with id : ${id} : `);
      console.log(`Error response : \n${err}`);
      return res.status(404).json({ err });
    }
  };

  const updateUser = async (id, db, user, res) => {
    const objectId = new ObjectId(id);
    try {
      const filter = { _id: objectId };
      const updatedUser = {
        $set: {
          ...user,
        },
      };
      const update = await db
        .collection("users")
        .updateOne(filter, updatedUser);
      return res.status(204).json({ update });
    } catch (err) {
      console.log("error in updateUser");
      console.log(err);
      return res.status(404).json({ err });
    }
  };

  const fetchProfile = async (req, db, res, token) => {
    const user = jwt.decode(token);
    const { id } = user.data;
    return await getUser(id, db, res);
  };

  const fetchLikes = async (db, res, body) => {
    try {
      const test = await getLikes(res, db, body);
      console.log("helle", test);
    } catch (err) {}
    //return await ressources.getLikes(res, db, id);
  };

  const fetchEvents = async (db, res, token) => {
    const user = jwt.decode(token);
    const { id } = user.data;
    return await getEvents(res, db, id);
  };

  const getEvents = async (res, db, id) => {
    try {
      console.log(body);
      const likesArr = body.map((i) => ObjectId(i));
      const events = await db
        .collection("resources")
        .find({
          _id: {
            $in: likesArr,
          },
        })
        .toArray();

      return res.status(200).json({ events });
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const getLikes = async (res, db, body) => {
    try {
      console.log(body);
      const likesArr = body.map((i) => ObjectId(i));
      const resources = await db
        .collection("resources")
        .find({
          _id: {
            $in: likesArr,
          },
        })
        .toArray();

        console.log(resources);

      return res.status(200).json({ resources });
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const getRoute = async (req, res, next) => {
    const db = await connect();
    const user = req?.body ? req.body : null;

    switch (req.method) {
      case "GET": {
        const id = req.query.id.trim();
        return await getUser(id, db, res);
      }
      case "DELETE":
        return await deleteUser(id.toString());
      case "PUT":
        return await updateUser(id, db, user, res);
      case "POST":
        const query = req.query.data;
        console.log(req.body.headers?.Authorization);
        const token = req.body.headers?.Authorization
          ? req.body.headers.Authorization
          : null;
        // // Verifie si le token est valide

        console.log(query);

        if (query === "likes") {
          const body = req.body;
          const test = req.headers?.authorization
            ? req.headers?.authorization
            : null;

          jwt.verify(test, process.env.JWT_SECRET, function (err) {
            if (err) {
              console.log(err);
              return res.status(401).json({
                name: err.name,
                expiredAt: err.expiredAt,
              });
            }
          });
          return await fetchLikes(db, res, body);
        } else if (query === "events") {
          return await fetchEvents(db, res, body);
        } else {
          jwt.verify(token, process.env.JWT_SECRET, function (err) {
            if (err) {
              console.log(err);
              return res.status(401).json({
                name: err.name,
                expiredAt: err.expiredAt,
              });
            }
          });
          return await fetchProfile(req, db, res, token);
        }

      default:
        res.status(405).end("Method Not Allowed");
        break;
    }
  };

  return getRoute(req, res);
}

/**
 * @swagger
 * /users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: L'id de l'utilisateur.
 *       schema:
 *         type: integer
 *   get:
 *     tags : [users]
 *     description: Retrouve un utilisateur selon l'id.
 *     responses:
 *       200:
 *         description: L'utilisateur demandé
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
 *               message: "fdkjsfjd"
 *   put:
 *     tags : [users]
 *     description: Modifie les informations d'un utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: L'utilisateur avec les informations mises à jour
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
 *               message: "fdkjsfjd"
 *   delete:
 *     tags : [users]
 *     description: Supprime un utilisateur.
 *     responses:
 *       204:
 *         description:
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
 *               message: "fdkjsfjd"
 */

/**
 * @swagger
 * /users/profile:
 *   post:
 *     tags : [users]
 *     description: Récupère les informations liées à l'utilisateur connecté
 *     responses:
 *       200:
 *         description: L'utilisateur demandé
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
 *               message: "fdkjsfjd"
 */
