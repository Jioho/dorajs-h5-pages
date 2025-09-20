import { VantResolver } from "@vant/auto-import-resolver";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import postCssPxToRem from "postcss-pxtorem";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import vike from "vike/plugin";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    build: { reportCompressedSize: false },
    base: env.VITE_BASE_PATH || "/",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 37.5,
            propList: ["*"],
            selectorBlackList: ["-norem"],
          }),
        ],
      },
    },
    ssr: {
      noExternal: ["vant"],
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
      vike({
        prerender: true,
        baseAssets: env.VITE_BASE_PATH || "/",
      }),
    ],
  };
});
