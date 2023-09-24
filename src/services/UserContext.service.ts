import { container, injectable } from "tsyringe";
import { UserService } from "./User.service";

@injectable()
export class UserContext {
  private userService: UserService = container.resolve(UserService);
  createContext = async ({ req }) => {
    try {
      const token = req.headers.authorization || "";
      if (!token) {
        return null;
      }
      const { default: jwt } = await import("jsonwebtoken");
      //   const isValid = await jwt.verify(token, "your-secret-key");
      const user = jwt.decode(token);
      //   console.log("createContext -- ", { token, user });
      return { user };
    } catch (error) {
      console.error("Error in createContext:", error);
      throw error;
    }
  };

  getUserFromToken = async (token: string) => {
    try {
      const { default: jwt } = await import("jsonwebtoken");
      const decoded = await jwt.verify(token, "your-secret-key");
      return decoded;
    } catch (error) {
      console.error("Error in getUserFromToken:", error);
      throw new Error("Invalid token");
    }
  };
}
