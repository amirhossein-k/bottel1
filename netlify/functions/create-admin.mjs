import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function handler(event, context) {
  const MONGODB_URI = process.env.MONGODB_URI;
  const USERNAME = process.env.ADMIN_USERNAME || "admin";
  const PASSWORD = process.env.ADMIN_PASSWORD || "123456";

  if (!MONGODB_URI) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "MONGODB_URI not set" }),
    };
  }

  const AdminSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: "superadmin" },
  });

  try {
    await mongoose.connect(MONGODB_URI, { dbName: "trackbot" });
    const Admin = mongoose.model("Admin", AdminSchema);
    const exists = await Admin.findOne({ username: USERNAME });

    if (exists) {
      await mongoose.disconnect();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Admin "${USERNAME}" already exists` }),
      };
    }

    const hashed = await bcrypt.hash(PASSWORD, 12);
    await Admin.create({
      username: USERNAME,
      password: hashed,
      role: "superadmin",
    });
    await mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Admin created",
        username: USERNAME,
        password: PASSWORD,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
