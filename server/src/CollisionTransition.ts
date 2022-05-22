import Character from "./Character";
import { ResolvedCollisionEvent } from "./CharacterDataInterfaces";

export default interface CollisionTransition {
  handleCollision: (collisionEvent: ResolvedCollisionEvent, character: Character) => void;
}