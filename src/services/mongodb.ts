import mongoose from "mongoose";

export async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb://admin:adminpassword@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true",
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
