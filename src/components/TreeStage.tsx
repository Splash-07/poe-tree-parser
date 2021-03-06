import { TreeBgFilter, TreeContainerFilter } from "./TreeVisualFilters";
import { Sprite, Stage, TilingSprite } from "@inlet/react-pixi";
import Tree from "./Tree";
import TreeViewport from "./TreeViewport";
import { useState } from "react";
import { Provider } from "react-redux";
import { parseTreeData } from "../lib/services/parseTreeData";
import { store } from "../lib/store/store";

const TreeStage = () => {
  // TODO: PARSE ONLY IN REDUX atlasTree.slice.ts
  const { constants } = parseTreeData();

  const [stageOptions, setStageOptions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const worldOptions = {
    minScale: constants.imageZoomLevels[0], // (max zoomOut)
    maxScale: constants.imageZoomLevels[3], // (max zoomIn)
    posX: (constants.minX + constants.maxX) / 2,
    posY: (constants.minY + constants.maxY) / 4.95,
  };

  return (
    <Stage
      width={stageOptions.width}
      height={stageOptions.height}
      options={{ antialias: true }}
    >
      <Provider store={store}>
        <TreeContainerFilter
          adjust={{ saturation: 1, brightness: 1, gamma: 1, contrast: 0.95 }}
          blur={{ blur: 0.1, quality: 1, pixelSize: [0.1, 0.1] }}
        >
          <TilingSprite
            image="./Background2.png"
            width={stageOptions.width}
            height={stageOptions.height}
            tilePosition={{ x: 0, y: 0 }}
          />
          <TreeViewport
            constants={constants}
            width={stageOptions.width}
            height={stageOptions.height}
            worldOptions={worldOptions}
          >
            <TreeBgFilter blur={{ blur: 0.15 }}>
              <Sprite
                image="./AtlasPassiveBackground.png"
                x={constants.minX - 925}
                y={constants.minY - 120}
                scale={7.25}
              />
            </TreeBgFilter>
            <Tree />
          </TreeViewport>
        </TreeContainerFilter>
      </Provider>
    </Stage>
  );
};

export default TreeStage;
