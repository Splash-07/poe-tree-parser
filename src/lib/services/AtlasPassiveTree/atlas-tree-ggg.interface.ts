export declare namespace GGGAtlasPassiveTree {
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
    mastery: SkillSpriteCoords[];
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
