import { unescapeHtml } from '../../utils/unescape-html';

export function emoteRegex(msg, code, id, obj) {
  const space = /\S+/g;
  const regex = new RegExp("(\\b|^|\s)" + unescapeHtml(code) + "(\\b|$|\s)");
  let match;

  // Check if emote code matches using RegExp and push it to the object..
  while ((match = space.exec(msg)) !== null) {
    if (regex.test(match[0])) {
      obj[id] = obj[id] || [];
      obj[id].push([match.index, space.lastIndex - 1]);
    }
  }
}
