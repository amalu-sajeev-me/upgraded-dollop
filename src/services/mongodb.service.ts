import { injectable } from "tsyringe";
import mongoose, { Connection } from "mongoose";

@injectable()
export class MongoDB {
  private connection: Connection;

  constructor() {
    this.connect();
    this.setupEventListeners();
  }

  private connect() {
    const connectionString =
      process.env.MONGODB_URI ||
      "mongodb://admin:adminpassword@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true";

    mongoose.connect(connectionString, {});

    this.connection = mongoose.connection;
  }

  private setupEventListeners() {
    this.connection.on("error", (error) => {
      console.error("MongoDB Connection Error:", error);
    });

    this.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    this.connection.on("disconnected", () => {
      console.warn("Disconnected from MongoDB");
    });

    process.on("SIGINT", async () => {
      await this.connection.close();
      process.exit(0);
    });
  }

  getConnection() {
    return this.connection;
  }

  getMongoose() {
    return mongoose;
  }
}
