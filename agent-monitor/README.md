# @local/agent-monitor

Floating monitor card for **dsh web**: a live view of running sessions and their active subagents.

## Features

- Running sessions with their active subagents in one floating card
- Per-subagent details: name, task brief, model, reasoning effort, status
- Auto-refresh every 2 seconds

## Install (local plugin)

```sh
ln -s /path/to/dsh-plugins/agent-monitor ~/.dsh/profiles/web/node_modules/@local/agent-monitor
```

Then add `"@local/agent-monitor"` to `dsh.profile.bundles` in `~/.dsh/profiles/web/package.json` and restart `dsh web`.

## Layout

```
package.json        # dsh bundle metadata (dsh.bundle + dsh.client)
cordis.patch.yml    # host row: inserts @local/agent-monitor
lib/index.js        # host half: webServer JSON route aggregating running agents + subagents
lib/client.js       # browser half: the floating monitor card
```

## Version

1.0.0 - MIT
