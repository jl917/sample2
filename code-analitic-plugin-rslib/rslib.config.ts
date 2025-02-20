import { defineConfig } from "@rslib/core";

export default defineConfig({
  output: {
    minify: true,
  },
  lib: [
    {
      format: "esm",
      syntax: "es2021",
      dts: true,
    },
    {
      format: "cjs",
      syntax: "es2021",
    },
  ],
});
