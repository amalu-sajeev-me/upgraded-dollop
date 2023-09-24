import { container, injectable } from "tsyringe";
import { UserModel } from "../models/User.model";
import { IUser } from "../schema/User.schema";
import { InMemoryCacheService } from "./InMemoryCache.service";

@injectable()
export class UserService {
  private readonly cacheService: InMemoryCacheService = container.resolve(
    InMemoryCacheService
  ) as InMemoryCacheService;
  async addUser(user: IUser) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      console.log("User saved successfully:", newUser);
      return newUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  verifyCredentials = async (username: string, password: string) => {
    try {
      const { default: jwt } = await import("jsonwebtoken");
      const token = jwt.sign({ username }, "your-secret-key", {
        expiresIn: "1h",
      });
      if (this.cacheService.has(username)) {
        return token;
      }
      const user = await UserModel.findOne({ username, password });
      if (!user) {
        return false;
      }
      return token;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      throw error;
    }
  };
  fetchAllUsers = async () => {
    return await UserModel.find({});
  };
}
