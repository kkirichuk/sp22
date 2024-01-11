import express, { Express, Request, Response } from "express";
import { MongoClient, ObjectId } from 'mongodb' 
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3000;

async function run() {
  const url = process.env.DATABASE_URL || '';
  const client = new MongoClient(url);

  await client.connect();

  const database = client.db('Database');
  const positionCollection = database.collection('positions');

  // get endpoint, to fetch all data
  app.get("/", async (req: Request, res: Response) => {
    const databaseResponse = await positionCollection.find().toArray();
    res.json(databaseResponse);
  });

  // post endpoint, to create/add a new entry
  app.post("/", async (req: Request, res: Response) => {
    const obj = {
      ...req.body,
      updatedAt: new Date(),
      createdAt: new Date()
    }
    const result = await positionCollection.insertOne(obj)
    res.json(result.insertedId);
  });

  // put endpoint, to edit an specific entry
  app.put("/:id", async (req: Request, res: Response) => {
    let result = { modifiedCount: 0 }
    try {
      const obj = {
        ...req.body,
        updatedAt: new Date()
      }
      result = await positionCollection.updateOne({ _id: new ObjectId(req.params.id)}, { $set: obj })
    } catch (err) { 
      console.error(err)
    }
    res.json(result.modifiedCount);
  });

  // delete endpoint, to delete a specific entry
  app.delete("/:id", async (req: Request, res: Response) => {
    let result = { deletedCount: 0 }
    try {
      result = await positionCollection.deleteOne({ _id: new ObjectId(req.params.id) })
    } catch (err) {
      console.error(err)
    }
    return res.json(result.deletedCount);
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

run()



