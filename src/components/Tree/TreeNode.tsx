import { Container, Sprite, Text, TilingSprite } from "@inlet/react-pixi";
import { TextStyle } from "pixi.js";
import { FC, memo } from "react";
import { useDispatch } from "react-redux";
import { InternalAtlasTree } from "../../lib/services/AtlasTreeParser/AtlasTree.interface";
import {
  allocateNodes,
  // deallocateNodes,
  getNodesToAllocate,
  getNodesToDeallocate,
  removeHighLight,
  triggerTreeUpdateOnClick,
  triggerTreeUpdateOnHover,
} from "../../lib/store/slices/atlasTree.slice";
import debounce from "lodash.debounce";

interface TreeNodeProps {
  node:
    | InternalAtlasTree.Node
    | InternalAtlasTree.NotableNode
    | InternalAtlasTree.MasteryNode;
}
const TreeNode: FC<TreeNodeProps> = ({ node }) => {
  const dispatch = useDispatch();
  const iconSrc = node.isSelected
    ? `/${node.nodeIcon?.active.filename}`
    : `/${node.nodeIcon?.inactive.filename}`;
  const outlineIconSrc = node.isSelected
    ? `/${node.outlineIcon?.active}`
    : `/${node.outlineIcon?.inactive}`;

  const debouncedHandleMouseOverNode = debounce(
    (node: InternalAtlasTree.Node) => handleMouseOverNode(node),
    100
  );

  function handleClickOnNode(node: InternalAtlasTree.Node) {
    if (!node.isSelected) {
      dispatch(allocateNodes());
    }
    dispatch(triggerTreeUpdateOnClick());
  }

  function handleMouseOverNode(node: InternalAtlasTree.Node) {
    node.isSelected
      ? dispatch(getNodesToDeallocate(node.nodeId))
      : dispatch(getNodesToAllocate(node.nodeId));

    dispatch(triggerTreeUpdateOnHover());
  }

  function handleMouseOutNode() {
    dispatch(removeHighLight());
    debouncedHandleMouseOverNode.cancel();
  }
  console.log("rerender");
  return (
    <Container sortableChildren={true} x={node.x} y={node.y}>
      <TilingSprite
        image={iconSrc}
        interactive={true}
        click={() => {
          handleClickOnNode(node);
        }}
        mouseover={() => {
          debouncedHandleMouseOverNode(node);
        }}
        mouseout={() => handleMouseOutNode()}
        cursor="pointer"
        anchor={0.5}
        scale={3}
        width={node.nodeIcon.inactive.cords.w}
        height={node.nodeIcon.inactive.cords.h}
        tilePosition={{
          x: -node.nodeIcon.inactive.cords.x,
          y: -node.nodeIcon.inactive.cords.y,
        }}
      />
      {node.outlineIcon && (
        <Sprite image={outlineIconSrc} anchor={0.5} scale={2.7} />
      )}
      <Text
        text={node.nodeId}
        style={
          new TextStyle({
            align: "center",
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: 50,
            fill: ["#ffffff"], // gradient
            stroke: "#01d27e",
            strokeThickness: 5,
            letterSpacing: 20,
            dropShadow: true,
            dropShadowColor: "#ccced2",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
          })
        }
      ></Text>
    </Container>
  );
};

export const MemoisedTreeNode = memo(TreeNode);
