import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
require("dotenv").config();

const PORT = 5000;
let server: Server;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@cluster0.bmhyihx.mongodb.net/library-management-system?retryWrites=true&w=majority&appName=Cluster0`
    );
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
