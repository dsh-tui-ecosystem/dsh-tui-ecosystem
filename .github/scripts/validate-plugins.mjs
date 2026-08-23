// dsh-tui-ecosystem PR 校验脚本：plugins.json 变更时自动检查收录标准。
// 运行于 GitHub Actions（node 20+）。失败时输出 ::error:: 工作流命令。
import { execSync } from 'node:child_process'

const GH = 'https://api.github.com'
const token = process.env.GITHUB_TOKEN || ''
const prAuthor = (process.env.PR_AUTHOR || '').toLowerCase()
const DSH_LINKS = ['https://github.com/ccch1mneyyy/dsh-tui', 'https://dshtui.com']
const KINDS = ['plugin', 'template', 'core']
const REQUIRED = ['name', 'displayName', 'description', 'author', 'repo', 'kind', 'addedAt']
const REPO_RE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}\/?$/
const errors = []

const api = async (path, accept) => {
  const res = await fetch(GH + path, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: accept || 'application/vnd.github+json',
      'user-agent': 'plugins-pr-validator',
      'x-github-api-version': '2022-11-28',
    },
  })
  return res
}

// 1. 当前文件必须合法
// 注意：本 workflow 使用 pull_request_target，checkout 到的是 base 分支代码，
// 因此 PR 修改后的 plugins.json 必须通过 GitHub API 从 PR head 获取，而不是读本地文件。
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'dsh-tui-ecosystem/dsh-tui-ecosystem').split('/')
const headSha = process.env.HEAD_SHA || ''
let data
try {
  const res = await api(`/repos/${owner}/${repo}/contents/plugins.json?ref=${encodeURIComponent(headSha)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const meta = await res.json()
  data = JSON.parse(Buffer.from(meta.content, 'base64').toString('utf8'))
} catch (e) {
  console.log(`::error::plugins.json 不是合法 JSON：${e.message}`)
  process.exit(1)
}
if (!Array.isArray(data.plugins)) errors.push('plugins 字段必须是数组')

// 2. 与 main 对比，找出新增条目（HEAD 即 base 分支，等同 main）
let baseRepos = new Set()
try {
  baseRepos = new Set((JSON.parse(execSync('git show HEAD:plugins.json', { encoding: 'utf8' })).plugins || []).map((p) => (p.repo || '').toLowerCase()))
} catch {
  // 首个 PR 或 main 不存在时跳过对比
}

// 3. 逐条校验
const seenNames = new Set()
const seenRepos = new Set()
const newEntries = []
for (const p of data.plugins || []) {
  const name = String(p.name || '')
  const repo = String(p.repo || '')
  for (const f of REQUIRED) {
    if (p[f] === undefined || p[f] === null || p[f] === '') errors.push(`插件 "${name || '?'}": 缺少字段 ${f}`)
  }
  if (!KINDS.includes(p.kind)) errors.push(`插件 "${name}": kind 必须是 ${KINDS.join('/')}`)
  const nk = name.toLowerCase()
  const rk = repo.toLowerCase()
  if (seenNames.has(nk)) errors.push(`插件名重复: ${name}`)
  if (seenRepos.has(rk)) errors.push(`仓库地址重复: ${repo}`)
  seenNames.add(nk)
  seenRepos.add(rk)
  if (!REPO_RE.test(repo)) errors.push(`插件 "${name}": repo 必须是 https://github.com/owner/repo 格式`)
  if (!baseRepos.has(rk)) newEntries.push({ name, repo, description: String(p.description || '') })
}

// 4. 新增条目的深度检查：仓库真实公开、归属、README 链接标准
for (const e of newEntries) {
  const m = e.repo.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)\/?$/)
  if (!m) continue
  const [, owner, repoName] = m
  const repoRes = await api(`/repos/${owner}/${repoName}`)
  if (repoRes.status === 404) {
    errors.push(`插件 "${e.name}": 仓库 ${e.repo} 不存在或不是公开仓库`)
    continue
  }
  if (repoRes.status >= 400) {
    errors.push(`插件 "${e.name}": 无法校验仓库（HTTP ${repoRes.status}）`)
    continue
  }
  const repoInfo = await repoRes.json()
  const repoOwner = String((repoInfo.owner || {}).login || '').toLowerCase()
  if (repoOwner !== prAuthor) {
    const collab = await api(`/repos/${owner}/${repoName}/collaborators/${encodeURIComponent(prAuthor)}`)
    if (collab.status !== 204) {
      errors.push(`插件 "${e.name}": PR 提交者不是仓库 owner/collaborator（收录标准要求本人提交自己仓库）`)
    }
  }
  const readmeRes = await api(`/repos/${owner}/${repoName}/readme`, 'application/vnd.github.raw+json')
  if (!readmeRes.ok) {
    errors.push(`插件 "${e.name}": 无法读取仓库 README（HTTP ${readmeRes.status}）`)
    continue
  }
  const readme = (await readmeRes.text()).toLowerCase()
  if (!DSH_LINKS.some((l) => readme.includes(l))) {
    errors.push(
      `插件 "${e.name}": README 未包含 dsh-TUI 链接（收录标准：README 需包含 https://dshtui.com 或 https://github.com/ccch1mneyyy/dsh-TUI）`,
    )
  }
}

// 5. 汇总
if (errors.length) {
  errors.forEach((m) => console.log(`::error::${m}`))
  console.log(`收录标准校验失败：共 ${errors.length} 个问题`)
  process.exit(1)
}
console.log(`✅ 收录标准校验通过：${(data.plugins || []).length} 个条目，本次新增 ${newEntries.length} 个`)
