import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { UserService } from "../services/User.service";
import { injectable, container } from "tsyringe";
import { User } from "../models/User.model";

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
  async users(): Promise<User[]> {
    return (await this.userService.fetchAllUsers()) as User[];
  }

  @Mutation(() => User)
  async addUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const newUser = await this.userService.addUser({
      username,
      password,
      email,
    } as User);
    return newUser;
  }

  @Mutation(() => String)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<undefined | string> {
    const token = await this.userService.verifyCredentials(username, password);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (token) {
      return token;
    } else {
      throw new Error("Invalid username or password");
    }
  }
}
