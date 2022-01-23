import Canvas from "./Canvas";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Visualizer from "./Visualizer";
import { CharacterUpdate } from "./InterfaceUtils";
import ControlsHandler from "./ControlsHandler";
import controlsMap from './ControlsMap.json'
import { ControlsEventHandler } from "./InterfaceUtils";

function App() {

  const [visualizers] = useState<Map<string, Visualizer>>(
    new Map([["0", new Visualizer()]])
  );

  const [controlsHandler] = useState<ControlsHandler>(initControlsHandler());

  const socket = useRef<Socket>(initSocket());
  
  function initControlsHandler(): ControlsHandler {
    let controlsHandlers: ControlsEventHandler[] = Object.entries(controlsMap).map(([controlLabel, controlKey]) => ({
      key: controlKey,
      onPress: () => {
        console.log(`Pressed ${controlLabel}`)
        socket.current.emit('controlsChange', {
          'control': controlLabel,
          'status': 'pressed'
        })
      },
      onRelease: () => {
        console.log(`Released ${controlLabel}`)
        socket.current.emit('controlsChange', {
          'control': controlLabel,
          'status': 'released'
        })
      }
    }));
    console.log(controlsHandlers);
    return new ControlsHandler(...controlsHandlers);
    // return new ControlsHandler(
    //   {
    //     key: controlsMap.moveLeft,
    //     onPress: () => {
    //       console.log('Pressed moveLeft');
    //       socket.current.emit('controlsChange', {
    //         'control': 'moveLeft',
    //         'status': 'pressed'
    //       });
    //     },
    //     onRelease: () => {
    //       console.log('Released moveLeft');
    //       socket.current.emit('controlsChange', {
    //         'control': 'moveLeft',
    //         'status': 'released'
    //       });
    //     },
    //   },
    //   {
    //     key: controlsMap.moveRight,
    //     onPress: () => {
    //       socket.current.emit('controlsChange', {
    //         'control': 'moveRight',
    //         'status': 'pressed'
    //       });
    //     },
    //     onRelease: () => {
    //       socket.current.emit('controlsChange', {
    //         'control': 'moveRight',
    //         'status': 'released'
    //       });
    //     },
    //   }
    // );
  }

  function initSocket() {
    console.log("Actually instantiating the scoket...");
    return io('http://localhost:3001');
  }


  const initSocketIo = (newSocket:Socket) => {
    newSocket.on('accepted_connection', () => {
      console.log("Received 'accepted_connection' signal!");
      console.log("Requesting character creation...");
      newSocket.emit('create_character');
    });
    newSocket.on('updateCharacter', (update:CharacterUpdate) => {
      console.log("Received an update!")
      console.log(update);
      const targetVisualizer = visualizers.get(update.id);
      if (!targetVisualizer) {
        console.log(`No visualizer with id ${update.id}`);
        return;
      }
      targetVisualizer.setAnimationState(update.state, update.collisionInfo);
      targetVisualizer.setPosition(update.position);
    });
  }

  const handleKeyDown = (event:KeyboardEvent) => {
    controlsHandler.keyPressed(event.key);
  }

  const handleKeyUp = (event:KeyboardEvent) => {
    controlsHandler.keyReleased(event.key);
  }

  useEffect(() => {
    console.log("Initializing socket...");
    initSocketIo(socket.current);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Canvas visualizers={visualizers}/>
      </header>
    </div>
  );
}

export default App;
