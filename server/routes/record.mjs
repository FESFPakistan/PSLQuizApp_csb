import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
    let collection = await db.collection("records");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
    // res.set('Content-Type', 'text/html');
    // res.send(Buffer.from('<h2>Test String</h2>'));
  });

  // This section will help you get a single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("records");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

  // This section will help you create a new record.
router.post("/quizData", async (req, res) => {
  try{
    const { sections, Quiz } = req.body;

    const newDocuments = sections.map(item => {
    const { questions } = item;
    const createdAt = new Date();
      //loop for questions start
    const quizSubmissions = questions.map(item => {
      const { id, type, userValue } = item;

      return {
        id,
        type,
        userValue
      };
    });
      //loop for questions end
      return {
        createdAt: createdAt.toLocaleString(),
        questions,
        quizSubmissions
      };
    });
    
    console.log(newDocuments+'from Record.mjs');
    let collection = await db.collection("quizResponse");
    let result = await collection.insertMany(newDocuments);
    res.status(200).send('Quiz data saved successfully');

  }
  catch(error){
    console.error('Error saving quiz data:', error);
    res.status(500).send('Error saving quiz data');
  }

  });

  // This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
        email: req.body.email,
      }
    };
  
    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
  });

  // This section will help you delete a record
router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
  
    const collection = db.collection("records");
    let result = await collection.deleteOne(query);
  
    res.send(result).status(200);
  });

  export default router;