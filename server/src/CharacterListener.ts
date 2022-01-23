import { Position } from './AnimationUtil';
import { CharacterStatus } from './CharacterDataInterfaces';
import { AnimationState } from './CharacterFileInterface';

export default abstract class CharacterListener {
  abstract handleCharacterUpdate(newStatus: CharacterStatus): void
}
