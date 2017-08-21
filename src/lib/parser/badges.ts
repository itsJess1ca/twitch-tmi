export function parseBadges(tags) {
  if (typeof tags["badges"] === 'string') {
    const badges = {};
    const explode = tags["badges"].split(",");

    for (let i = 0; i < explode.length; i++) {
      const parts = explode[i].split("/");
      if (!parts[1]) return;
      badges[parts[0]] = parts[1];
    }

    tags["badges-raw"] = tags["badges"];
    tags["badges"] = badges;
  }
  if (typeof tags["badges"] === 'boolean') { tags["badges-raw"] = null; }

  return tags;
}
