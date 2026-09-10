# dsh-plugins

Personal [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugins for the **web** profile.
Each plugin is a standard `dsh` bundle: a `cordis.patch.yml` host row plus a browser half declared through `dsh.client`.

| Plugin | Description |
|---|---|
| [`agent-monitor`](./agent-monitor) | Floating monitor card: running sessions and their active subagents (name, task brief, model, reasoning effort, status). Auto-refresh every 2s. |
| [`quick-notes`](./quick-notes) | Quick-notes floating panel: timestamped entries, clock, alarms with flashing reminder, API prices & balances, day/week/month/year grouping. |

## Install (local plugins)

These plugins are installed into a dsh profile as local packages:

```sh
# 1) link the package into the web profile
ln -s /path/to/dsh-plugins/agent-monitor ~/.dsh/profiles/web/node_modules/@local/agent-monitor

# 2) register it as a profile bundle (add to dsh.profile.bundles in
#    ~/.dsh/profiles/web/package.json)
#    "@local/agent-monitor"
```

Restart `dsh web` afterwards.

## Layout

```
agent-monitor/    # @local/agent-monitor 1.0.0
  package.json
  cordis.patch.yml
  lib/index.js    # host half (webServer routes)
  lib/client.js   # browser half
quick-notes/      # @local/quick-notes 1.0.0
  ... same layout ...
```

## Status

- Built artifacts only (`lib/`); sources are not included in this repository yet.
- Versions: `agent-monitor` 1.0.0, `quick-notes` 1.0.0.

---

个人 dsh 插件仓库（web profile）：agent-monitor（会话/子代理监控悬浮卡）与 quick-notes（速记/时钟/提醒/API 价格面板）。

## License

MIT - see [LICENSE](./LICENSE).
