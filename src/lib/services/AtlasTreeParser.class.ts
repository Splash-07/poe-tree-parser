import { GGGAtlasTree, InternalAtlasTree } from "./AtlasTree.interface";
import { isSkillNode, isTreeRoot } from "./AtlasTree.typeguards";

export class AtlasTreeParser {
  data: GGGAtlasTree.Data;
  skillSprites: GGGAtlasTree.SkillSprites;
  groupMap: Record<string, GGGAtlasTree.Group> = {};
  orbitDelta: InternalAtlasTree.OrbitDelta[][] = [];
  nodeMap: Record<string, InternalAtlasTree.Node> = {};
  masteryNodeMap: Record<string, InternalAtlasTree.MasteryNode> = {};
  connectionMap: Record<string, InternalAtlasTree.Connection[]> = {};

  constructor(data: GGGAtlasTree.Data) {
    this.data = data;
    this.skillSprites = data.skillSprites;
  }

  getOrbitAngles(nodesInOrbit: number): number[] {
    let orbitAngles = [];

    if (nodesInOrbit === 16) {
      // Every 30 and 45 degrees, per https://github.com/grindinggear/skilltree-export/blob/3.17.0/README.md
      const angles = [
        0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315,
        330,
      ];
      orbitAngles = [...angles];
    } else if (nodesInOrbit == 40) {
      // Every 10 and 45 degrees
      const angles = [
        0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135, 140,
        150, 160, 170, 180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270,
        280, 290, 300, 310, 315, 320, 330, 340, 350,
      ];
      orbitAngles = [...angles];
    } else {
      // Uniformly spaced
      for (let i = 0; i < nodesInOrbit; i++) {
        orbitAngles.push((360 * i) / nodesInOrbit);
      }
    }
    for (let i = 0; i < orbitAngles.length; i++) {
      orbitAngles[i] = orbitAngles[i] * (Math.PI / 180);
    }
    return orbitAngles;
  }

  computeOrbitDelta(): InternalAtlasTree.OrbitDelta[][] {
    const { skillsPerOrbit, orbitRadii } = this.data.constants;

    return skillsPerOrbit.map((nodesPerOrbit, orbitIndex) => {
      const nodeAngle = this.getOrbitAngles(nodesPerOrbit);
      const radius = orbitRadii[orbitIndex];
      const deltaCords = [];

      for (let i = 0; i < nodeAngle.length; i++) {
        const [x, y] = [
          Math.sin(nodeAngle[i]) * radius,
          Math.cos(nodeAngle[i]) * radius,
        ];
        deltaCords.push({ x, y: -y, angle: nodeAngle[i] }); // y negative is important,cuz sprite world y is negative
      }
      return deltaCords;
    });
  }

