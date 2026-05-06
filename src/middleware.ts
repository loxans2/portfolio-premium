import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

// Note: /api/admin/* routes check session inside their handlers
// to return proper JSON 401 responses (middleware would redirect to HTML).
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
