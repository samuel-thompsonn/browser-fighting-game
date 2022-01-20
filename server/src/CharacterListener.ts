import { Position } from './AnimationUtil';
import { AnimationState } from './CharacterFileInterface';

export default abstract class CharacterListener {
  abstract handleCharacterUpdate(newState: AnimationState, newPosition: Position): void
}
