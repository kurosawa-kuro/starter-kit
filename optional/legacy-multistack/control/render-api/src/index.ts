import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Hello World
app.get("/", (c) => {
  return c.json({
    message: "Hello World!",
    framework: "Hono",
    runtime: "Node.js",
  });
});

// API routes
app.get("/api/hello", (c) => {
  return c.json({ message: "Hello from API!" });
});

app.get("/api/hello/:name", (c) => {
  const name = c.req.param("name");
  return c.json({ message: `Hello, ${name}!` });
});

app.post("/api/echo", async (c) => {
  const body = await c.req.json();
  return c.json({
    received: body,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// Start server
const port = Number(process.env.PORT) || 3000;

console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
