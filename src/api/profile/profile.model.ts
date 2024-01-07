import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userid: { type: String, require: true },
  firstname: { type: String, require: false },
  lastname: { type: String, require: false },
  dob: { type: String, require: true },
});

export const ProfileModel = mongoose.model("Profile", ProfileSchema);

export const getProfiles = () => ProfileModel.find();

export const getProfileById = (id: string) =>
  ProfileModel.findOne({ userid: id });

export const createProfile = (values: Record<string, any>) =>
  new ProfileModel(values).save().then((profile) => profile.toObject());

export const updateProfileById = (id: string, values: Record<string, any>) =>
  ProfileModel.findOneAndUpdate({ userid: id }, values);

export const deleteProfileById = (id: String) =>
  ProfileModel.findOneAndDelete({ userid: id });
