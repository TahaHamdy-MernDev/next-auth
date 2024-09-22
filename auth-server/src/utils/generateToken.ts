import jwt from "jsonwebtoken";

const generateToken = (id: string | undefined) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
