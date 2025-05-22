import bcryptjs from "bcryptjs";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;

  // console.log("username: ", username, " - password: ", password);

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(404).json({ message: "User not found!" });
    }

    const passwordMatched = await bcryptjs.compare(password, admin.password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const tokenAge = 1000 * 60 * 60 * 24; // 1 day
    const { password: adminPassword, ...adminInfo } = admin;

    const token = jwt.sign(
      {
        id: admin.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: tokenAge }
    );

    // console.log("token: ", token)

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: tokenAge,
      })
      .status(200)
      .json({
        ...adminInfo,
        isAdmin: true,
        secure: process.env.NODE_ENV === "production",
      });
  } catch (err) {
    console.log("erreur")
    console.error(err);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successfull" });
};

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  // console.log("req body: ", req.body);

  try {
    // Check if the username already exists
    const existingUser = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // Hash password and create a new user
    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return res
      .status(200)
      .json({ message: "Your account has been created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies

  // console.log("Token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Invalid token!" });
    }

    req.admin = decoded; // Attach decoded token data to the request
    // console.log("Decoded token:", decoded);
    next();
  });
};