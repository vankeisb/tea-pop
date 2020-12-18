import * as React from "react";

export type ItemRenderer<T> = (t:T) => React.ReactNode;
