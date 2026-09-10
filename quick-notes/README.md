# @local/quick-notes

Quick-notes floating panel for **dsh web**: timestamped notes, a clock, alarms and API price shortcuts.

## Features

- Timestamped quick notes, grouped by day / week / month / year
- Clock plus alarms with a flashing reminder
- API price and balance shortcuts (DeepSeek and BigModel public pages)

## Install (local plugin)

```sh
ln -s /path/to/dsh-plugins/quick-notes ~/.dsh/profiles/web/node_modules/@local/quick-notes
```

Then add `"@local/quick-notes"` to `dsh.profile.bundles` in `~/.dsh/profiles/web/package.json` and restart `dsh web`.

## Layout

```
package.json        # dsh bundle metadata (dsh.bundle + dsh.client)
cordis.patch.yml    # host row: inserts @local/quick-notes
lib/index.js        # host half: webServer routes for the client panel
lib/client.js       # browser half: the quick-notes floating panel
```

## Version

1.0.0 - MIT
