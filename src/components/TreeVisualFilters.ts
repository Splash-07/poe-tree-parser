import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { Container, withFilters } from "@inlet/react-pixi";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";

export const TreeContainerFilter = withFilters(Container, {
  adjust: AdjustmentFilter,
  blur: KawaseBlurFilter,
});
export const TreeBgFilter = withFilters(Container, {
  blur: KawaseBlurFilter,
});
