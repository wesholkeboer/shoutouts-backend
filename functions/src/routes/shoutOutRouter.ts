import express from "express";
import { getClient } from "../db";
import ShoutOut from "../models/ShoutOut";

const shoutOutRouter = express.Router();

const catchError = (err: any, res: any) => {
  console.error("FAIL", err);
  res.status(500).json({ message: "internal server error" });
};

shoutOutRouter.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const results = await client
      .db()
      .collection<ShoutOut>("shoutouts")
      .find()
      .toArray();
    res.json(results);
  } catch (err) {
    catchError(err, res);
  }
});

shoutOutRouter.get("/user/:name", async (req, res) => {
  const name: string = req.params.name;
  try {
    const client = await getClient();
    const results = await client
      .db()
      .collection<ShoutOut>("shoutouts")
      .find({ to: name })
      .toArray();
    res.json(results);
  } catch (err) {
    catchError(err, res);
  }
});

shoutOutRouter.post("/", async (req, res) => {
  const newShoutOut: ShoutOut = req.body;
  try {
    const client = await getClient();
    await client.db().collection<ShoutOut>("shoutouts").insertOne(newShoutOut);

    res.status(201).json(newShoutOut);
  } catch (err) {
    catchError(err, res);
  }
});

export default shoutOutRouter;
