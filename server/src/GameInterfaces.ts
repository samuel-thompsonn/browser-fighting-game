import { CollisionRectangle, HitboxRectangle } from './CharacterFileInterface';
import { CollisionEntity } from './CollisionEntity';

interface CollisionMember {
    characterID: string;
    collisionEntity: CollisionEntity;
}

export interface CollisionEvent {
  firstEntity: CollisionMember;
  secondEntity: CollisionMember;
}
