// src\scripts\create-admin.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const USERNAME = process.env.ADMIN_USERNAME || "admin";
const PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI تنظیم نشده");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "superadmin" },
});

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "trackbot" });

  const Admin = mongoose.model("Admin", AdminSchema);
  const exists = await Admin.findOne({ username: USERNAME });

  if (exists) {
    console.log(`⚠️  ادمین "${USERNAME}" از قبل وجود داره`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(PASSWORD, 12);
  await Admin.create({
    username: USERNAME,
    password: hashed,
    role: "superadmin",
  });

  console.log(`✅ ادمین ساخته شد`);
  console.log(`   نام کاربری: ${USERNAME}`);
  console.log(`   رمز عبور: ${PASSWORD}`);
  console.log(`\n⚠️  رمز عبور رو بعد از اولین ورود عوض کن!`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
