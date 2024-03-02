import type { Node } from "./base.ts";
import type { Declaration } from "./declaration.ts";

export type VCL = Node<"vcl", { declarations: Declaration[] }>;
