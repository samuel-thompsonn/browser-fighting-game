import { CollisionRectangle, HitboxRectangle } from './CharacterFileInterface';

export interface CollisionEvent {
  firstEntity: {
    type: 'hitbox' | 'hurtbox';
    collisionBox: CollisionRectangle | HitboxRectangle;
  };
  secondEntity: {
    type: 'hitbox' | 'hurtbox';
    collisionBox: CollisionRectangle | HitboxRectangle;
  }
}
