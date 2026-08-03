const COOKIE_NAME = "site_auth";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loginPage(error) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Expense Tracker</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0b0e14; font-family: system-ui, sans-serif; }
  form { background:#0f172a; padding:2rem; border-radius:1rem; border:1px solid #1e293b; width:100%; max-width:320px; }
  h1 { color:#f1f5f9; font-size:1.25rem; margin:0 0 1.25rem; }
  input { width:100%; box-sizing:border-box; padding:0.65rem 0.85rem; border-radius:0.5rem; border:1px solid #334155; background:#1e293b; color:#f1f5f9; font-size:0.95rem; outline:none; }
  input:focus { border-color:#8b6cf6; }
  button { width:100%; margin-top:1rem; padding:0.65rem; border:none; border-radius:0.5rem; background:#8b6cf6; color:white; font-weight:600; cursor:pointer; font-size:0.95rem; }
  button:hover { background:#7c5cf0; }
  p.error { color:#fb7185; font-size:0.85rem; margin:0.75rem 0 0; }
</style>
</head>
<body>
  <form method="POST" action="/__auth">
    <h1>Expense Tracker</h1>
    <input type="password" name="password" placeholder="Password" autofocus />
    <button type="submit">Unlock</button>
    ${error ? `<p class="error">Wrong password, try again.</p>` : ""}
  </form>
</body>
</html>`;
}

export default async (request, context) => {
  const password = Netlify.env.get("SITE_PASSWORD");

  if (!password) {
    return context.next();
  }

  const url = new URL(request.url);
  const expectedHash = await sha256(password);

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([a-f0-9]+)`));
  const hasValidCookie = match && match[1] === expectedHash;

  if (hasValidCookie) {
    return context.next();
  }

  if (request.method === "POST" && url.pathname === "/__auth") {
    const form = await request.formData();
    const submitted = form.get("password");

    if (submitted === password) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": `${COOKIE_NAME}=${expectedHash}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    return new Response(loginPage(true), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new Response(loginPage(false), {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

export const config = { path: "/*" };
