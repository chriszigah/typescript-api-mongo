import { Request, Response } from "express";
import {
  getUserByEmail,
  createUser,
  getUsers,
  deleteUserById,
  getUserById,
  getUserBySessionToken,
} from "./users.model";

import { createProfile, deleteProfileById } from "../profile/profile.model";
import { random, authentication } from "../../helpers";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(500);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ msg: "Email ALready Registered" });
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    // Create User Profile
    await createProfile({
      userid: user._id,
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const cookieName: any = process.env.COOKIE_SESSION_NAME;
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(500)
        .json({ msg: "Invalid Username/Password combination" });
    }

    const user: any = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!email) {
      return res.status(500).json({ msg: "usere does not exist" });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res
        .status(403)
        .json({ msg: "Invalid Password/Username Combination" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();
    res.cookie(cookieName, user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
      httpOnly: true, // to disable accessing cookie via client side js
      secure: true, // to force https (if you use it)
      maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
      //signed: true, // if you use the secret with cookieParser
    });

    return res.status(200).json(user).end();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "something went wrong" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookieName: any = process.env.COOKIE_SESSION_NAME;
  const token = req.cookies[cookieName];

  const currentUser: any = await getUserBySessionToken(token).select(
    "+authentication.sessionToken"
  );

  currentUser.authentication.sessionToken = null;
  await currentUser.save();
  res.clearCookie(cookieName);

  return res.status(200).json({ msg: "Logout Successfully" });
};

export const getAUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dbUser = await getUserById(id);

    if (!dbUser) {
      return res.status(400).json({ msg: "No user found" });
    }

    const deletedUser = await deleteUserById(id);
    await deleteProfileById(id);
    return res.status(401).json(deletedUser);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const dbUser = await getUserById(id);

    if (!dbUser) {
      return res.sendStatus(403);
    }

    dbUser.username = username;
    await dbUser.save();

    return res.status(200).json(dbUser).end();
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};
