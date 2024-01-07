import { Router, Response, Request } from "express";

const router = Router();

import usersRoutes from "../api/users/users.routes";
import profileRoutes from "../api/profile/profile.routes";

import { getUserBySessionToken } from "../api/users/users.model";

router.get("/get-session-user", async (req: Request, res: Response) => {
  const cookieName: any = process.env.COOKIE_SESSION_NAME;
  try {
    const token = req.cookies[cookieName];

    const currentUser = await getUserBySessionToken(token);
    return res.status(200).json({ user: currentUser });
  } catch (e) {}
});

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ msg: "Landed Well !" });
});

//Users Routes
router.use("/users", usersRoutes);
router.use("/profile", profileRoutes);

export default router;
