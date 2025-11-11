# @vben/backend-mock

## 说明

Vben Admin 数据 mock 服务，所有数据都是模拟的，用于前端开发时提供数据支持。

该服务不需要手动启动，已经集成在 vite 插件内，随应用一起启用。

## 可用的接口

- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `POST /api/auth/refresh` - 刷新 token
- `GET /api/auth/codes` - 获取权限码
- `GET /api/user/info` - 获取用户信息
- `GET /api/menu/all` - 获取菜单

## 默认用户

- 用户名: `vben` 密码: `123456` 角色: `super`
- 用户名: `admin` 密码: `123456` 角色: `admin`
- 用户名: `jack` 密码: `123456` 角色: `user`

## 运行服务

```bash
# 开发模式
$ pnpm run start
# 构建
$ pnpm run build
```
