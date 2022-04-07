import React from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
  width: number;
  height: number;
  worldOptions: {
    minScale: number;
    maxScale: number;
  };
  worldPosition: {
    x: number;
    y: number;
  };
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      screenWidth: props.width,
      screenHeight: props.height,
      worldWidth: props.width,
      worldHeight: props.height,
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
    });
    // add world boundaries
    // change scale per scroll for 0.0863
    viewport
      .animate({ time: 0, scale: props.worldOptions.minScale, position: props.worldPosition })
      .drag()
      .pinch()
      .wheel()
      // [0.1246, 0.2109, 0.2972, 0.3835]
      //   .clamp({ ...props.clampOptions })
      .clampZoom(props.worldOptions);
    viewport.on("clicked", () => console.log(viewport.scaled));
    return viewport;
  },
});

const Viewport = (props: ViewportProps) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

export default Viewport;
