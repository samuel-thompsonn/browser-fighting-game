import Character from "./Character";
import { ResolvedCollisionEvent } from "./CharacterDataInterfaces";
import CollisionTransition from "./CollisionTransition";
import { CollisionTransitionDescription, TransitionEffectDescription } from "./CharacterFileInterface";
import TransitionEffect from "./transition_effect/TransitionEffect";
import TransitionEffectFactory from "./transition_effect/TransitionEffectFactory";


export default class BasicCollisionTransition implements CollisionTransition {

  #foreignEntityType: string;

  #selfEntityType: string;

  #destination: string;

  #effects: TransitionEffect[];

  #getTargetState(stateName: string): string {
    return `${stateName}1`;
  }

  constructor(description: CollisionTransitionDescription) {
    this.#foreignEntityType = description.foreignEntityType;
    this.#selfEntityType = description.selfEntityType;
    this.#destination = this.#getTargetState(description.destination);
    this.#effects = this.#resolveTransitionEffects(description.effects);
  }

  #resolveTransitionEffects(effectDescriptions: TransitionEffectDescription[]): TransitionEffect[] {
    const effects:TransitionEffect[] = [];
    effectDescriptions.forEach((effectDescription) => {
      const effect = TransitionEffectFactory.instantiateTransitionEffect(effectDescription);
      if (effect) {
        effects.push(effect);
      }
    });
    return effects;
  }

  handleCollision(collisionEvent: ResolvedCollisionEvent, character: Character): void {
    if (collisionEvent.selfEntity.type === this.#selfEntityType
    &&  collisionEvent.otherEntity.type === this.#foreignEntityType) {
      console.log(`I have ${this.#effects.length} effects.`)
      this.#effects.forEach((effect) => {
        effect.execute(collisionEvent, character);
        character.setNextState(this.#destination);
      })      
    }
  }
}