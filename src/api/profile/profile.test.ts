import request from "supertest";
import app from "../../app";
import { connectDB, getenv } from "../../helpers";

getenv();

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI as string);
});

let userID = "507f1f77bcf86cd799439011";

/*  Create a new Profile */

describe("Create a new Profile", () => {
  test("It Should Create a new Profile", async () => {
    const res = await request(app).post(`profile/new/${userID}`).send({
      firstname: "Efo Christian",
      lastname: "Zigah",
      dob: "24-07-1990",
    });
    expect(res.statusCode).toBe(201);
  });
});

describe("Get all Profiles", () => {
  test("It Should GET all Profiles ", async () => {
    const res = await request(app).get(`/profile`);
    expect(res.statusCode).toBe(200);
  });
});

describe("Get a Users Profile", () => {
  test("It Should GET a User Profile by ID", async () => {
    const res = await request(app).get(`/profile/${userID}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("Delete a User Profile", () => {
  test("It Should DELETE a user Profile by userID ", async () => {
    const res = await request(app).delete(`/profile/${userID}`);
    expect(res.statusCode).toBe(401);
  });
});
