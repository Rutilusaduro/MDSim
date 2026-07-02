export function gainFromBaseline(character) {
  return Math.max(0, character.weight - (character.baselineWeight || character.weight));
}
