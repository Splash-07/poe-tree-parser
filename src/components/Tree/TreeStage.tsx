import { Sprite, Stage, Container, TilingSprite, Graphics } from "@inlet/react-pixi";
import { useState } from "react";
import { parseTreeData } from "../../lib/parseTreeData";
import { isRootNode } from "../../lib/services/AtlasTree/AtlasTree.typeguards";
import { Filters } from "./TreeContainerFilter";
import TreeLine from "./TreeLine";
import TreeNode from "./TreeNode";
import TreeViewport from "./TreeViewport";

const TreeStage = () => {
  const { nodes, skillSprites, constants, connectionMap } = parseTreeData();
  const [stageOptions, setStageOptions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 0.1,
  });
  const worldOptions = {
    minScale: constants.imageZoomLevels[0], // (max zoomOut)
    maxScale: constants.imageZoomLevels[3], // (max zoomIn)
  };
  const calculatePosition = {
    x: (constants.minX + constants.maxX) / 2,
    y: (constants.minY + constants.maxY) / 5,
  };
  console.log(connectionMap);

  return (
    <Stage width={stageOptions.width} height={stageOptions.height}>
      <Container>
        <TilingSprite
          image="./Background2.png"
          width={stageOptions.width}
          height={stageOptions.height}
          tilePosition={{ x: 0, y: 0 }}
        />
        <TreeViewport
          width={stageOptions.width}
          height={stageOptions.height}
          worldOptions={worldOptions}
          worldPosition={calculatePosition}
        >
          <Sprite image="./AtlasPassiveBackground.png" x={constants.minX - 860} y={constants.minY - 100} scale={7.2} />
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
          {Object.values(connectionMap).map((lines, indexOne) => {
            return lines.map((line, indexTwo) => (
              <TreeLine
                key={10000 + indexOne * indexTwo}
                isSelected={line.isSelected}
                toNode={line.toNode}
                fromNode={line.fromNode}
              />
            ));
          })}
        </TreeViewport>
      </Container>
    </Stage>
  );
};

export default TreeStage;
