import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default function ressources(req, res) {
  const connect = async () => {
    const client = await clientPromise;
    const db = await client.db(process.env.MONGO_DB_NAME);
    return db;
  };

  const getRessources = async (db, res) => {
    try {
      const resources = await db.collection("resources").find({}).toArray();
      return res.status(200).json({ resources });
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const addResource = async (db, res, resource, token) => {
    try {
      const newResource = await createResourceModel(resource, token);
      console.log("resource", newResource);
      const add = await db.collection("resources").insertOne(newResource);
      return res.status(201).json({ add });
    } catch (err) {
      return res.status(404).json({ err });
    }
  };

  const createResourceModel = async (resource, token) => {
    const {
      resourceType,
      categories,
      title,
      content,
      startDate,
      endDate,
      thumbnail,
      description,
    } = resource;

    const newUser = {
      resourceType,
      categories,
      author: ObjectId(await getAuthor(token)),
      hasParticipants: [],
      moderationValidation: false,
      publicationStatus: "public",
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate,
      endDate,
      place: {
        city: "",
        zipCode: "",
        region: "",
      },
      likes: 0,
      thumbnail,
      description,
      validationStatus: false,
    };

    return newUser;
  };

  const getAuthor = async (token) => {
    console.log("pouet", token)
    // Ajout
    jwt.verify(token, process.env.JWT_SECRET, function (err) {
      if (err) {
        console.log("non")
        return res.status(401).json({
          name: err.name,
          expiredAt: err.expiredAt,
        });
      }
    });
    const user = jwt.decode(token);
    const { id } = user.data;
    return id;
  };

  const getRoute = async (req, res) => {
    const db = await connect();

    switch (req.method) {
      case "GET": {
        return await getRessources(db, res);
      }
      case "POST": {
        const resource = req.body;
        const token = req.headers?.authorization
          ? req.headers.authorization
          : null;
        return await addResource(db, res, resource, token);
      }
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };

  return getRoute(req, res);
}

//! Detail de la structure de media, externalLink et place a faire + corriger les oneOf
/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         id:
 *           type: uuid
 *           description: l'id de la ressource.
 *           example: trouver un truc
 *         resourceType:
 *           type: string
 *           description: Le type de la ressource.
 *           schema :
 *             oneOf: ["event", "association"]
 *             example: event
 *         categories:
 *           type: array
 *           description: Les categories de la ressource.
 *           example: ["uuid wanted"]
 *         author:
 *           type: int
 *           description: L'id de l'auteur de la ressource.
 *           example: uuid wanted
 *         hasParticipants:
 *           type: array
 *           description: Les utilisateurs inscrits pour l'evenement.
 *           example: ["uuid wanted"]
 *         moderationValidation:
 *           type: boolean
 *           description: La ressource a été validée par un administrateur.
 *           example: true
 *         publicationStatus:
 *           type: string
 *           description: Le statut de la ressource.
 *           schema :
 *             oneOf: ["public", "private"]
 *             example: public
 *         title:
 *           type: string
 *           description: Le titre de la ressource
 *           example: Distribution de fournitures scolaires pour la rentrée
 *         contentId:
 *           type: uuid
 *           description: Le contenu rattaché à la ressource
 *           example: "uuid wanted"
 *         externalLinks:
 *           type: array
 *           description: Les liens externes de la ressource.
 *           example: [{active: false, type: "twitter",link: "https://twitter.com/lillefrance/status/1409978077015388168?s=20"}]
 *         likes:
 *           type: int
 *           description: Le nombre de likes attachés à la publication.
 *           example: 12
 *         createdAt:
 *           type: date
 *           description: La date de création de la ressource.
 *           example: 1630792800
 *         updatedAt:
 *           type: date
 *           description: La date de mise à jour de la ressource.
 *           example: 1630792800
 *         startDate:
 *           type: date
 *           description: La date de début de l'evenement.
 *           example: 1630792800
 *         endDate:
 *           type: date
 *           description: La date de fin de l'evenement.
 *           example: 1630792800
 *         place:
 *           type: object
 *           description: La localisation de la ressource.
 *           example: {"city": "Lille","zipCode": "59000","region": "Hauts-de-France"}
 *         media:
 *           type: array
 *           description: Les fichiers media attachées a la ressource.
 *           example: [url: "https://media.giphy.com/media/Lopx9eUi34rbq/giphy.gif"]
 */

/**
 * @swagger
 * /resources:
 *   get:
 *     tags : [resources]
 *     description: Renvoie la liste des ressources.
 *     responses:
 *       200:
 *         description: L'ensemble des ressources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "fdkjsfjd"
 *   post:
 *     tags : [resources]
 *     description: Créé une nouvelle ressource.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       201:
 *         description: La ressource nouvellement crée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Echec de la requête.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "fdkjsfjd"
 */
