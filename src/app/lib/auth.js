import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAuth(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json(
      { success: false, error: "لطفاً وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  return null;
}

export async function getSession() {
  return getServerSession(authOptions);
}
