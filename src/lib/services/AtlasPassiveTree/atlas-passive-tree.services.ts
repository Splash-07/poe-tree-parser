import { GGGAtlasPassiveTree } from "./atlas-tree-ggg.interface";
import { InternalPassiveTree } from "./atlas-tree-internal.interface";
import { isSkillNode } from "./atlas-tree.typeguards";

export class AtlasPassiveTreeService {
  data: GGGAtlasPassiveTree.Data;
  skillSprites: GGGAtlasPassiveTree.SkillSprites;
  groupMap: Record<string, GGGAtlasPassiveTree.Group> = {};
  orbitDelta: InternalPassiveTree.OrbitDelta[][] = [];
  nodeMap: Record<string, InternalPassiveTree.Node> = {};
  connectionMap: Record<string, InternalPassiveTree.Connection[]> = {};

  constructor(data: GGGAtlasPassiveTree.Data) {
    this.data = data;
    this.skillSprites = data.skillSprites;
  }

  computeOrbitDelta(): InternalPassiveTree.OrbitDelta[][] {
    const { skillsPerOrbit, orbitRadii } = this.data.constants;

    return skillsPerOrbit.map((nodesPerOrbit, orbitIndex) => {
      const nodeAngle = this.calcOrbitAngles(nodesPerOrbit);
      const radius = orbitRadii[orbitIndex];
      const deltaCords = [];

      for (let i = 0; i < nodeAngle.length; i++) {
        const [x, y] = [Math.sin(nodeAngle[i]) * radius, Math.cos(nodeAngle[i]) * radius];
        deltaCords.push({ x, y: -y }); // y negative is important,cuz sprite world y is negative
      }
      return deltaCords;
    });
  }

  parseGroups(): Record<number, GGGAtlasPassiveTree.Group> {
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

  mapToInternalNode(node: GGGAtlasPassiveTree.Node, nodeId: string): InternalPassiveTree.Node {
    return {
      ...node,
      nodeId,
      out: node.out ?? [],
      name: node.name ?? "",
      groupId: node.group?.toString() ?? null,
      isSelected: false,
    };
  }

  handleNode(node: GGGAtlasPassiveTree.Node, nodeId: string) {
    let result: InternalPassiveTree.Node = this.mapToInternalNode(node, nodeId);
    if (isSkillNode(node) && node.group) {
      if (node.orbit !== undefined && node.orbitIndex !== undefined) {
        const { x, y, backgroundOverride } = this.groupMap[node.group];
        const orbitDelta = this.orbitDelta[node.orbit][node.orbitIndex];
        result = {
          ...result,
          backgroundOverride,
          x: x + orbitDelta.x,
          y: y + orbitDelta.y,
        };
      }
    }

    return result;
  }

  parseNodes(): Record<string, InternalPassiveTree.Node> {
    const nodes = Object.keys(this.data.nodes).map((nodeId) => {
      const node = this.data.nodes[nodeId];

      return this.handleNode(node, nodeId);
    });
    return nodes.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.nodeId]: cur,
      }),
      {}
    );
  }

  parseConnections(): Record<string, InternalPassiveTree.Connection[]> {
    let connections: InternalPassiveTree.Connection[] = [];
    Object.keys(this.nodeMap).forEach((nodeOneId) => {
      const nodeOne = this.nodeMap[nodeOneId];

      nodeOne.out?.forEach((nodeTwoId) => {
        const nodeTwo = this.nodeMap[nodeTwoId];

        if (!nodeTwo) {
          return;
        }

        const isCurved = nodeOne.groupId === nodeTwo.groupId && nodeOne.orbit === nodeTwo.orbit;
        const nodes = [nodeOne, nodeTwo];

        nodes.sort((a, b) => {
          if (Number.isInteger(a.orbitIndex) && Number.isInteger(b.orbitIndex)) {
            return a.orbitIndex! < b.orbitIndex! ? -1 : 1;
          }

          return -1;
        });

        const [fromNode, toNode] = nodes;

        connections.push({
          fromNode,
          toNode,
          isCurved,
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

  getData(): InternalPassiveTree.Data {
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
    this.nodeMap = this.parseNodes();
    this.connectionMap = this.parseConnections();

    return {
      constants,
      skillSprites: this.skillSprites,
      nodes: this.nodeMap,
      connectionMap: this.connectionMap,
    };
  }

  calcOrbitAngles(nodesInOrbit: number): number[] {
    let orbitAngles = [];

    if (nodesInOrbit === 16) {
      // Every 30 and 45 degrees, per https://github.com/grindinggear/skilltree-export/blob/3.17.0/README.md
      const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
      orbitAngles = [...angles];
    } else if (nodesInOrbit == 40) {
      // Every 10 and 45 degrees
      const angles = [
        0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135, 140, 150, 160, 170, 180, 190, 200, 210, 220,
        225, 230, 240, 250, 260, 270, 280, 290, 300, 310, 315, 320, 330, 340, 350,
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
}
