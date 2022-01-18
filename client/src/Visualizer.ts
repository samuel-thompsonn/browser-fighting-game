import animationData from "./animation/idle1/idle1.json";

const ANIM_FRAMES_PER_SECOND = 2;
const NUM_ANIM_FRAMES = 4;

interface AnimationState {
  id: string,
  transitions: Map<string, string>,
  image: HTMLImageElement
};

function getTransitionMap(transitions: object):Map<string, string> {
  const transitionMap = new Map<string, string>();
  for (let [event, nextState] of Object.entries(transitions)) {
    transitionMap.set(event, nextState);
  }
  return transitionMap;
}

class Visualizer {
  images: Map<string, HTMLImageElement>;
  totalSeconds: number;
  currentState: AnimationState|undefined;
  animationStates: Map<string, AnimationState>;

  constructor() {
    this.totalSeconds = 0;
    this.animationStates = new Map<string, AnimationState>();
    this.images = new Map();
    for (let animationState of animationData.character1_idle) {
      
      const image = new Image();
      // const sourceString = idleFrames.get(animationState.sprite);
      // if (sourceString !== undefined) {
      image.src = `../sprites/${animationState.sprite}.jpg`;
      // }
      image.onerror = (event) => {
        // alert("Failed to load an image!");
        console.log(event);
        console.log("FAILED TO LOAD AN AIMGE")
      }
      // this.images.set(animationState.id, image);
      this.animationStates.set(animationState.id, {
        id: animationState.id,
        transitions: getTransitionMap(animationState.transitions),
        image: image
      });
      this.currentState = this.animationStates.get(animationData.character1_idle[0].id);
    }
  }

  setAnimationState(newState: string) {
    if (this.animationStates.has(newState)) {
      this.currentState = this.animationStates.get(newState);
    }
    else {
      console.log(`Visualizer doesn't have state ${newState}. Aborting...`);
    }
  }

  drawSelf(
    canvas: CanvasRenderingContext2D,
    elapsedSeconds: number,
  ):void {
    // Increment counter by elapsed seconds
    // If the time has come to go to the next frame:
    //   Figure out what is the next frame by the traversal from
    //     the current frame
    //   Transition to that frame

    // this.totalSeconds += elapsedSeconds;
    // const secondsPerFrame = 1 / ANIM_FRAMES_PER_SECOND;
    if (!this.currentState) { return; }
    // if (this.totalSeconds >= secondsPerFrame) {
    //   this.totalSeconds = this.totalSeconds % secondsPerFrame;
    //   const nextStateId = this.currentState.transitions.get("default");
    //   if (!nextStateId) { return; }
    //   const nextState = this.animationStates.get(nextStateId);
    //   if (!nextState) { return; }
    //   this.currentState = nextState;
    // }
    canvas.drawImage(this.currentState.image, 0, 0);
  }
}

export default Visualizer;