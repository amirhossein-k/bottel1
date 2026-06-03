import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

// همه مسیرهای /admin رو محافظت کن (به جز login)
export const config = {
  matcher: ["/admin/:path*"],
};
