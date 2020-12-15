import {Menu} from "./Menu";
import {Pos} from "../tea-popover/Pos";
import {Maybe} from "react-tea-cup";

export interface Model<T> {
  readonly menu: Menu<T>;
  readonly openAt: Maybe<Pos>;
}
