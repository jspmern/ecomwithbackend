import bcrypt from "bcryptjs";
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};
export const camparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
