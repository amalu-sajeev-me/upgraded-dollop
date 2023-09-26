import { inject, injectable, singleton } from "tsyringe";
import mongoose, { Connection } from "mongoose";
import { LoggerUtil } from "../utils/logger.util";

@singleton()
@injectable()
export class MongoDB {
  private connection: Connection;
  // private readonly logger: LoggerUtil = container.resolve(
  //   LoggerUtil
  // ) as typeof LoggerUtil;

  constructor(@inject(LoggerUtil) private readonly logger: typeof LoggerUtil) {
    this.connect();
  }

  private async connect() {
    try {
      const connectionString =
        process.env.MONGODB_URI ||
        "mongodb://admin:adminpassword@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true";

      await mongoose.connect(connectionString, {});
      this.logger.info("MongoDB", "Database connection succesfull");
      // this.logger.info

      this.connection = mongoose.connection;

      this.setupEventListeners();
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
    }
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
