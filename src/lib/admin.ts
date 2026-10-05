export function adminKey() {
  return process.env.ADMIN_KEY || "mehta2026";
}

export function isAdminKey(key: string | undefined | null) {
  return !!key && key === adminKey();
}
