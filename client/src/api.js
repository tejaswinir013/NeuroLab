const ROOT = import.meta.env.VITE_API_URL || "";
export const API_BASE = ROOT + "/api";

export const api = {
  get: async (path) => (await fetch(API_BASE + path)).json(),
  post: async (path, body) =>
    (
      await fetch(API_BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    ).json(),
  del: async (path) => (await fetch(API_BASE + path, { method: "DELETE" })).json(),
};