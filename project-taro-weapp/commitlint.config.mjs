export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [0], // 禁用标题长度限制
    "body-max-line-length": [0], // 禁用 body 长度限制
  },
};

