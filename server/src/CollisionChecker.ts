import { CollisionData } from './CharacterFileInterface';
import { CollisionEvent } from './GameInterfaces';

export default abstract class CollisionChecker {
  abstract hasCollision(
    firstCharacterCollisions: CollisionData,
    secondCharacterCollisions: CollisionData,
  ): CollisionEvent | undefined;
}
