import { Container, Sprite, TilingSprite } from "@inlet/react-pixi";
import React, { FC, useEffect, useState } from "react";
import { GGGAtlasPassiveTree } from "../../lib/services/AtlasPassiveTree/atlas-tree-ggg.interface";
import { InternalPassiveTree } from "../../lib/services/AtlasPassiveTree/atlas-tree-internal.interface";
import { isMasteryNode, isNotableNode, isRootNode } from "../../lib/services/AtlasPassiveTree/atlas-tree.typeguards";

interface TreeNodeInterface {
  node: InternalPassiveTree.Node | InternalPassiveTree.NotableNode | InternalPassiveTree.MasteryNode;
  skillSprites: GGGAtlasPassiveTree.SkillSprites;
  zoomLevel: number;
}

const TreeNode: FC<TreeNodeInterface> = ({ node, skillSprites, zoomLevel }) => {
  // zoom level node type, active
  const [{ iconSrc, iconOutline }, setIcon] = useState<{
    iconSrc: GGGAtlasPassiveTree.SkillSpriteCoords;
    iconOutline: string;
  }>(getIcon(node, skillSprites, zoomLevel));

  function getIcon(
    node: InternalPassiveTree.Node | InternalPassiveTree.NotableNode | InternalPassiveTree.MasteryNode,
    skillSprites: GGGAtlasPassiveTree.SkillSprites,
    zoomLevel: number
  ) {
    let iconSrc;
    let iconOutline;

    if (node.isSelected) {
      iconSrc = skillSprites.normalActive[zoomLevel];
      iconOutline = "PSSkillFrameActive.png";
      if (isMasteryNode(node)) {
        iconSrc = skillSprites.masteryActive[zoomLevel];
        iconOutline = "";
      }
      if (isNotableNode(node)) {
        iconSrc = skillSprites.notableActive[zoomLevel];
        iconOutline = "NotableFrameAllocated.png";
      }
    } else {
      iconSrc = skillSprites.normalInactive[zoomLevel];
      iconOutline = "PSSkillFrame.png";
      if (isMasteryNode(node)) {
        iconSrc = skillSprites.mastery[zoomLevel];
        iconOutline = "";
      }
      if (isNotableNode(node)) {
        iconSrc = skillSprites.notableInactive[zoomLevel];
        iconOutline = "NotableFrameUnallocated.png";
      }
    }

    return {
      iconSrc,
      iconOutline,
    };
  }
  // console.log(isMasteryNode(node) && (node.nodeId, node));
  // console.log(node);
  return (
    <Container sortableChildren={true} x={node.x} y={node.y}>
      {isMasteryNode(node) ? (
        <Sprite image={`/PSGroupBackground${0}.png`} anchor={0.5} scale={2.5} />
      ) : (
        <Sprite zIndex={100} image={iconOutline} anchor={0.5} scale={2.5} />
      )}
      <TilingSprite
        image={`/${iconSrc.filename}`}
        interactive={true}
        click={(event) => console.log(node.name, node.icon, iconSrc.coords[`${node.icon}`], event.target)}
        anchor={0.5}
        zIndex={10}
        scale={2.75}
        width={iconSrc.coords[`${node.icon}`].w}
        height={iconSrc.coords[`${node.icon}`].h}
        tilePosition={{
          x: -iconSrc.coords[`${node.icon}`].x,
          y: -iconSrc.coords[`${node.icon}`].y,
        }}
      />
    </Container>
  );
};

export default TreeNode;
