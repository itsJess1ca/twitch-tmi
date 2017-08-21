export function replaceAll(str: string, obj: any): string {
  if (str === null || typeof str === "undefined") { return null; }
  for (const x in obj) {
    if (obj.hasOwnProperty(x)) {
      str = str.replace(new RegExp(x, "g"), obj[x]);
    }
  }
  return str;
}
