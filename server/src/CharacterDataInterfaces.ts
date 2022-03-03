import { Position } from './AnimationUtil';
import { AnimationState, CollisionData } from './CharacterFileInterface';

/**
 * Describes the current status of a character, sufficient enough that
 * their future behavior can be predicted unambiguously given their
 * state transition map.
 */
export interface CharacterStatus {
  characterID: string;
  animationState: AnimationState;
  position: Position;
  healthInfo: {
    health: number;
    maxHealth: number;
  }
  collisionInfo?: CollisionData;
}
