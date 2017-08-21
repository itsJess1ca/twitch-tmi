export function formatChannelName(str: string): string {
  const channel = typeof str === "undefined" || str === null ? "" : str;
  return channel.charAt(0) === "#" ? channel.toLowerCase() : "#" + channel.toLowerCase();
}
