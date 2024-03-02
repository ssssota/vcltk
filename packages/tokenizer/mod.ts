import type { Token } from "jsr:@vcltk/token@^0.1.0";
import { Tokenizer } from "./tokenizer.ts";

/**
 * Tokenize Fastly VCL source code
 * @param input Fastly VCL source code
 * @returns tokens
 */
export function tokenize(input: string): Token[] {
  return Array.from(new Tokenizer(input));
}

export { type Token, Tokenizer };
