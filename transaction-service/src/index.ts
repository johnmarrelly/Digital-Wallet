import dotenv from "dotenv";
import { app } from "./server";
import MongoConnection from "./database-connections/mongodb";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

startServer();

async function connectToServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      resolve(server);
    });

    server.on("error", (err) => {
      console.error("Server startup error:", err);
      reject(err);
    });
  });
}

async function connectToDatabase() {
  try {
    const mongoConnection = new MongoConnection(
      `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}` ?? ""
    );
    await mongoConnection.run();
    console.log("Database connection established");
  } catch (err) {
    console.log(err);
  }
}

async function startServer() {
  try {
    await connectToDatabase();
    await connectToServer();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
