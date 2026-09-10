# dsh-plugins

Personal [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugins for the **web** profile.
Each plugin is a standard `dsh` bundle: a `cordis.patch.yml` host row plus a browser half declared through `dsh.client`.

| Plugin | Description |
|---|---|
| [`agent-monitor`](./agent-monitor) | Floating monitor card: running sessions and their active subagents (name, task brief, model, reasoning effort, status). Auto-refresh every 2s. |
| [`quick-notes`](./quick-notes) | Quick-notes floating panel: timestamped entries, clock, alarms with flashing reminder, API prices & balances, day/week/month/year grouping. |

## Install

```sh
dsh plugin --profile web add dsh-plugin-agent-monitor
dsh plugin --profile web add dsh-plugin-quick-notes
```

Both are also installable as local packages: symlink the plugin directory into the dsh profile's `node_modules` and register the package name in `dsh.profile.bundles` in `~/.dsh/profiles/web/package.json`.

## Layout

```
agent-monitor/    # dsh-plugin-agent-monitor 1.0.0
  package.json
  cordis.patch.yml
  lib/index.js    # host half (webServer routes)
  lib/client.js   # browser half
quick-notes/      # dsh-plugin-quick-notes 1.0.0
  ... same layout ...
```

## Status

- Built artifacts only (`lib/`); sources are not included in this repository yet.
- Versions: `agent-monitor` 1.0.0, `quick-notes` 1.0.0.

---

个人 dsh 插件仓库（web profile）：agent-monitor（会话/子代理监控悬浮卡）与 quick-notes（速记/时钟/提醒/API 价格面板）。

## License

MIT - see [LICENSE](./LICENSE).
