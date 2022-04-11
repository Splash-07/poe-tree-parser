import React from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { Viewport as PixiViewport } from "pixi-viewport";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";

export interface ViewportProps {
  worldOptions: {
    minScale: number;
    maxScale: number;
    posX: number;
    posY: number;
  };
  constants: InternalAtlasTree.Constants;
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const { worldOptions, app, constants } = props;
    const viewport = new PixiViewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: Math.abs(constants.minX) + Math.abs(constants.maxX),
      worldHeight: Math.abs(constants.minY) + Math.abs(constants.maxY),
      ticker: app.ticker,
      interaction: app.renderer.plugins.interaction,
    });
    // add world boundaries
    // change scale per scroll for 0.0863
    const worldClampOption = {
      left: -10000,
      top: 10000,
      right: 20000,
      bottom: 20000,
    };
    const clampZoomOptions = {
      minScale: worldOptions.minScale,
      maxScale: worldOptions.maxScale,
    };
    viewport
      .animate({ time: 0, scale: worldOptions.minScale, position: { x: worldOptions.posX, y: worldOptions.posY } })
      .drag()
      .pinch()
      .wheel()
      // [0.1246, 0.2109, 0.2972, 0.3835] 0.0863
      .zoom(0.0863 * 100)
      .clampZoom(clampZoomOptions)
      .getVisibleBounds();
    viewport.on("clicked", () => console.log(viewport.scaled), console.log(viewport.scaled));
    return viewport;
  },
});

const Viewport = (props: ViewportProps) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

export default Viewport;
