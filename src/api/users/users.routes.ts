import { Router } from "express";
import {
  register,
  login,
  getAUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  logout,
} from "./users.controller";
import { isAuthenticated, isOwner } from "../../middlewares";

const router = Router();

router.post("/auth/register", register);

router.post("/auth/login", login);

router.get("/:id", isAuthenticated, getAUserById);

router.get("/", isAuthenticated, getAllUsers);

router.patch("/:id", isAuthenticated, updateUser);

router.delete("/:id", isAuthenticated, isOwner, deleteUser);

router.get("/auth/logout", isAuthenticated, logout);

export default router;
