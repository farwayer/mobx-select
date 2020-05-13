const esm = !!process.env.ESM


export default {
  presets: [
    ['@babel/preset-env', {
      bugfixes: true,
      loose: true,
      modules: esm ? false : undefined,
    }],
  ],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining', {loose: true}],
  ],
}
