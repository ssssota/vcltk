import type { Token } from "./deps.ts";

/**
 * Tokenize Fastly VCL source code
 * @param input Fastly VCL source code
 * @returns tokens
 */
export function tokenize(input: string): Token[] {
  return Array.from(new Tokenizer(input));
}

const ALPHANUMUNDER_REG = /[_a-zA-Z0-9]/;
const ALPHA_REG = /[a-zA-Z]/;
const HEX_REG = /[0-9a-fA-F]/;
const DEC_REG = /[0-9]/;

/**
 * Fastly VCL tokenizer
 */
export class Tokenizer implements Iterable<Token> {
  private cursor = 0;

  /**
   * Create a new tokenizer
   * @param input Fastly VCL source code
   */
  constructor(private input: string) {}
  private static isWhitespace(char: string): boolean {
    return char === " " || char === "\t";
  }
  private nextChar(): string {
    return this.input.charAt(this.cursor++);
  }
  private peekChar(count = 0): string {
    return this.input.charAt(this.cursor + count);
  }
  private skipPeekChar(): string {
    return this.input.charAt(++this.cursor);
  }
  private readWhitespaces(start: number): Token.WS {
    let char = this.peekChar();
    while (Tokenizer.isWhitespace(char)) {
      char = this.skipPeekChar();
    }
    return { kind: "ws", start, end: this.cursor };
  }
  private readLineComment(start: number): Token.Comment {
    let end = this.cursor;
    let char = this.peekChar();
    while (this.cursor < this.input.length) {
      if (char === "\n") break;
      char = this.skipPeekChar();
      end = this.cursor;
    }
    return { kind: "comment", start, end };
  }
  private readBlockComment(start: number): Token.Comment {
    while (this.cursor < this.input.length) {
      const char = this.nextChar();
      if (char === "*" && this.peekChar() === "/") {
        this.cursor++;
        break;
      }
    }
    return { kind: "comment", start, end: this.cursor };
  }
  private readNumber(start: number, startsWith0 = false): Token {
    let char = this.peekChar();
    let end = this.cursor;
    const hex = startsWith0 && char === "x";
    if (hex) {
      // whole part
      char = this.skipPeekChar();
      while (this.cursor < this.input.length) {
        if (!HEX_REG.test(char)) break;
        char = this.skipPeekChar();
        end = this.cursor;
      }
      if (char !== ".") return { kind: "number", start, end };
      // fractional part
      char = this.skipPeekChar();
      if (!HEX_REG.test(char)) return { kind: "illegal", start, end };
      while (this.cursor < this.input.length) {
        if (!HEX_REG.test(char)) break;
        char = this.skipPeekChar();
        end = this.cursor;
      }
      if (char !== "p") return { kind: "number", start, end };
      // exponent part
      char = this.skipPeekChar();
      if (char === "+" || char === "-") char = this.skipPeekChar();
      if (!DEC_REG.test(char)) return { kind: "illegal", start, end };
      while (this.cursor < this.input.length) {
        if (!DEC_REG.test(char)) break;
        char = this.skipPeekChar();
        end = this.cursor;
      }
      return { kind: "number", start, end };
    }
    // whole part
    while (this.cursor < this.input.length) {
      if (!DEC_REG.test(char)) break;
      char = this.skipPeekChar();
      end = this.cursor;
    }
    if (char !== ".") return { kind: "number", start, end };
    // fractional part
    char = this.skipPeekChar();
    if (!DEC_REG.test(char)) return { kind: "illegal", start, end };
    while (this.cursor < this.input.length) {
      if (!DEC_REG.test(char)) break;
      char = this.skipPeekChar();
      end = this.cursor;
    }
    if (char !== "e") return { kind: "number", start, end };
    // exponent part
    char = this.skipPeekChar();
    if (char === "+" || char === "-") char = this.skipPeekChar();
    if (!DEC_REG.test(char)) return { kind: "illegal", start, end };
    while (this.cursor < this.input.length) {
      if (!DEC_REG.test(char)) break;
      char = this.skipPeekChar();
      end = this.cursor;
    }
    return { kind: "number", start, end };
  }
  private readString(start: number): Token.String {
    while (this.cursor < this.input.length) {
      const char = this.nextChar();
      if (char === '"') break;
    }
    return { kind: "string", start, end: this.cursor };
  }
  private handleBrace(start: number): Token {
    let index = 0;
    let char = this.peekChar(index);
    let hereDoc = "";
    while (ALPHANUMUNDER_REG.test(char)) {
      hereDoc += char;
      char = this.peekChar(++index);
    }
    if (this.peekChar(index) !== '"') {
      return { kind: "{", start, end: this.cursor };
    }
    this.cursor += index + 1;
    while (this.cursor < this.input.length) {
      const char = this.nextChar();
      if (
        char === '"' &&
        this.input.slice(this.cursor, this.cursor + hereDoc.length) ===
          hereDoc &&
        this.peekChar(hereDoc.length) === "}"
      ) {
        this.cursor += hereDoc.length + 1;
        return { kind: "string", start, end: this.cursor };
      }
    }
    return { kind: "illegal", start, end: this.cursor };
  }
  private readMaybyIdentifier(start: number): Token {
    let char = this.peekChar();
    while (this.cursor < this.input.length) {
      if (!/[-.:_a-zA-Z0-9]/.test(char)) break;
      char = this.skipPeekChar();
    }
    const word = this.input.slice(start, this.cursor);
    if (word === "ror" && this.peekChar() === "=") {
      return { kind: "ror=", start, end: ++this.cursor };
    }
    if (word === "rol" && this.peekChar() === "=") {
      return { kind: "rol=", start, end: ++this.cursor };
    }
    return Tokenizer.resolveIdentifier(word, start, this.cursor);
  }
  private static resolveIdentifier(
    word: string,
    start: number,
    end: number,
  ): Token {
    switch (word) {
      case "true":
        return { kind: "bool", value: true, start, end };
      case "false":
        return { kind: "bool", value: false, start, end };
    }
    return { kind: "keyword", start, end, value: word };
  }

