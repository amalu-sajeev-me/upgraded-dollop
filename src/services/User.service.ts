import { injectable } from "tsyringe";
import { UserModel } from "../models/User.model";
import { IUser } from "../schema/User.schema";

@injectable()
export class UserService {
  async addUser(user: IUser) {
    // UserModel.
    const newUser = new UserModel(user);
    await newUser.save();
    console.log("user saved succesfully", newUser);
    return newUser;
  }
}
