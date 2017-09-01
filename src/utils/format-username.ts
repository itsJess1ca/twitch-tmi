export function formatUsername(name: string) {
  if (typeof name !== "string") return "";
  const username = typeof name === 'undefined' || name === null ? "" : name;
  return username.charAt(0) === "#" ? username.substring(1).toLowerCase() : username.toLowerCase();
}
