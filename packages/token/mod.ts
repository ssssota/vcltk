/**
 * Fastly VCL token types
 */
// deno-lint-ignore no-namespace
export namespace Token {
  type TokenFor<T> = {
    readonly token: T;
    readonly start: number;
    readonly end: number;
  };
  // Special
  export type Illegal = TokenFor<"illegal">;
  export type LF = TokenFor<"lf">;
  export type WS = TokenFor<"ws">;
  export type EOF = TokenFor<"eof">;
  // Identifiers
  export type Ident = TokenFor<"ident">;
  export type Number = TokenFor<"number">;
  export type String = TokenFor<"string">;
  export type Comment = TokenFor<"comment">;
  export type True = TokenFor<"true">;
  export type False = TokenFor<"false">;

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
  export type Acl = TokenFor<"acl">;
  export type Backend = TokenFor<"backend">;
  export type Declare = TokenFor<"declare">;
  export type Director = TokenFor<"director">;
  export type Import = TokenFor<"import">;
  export type Include = TokenFor<"include">;
  export type Table = TokenFor<"table">;
  export type Add = TokenFor<"add">;
  export type Call = TokenFor<"call">;
  export type Sub = TokenFor<"sub">;
  export type Error = TokenFor<"error">;
  export type Return = TokenFor<"return">;
  export type Restart = TokenFor<"restart">;
  export type Set = TokenFor<"set">;
  export type Unset = TokenFor<"unset">;
  export type Log = TokenFor<"log">;
  export type Esi = TokenFor<"esi">;
  export type Synthetic = TokenFor<"synthetic">;
  export type SyntheticBase64 = TokenFor<"synthetic.base64">;
  export type If = TokenFor<"if">;
  export type Else = TokenFor<"else">;
  export type Elsif = TokenFor<"elsif">;
  export type Elseif = TokenFor<"elseif">;
  export type Penaltybox = TokenFor<"penaltybox">;
  export type Ratecounter = TokenFor<"ratecounter">;
}

/**
 * Fastly VCL token
 */
export type Token =
  | Token.Illegal
  | Token.LF
  | Token.WS
  | Token.EOF
  | Token.Ident
  | Token.Number
  | Token.String
  | Token.Comment
  | Token.True
  | Token.False
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
  | Token.Acl
  | Token.Backend
  | Token.Declare
  | Token.Director
  | Token.Import
  | Token.Include
  | Token.Table
  | Token.Add
  | Token.Call
  | Token.Sub
  | Token.Error
  | Token.Return
  | Token.Restart
  | Token.Set
  | Token.Unset
  | Token.Log
  | Token.Esi
  | Token.Synthetic
  | Token.SyntheticBase64
  | Token.If
  | Token.Else
  | Token.Elsif
  | Token.Elseif
  | Token.Penaltybox
  | Token.Ratecounter;
