import { useEffect, useRef, useState } from 'react';
import "./Canvas.css";
import "./Visualizer";
import Visualizer from './Visualizer';

interface CanvasProps {
  visualizers: Map<string, Visualizer>;
};

const Canvas = ({ visualizers }:CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) { return; }
    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) { return; }
    
    let animationFrameId:number;

    // const image = imageRef.current;
    const image = new Image();
    if (image === null) { return; }
    image.onload = () => {
      // canvasContext.drawImage(image, 50, 20);
    };
    image.onerror = () => {
      alert('no image found with that url.')
    }

    const draw = (
      canvasContext: CanvasRenderingContext2D,
    ) => {        
      canvasContext!.fillStyle = `#000000`;
      const width = canvasContext.canvas.width;
      const height = canvasContext.canvas.height;
      canvasContext.clearRect(0, 0, width, height);
      visualizers.forEach((visualizer) => {
        visualizer.drawSelf(canvasContext);
      });
    };

    const render = () => {
      draw(canvasContext);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
    
  });

  return (
    <div>
      <canvas ref={canvasRef}/>
    </div>
  );
}

export default Canvas;