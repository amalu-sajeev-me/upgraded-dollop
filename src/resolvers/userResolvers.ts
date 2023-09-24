import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { User } from "../entities/User";
import { sign } from "jsonwebtoken";
import { UserService } from "../services/User.service";
import { injectable, container } from "tsyringe";
interface IUser {}

@injectable()
@Resolver()
export class UserResolver {
  private userService: UserService = container.resolve(UserService);

  @Query(() => [User])
  @Authorized()
  users() {
    return [];
  }

  @Mutation(() => User)
  async addUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    // console.log("lol", { username, email });
    const newUser = await this.userService.addUser({
      username,
      password,
      email,
    } as IUser);
    return newUser;
  }

  @Mutation(() => String)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    // Assuming you have a method to validate the user's credentials
    const token = await this.userService.verifyCredentials(username, password);
    // console.log("lll", { token });
    if (token) {
      return token;
    } else {
      throw new Error("Invalid username or password");
    }
  }
}
