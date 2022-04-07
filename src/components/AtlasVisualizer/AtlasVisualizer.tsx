import { Box } from "@chakra-ui/react";
import { Sprite, Stage, Container } from "@inlet/react-pixi";
import { useState } from "react";
import { parseTreeData } from "../../lib/parseTreeData";
import { isRootNode } from "../../lib/services/AtlasPassiveTree/atlas-tree.typeguards";
import TreeNode from "./TreeNode";
import Viewport from "./Viewport";

const AtlasVisualizer = () => {
  const { nodes, skillSprites, constants } = parseTreeData();
  const [stageOptions, setStageOptions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const worldOptions = {
    minScale: constants.imageZoomLevels[0], // (max zoomOut)
    maxScale: constants.imageZoomLevels[3], // (max zoomIn)
  };
  const calculatePosition = {
    x: (constants.minX + constants.maxX) / 2,
    y: (constants.minY + constants.maxY) / 5,
  };
  return (
    <Box backgroundImage="url('./Background2.png')" backgroundRepeat="repeat">
      <Stage width={stageOptions.width} height={stageOptions.height} options={{ backgroundAlpha: 0 }}>
        <Viewport
          width={stageOptions.width}
          height={stageOptions.height}
          worldOptions={worldOptions}
          worldPosition={calculatePosition}
        >
          <Container>
            {/* <Sprite
              image="./AtlasPassiveBackground.png"
              x={constants.minX}
              y={constants.minY}
              width={Math.abs(constants.minX) + Math.abs(constants.maxX)}
              height={Math.abs(constants.minY)}
            /> */}
            {Object.values(nodes).map(
              (node, index) =>
                node.nodeId !== "root" &&
                (isRootNode(node) ? (
                  <Sprite
                    key={index}
                    image="/AtlasPassiveSkillScreenStart.png"
                    scale={3}
                    x={node.x}
                    y={node.y}
                    anchor={0.5}
                  />
                ) : (
                  <TreeNode key={index} skillSprites={skillSprites} node={node} zoomLevel={3} />
                ))
            )}
          </Container>
        </Viewport>
      </Stage>
    </Box>
  );
};

export default AtlasVisualizer;
