import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.ts',        // Your entry TS file
  output: {
    file: 'dist/main.js',      // Bundled output
    format: 'cjs',             // CommonJS, what Obsidian expects
    sourcemap: true,
  },
  plugins: [
    resolve(),                // Helps Rollup find node modules if used
    typescript({
      tsconfigOverride: { compilerOptions: { module: "ESNext" } },
      clean: true,
    }),
  ],
};
