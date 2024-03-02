// deno-lint-ignore no-namespace
export namespace DirectorType {
  export type Random = { type: "RANDOM" };
  export type Fallback = { type: "FALLBACK" };
  export type Content = { type: "CONTENT" };
  export type Client = { type: "CLIENT" };
  export type ConsistentHashing = { type: "CONSISTENT_HASHING" };
  export type Unknown = { type: "UNKNOWN"; value: string };
}

export type DirectorType =
  | DirectorType.Random
  | DirectorType.Fallback
  | DirectorType.Content
  | DirectorType.Client
  | DirectorType.ConsistentHashing
  | DirectorType.Unknown;