  parseGroups(): Record<number, GGGAtlasTree.Group> {
    const groups = Object.keys(this.data.groups).map((groupId) => {
      const group = this.data.groups[groupId];

      const backgroundOverride = group.backgroundOverride;
      const maximumOrbit = Math.max(...group.orbits);
      const radius = this.data.constants.orbitRadii[maximumOrbit];

      return {
        ...group,
        backgroundOverride,
        radius,
        groupId,
      };
    });

    return groups.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.groupId]: cur,
      }),
      {}
    );
  }

  parseNodeIcon(
    node: GGGAtlasTree.Node,
    skillSprites: GGGAtlasTree.SkillSprites,
    zoomLevel: number
  ): {
    nodeIcon: InternalAtlasTree.NodeIcon;
    outlineIcon?: InternalAtlasTree.OutlineIcon;
    groupBackground?: string;
  } {
    const { icon } = node;
    const iconType =
      "isMastery" in node
        ? "mastery"
        : "isNotable" in node
        ? "notable"
        : "normal";

    const result = {
      nodeIcon: {
        active: {
          filename: skillSprites[`${iconType}Active`][zoomLevel].filename,
          cords: skillSprites[`${iconType}Active`][zoomLevel].coords[`${icon}`],
        },
        inactive: {
          filename: skillSprites[`${iconType}Inactive`][zoomLevel].filename,
          cords:
            skillSprites[`${iconType}Inactive`][zoomLevel].coords[`${icon}`],
        },
      },
      outlineIcon: {
        active: `${
          iconType === "notable"
            ? "NotableFrameAllocated"
            : "PSSkillFrameActive"
        }.png`,
        inactive: `${
          iconType === "notable" ? "NotableFrameUnallocated" : "PSSkillFrame"
        }.png`,
      },
    };

    if (iconType === "mastery") {
      const { nodeIcon } = result;
      const { orbits, backgroundOverride } = this.groupMap[node.group];
      if (orbits.length > 1) {
        const filteredOrbits = orbits.filter((orbit) => orbit <= 3);
        const lastOrbit = filteredOrbits[filteredOrbits.length - 1];
        const bgId =
          lastOrbit === backgroundOverride
            ? lastOrbit
            : lastOrbit - backgroundOverride;
        return {
          nodeIcon,
          groupBackground: `PSGroupBackground${bgId}.png`,
        };
      }
    }

    return result;
  }

  mapToInternalNode(
    node: GGGAtlasTree.Node,
    nodeId: string
  ): InternalAtlasTree.Node | InternalAtlasTree.MasteryNode {
    const { nodeIcon, outlineIcon, groupBackground } = this.parseNodeIcon(
      node,
      this.skillSprites,
      3
    );
    const { icon, ...restNodeValues } = node;

    // if mastery node
    if ("isMastery" in node) {
      return {
        ...restNodeValues,
        nodeIcon,
        groupBackground,
        nodeId,
        name: node.name ?? "",
        groupId: node.group?.toString() ?? null,
        isHighlighted: false,
      };
    }
    // if any other node
    return {
      ...restNodeValues,
      nodeIcon,
      outlineIcon,
      nodeId,
      in: node.in ?? [],
      out: node.out ?? [],
      name: node.name ?? "",
      groupId: node.group?.toString() ?? null,
      isSelected: false,
      isHovered: false,
    };
  }

  handleNode(node: GGGAtlasTree.Node, nodeId: string) {
    let result: InternalAtlasTree.Node | InternalAtlasTree.MasteryNode =
      this.mapToInternalNode(node, nodeId);
    if (isSkillNode(node) && node.group) {
      if (node.orbit !== undefined && node.orbitIndex !== undefined) {
        const orbitDelta = this.orbitDelta[node.orbit][node.orbitIndex];
        const { x, y, backgroundOverride } = this.groupMap[node.group];
        result = {
          ...result,
          backgroundOverride,
          groupX: x,
          groupY: y,
          angle: orbitDelta.angle,
          x: x + orbitDelta.x,
          y: y + orbitDelta.y,
        };
      }
    }

    return result;
  }

  parseNodes() {
    const masteryNodes: InternalAtlasTree.MasteryNode[] = [];
    const nodes: InternalAtlasTree.Node[] = [];

    Object.keys(this.data.nodes).forEach((nodeId) => {
      const node = this.handleNode(this.data.nodes[nodeId], nodeId);
      if (!isTreeRoot(node)) {
        if ("isMastery" in node) masteryNodes.push(node);
        else nodes.push(node as InternalAtlasTree.Node);
      }
    });

    const nodeMap = nodes.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.nodeId]: cur,
      }),
      {}
    );
    const masteryNodeMap = masteryNodes.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.nodeId]: cur,
      }),
      {}
    );

    return {
      nodeMap,
      masteryNodeMap,
    };
  }

  parseConnections(): Record<string, InternalAtlasTree.Connection[]> {
    let connections: InternalAtlasTree.Connection[] = [];
    Object.keys(this.nodeMap).forEach((nodeOneId) => {
      const nodeOne = this.nodeMap[nodeOneId];

      nodeOne.out?.forEach((nodeTwoId) => {
        const nodeTwo = this.nodeMap[nodeTwoId];

        if (!nodeTwo) {
          return;
        }

        const isCurved =
          nodeOne.groupId === nodeTwo.groupId &&
          nodeOne.orbit === nodeTwo.orbit;
        const nodes = [nodeOne, nodeTwo];

        nodes.sort((a, b) => {
          if (
            Number.isInteger(a.orbitIndex) &&
            Number.isInteger(b.orbitIndex)
          ) {
            return a.orbitIndex! < b.orbitIndex! ? -1 : 1;
          }

          return -1;
        });

        const [fromNode, toNode] = nodes;

        connections.push({
          fromNode: nodeOne,
          toNode: nodeTwo,
          isCurved,
          isSelected: false,
          canBeAllocated: false,
          canBeUnallocated: false,
        });
      });
    });

    return connections.reduce((acc: { [key: string]: any }, cur) => {
      const fromNodeId = cur.fromNode.nodeId;

      return {
        ...acc,
        [fromNodeId]: acc[fromNodeId] ? [...acc[fromNodeId], cur] : [cur],
      };
    }, {});
  }

  getData(): InternalAtlasTree.Data {
    this.orbitDelta = this.computeOrbitDelta();
    const constants = {
      orbitDelta: this.orbitDelta,
      orbitRadii: this.data.constants.orbitRadii,
      skillsPerOrbit: this.data.constants.skillsPerOrbit,
      imageZoomLevels: this.data.imageZoomLevels,
      minX: this.data.min_x,
      minY: this.data.min_y,
      maxX: this.data.max_x,
      maxY: this.data.max_y,
    };

    this.groupMap = this.parseGroups();
    const { nodeMap, masteryNodeMap } = this.parseNodes();
    this.masteryNodeMap = masteryNodeMap;
    this.nodeMap = nodeMap;
    this.connectionMap = this.parseConnections();
    return {
      constants,
      skillSprites: this.skillSprites,
      nodeMap: this.nodeMap,
      masteryNodeMap: this.masteryNodeMap,
      connectionMap: this.connectionMap,
    };
  }
}
