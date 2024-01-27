import mongoose from "mongoose";

export default class MongoConnection {
  private uri: string = "";
  constructor(uri: string) {
    this.uri = uri;
  }

  public async run() {
    try {
      console.log(this.uri);
      await mongoose.connect(this.uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
}
