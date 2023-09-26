import { container, inject, injectable } from "tsyringe";
import { UserModel } from "../models/User.model";
import { IUser, UserSchema } from "../schema/User.schema";
import { InMemoryCacheService } from "./InMemoryCache.service";
import bcrypt from "bcrypt";
import { LoggerUtil } from "../utils/logger.util";
import { SocketService } from "../bin/SocketIo";

@injectable()
export class UserService {
  private readonly cacheService: InMemoryCacheService = container.resolve(
    InMemoryCacheService
  ) as InMemoryCacheService;
  constructor(
    @inject(LoggerUtil) private readonly logger: typeof LoggerUtil,
    @inject(SocketService) private readonly socketService: SocketService
  ) {}
  async addUser(user: IUser) {
    try {
      await UserSchema.parseAsync(user);
      const isUnique = !(await UserModel.exists({ username: user.username }));
      if (!isUnique) throw new Error("username already exists");
      const newUser = new UserModel(user);
      await newUser.save();
      this.logger.info(
        "mongodb:",
        `newUser ${newUser.username} added succesfully`
      );
      const io = this.socketService.getIoInstance();
      io.emit("newData", `newUser ${newUser.username} has joined`);
      return newUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  verifyUser = async (username: string, password: string) => {
    const { default: jwt } = await import("jsonwebtoken");
    const partialUserSchema = UserSchema.pick({
      username: true,
      password: true,
    });
    try {
      partialUserSchema.parseAsync({ username, password });
    } catch (err) {
      this.logger.error("zod-error", "data validation failed");
      throw err;
    }
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
