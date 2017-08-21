export function parseEmotes(tags) {
  if (typeof tags["emotes"] === 'string') {
    const emoticons = tags["emotes"].split("/");
    const emotes = {};

    for (let i = 0; i < emoticons.length; i++) {
      const parts = emoticons[i].split(":");
      if (!parts[1]) return;
      emotes[parts[0]] = parts[1].split(",");
    }

    tags["emotes-raw"] = tags["emotes"];
    tags["emotes"] = emotes;
  }
  if (typeof tags["emotes"] === 'boolean') { tags["emotes-raw"] = null; }

  return tags;
}
