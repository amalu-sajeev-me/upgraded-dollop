import { injectable } from "tsyringe";
import { UserModel } from "../models/User.model";
import { IUser } from "../schema/User.schema";

@injectable()
export class UserService {
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
      const user = await UserModel.findOne({ username, password });
      if (!user) {
        return false;
      }
      const { password: pass, email } = user;
      const { default: jwt } = await import("jsonwebtoken");
      // console.log({ j: jwt });
      const token = jwt.sign({ username, email }, "your-secret-key", {
        expiresIn: "1h",
      });
      // console.log("userservice -- ", { token, password });
      return token;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      throw error;
    }
  };
}
