import type { SupportLanguage } from "prettier";

export const language = {
	name: "Fastly VCL",
	extensions: [".vcl"],
	parsers: ["fastly-vcl"],
} as const satisfies SupportLanguage;
