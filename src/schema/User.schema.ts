import { z } from "zod";

const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(), // Ensure email format
  password: z.string(), // You might want to add additional validation rules for password
});

export type IUser = z.infer<typeof UserSchema>;

export { UserSchema };
