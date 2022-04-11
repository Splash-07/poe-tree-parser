import * as PIXI from "pixi.js";
import { Graphics } from "@inlet/react-pixi";

import React, { FC, useCallback } from "react";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";

interface TreeConnectorProps {
  connection: InternalAtlasTree.Connection;
  orbitRadii: number[];
}

const DrawLineConnection = (connection: TreeConnectorProps["connection"]) => {
  const { fromNode, toNode } = connection;
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(16, 0x8f6c29, 0.4);
    g.moveTo(fromNode.x!, fromNode.y!);
    g.lineTo(toNode.x!, toNode.y!);
    g.endFill();
  }, []);

  return <Graphics draw={draw} />;
};

const DrawArcConnection = (connection: TreeConnectorProps["connection"], orbitRadii: number[]) => {
  const { fromNode, toNode } = connection;
  const orbitRadius = orbitRadii[fromNode.orbit!];
  let startAngle = fromNode.angle! < toNode.angle! ? fromNode.angle : toNode.angle;
  let endAngle = fromNode.angle! < toNode.angle! ? toNode.angle : fromNode.angle;
  const delta = endAngle! - startAngle!;
  if (delta >= Math.PI) {
    const c = 2 * Math.PI - delta;
    startAngle = endAngle;
    endAngle = startAngle! + c;
  }
  startAngle! -= Math.PI / 2;
  endAngle! -= Math.PI / 2;

  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(16, 0x8f6c29, 0.4);
    g.arc(fromNode.groupX!, fromNode.groupY!, orbitRadius, startAngle!, endAngle!, false);
    g.endFill();
  }, []);

  return <Graphics draw={draw} />;
};

const TreeConnector: FC<TreeConnectorProps> = ({ connection, orbitRadii }) => {
  return connection.isCurved ? DrawArcConnection(connection, orbitRadii) : DrawLineConnection(connection);
};

export default TreeConnector;

// Line from texture
// const DrawLineConnection = (connection: TreeConnectorProps["connection"]) => {
//   const { fromNode, toNode } = connection;
//   const texture = PIXI.Texture.from("./LineConnectorNormal.png");
//   const TEXTURE_HEIGHT = 13;
//   const length = Math.hypot(fromNode.x! - toNode.x!, fromNode.y! - toNode.y!);

//   return (
//     <TilingSprite
//       texture={texture}
//       tilePosition={{
//         x: 0,
//         y: 0,
//       }}
//       width={length}
//       height={TEXTURE_HEIGHT}
//       x={fromNode.x!}
//       y={fromNode.y!}
//       scale={{ x: 1, y: 4 }}
//       anchor={{ x: 0, y: 0.5 }}
//       rotation={Math.atan2(toNode.y! - fromNode.y!, toNode.x! - fromNode.x!)}
//     />
//   );
// };