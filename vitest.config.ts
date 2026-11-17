import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@meduza/ui", replacement: path.resolve("design-system/src/index.ts") },
      { find: /^@\//, replacement: `${path.resolve(".")}/` }
    ]
  },
  // tsconfig keeps jsx as "preserve" for Next, so tell the test transformer to compile JSX itself.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
    // Same value as .env.local, so the tests do not depend on the machine.
    env: { BOOKING_LAST_TIME: "23:30" }
  }
});
