export declare namespace GGGAtlasTree {
  export interface Group {
    x: number;
    y: number;
    backgroundOverride: number;
    orbits: number[];
    nodes: string[];
  }
  export interface Node {
    name?: string;
    group: number;
    orbit: number;
    orbitIndex: number;

    out?: string[];
    in?: string[];
    icon?: string;
    isMastery?: boolean;
    isNotable?: boolean;
  }

  export interface SkillNode extends Node {
    skill: number;
    icons?: string;
    stats?: string[];
  }

  export interface MasteryNode extends SkillNode {
    isMastery: boolean;
  }

  export interface NotableNode extends SkillNode {
    isNotable: boolean;
  }

  export interface Constants {
    classes: never[];
    characterAttributes: never[];
    PSSCentreInnerRadius: number;
    skillsPerOrbit: number[];
    orbitRadii: number[];
  }

  export interface SkillSpriteCoords {
    filename: string;
    coords: {
      [key: string]: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
    };
  }
  export interface SkillSprites {
    normalActive: SkillSpriteCoords[];
    notableActive: SkillSpriteCoords[];
    normalInactive: SkillSpriteCoords[];
    notableInactive: SkillSpriteCoords[];
    masteryInactive: SkillSpriteCoords[];
    masteryActive: SkillSpriteCoords[];
  }

  export interface Data {
    constants: Constants;
    groups: Record<string, Group>;
    nodes: Record<string, Node | NotableNode | MasteryNode>;
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
    skillSprites: SkillSprites;
    imageZoomLevels: number[];
  }
}

export declare namespace InternalAtlasTree {
  export interface IconSprite {
    filename: string;
    cords: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  }

  export interface NodeIcon {
    active: IconSprite;
    inactive: IconSprite;
  }
  export interface OutlineIcon {
    active: string;
    inactive: string;
  }

  export interface OrbitDelta {
    x: number;
    y: number;
    angle: number;
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
    name: string;
    nodeId: string;
    groupId: string;
    orbit: number;
    orbitIndex: number;

    nodeIcon: NodeIcon;
    outlineIcon?: OutlineIcon;
    groupBackground?: string;
    stats?: string[];

    groupX?: number;
    groupY?: number;
    x?: number;
    y?: number;
    angle?: number;

    backgroundOverride?: number;

    out: string[];

    isSelected: boolean;
    isHovered: boolean;
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

    isSelected: boolean;
  }

  export interface Data {
    constants: Constants;
    connectionMap: Record<string, Connection[]>;
    nodeMap: Record<string, Node | NotableNode | MasteryNode>;
    skillSprites: GGGAtlasTree.SkillSprites;
  }
}
