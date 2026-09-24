# dsh-tui-ecosystem

围绕 [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)
（`@deepseek-harness-tui/dsh-tui`）的社区插件与扩展生态组织。

> 核心仓库不迁移。dsh-TUI 永远属于它的作者；本组织只承载社区资产：
> 插件模板、社区插件与收录列表。

## Repositories

| 仓库 | 说明 |
| --- | --- |
| [plugin-template](plugin-template/) | 插件模板：从零到一个能跑的 Cordis 插件，5 分钟起步 |

## 想做一个插件？

1. 从 [`plugin-template`](plugin-template/) 克隆起步；
2. 通读核心仓库的[插件开发指南](https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/plugins.md)
   （接缝：会话事件 / TUI 槽位 / 技能 / 主题 / prompt 段）；
3. 完成后把你的仓库链接提交到本 README 的收录列表（PR 即可），
   或提交到核心仓库的 [docs/links.md](https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/links.md)。

## 社区收录

| 项目 | 类型 | 说明 |
| --- | --- | --- |
| [YesPlayMusic ypm skill](https://github.com/nagi-studio/YesPlayMusic/tree/master/skills/ypm) | 技能 | 让 dsh 的 agent 控制本机 YesPlayMusic 音乐播放：查在放的歌、暂停/继续、切歌 |

## 收录规则（轻治理）

- 插件作者对自己的仓库拥有完全所有权；组织成员只维护自己的插件仓库。
- 收录列表只做链接与背书，不吸收代码；烂插件不会污染组织，只是不进列表。
- 命名约定：npm 包 `@dsh-tui-ecosystem/<name>`，仓库 `github.com/dsh-tui-ecosystem/<name>`，
  MIT 许可证。
