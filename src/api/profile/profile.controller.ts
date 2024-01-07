import { Request, Response } from "express";
import {
  createProfile,
  getProfiles,
  deleteProfileById,
  updateProfileById,
  getProfileById,
} from "./profile.model";

import { getUserById } from "../users/users.model";

export const newProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, dob } = req.body;

    if (!firstname || !lastname || !dob) {
      return res.sendStatus(500);
    }

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(400).json({ msg: "Not a registered User" });
    }

    const profile = await createProfile({
      userid: id,
      firstname: firstname,
      lastname: lastname,
      dob: dob,
    });

    return res.status(200).json({ profile });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await getProfiles();
    return res.status(200).json(profiles);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export const getUserProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await getProfileById(id);
    return res.status(200).json(profile);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const changes = req.body;

    const dbUser = await getUserById(id);

    if (!dbUser) {
      return res.sendStatus(404);
    }

    const updateId = dbUser._id.toHexString();

    const updatedUser = await updateProfileById(updateId, changes);
    return res.status(200).json(updatedUser).end();
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteProfileById(id);
    return res.status(401).json(deletedUser);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};
