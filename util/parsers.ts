export function parseGenitive(word: string) {
  word = word.trim();
  if (word.endsWith('s')) {
    return `${word}'`;
  }
  return `${word}'s`;
}
