import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const handleUserLogin = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    //
  },
);
