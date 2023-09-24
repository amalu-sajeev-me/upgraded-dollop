import { AuthChecker } from "type-graphql";
import { verify } from "jsonwebtoken";

const customAuthChecker: AuthChecker<any> = async ({ context, args }) => {
  // Get the token from the request headers
  console.log({ ola: context, args }, "cooooo");
  const { user } = context;

  try {
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
