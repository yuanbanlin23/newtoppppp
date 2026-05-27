import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  // GitHub Pages 项目站路径：https://yuanbanlin23.github.io/newtoppppp/
  base: command === "build" ? "/newtoppppp/" : "/",
}));
