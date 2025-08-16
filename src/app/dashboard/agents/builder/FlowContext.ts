import { createContext } from "react";

export const FlowContext = createContext<{
  onAddBetween?: (edgeId: string) => void;
}>({});
