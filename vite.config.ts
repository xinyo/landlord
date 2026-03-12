/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isWechatMode = mode === "wechat";

  return {
    plugins: [react()],
    define: {
      __BUILD_TARGET__: JSON.stringify(isWechatMode ? "wechat" : "web"),
    },
    build: {
      outDir: isWechatMode ? "dist-wechat" : "dist",
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
    },
  };
});
