import Character from "../Character";
import { ResolvedCollisionEvent } from "../CharacterDataInterfaces";

export default interface TransitionEffect {
  execute: (collisionEvent: ResolvedCollisionEvent, character: Character) => void;
}