const UserModel = require("../models/user.model");
const mongoose = require("mongoose");

module.exports.getAllUser = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unkown :" + req.params.id);
  UserModel.findById(req.params.id, (err, data) => {
    if (!err) res.send(data);
    else console.log("ID unknown : " + err);
  }).select("-password");
};
module.exports.updateUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unkown :" + req.params.id);
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      },
      (err, data) => {
        if (!err) return res.send(data);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unkown :" + req.params.id);
  try {
    await UserModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Successfully deleted . " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.follow = async (req, res) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.id) ||
    !mongoose.Types.ObjectId.isValid(req.body.idToFollow)
  )
    return res
      .status(400)
      .send("ID unkown : " + req.params.id + " or  " + req.body.idToFollow);
  try {
    //add to follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, data) => {
        if (!err) return res.status(201).json(data);
        if (err) return res.status(400).json(err);
      }
    );
    //add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, data) => {
        //(taraja kn rak followet sayed msh raw rak wahed mel follwers mtaah )if(!err) return res.status(201).json(data);
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.id) ||
    !mongoose.Types.ObjectId.isValid(req.body.idToUnfollow)
  )
    return res
      .status(400)
      .send("ID unkown : " + req.params.id + " or  " + req.body.idToUnfollow);
  try {
    //add to follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, data) => {
        if (!err) return res.status(201).json(data);
        if (err) return res.status(400).json(err);
      }
    );
    //add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, data) => {
        //(taraja kn rak followet sayed msh raw rak wahed mel follwers mtaah )if(!err) return res.status(201).json(data);
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
