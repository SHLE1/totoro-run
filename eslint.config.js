import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  stylistic: false,
  ignores: [
    'src/utils/nodeRSA.ts',
    '.agents/**',
    '.claude/**',
    '.commandcode/**',
    '.grok/**',
    '.zcode/**',
    '.oil-ui/**',
  ],
})
