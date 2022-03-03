import { CollisionData, CollisionRectangle } from './CharacterFileInterface';
import { CollisionEvent } from './GameInterfaces';

interface Interval {
  a: number;
  b: number;
}

function intervalsColliding(firstInterval: Interval, secondInterval: Interval): boolean {
  return !(firstInterval.b < secondInterval.a || secondInterval.b < firstInterval.a);
}

function getProjection(collisionBox: CollisionRectangle, axis: 'x'|'y') {
  if (axis === 'x') {
    return { a: collisionBox.x, b: collisionBox.x + collisionBox.width };
  }
  return { a: collisionBox.y, b: collisionBox.y + collisionBox.height };
}

function collidingInAxis(firstBox: CollisionRectangle, secondBox: CollisionRectangle, axis: 'x'|'y'): boolean {
  const firstProjection = getProjection(firstBox, axis);
  const secondProjection = getProjection(secondBox, axis);
  return intervalsColliding(firstProjection, secondProjection);
}

function boxesColliding(firstBox: CollisionRectangle, secondBox: CollisionRectangle): boolean {
  return collidingInAxis(firstBox, secondBox, 'x') && collidingInAxis(firstBox, secondBox, 'y');
}

export default class BasicCollisionChecker {
  static hasCollision(
    firstCharacterCollisions: CollisionData,
    secondCharacterCollisions: CollisionData,
  ): CollisionEvent | undefined {
    let detectedCollision;
    firstCharacterCollisions.hitbox?.rectangles.forEach((firstHitbox) => {
      secondCharacterCollisions.hurtbox?.rectangles.forEach((secondHurtbox) => {
        if (boxesColliding(firstHitbox.collisionBox, secondHurtbox)) {
          detectedCollision = {
            firstEntity: {
              type: 'hitbox',
              collisionBox: firstHitbox,
            },
            secondEntity: {
              type: 'hurtbox',
              collisionBox: secondHurtbox,
            },
          };
        }
      });
    });
    //   for each hurtbox in second character:
    //     check for collision
    //   for each hitbox in second character:
    //     check for collision
    return detectedCollision;
  }
}
