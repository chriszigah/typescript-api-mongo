import { Router } from "express";
import {
  newProfile,
  getAllProfiles,
  getUserProfileById,
  updateProfile,
  deleteProfile,
} from "./profile.controller";
import { isAuthenticated, isOwner } from "../../middlewares";

const router = Router();

router.post("/new/:id", newProfile);

router.get("/", isAuthenticated, getAllProfiles);

router.get("/:id", isAuthenticated, getUserProfileById);

router.patch("/:id", isAuthenticated, isOwner, updateProfile);

router.delete("/:id", isAuthenticated, isOwner, deleteProfile);

export default router;
