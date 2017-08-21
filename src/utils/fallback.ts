export function fallback(...vars: any[]) {
  let response = null;
  for (const v of vars) {
    if (v) {
      response = v;
      break;
    }
  }
  return response;
}
