export default async (request, context) => {
  const password = Netlify.env.get("SITE_PASSWORD");

  // If no password is configured, don't lock anyone out.
  if (!password) {
    return context.next();
  }

  const authHeader = request.headers.get("Authorization");

  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice("Basic ".length));
    const suppliedPassword = decoded.split(":")[1] ?? "";

    if (suppliedPassword === password) {
      return context.next();
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Expense Tracker"',
    },
  });
};

export const config = { path: "/*" };
