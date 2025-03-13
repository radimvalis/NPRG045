import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({

    plugins: [
        vue(),
        vuetify()
    ],
    server: {
        port: parseInt(process.env.FRONTEND_PORT),
        allowedHosts: ["frontend"],
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