  /**
   * Get the next token
   * @returns token
   */
  next(): Token | undefined {
    if (this.cursor >= this.input.length) return;
    const start = this.cursor;
    const char = this.nextChar();
    switch (char) {
      case " ":
      case "\t":
        return this.readWhitespaces(start);
      case "\n":
        return { kind: "lf", start, end: this.cursor };
      case "(":
        return { kind: "(", start, end: this.cursor };
      case ")":
        return { kind: ")", start, end: this.cursor };
      case "{":
        return this.handleBrace(start);
      case "}":
        return { kind: "}", start, end: this.cursor };
      case "[":
        return { kind: "[", start, end: this.cursor };
      case "]":
        return { kind: "]", start, end: this.cursor };
      case ",":
        return { kind: ",", start, end: this.cursor };
      case ".":
        return { kind: ".", start, end: this.cursor };
      case ";":
        return { kind: ";", start, end: this.cursor };
      case ":":
        return { kind: ":", start, end: this.cursor };
      case "/":
        switch (this.peekChar()) {
          case "=":
            return { kind: "/=", start, end: ++this.cursor };
          case "/":
            return this.readLineComment(start);
          case "*":
            return this.readBlockComment(start);
        }
        return { kind: "/", start, end: this.cursor };
      case "!":
        switch (this.peekChar()) {
          case "=":
            return { kind: "!=", start, end: ++this.cursor };
          case "~":
            return { kind: "!~", start, end: ++this.cursor };
        }
        return { kind: "!", start, end: this.cursor };
      case "+":
        switch (this.peekChar()) {
          case "=":
            return { kind: "+=", start, end: ++this.cursor };
          case "+":
            return { kind: "++", start, end: ++this.cursor };
        }
        return { kind: "+", start, end: this.cursor };
      case "-":
        switch (this.peekChar()) {
          case "=":
            return { kind: "-=", start, end: ++this.cursor };
          case "-":
            return { kind: "--", start, end: ++this.cursor };
          case "0":
            return this.readNumber(start, true);
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            return this.readNumber(start);
        }
        return { kind: "-", start, end: this.cursor };
      case "=":
        if (this.peekChar() === "=") {
          return { kind: "==", start, end: ++this.cursor };
        }
        return { kind: "=", start, end: this.cursor };
      case "~":
        return { kind: "~", start, end: this.cursor };
      case "<":
        switch (this.peekChar()) {
          case "=":
            return { kind: "<=", start, end: ++this.cursor };
          case "<":
            this.nextChar();
            if (this.peekChar() === "=") {
              return { kind: "<<=", start, end: ++this.cursor };
            }
            return { kind: "<<", start, end: this.cursor };
        }
        return { kind: "<", start, end: this.cursor };
      case ">":
        switch (this.peekChar()) {
          case "=":
            return { kind: ">=", start, end: ++this.cursor };
          case ">":
            this.nextChar();
            if (this.peekChar() === "=") {
              return { kind: ">>=", start, end: ++this.cursor };
            }
            return { kind: ">>", start, end: this.cursor };
        }
        return { kind: ">", start, end: this.cursor };
      case "|":
        switch (this.peekChar()) {
          case "=":
            return { kind: "|=", start, end: ++this.cursor };
          case "|":
            this.nextChar();
            if (this.peekChar() === "=") {
              return { kind: "||=", start, end: ++this.cursor };
            }
            return { kind: "||", start, end: this.cursor };
        }
        return { kind: "|", start, end: this.cursor };
      case "&":
        switch (this.peekChar()) {
          case "=":
            return { kind: "&=", start, end: ++this.cursor };
          case "&":
            this.nextChar();
            if (this.peekChar() === "=") {
              return { kind: "&&=", start, end: ++this.cursor };
            }
            return { kind: "&&", start, end: this.cursor };
        }
        return { kind: "&", start, end: this.cursor };
      case "^":
        if (this.peekChar() === "=") {
          return { kind: "^=", start, end: ++this.cursor };
        }
        return { kind: "illegal", start, end: this.cursor };
      case "*":
        if (this.peekChar() === "=") {
          return { kind: "*=", start, end: ++this.cursor };
        }
        return { kind: "*", start, end: this.cursor };
      case "%":
        if (this.peekChar() === "=") {
          return { kind: "%=", start, end: ++this.cursor };
        }
        return { kind: "%", start, end: this.cursor };
      case '"':
        return this.readString(start);
      case "#":
        return this.readLineComment(start);
      default:
        if (ALPHA_REG.test(char)) return this.readMaybyIdentifier(start);
        if (DEC_REG.test(char)) return this.readNumber(start, char === "0");
    }
  }

  /**
   * Get the token iterator
   * @returns token iterator
   */
  [Symbol.iterator](): Iterator<Token> {
    // deno-lint-ignore no-this-alias
    const self = this;
    return (function* () {
      let token: Token | undefined;
      while ((token = self.next())) {
        yield token;
      }
      yield { kind: "eof", start: self.input.length, end: self.input.length };
    })();
  }
}
