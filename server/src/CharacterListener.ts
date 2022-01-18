import { AnimationState, Position } from './AnimationUtil';

export default abstract class CharacterListener {
  abstract handleCharacterUpdate(newState: AnimationState, newPosition: Position): void
}
