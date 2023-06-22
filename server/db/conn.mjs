import {MongoClient} from "mongodb";
const connectionString = process.env.EC2_URI || "";
const client = new MongoClient(connectionString);

let conn;
try{
    conn = await client.connect();
    console.log(`Successfully connected to MongoDB`);
}catch(e){
    console.error(e);
}

let db=conn.db("quizUserdb");
export default db;