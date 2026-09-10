// @local/agent-monitor — Client half (real browser bundle for the dsh __ModuleLoader__).
// Data via fetch to this package's webServer route; React via the loader's require.
window.__ModuleLoader__.load({
  id: "@local/agent-monitor",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    let react = require("react");
    let { createElement: E, useState: US, useEffect: UE } = react;
    let reactDom = require("react-dom");

const EFF_COLORS = {
  max: { c: '#d3b3ff', bg: 'rgba(211,179,255,.16)' },
  high: { c: '#ffc46b', bg: 'rgba(255,196,107,.14)' },
  medium: { c: '#9db9ff', bg: 'rgba(157,185,255,.14)' },
  med: { c: '#9db9ff', bg: 'rgba(157,185,255,.14)' },
  low: { c: '#8fd4c4', bg: 'rgba(143,212,196,.13)' },
  minimal: { c: '#8b98ab', bg: 'rgba(139,152,171,.12)' },
  min: { c: '#8b98ab', bg: 'rgba(139,152,171,.12)' },
  off: { c: '#68758a', bg: 'rgba(104,117,138,.12)' },
}
function effBadge(effort) {
  if (!effort || typeof effort !== 'string') return null
  const key = effort.toLowerCase()
  const col = EFF_COLORS[key]
  if (!col) return null
  return E('span', {
    className: 'am-eff', title: '推理深度',
    style: { color: col.c, background: col.bg },
  }, key)
}

const CSS = [
  '.am-panel{position:fixed;width:340px;z-index:99980;background:rgba(20,24,30,.95);color:#e6e9f0;',
  'border:1px solid rgba(90,200,160,.3);border-left:3px solid #2fbf71;border-radius:10px;',
  'box-shadow:0 10px 32px rgba(0,0,0,.4);font-size:12.5px;line-height:1.45;user-select:none;}',
  '.am-head{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:grab;font-weight:700;',
  'letter-spacing:.04em;border-bottom:1px solid rgba(120,150,200,.16);border-radius:9px 9px 0 0;background:rgba(255,255,255,.03);}',
  '.am-head:active{cursor:grabbing}',
  '.am-dot{width:8px;height:8px;border-radius:50%;background:#2fbf71;box-shadow:0 0 6px #2fbf71;flex:none;}',
  '.am-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.am-count{font-weight:400;font-size:11px;color:#9fb0c7;background:rgba(255,255,255,.08);border-radius:8px;padding:1px 7px;}',
  '.am-min{width:22px;height:22px;line-height:20px;text-align:center;border-radius:6px;',
  'background:rgba(255,255,255,.08);cursor:pointer;font-size:14px;flex:none;}',
  '.am-min:hover{background:rgba(47,191,113,.35)}',
  '.am-body{padding:6px 10px 10px;max-height:320px;overflow-y:auto;user-select:text;}',
  '.am-body::-webkit-scrollbar{width:6px}',
  '.am-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:3px}',
  '.am-row{padding:7px 9px;margin-top:6px;background:rgba(255,255,255,.05);border-radius:8px;}',
  '.am-row:first-child{margin-top:4px}',
  '.am-kids{margin-top:5px;padding-left:16px;border-left:2px solid rgba(53,194,107,.35);display:flex;flex-direction:column;gap:5px;}',
  '.am-kid{background:rgba(53,194,107,.07);border-radius:7px;padding:5px 8px;}',
  '.am-kidtop{display:flex;align-items:center;gap:6px;}',
  '.am-rowtop{display:flex;align-items:center;gap:6px;}',
  '.am-st{width:9px;height:9px;border-radius:50%;flex:none;}',
  '.am-st.run{background:#35c26b;box-shadow:0 0 7px #35c26b;animation:am-pulse 1.1s ease-in-out infinite;}',
  '.am-st.idle{background:#68758a;}',
  '@keyframes am-pulse{0%,100%{opacity:1}50%{opacity:.45}}',
  '.am-name{flex:1;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.am-kind{flex:none;font-size:9.5px;padding:1px 6px;border-radius:8px;background:rgba(79,140,255,.22);color:#a9c4ff;}',
  '.am-kid .am-kind{background:rgba(47,191,113,.2);color:#8fe0bb;}',
  '.am-eff{flex:none;font-size:9px;padding:1px 5px;border-radius:6px;',
  'font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;letter-spacing:.02em;}',
  '.am-model{flex:none;font-size:10px;color:#9fd4a8;font-family:ui-monospace,Menlo,Consolas,monospace;',
  'max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.am-prov{flex:none;font-size:9px;padding:1px 5px;border-radius:6px;color:#8b98ab;',
  'background:rgba(139,152,171,.12);max-width:86px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.am-brief{margin-top:3px;color:#aab6c8;font-size:11.5px;overflow:hidden;text-overflow:ellipsis;',
  'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}',
  '.am-meta{margin-top:3px;color:#68758a;font-size:10px;display:flex;gap:8px;}',
  '.am-sttxt.run{color:#35c26b;}.am-sttxt.idle{color:#8b98ab;}',
  '.am-empty{color:#7c8aa0;font-size:12px;text-align:center;padding:16px 0;}',
  '.am-hint{color:#68758a;font-size:10px;text-align:center;padding-bottom:4px;}',
  '.am-capture{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99985;cursor:grabbing;}',
  '.am-rs{position:absolute;right:1px;bottom:1px;width:17px;height:17px;cursor:nwse-resize;opacity:.5;}',
  '.am-rs:hover{opacity:1;background:rgba(47,191,113,.18);border-radius:6px;}',
  '.am-rs::after{content:"";position:absolute;right:3px;bottom:3px;width:8px;height:8px;',
  'border-right:2px solid #5a8f6f;border-bottom:2px solid #5a8f6f;border-radius:1px;}',
  // 拉大后解除截断：名称/模型/provider 换行完整显示，brief 不再两行钳制
  '.am-wide .am-name,.am-wide .am-model,.am-wide .am-prov{max-width:none;white-space:normal;overflow:visible;text-overflow:clip;}',
  '.am-wide .am-brief{display:block;-webkit-line-clamp:unset;-webkit-box-orient:horizontal;white-space:pre-wrap;}',
].join('\n')

const name = 'agent-monitor-client'

function apply(ctx) {
  const slots = ctx.get('slots')
  if (slots === undefined) return

  let styleEl = null
  try {
    styleEl = document.createElement('style')
    styleEl.textContent = CSS
    document.head.appendChild(styleEl)
  } catch {}

  function App() {
    const [rows, setRows] = US([])
    const [pos, setPos] = US(null)
    const [drag, setDrag] = US(null)
    const [open, setOpen] = US(true)
    const [err, setErr] = US('')
    const [rs, setRs] = US(null)
    const [size, setSize] = US(() => {
      try {
        const s = JSON.parse(window.localStorage.getItem('agent-monitor-size') || '')
        if (s && Number(s.w) >= 280 && Number(s.h) >= 140) return { w: Number(s.w), h: Number(s.h) }
      } catch {}
      return { w: 340, h: 320 }
    })

    const clampSize = (w, h) => {
      const vw = (typeof window !== 'undefined' && window.innerWidth) || 1024
      const vh = (typeof window !== 'undefined' && window.innerHeight) || 768
      return {
        w: Math.max(280, Math.min(1000, vw - 40, w)),
        h: Math.max(140, Math.min(vh - 180, h)),
      }
    }
    const resizeTo = (w, h) => setSize(clampSize(w, h))

    UE(() => {
      try { window.localStorage.setItem('agent-monitor-size', JSON.stringify(size)) } catch {}
    }, [size])

    const refresh = () => {
      fetch('/plugins/local/agent-monitor/snapshot').then((r) => r.json()).then((r) => {
        if (r && r.ok) {
          setRows(Array.isArray(r.agents) ? r.agents : [])
          setErr('')
        }
      }).catch(() => setErr('快照失败：服务不可达'))
    }

    UE(() => {
      refresh()
      const t = setInterval(refresh, 2000)
      return () => clearInterval(t)
    }, [])

    const stTxt = (st) => st === 'running' ? '运行中' : '空闲'

    const modelTip = (r) => {
      let tip = [r.provider, r.model].filter(Boolean).join('/')
      if (r.effort) tip += (tip ? ' · ' : '') + '推理 ' + r.effort
      if (r.maxTokens) tip += (tip ? ' · ' : '') + 'max ' + r.maxTokens
      return tip
    }
    const provChip = (r) => r.provider
      ? E('span', { className: 'am-prov', title: '提供方：' + r.provider }, r.provider)
      : null

    const kidEl = (k) => E('div', { className: 'am-kid', key: k.id },
      E('div', { className: 'am-kidtop' },
        E('span', { className: 'am-st run', title: stTxt(k.status) }),
        E('span', { className: 'am-kind' }, k.kind),
        E('span', { className: 'am-name', title: k.name || k.id }, k.name || k.id.slice(0, 10)),
        provChip(k),
        effBadge(k.effort),
        E('span', { className: 'am-model', title: modelTip(k) }, k.model || '—'),
      ),
      k.brief ? E('div', { className: 'am-brief', title: k.brief }, k.brief) : null,
      E('div', { className: 'am-meta' },
        E('span', { className: 'am-sttxt run' }, stTxt(k.status)),
        E('span', null, '#' + String(k.id || '').slice(0, 8)),
        k.turns > 0 ? E('span', null, k.turns + ' 事件') : null,
      ),
    )

    const sessEl = (a) => E('div', { className: 'am-row', key: a.id },
      E('div', { className: 'am-rowtop' },
        E('span', { className: 'am-st run', title: stTxt(a.status) }),
        E('span', { className: 'am-kind' }, a.kind),
        E('span', { className: 'am-name', title: a.name || a.id }, a.name || a.id.slice(0, 10)),
        provChip(a),
        effBadge(a.effort),
        E('span', { className: 'am-model', title: modelTip(a) }, a.model || '—'),
      ),
      a.brief ? E('div', { className: 'am-brief', title: a.brief }, a.brief) : null,
      E('div', { className: 'am-meta' },
        E('span', { className: 'am-sttxt run' }, stTxt(a.status)),
        E('span', null, '#' + String(a.id || '').slice(0, 8)),
        a.turns > 0 ? E('span', null, a.turns + ' 事件') : null,
      ),
      Array.isArray(a.children) && a.children.length
        ? E('div', { className: 'am-kids' }, a.children.map(kidEl))
        : null,
    )

    const bodyEl = !open ? null : E('div', { className: 'am-body', style: { maxHeight: size.h + 'px' } },
      E('div', { className: 'am-hint' }, '仅显示运行中的会话与其活跃子代理 · 每 2 秒刷新 · 右下角可拉伸'),
      err ? E('div', { className: 'am-empty', style: { color: '#ff9a9a' } }, err) : null,
      !err && rows.length === 0
        ? E('div', { className: 'am-empty' }, '没有运行中的会话')
        : rows.map(sessEl),
    )

    const panelStyle = Object.assign(
      pos
        ? { left: pos.x + 'px', top: pos.y + 'px', pointerEvents: 'auto' }
        : { left: '26px', bottom: '92px', pointerEvents: 'auto' },
      { width: size.w + 'px' },
    )

    let activeN = 0
    for (const r of rows) activeN += 1 + ((r.children && r.children.length) || 0)

    return [
      (drag || rs) ? E('div', {
        className: 'am-capture',
        onMouseMove: (ev) => {
          if (drag) setPos({ x: drag.bx + (ev.clientX - drag.mx), y: drag.by + (ev.clientY - drag.my) })
          else if (rs) resizeTo(rs.w + (ev.clientX - rs.mx), rs.h + (ev.clientY - rs.my))
        },
        onMouseUp: () => { setDrag(null); setRs(null) },
      }) : null,
      E('div', { className: 'am-panel' + (size.w > 360 ? ' am-wide' : ''), style: panelStyle },
        E('div', { className: 'am-head', onMouseDown: (ev) => {
          ev.preventDefault()
          const rc = ev.currentTarget.getBoundingClientRect()
          setPos({ x: rc.left, y: rc.top })
          setDrag({ mx: ev.clientX, my: ev.clientY, bx: rc.left, by: rc.top })
        }, title: '按住拖动移动位置' },
          E('span', { className: 'am-dot' }),
          E('span', { className: 'am-title' }, 'Agent 监控'),
          E('span', { className: 'am-count' }, activeN > 0 ? activeN + ' 活跃' : '空闲'),
          E('span', { className: 'am-min', onMouseDown: (ev) => ev.stopPropagation(),
            onClick: (ev) => { ev.stopPropagation(); setOpen((v) => !v) },
            title: open ? '收起' : '展开' }, open ? '−' : '＋'),
        ),
        bodyEl,
        E('div', { className: 'am-rs', title: '拖动调整窗口大小', onMouseDown: (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          setRs({ mx: ev.clientX, my: ev.clientY, w: size.w, h: size.h })
        } }),
      ),
    ]
  }

  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'agent-monitor', order: 8100 },
    (props) => reactDom.createPortal(E(App, props), document.body),
  ))
}

exports.name = name;
exports.apply = apply;
exports.inject = ['slots'];
return module.exports;
  }
});
