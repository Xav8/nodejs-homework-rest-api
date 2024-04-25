const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

const validateAuthSchema = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};
exports.signup = async (req, res) => {
  const { error } = validateAuthSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).send("Email in use");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the user");
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = validateAuthSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Email or password is wrong");
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    const filter = { email: user.email };
    const update = {
      $set: {
        token: token,
      },
    };

    await User.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Login error");
  }
};
exports.logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).end();
};
exports.current = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send("Not authorized");
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).send("Extracting current user error");
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const options = ["starter", "pro", "business"];
    if (!subscription || !options.includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription value" });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).send("Not authorized subs");
    }

    res.status(200).json({
      message: "Subscription updated successfully",
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).send("Error updating subscription");
  }
};