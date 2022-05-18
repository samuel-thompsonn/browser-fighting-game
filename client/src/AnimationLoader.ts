import { AnimationState, AnimationDescription } from './InterfaceUtils';

export default abstract class AnimationLoader {
  abstract loadAnimations(animationData: AnimationDescription[]): Map<string, AnimationState>;
}