import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: { userId: string };
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === 'object' && 'userId' in decoded) {
      req.user = { userId: (decoded as JwtPayload).userId };
      next();
    } else {
      return res.sendStatus(403); // Invalid token
    }
  } catch (err) {
    return res.sendStatus(403);
  }
};
