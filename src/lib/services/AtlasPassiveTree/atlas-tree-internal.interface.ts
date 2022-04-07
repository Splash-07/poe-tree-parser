import { GGGAtlasPassiveTree } from "./atlas-tree-ggg.interface";
export declare namespace InternalPassiveTree {
  export interface OrbitDelta {
    x: number;
    y: number;
  }

  export interface Constants {
    orbitRadii: number[];
    orbitDelta: OrbitDelta[][];
    skillsPerOrbit: number[];
    imageZoomLevels: number[];
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }

  export interface Node {
    nodeId: string;
    groupId?: string;
    orbit?: number;
    orbitIndex?: number;

    icon?: string;
    stats?: string[];
    name?: string;

    x?: number;
    y?: number;
    backgroundOverride?: number;

    out: string[];

    isSelected: boolean;
  }

  export interface RootNode extends Node {
    nodeId: "29045";
  }
  export interface MasteryNode extends Node {
    isMastery: boolean;
  }

  export interface NotableNode extends Node {
    isNotable: boolean;
  }

  export interface Connection {
    fromNode: Node;
    toNode: Node;
    isCurved: boolean;

    isSelected?: boolean;
  }

  export interface Data {
    constants: Constants;
    connectionMap: Record<string, Connection[]>;
    nodes: Record<string, Node | NotableNode | MasteryNode>;
    skillSprites: GGGAtlasPassiveTree.SkillSprites;
  }
}
