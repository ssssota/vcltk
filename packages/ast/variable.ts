import type { Node } from "./base.ts";

export type Variable = Node<"variable", {
  name: string;
  properties: string[];
  subField?: string;
}>;
