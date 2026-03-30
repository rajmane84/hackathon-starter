import { Router } from "express";
import { handleUserLogin } from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", handleUserLogin);

export default authRouter;