// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true,
      compiler: 'webpack5',
    }]
  ],
  plugins: [
    // 确保可选链操作符被正确转译
    '@babel/plugin-transform-optional-chaining',
    // 确保空值合并操作符被正确转译
    '@babel/plugin-transform-nullish-coalescing-operator'
  ]
}

