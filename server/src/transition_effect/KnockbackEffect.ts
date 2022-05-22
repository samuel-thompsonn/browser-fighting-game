import Character from "../Character";
import { ResolvedCollisionEvent } from "../CharacterDataInterfaces";
import TransitionEffect from "./TransitionEffect";

const DEFAULT_KNOCKBACK_STRENGTH = 20;

export default class KnockbackEffect implements TransitionEffect {
  execute(collisionEvent: ResolvedCollisionEvent, character: Character): void {
    const knockbackString = collisionEvent.otherEntity.entity.getProperty("knockback");
    if (knockbackString) {
      const knockback = parseFloat(knockbackString);
      console.log(`Doing a knockback of magnitude ${knockback}`)
      character.changePosition({
        x: DEFAULT_KNOCKBACK_STRENGTH * knockback,
        y: 0
      });
      return;
    }
    console.log("Failed to execute knockback: No knockback value for opposing hitbox!")
  }
}