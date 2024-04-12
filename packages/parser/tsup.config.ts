import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["mod.ts"],
	outDir: "dist",
	format: "esm",
	dts: true,
});
