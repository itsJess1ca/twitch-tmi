import { unescapeHtml } from '../../utils/unescape-html';

export function emoteString(msg, code, id, obj) {
  const space = /\S+/g;
  let match;

  // Check if emote code matches and push it to the object..
  while ((match = space.exec(msg)) !== null) {
    if (match[0] === unescapeHtml(code)) {
      obj[id] = obj[id] || [];
      obj[id].push([match.index, space.lastIndex - 1]);
    }
  }
}
