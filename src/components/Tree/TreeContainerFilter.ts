import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { SimpleLightmapFilter } from "@pixi/filter-simple-lightmap";
import { Container, withFilters } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import { BloomFilter } from "@pixi/filter-bloom";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";

export const Filters = withFilters(Container, {
  // blur: PIXI.filters.BlurFilter,
  // lightMap: SimpleLightmapFilter,
  bloom: BloomFilter,
  // adjust: AdjustmentFilter,
});
