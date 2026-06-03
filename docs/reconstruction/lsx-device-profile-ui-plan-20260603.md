# LSX 设备基础画像前端展示计划

日期：2026-06-03

## 目标

在 2.11 前端设备详情页实时展示后端已经迁移的 LSX 设备画像字段，方便确认设备上报后的字段值是否已经落库并返回。

## 范围

本次只做最小可见闭环：

- 在设备详情页 `Info` 面板增加“LSX 设备信息”区块。
- 展示设备画像字段和当前 SIM 卡。
- 补齐 `DeviceInstance` 类型。
- 不新增 REWEB 按钮。
- 不实现完整物联网卡管理页面。

## 修改文件

- `src/modules/device-manager-ui/views/device/Instance/Detail/Info/index.vue`
  - 新增 LSX 描述区块。
  - 从 `instanceStore.current` 读取字段。
  - 空值统一显示 `--`。
- `src/modules/device-manager-ui/views/device/Instance/typings.d.ts`
  - 补齐后端 `DeviceDetail` 返回的 LSX 字段和 `cards` 类型。

## 当前提交状态

`device-manager-ui` 是前端根仓库里的 Git 子模块，不是普通目录。

当前本地子模块已创建分支并提交：

```text
branch: lsx-ui-migration-2.11-device-profile
commit: 0aea2b3 feat: show lsx device profile
```

但当前子模块 remote 仍然是官方仓库：

```text
git@github.com:jetlinks-v2/device-manager-ui.git
```

本机没有 `gh`，并且 `haishen668/device-manager-ui` 仓库暂不存在，所以这次不能把子模块提交推送到用户私有远端。

因此前端根仓库暂时只提交本计划文档，不提交子模块指针。等创建可写的 `haishen668/device-manager-ui` 后，应执行：

```powershell
cd F:\project\other\jetlinks\worktrees\jetlinks-ui-vue-lsx-ui-migration-2.11\src\modules\device-manager-ui
git remote add haishen668 https://github.com/haishen668/device-manager-ui.git
git push haishen668 lsx-ui-migration-2.11-device-profile

cd F:\project\other\jetlinks\worktrees\jetlinks-ui-vue-lsx-ui-migration-2.11
git submodule set-url src/modules/device-manager-ui https://github.com/haishen668/device-manager-ui.git
git add .gitmodules src/modules/device-manager-ui
git commit -m "feat: point device manager ui to lsx branch"
git push
```

## 无私有子模块远端时的恢复方式

为了避免本地子模块提交丢失，前端根仓库已保存补丁：

```text
docs/reconstruction/patches/device-manager-ui-lsx-device-profile-0aea2b3.patch
```

如果以后重新 clone 前端仓库，但还没有 `haishen668/device-manager-ui` 子模块 fork，可以这样恢复 LSX 设备详情展示：

```powershell
cd F:\project\other\jetlinks\worktrees\jetlinks-ui-vue-lsx-ui-migration-2.11
git submodule update --init --recursive src/modules/device-manager-ui

cd F:\project\other\jetlinks\worktrees\jetlinks-ui-vue-lsx-ui-migration-2.11\src\modules\device-manager-ui
git switch -c lsx-ui-migration-2.11-device-profile
git am ..\..\..\docs\reconstruction\patches\device-manager-ui-lsx-device-profile-0aea2b3.patch
```

恢复后再次运行：

```powershell
cd F:\project\other\jetlinks\worktrees\jetlinks-ui-vue-lsx-ui-migration-2.11
corepack pnpm build
```

## 验证

运行：

```powershell
corepack pnpm build
```

预期：

```text
构建成功
```

运行时验证：

1. 后端运行在 `http://127.0.0.1:8848`。
2. 前端打开设备详情页。
3. 在“LSX 设备信息”区块看到 IMEI、MAC、固件版本、网络指标和 SIM 卡字段。
