import { prop, getModelForClass, pre } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import { Field, ID, ObjectType } from "type-graphql";
import { container } from "tsyringe";
import { LoggerUtil } from "../utils/logger.util";
import { IUser } from "../schema/User.schema";

const logger = container.resolve(LoggerUtil) as typeof LoggerUtil;
@pre<User>("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      logger.error("hashing-failure", error);
      next(error);
    }
  }
  next();
})
@ObjectType()
export class User implements IUser {
  @Field(() => ID)
  id: string;

  @prop({ required: true })
  @Field()
  username!: string;

  @prop({ required: true })
  @Field()
  email!: string;

  @prop({ required: true })
  @Field()
  password!: string;
}

const UserModel = getModelForClass(User);

export { UserModel };
