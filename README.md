# 涵洞三维结构教学

[![MIT License](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![Deploy to GitHub Pages](https://github.com/jackinthebox771/culvert-teaching-3d/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/jackinthebox771/culvert-teaching-3d/actions/workflows/deploy-pages.yml)

面向大学《工程制图》课程的三维交互式涵洞结构教学网页。项目通过经过图纸与 FBX 模型核对的独立构件模型，帮助学生建立：

> **二维工程图 ↔ 三维结构 ↔ 构件关系**

项目不是普通的三维展示器，而是一套支持构件认知、空间关系分析、爆炸分解、剖切观察、三面投影联动和课堂练习的教学工具。

## 在线体验

- **GitHub Pages：** <https://jackinthebox771.github.io/culvert-teaching-3d/>
- **源代码仓库：** <https://github.com/jackinthebox771/culvert-teaching-3d>

建议使用最新版 Chrome、Edge 或 Firefox，并开启浏览器硬件加速。

## 项目目标

- 将抽象的工程投影关系转化为可操作的三维学习过程。
- 让学生理解底板、洞身、面墙和翼墙之间的真实空间关系。
- 通过构件选择、隔离、剖切和爆炸分解识别复杂形体。
- 将三维构件与正面投影图、水平投影图、侧面投影图同步关联。
- 为教师提供适合课堂演示、结构讲解和即时练习的可视化工具。
- 保持尺寸集中管理和构件独立性，方便后续扩展尺寸标注、教学内容与测验。

## 核心功能

### 1. 经核对的独立构件模型

模型由八个可独立操作的构件组成：

```text
culvert
├── bottom-slab                底板
├── barrel                     洞身
├── front-headwall             前端面墙
├── rear-headwall              后端面墙
├── front-left-wing-wall       前端左翼墙
├── front-right-wing-wall      前端右翼墙
├── rear-left-wing-wall        后端左翼墙
└── rear-right-wing-wall       后端右翼墙
```

重点保留的结构特征包括：

- 底板底面的燕尾形空槽和分段台阶外轮廓。
- 洞身边墙、同心内外拱圈及贯通拱形通道。
- 面墙拱形穿孔、变截面、顶帽和顶部倒角。
- 四片翼墙的八字形展开、斜置方向与变高多折面形体。

### 2. 三维查看与构件联动

- 鼠标旋转、缩放和平移模型。
- 点击或悬停模型选择构件，并与构件列表双向联动。
- 构件高亮、显隐、相机聚焦、隔离观察与全部恢复。
- 默认轴测、正面投影图方向、水平投影图方向和侧面投影图方向快捷切换。
- 工程蓝图网格、教学配色、边缘线和构件名称标签。

### 3. 爆炸分解教学

- 使用连续滑杆观察任意中间分解状态。
- 支持逐步分解、一键分解、一键组合和自动演示。
- 固定教学顺序：底板向下 → 翼墙向两侧 → 面墙向前后 → 洞身向上。
- 八个构件在完全分解状态下彼此分离，同时保持正确的空间方向。

### 4. 剖切、透明与尺寸观察

- 实体、半透明和 X-Ray 三种显示方式。
- 横向剖切保留 `+X` 部分，纵向剖切保留 `-Z` 部分。
- 连续调节剖切位置。
- 单独翻转底板，观察底面的燕尾形空槽。
- 显示关键尺寸、选中构件尺寸或全部尺寸。

### 5. 三面投影联动

- 正面投影图、水平投影图和侧面投影图使用独立正交相机。
- 三个投影视窗与三维轴测视窗共享同一套正式几何数据。
- 点击或悬停任一视窗中的构件，其他视窗同步高亮。
- 支持投影生成演示，帮助理解投射方向和视图对应关系。
- 教学界面统一采用正式工程制图术语。

### 6. 教学导览与课堂挑战

- 七步结构导览依次讲解整体、底板、洞身、面墙、翼墙、三面投影和组合关系。
- 导览步骤可驱动相机、构件选择、隔离、剖切和底板翻转。
- 提供“认构件”“图找物”“物找图”和“拼装涵洞”四类课堂练习。
- 练习直接使用正式三维模型和正交投影结果，不使用替代示意模型。

### 7. Debug 与移动端支持

- Debug 模式可显示 XYZ 坐标轴、工程网格、构件原点、Bounding Box、构件名称、当前尺寸和相机参数。
- 手机端采用全屏模型与底部抽屉布局，保留核心查看和教学功能。
- 手机与电脑位于同一局域网时，可直接访问本地开发服务器进行移动端验收。

## 基本操作

| 操作 | 功能 |
|---|---|
| 鼠标左键拖动 | 旋转模型 |
| 鼠标滚轮 | 缩放模型 |
| 鼠标右键拖动 | 平移模型 |
| 点击构件 | 选择并显示构件教学信息 |
| 悬停构件 | 临时高亮对应构件 |
| 点击场景空白或按 `Esc` | 取消选择 |
| 构件列表眼睛按钮 | 单独显示或隐藏构件 |
| 底部统一控制台 | 控制显示、剖切、尺寸、爆炸和观察方向 |

首页右上角还可进入：

- **5 分钟结构导览**：按教学顺序自动讲解结构。
- **课堂挑战**：进行构件与投影关系练习。
- **三面投影图**：打开四视窗联动教学界面。

## 本地运行

### 环境要求

- Windows 10/11、macOS 或 Linux。
- Node.js `^20.19.0` 或 `>=22.12.0`，建议使用 Node.js 22 LTS。
- 支持 WebGL 2 的现代浏览器。
- 首次安装依赖时需要网络连接。

### Windows 一键启动

双击项目根目录中的：

```text
启动本地项目.cmd
```

脚本会自动进入项目目录、检查 Node.js、按需安装依赖、启动开发服务器并打开浏览器。完整说明见 [docs/本地运行说明.md](docs/本地运行说明.md)。

### 命令行启动

```bash
git clone https://github.com/jackinthebox771/culvert-teaching-3d.git
cd culvert-teaching-3d
npm install
npm run dev -- --host 0.0.0.0
```

启动后访问：

- 本机：`http://localhost:5173/culvert-teaching-3d/`
- 手机：使用终端中显示的 `Network` 地址。

停止服务器时，在运行终端中按 `Ctrl+C`。

### 质量检查与生产构建

```bash
npm run typecheck
npm run lint
npm run build
```

生产文件生成在 `dist/` 目录。推送到 `main` 分支后，GitHub Actions 会自动构建并更新 GitHub Pages。

## 技术栈

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/)
- [Drei](https://drei.docs.pmnd.rs/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- `three-bvh-csg`

## 项目结构

```text
src/
├── app/             应用入口与桌面布局
├── components3d/    独立三维构件组件
├── config/          尺寸、颜色、相机、爆炸与教学配置
├── geometry/        参数化几何与 FBX 独立网格映射
├── projection/      三面投影与四视窗联动
├── scene/           主场景、灯光、相机、剖切与动画
├── store/           Zustand 全局交互状态
├── ui/              控制台、构件树、导览和课堂挑战
└── types/           公共 TypeScript 类型

docs/                开发规划、图纸、模型资料与运行说明
scripts/             模型检查等工程脚本
```

所有正式几何尺寸集中在 `src/config/culvertDimensions.ts`，爆炸参数集中在 `src/config/explodeConfig.ts`，禁止在 React 组件中散落硬编码尺寸。

## 坐标系与模型依据

- 使用 Three.js 右手坐标系。
- `X`：洞口横向。
- `Y`：竖直方向，向上为正。
- `Z`：涵洞纵向；前端为 `-Z`，后端为 `+Z`。
- 原点位于洞身纵横中心线与底板顶面的交点。
- 参数文件使用毫米，几何工厂统一换算为场景单位。

涵洞结构和尺寸以 `docs/涵洞图纸.pdf` 为主要依据，并与 `docs/涵洞三维模型.fbx` 交叉核对。复杂多折面构件使用 FBX 中的独立实体网格，构件 ID、交互状态和尺寸配置仍由代码统一管理。

## 已知非阻塞项

- 开发控制台可能显示 Three.js 上游 `THREE.Clock` 弃用警告，当前不影响运行和动画。
- Three.js/R3F 生产代码块超过 Vite 默认的 500 kB 提示阈值，当前不影响加载与使用。

## 许可证

本项目采用 [MIT License](LICENSE)。

```text
Copyright (c) 2026 jackinthebox771
```

在保留版权声明和许可声明的前提下，可以使用、复制、修改、合并、发布、分发、再许可或销售本软件。软件按“原样”提供，不附带任何明示或默示担保；完整条款请阅读 [LICENSE](LICENSE)。
