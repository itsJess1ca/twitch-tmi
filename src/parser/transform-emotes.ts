export function transformEmotes(emotes) {
  let transformed = "";

  Object.keys(emotes).forEach((id) => {
    transformed = `${transformed + id}:`;
    emotes[id].forEach((index) => {
      transformed = `${transformed + index.join("-")},`;
    });
    transformed = `${transformed.slice(0, -1)}/`;
  });

  return transformed.slice(0, -1);
}
