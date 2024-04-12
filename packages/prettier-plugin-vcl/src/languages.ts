import type { SupportLanguage } from "prettier";

export const languages: SupportLanguage[] = [
  {
    name: "Fastly VCL",
    extensions: [".vcl"],
    parsers: ["fastly-vcl"],
  },
];
