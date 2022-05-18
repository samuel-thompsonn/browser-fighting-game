import AnimationLoader from './AnimationLoader';
import { AnimationDescription, AnimationState } from './InterfaceUtils';

function generateAnimationState(
  animationDescription: AnimationDescription,
  index: number,
  image: HTMLImageElement
): AnimationState {
  return {
    id: `${animationDescription.id}${index + 1}`,
    image: image,
    imageOffset: {
      x: animationDescription.offset.x + (+ animationDescription.stride * index),
      y: animationDescription.offset.y
    },
    imageSize: animationDescription.frameSize
  }
}

export default class SimpleAnimationLoader implements AnimationLoader {
  loadAnimations(animationData: AnimationDescription[]): Map<string, AnimationState> {
    const animationStates = new Map<string, AnimationState>()
    const loadedImages = new Map<string, HTMLImageElement>();
    for (let animationDescription of animationData) {
      let image = loadedImages.get(animationDescription.filePath);
      if (!image) {
        image = new Image();
        image.src = `../sprites/${animationDescription.filePath}`;
        image.onerror = (event) => {
          console.log(event);
          console.log("FAILED TO LOAD AN IMAGE")
        }
        loadedImages.set(animationDescription.filePath, image);
      }
      for (let i = 0; i < animationDescription.numFrames; i += 1) {
        const generatedState = generateAnimationState(
          animationDescription,
          i,
          image
        );
        animationStates.set(generatedState.id, generatedState);
      }
      
    }
    return animationStates;
  }
}