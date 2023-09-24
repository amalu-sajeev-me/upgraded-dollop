import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { User } from "../entities/User";
import { UserService } from "../services/User.service";
import { injectable, container } from "tsyringe";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUser {}

@injectable()
@Resolver()
export class UserResolver {
  private readonly userService: UserService = container.resolve(UserService);

  @Query(() => [User])
  /**
   * @summary Get a greeting message
   * @return {string} - The greeting message
   */
  @Authorized()
  users(): unknown[] {
    return [];
  }

  @Mutation(() => User)
  async addUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<IUser> {
    // console.log("lol", { username, email });
    const newUser = await this.userService.addUser({
      username,
      password,
      email,
    } satisfies IUser);
    return newUser;
  }

  @Mutation(() => String)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<undefined | string> {
    // Assuming you have a method to validate the user's credentials
    const token = await this.userService.verifyCredentials(username, password);
    // console.log("lll", { token });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (token) {
      return token;
    } else {
      throw new Error("Invalid username or password");
    }
  }
}
