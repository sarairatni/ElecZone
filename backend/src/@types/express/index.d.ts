import { JwtPayload } from "jsonwebtoken";

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
    } | string | JwtPayload;
  }
}
