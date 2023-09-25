import { container, injectable } from "tsyringe";
import { UserModel } from "../models/User.model";
import { IUser } from "../schema/User.schema";
import { InMemoryCacheService } from "./InMemoryCache.service";
import bcrypt from "bcrypt";

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

  verifyUser = async (username: string, password: string) => {
    const { default: jwt } = await import("jsonwebtoken");
    //
    const isCached = this.cacheService.has(username);
    if (isCached) {
      const hash = this.cacheService.get(username)!;
      const token = jwt.sign({ username }, "your-secret-key", {
        expiresIn: "1h",
      });
      if (hash === password) return token;
    }
    const user = await UserModel.findOne({ username });
    const isValidUser = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isValidUser) return false;
    const token = jwt.sign({ username }, "your-secret-key", {
      expiresIn: "1h",
    });
    this.cacheService.set(username, password);
    return token;
  };

  fetchAllUsers = async () => {
    return await UserModel.find({});
  };
}
