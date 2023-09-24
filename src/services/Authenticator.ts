import { type AuthChecker } from "type-graphql";
import { IUser } from "../schema/User.schema";

const customAuthChecker: AuthChecker<Record<"user", IUser>> = async ({
  context,
  args,
}) => {
  // Get the token from the request headers
  console.log({ ola: context, args }, "cooooo");
  const { user } = context;

  try {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (user) return true;

    // Verify the token
    throw new Error("invalid token");
  } catch (error) {
    // Token verification failed
    console.log(error);
    return false;
  }
};

export default customAuthChecker;
