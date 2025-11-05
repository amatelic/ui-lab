// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), partytown(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
