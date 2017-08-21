export function validateOAuthString(oauth: string): boolean {
  const index = oauth.indexOf('oauth:');
  return index === 0;
}
