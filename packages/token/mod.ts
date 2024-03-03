/**
 * Fastly VCL token types
 */
// deno-lint-ignore no-namespace
export namespace Token {
  type TokenFor<
    T extends string,
    U extends Record<string, unknown> = Record<string, unknown>,
  > = {
    readonly kind: T;
    readonly start: number;
    readonly end: number;
  } & U;
  // Special
  export type Illegal = TokenFor<"illegal">;
  export type LF = TokenFor<"lf">;
  export type WS = TokenFor<"ws">;
  export type EOF = TokenFor<"eof">;
  // Identifiers
  export type Number = TokenFor<"number">;
  export type String = TokenFor<"string">;
  export type Comment = TokenFor<"comment">;
  export type Bool = TokenFor<"bool", { value: boolean }>;

  // Operators
  // Conditional operators (https://www.fastly.com/documentation/reference/vcl/operators/#conditional-operators)
  export type LogicalAnd = TokenFor<"&&">;
  export type LogicalOr = TokenFor<"||">;
  export type Equal = TokenFor<"==">;
  export type NotEqual = TokenFor<"!=">;
  export type Match = TokenFor<"~">;
  export type NotMatch = TokenFor<"!~">;
  export type Gt = TokenFor<">">;
  export type Lt = TokenFor<"<">;
  export type Gte = TokenFor<">=">;
  export type Lte = TokenFor<"<=">;
  // Assignment operators (https://www.fastly.com/documentation/reference/vcl/operators/#assignment-operators)
  export type Assign = TokenFor<"=">;
  export type AddAssign = TokenFor<"+=">;
  export type SubAssign = TokenFor<"-=">;
  export type MulAssign = TokenFor<"*=">;
  export type DivAssign = TokenFor<"/=">;
  export type ModAssign = TokenFor<"%=">;
  export type BitOrAssign = TokenFor<"|=">;
  export type BitAndAssign = TokenFor<"&=">;
  export type BitXorAssign = TokenFor<"^=">;
  export type ShiftLeftAssign = TokenFor<"<<=">;
  export type ShiftRightAssign = TokenFor<">>=">;
  export type RolAssign = TokenFor<"rol=">;
  export type RorAssign = TokenFor<"ror=">;
  export type LogicalAndAssign = TokenFor<"&&=">;
  export type LogicalOrAssign = TokenFor<"||=">;

  // Punctuation (https://www.fastly.com/documentation/reference/vcl/operators/#reserved-punctuation)
  export type LeftParen = TokenFor<"(">;
  export type RightParen = TokenFor<")">;
  export type LeftBrace = TokenFor<"{">;
  export type RightBrace = TokenFor<"}">;
  export type LeftBracket = TokenFor<"[">;
  export type RightBracket = TokenFor<"]">;
  export type Comma = TokenFor<",">;
  export type Dot = TokenFor<".">;
  export type Semicolon = TokenFor<";">;
  export type Colon = TokenFor<":">;
  export type Slash = TokenFor<"/">;
  export type Exclamation = TokenFor<"!">;
  export type Plus = TokenFor<"+">;
  // Reserved (but not used)
  export type Minus = TokenFor<"-">;
  export type Mul = TokenFor<"*">;
  export type Mod = TokenFor<"%">;
  export type BitOr = TokenFor<"|">;
  export type BitAnd = TokenFor<"&">;
  export type ShiftLeft = TokenFor<"<<">;
  export type ShiftRight = TokenFor<">>">;
  export type PlusPlus = TokenFor<"++">;
  export type MinusMinus = TokenFor<"--">;

  // Keywords
  export type Keyword = TokenFor<"keyword", { value: string }>;
}

/**
 * Fastly VCL token
 */
export type Token =
  | Token.Illegal
  | Token.LF
  | Token.WS
  | Token.EOF
  | Token.Number
  | Token.String
  | Token.Comment
  | Token.Bool
  | Token.LogicalAnd
  | Token.LogicalOr
  | Token.Equal
  | Token.NotEqual
  | Token.Match
  | Token.NotMatch
  | Token.Gt
  | Token.Lt
  | Token.Gte
  | Token.Lte
  | Token.Assign
  | Token.AddAssign
  | Token.SubAssign
  | Token.MulAssign
  | Token.DivAssign
  | Token.ModAssign
  | Token.BitOrAssign
  | Token.BitAndAssign
  | Token.BitXorAssign
  | Token.ShiftLeftAssign
  | Token.ShiftRightAssign
  | Token.RolAssign
  | Token.RorAssign
  | Token.LogicalAndAssign
  | Token.LogicalOrAssign
  | Token.LeftParen
  | Token.RightParen
  | Token.LeftBrace
  | Token.RightBrace
  | Token.LeftBracket
  | Token.RightBracket
  | Token.Comma
  | Token.Dot
  | Token.Semicolon
  | Token.Colon
  | Token.Slash
  | Token.Exclamation
  | Token.Plus
  | Token.Minus
  | Token.Mul
  | Token.Mod
  | Token.BitOr
  | Token.BitAnd
  | Token.ShiftLeft
  | Token.ShiftRight
  | Token.PlusPlus
  | Token.MinusMinus
  | Token.Keyword;
