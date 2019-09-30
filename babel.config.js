const esm = !!process.env.ESM

module.exports = {
  presets: [
    ['@babel/preset-env', {loose: true, ...(esm ? {modules: false} : {})}],
  ],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining', {loose: true}],
  ],
}
