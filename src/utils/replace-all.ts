export const replaceAll = (str: string, obj: {[key: string]: string}): string => {
  if (str === null || typeof str === "undefined") { return null; }
  for (let x in obj) {
    if (obj.hasOwnProperty(x)) {
      str = str.replace(new RegExp(x, "g"), obj[x]);
    }
  }
  return str;
};
