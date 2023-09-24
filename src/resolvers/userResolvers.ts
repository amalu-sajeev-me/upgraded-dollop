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
  users() {
    return [];
  }

  @Mutation(() => User)
  async addUser(
    @Arg("username") username: string,
    @Arg("email") email: string
  ) {
    console.log("lol", { username, email });
    const newUser = await this.userService.addUser({
      username,
      password: "password",
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
    const isValid = await this.validateUserCredentials(username, password);

    if (isValid) {
      const token = sign({ username }, "your-secret-key", { expiresIn: "1h" });
      return token;
    } else {
      throw new Error("Invalid username or password");
    }
  }

  // Mock method for validating user credentials (replace with actual implementation)
  private async validateUserCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    // Implement your actual user validation logic (e.g., check against a database)
    // Return true if the user is valid, false otherwise
    // Example: return someDatabaseService.validateUser(username, password);
    return username === "validuser" && password === "password123";
  }
}
