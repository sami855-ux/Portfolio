// List of allowed admin email addresses for authentication
export const ALLOWED_ADMIN_EMAILS = [
  import.meta.env.VITE_ADMIN_PRIMARY_EMAIL || "samueltale855@gmail.com",
  import.meta.env.VITE_ADMIN_SECONDARY_EMAIL || "",
  import.meta.env.VITE_ADMIN_TERTIARY_EMAIL || "",
  "samitale56@outlook.com",
  "samitale86@gmail.com",
  "samueltale331@gmail.com",
].map((e) => e.trim().toLowerCase()).filter(Boolean);

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  // Check against normalized whitelist
  return ALLOWED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
