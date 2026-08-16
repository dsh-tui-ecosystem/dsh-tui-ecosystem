# 插件收录标准 · CONTRIBUTING

这个仓库是 dsh-TUI 插件市场（<https://dshtui.com/plugins/>）的收录列表仓库。
所有收录都走**同一套自动校验**，无需人工审批。

## 收录标准（自动校验）

1. **仓库要求**：插件必须是公开的 GitHub 仓库。
2. **归属要求**：提交者必须是该仓库的 owner 或 collaborator（不能替别人提交）。
3. **README 链接**：插件仓库的 README 必须包含 dsh-TUI 链接之一：
   - `https://dshtui.com`
   - `https://github.com/ccch1mneyyy/dsh-TUI`
4. **字段要求**：`plugins.json` 条目必须包含 `name`、`displayName`、`description`、`author`、`repo`、`kind`（`plugin`/`template`/`core`）、`addedAt`；`tags` 可选。
5. **去重**：`name` 与 `repo` 不得与已有条目重复。

## 两条提交路线

### ① 提 PR（推荐给熟悉 GitHub 的人）

```sh
# fork 后修改 plugins.json，新增一条：
{
  "name": "your-plugin",
  "displayName": "Your Plugin",
  "description": "一句话介绍",
  "author": "your-name",
  "repo": "https://github.com/your-name/your-plugin",
  "npm": null,
  "tags": ["主题", "状态栏"],
  "kind": "plugin",
  "featured": false,
  "addedAt": "2026-08-16"
}
```

合并后流程全自动：**校验（标准 1–5）→ AI 审查（描述质量/垃圾内容）→ 通过即自动合并**，
一小时内同步到插件市场。AI 标记可疑的会留言等你人工处理。

### ② 在线提交表单

在 <https://dshtui.com/plugins/> 底部填表提交。通过同一套校验（含 README 链接检查）后
**自动写入本文件并立即上架**；不通过会直接提示原因（例如 README 缺 dsh-TUI 链接），
改好后重新提交即可。

## 本地验证

```sh
# 需要 node 20+；先 fetch 最新 main
git fetch origin main
GITHUB_TOKEN=xxx PR_AUTHOR=你的用户名 node .github/scripts/validate-plugins.mjs
```
