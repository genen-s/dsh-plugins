// @local/quick-notes — Client half (real browser bundle for the dsh __ModuleLoader__).
// RPC via fetch to this package's webServer routes; React via the loader's require.
window.__ModuleLoader__.load({
  id: "@local/quick-notes",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    let react = require("react");
    let { createElement: E, useState: US, useEffect: UE } = react;
    let reactDom = require("react-dom");

const PRICE_SNAPSHOT = '2026-08-27'
const PRICES = {
  ds: [
    ['deepseek-v4-flash', '0.10', '3.0', '9.0'],
    ['deepseek-v4-pro', '0.30', '9.0', '27.0'],
    ['v4-flash-vision-exp', '0.10', '3.0', '9.0'],
  ],
  glm: [
    ['glm-5.3-flash', '0.23', '0.8', '2.8'],
  ],
}
const BAL_PROVIDERS = [
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'zhipu', label: '智谱 GLM' },
]
const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const API = '/plugins/local/quick-notes'
async function rpc(path, body) {
  const res = await fetch(API + path, body === undefined
    ? undefined
    : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  return res.json()
}

function isoWeekOf(d) {
  const thursday = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = (thursday.getDay() + 6) % 7
  thursday.setDate(thursday.getDate() - dow + 3)
  const isoYear = thursday.getFullYear()
  const jan4 = new Date(isoYear, 0, 4)
  const jdow = (jan4.getDay() + 6) % 7
  jan4.setDate(jan4.getDate() - jdow + 3)
  const week = 1 + Math.round((thursday.getTime() - jan4.getTime()) / (7 * 24 * 3600 * 1000))
  return { y: isoYear, w: week }
}

function groupKeyLabel(mode, ts) {
  const d = new Date(ts)
  const p2v = (n) => String(n).padStart(2, '0')
  if (mode === 'day') {
    return { key: d.getFullYear() + '-' + p2v(d.getMonth() + 1) + '-' + p2v(d.getDate()),
             label: d.getFullYear() + '-' + p2v(d.getMonth() + 1) + '-' + p2v(d.getDate()) + ' ' + WEEK_CN[d.getDay()] }
  }
  if (mode === 'week') {
    const iw = isoWeekOf(d)
    return { key: iw.y + '-W' + p2v(iw.w), label: iw.y + '年 第' + iw.w + '周' }
  }
  if (mode === 'month') {
    return { key: d.getFullYear() + '-' + p2v(d.getMonth() + 1), label: d.getFullYear() + '年' + (d.getMonth() + 1) + '月' }
  }
  return { key: String(d.getFullYear()), label: d.getFullYear() + '年' }
}

const CSS = [
  '.qn-panel{position:fixed;width:320px;z-index:99990;background:rgba(23,27,34,.95);color:#e8eaf0;',
  'border:1px solid rgba(120,150,200,.28);border-left:3px solid #4f8cff;border-radius:10px;',
  'box-shadow:0 10px 32px rgba(0,0,0,.38);font-size:13px;line-height:1.5;user-select:none;}',
  '.qn-head{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:grab;',
  'font-weight:600;letter-spacing:.03em;border-bottom:1px solid rgba(120,150,200,.18);border-radius:9px 9px 0 0;',
  'background:rgba(255,255,255,.03);}',
  '.qn-head:active{cursor:grabbing}',
  '.qn-dot{width:8px;height:8px;border-radius:50%;background:#4f8cff;box-shadow:0 0 6px #4f8cff;flex:none;}',
  '.qn-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.qn-count{font-weight:400;font-size:11px;color:#9fb0c7;background:rgba(255,255,255,.08);border-radius:8px;padding:1px 7px;}',
  '.qn-min{width:22px;height:22px;line-height:20px;text-align:center;border-radius:6px;background:rgba(255,255,255,.08);',
  'cursor:pointer;font-size:14px;flex:none;}',
  '.qn-min:hover{background:rgba(79,140,255,.35)}',
  '.qn-body{padding:0 12px 12px;user-select:text;}',
  '.qn-clock{display:flex;align-items:baseline;gap:8px;margin-top:12px;',
  'background:rgba(79,140,255,.12);border:1px solid rgba(79,140,255,.35);border-radius:8px;padding:7px 10px;}',
  '.qn-hms{font-size:24px;font-weight:700;font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:.05em;}',
  '.qn-date{color:#9fb0c7;font-size:11px;margin-left:auto;}',
  '.qn-alarmrow{display:flex;align-items:center;gap:6px;margin-top:8px;}',
  '.qn-alarmrow2{display:flex;align-items:center;gap:6px;margin-top:6px;}',
  '.qn-timein{background:rgba(255,255,255,.07);border:1px solid rgba(120,150,200,.25);border-radius:7px;',
  'color:#e8eaf0;padding:4px 8px;font-size:13px;outline:none;color-scheme:dark;}',
  '.qn-timein:focus,.qn-lblin:focus{border-color:#4f8cff}',
  '.qn-lblin{flex:1;min-width:0;background:rgba(255,255,255,.07);border:1px solid rgba(120,150,200,.25);border-radius:7px;',
  'color:#e8eaf0;padding:4px 9px;font-size:12px;outline:none;}',
  '.qn-lblin::placeholder{color:#7c8aa0}',
  '.qn-bell{background:rgba(245,166,35,.18);color:#ffc46b;border:1px solid rgba(245,166,35,.45);',
  'border-radius:7px;padding:4px 12px;font-size:12px;cursor:pointer;font-weight:600;flex:none;}',
  '.qn-bell:hover{background:rgba(245,166,35,.32)}',
  '.qn-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}',
  '.qn-chip{display:inline-flex;align-items:center;gap:5px;background:rgba(245,166,35,.14);',
  'border:1px solid rgba(245,166,35,.4);border-radius:12px;padding:2px 9px;font-size:11.5px;color:#ffc46b;',
  'font-family:ui-monospace,Menlo,Consolas,monospace;max-width:100%;}',
  '.qn-chiplbl{font-family:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:170px;}',
  '.qn-chipx{cursor:pointer;opacity:.55;font-size:13px;line-height:1;flex:none;}',
  '.qn-chipx:hover{opacity:1;color:#ff8484}',
  '.qn-gmodes{display:flex;align-items:center;gap:5px;margin-top:10px;}',
  '.qn-gmlabel{font-size:10.5px;color:#7c8aa0;flex:none;}',
  '.qn-gchip{font-size:10.5px;color:#9fb0c7;background:rgba(255,255,255,.06);border:none;border-radius:9px;',
  'padding:2px 9px;cursor:pointer;}',
  '.qn-gchip:hover{background:rgba(255,255,255,.12)}',
  '.qn-gchip.qn-on{background:rgba(79,140,255,.4);color:#fff;font-weight:600;}',
  '.qn-ghead{display:flex;align-items:center;gap:6px;margin-top:8px;padding:4px 7px;border-radius:7px;',
  'cursor:pointer;background:rgba(79,140,255,.10);color:#bcd2ff;font-weight:700;font-size:11px;user-select:none;}',
  '.qn-ghead:hover{background:rgba(79,140,255,.2)}',
  '.qn-gcaret{width:12px;flex:none;text-align:center;font-size:9px;}',
  '.qn-gcount{margin-left:auto;font-weight:400;color:#7c8aa0;font-size:10px;}',
  '.qn-prices{margin-top:10px;border:1px solid rgba(79,140,255,.3);border-radius:8px;padding:8px 10px;background:rgba(255,255,255,.04);}',
  '.qn-ptitle{display:flex;align-items:center;gap:6px;font-weight:700;font-size:12px;color:#cfe0ff;}',
  '.qn-psnap{color:#7c8aa0;font-weight:400;font-size:10.5px;margin-left:auto;}',
  '.qn-pnote{color:#7c8aa0;font-size:10px;margin-top:4px;}',
  '.qn-phead{display:flex;gap:4px;margin-top:7px;padding:3px 6px;background:rgba(79,140,255,.16);',
  'border-radius:6px;font-size:10px;color:#bcd2ff;}',
  '.qn-phm{flex:none;width:86px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.qn-phv{flex:1;text-align:right;}',
  '.qn-prow{display:flex;gap:4px;padding:3px 6px;font-size:10.5px;}',
  '.qn-prow:nth-child(even){background:rgba(255,255,255,.03)}',
  '.qn-pname{flex:none;width:86px;color:#e8eaf0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.qn-pval{flex:1;text-align:right;color:#9fd4a8;font-family:ui-monospace,Menlo,Consolas,monospace;}',
  '.qn-psub{margin-top:6px;font-size:10.5px;color:#bcd2ff;font-weight:600;}',
  '.qn-plinks{display:flex;gap:10px;margin-top:6px;flex-wrap:wrap;}',
  '.qn-plink{color:#7fb0ff;font-size:11px;text-decoration:none;}',
  '.qn-plink:hover{text-decoration:underline;}',
  '.qn-balrow{display:flex;align-items:center;gap:7px;padding:5px 2px;border-bottom:1px dashed rgba(120,150,200,.16);}',
  '.qn-balrow:last-of-type{border-bottom:none}',
  '.qn-balprov{flex:none;width:64px;font-size:11.5px;color:#cfe0ff;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.qn-balamt{flex:1;text-align:right;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:700;}',
  '.qn-balok{color:#9fd4a8}.qn-balneg{color:#ff8484}.qn-balnone{color:#7c8aa0;font-weight:400;font-size:11px;}',
  '.qn-balhint{flex-basis:100%;font-size:10px;color:#ff9a9a;}',
  '.qn-balupd{flex-basis:100%;font-size:9.5px;color:#68758a;}',
  '.qn-baledit{flex:none;width:22px;height:22px;line-height:20px;text-align:center;border-radius:6px;cursor:pointer;',
  'background:rgba(255,255,255,.08);font-size:12px;color:#9fb0c7;}',
  '.qn-baledit:hover{background:rgba(79,140,255,.35);color:#fff}',
  '.qn-balin{width:110px;background:rgba(255,255,255,.07);border:1px solid #4f8cff;border-radius:6px;',
  'color:#e8eaf0;padding:3px 7px;font-size:12px;outline:none;}',
  '.qn-balsave{background:#4f8cff;border:none;border-radius:6px;color:#fff;padding:3px 10px;font-size:11.5px;cursor:pointer;font-weight:600;}',
  '@keyframes qn-flash{0%{background:#d63a3f;border-color:#ffb3b3}25%{background:#e5940f;border-color:#ffd9a0}',
  '50%{background:#2563eb;border-color:#9db9ff}75%{background:#17987f;border-color:#a0ecdc}',
  '100%{background:#d63a3f;border-color:#ffb3b3}}',
  '.qn-panel.qn-firing{animation:qn-flash .8s step-end infinite;cursor:pointer;border-left-color:#ffffff;}',
  '.qn-firebanner{margin-top:12px;text-align:center;font-weight:800;font-size:15px;letter-spacing:.06em;',
  'background:rgba(0,0,0,.28);border-radius:8px;padding:8px 10px;}',
  '.qn-firemsg{display:block;font-size:13px;font-weight:700;color:#ffe9a8;margin-top:3px;',
  'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
  '.qn-text{width:100%;box-sizing:border-box;height:64px;resize:none;background:rgba(255,255,255,.07);',
  'border:1px solid rgba(120,150,200,.25);border-radius:8px;color:#e8eaf0;font-size:13px;padding:8px 10px;outline:none;}',
  '.qn-text:focus{border-color:#4f8cff}',
  '.qn-text::placeholder{color:#7c8aa0}',
  '.qn-addrow{display:flex;align-items:center;gap:8px;margin-top:8px;}',
  '.qn-add{background:#4f8cff;color:#fff;border:none;border-radius:7px;padding:5px 16px;font-size:13px;cursor:pointer;font-weight:600;}',
  '.qn-add:hover{filter:brightness(1.12)}',
  '.qn-hint{color:#7c8aa0;font-size:11px;}',
  '.qn-err{color:#ff9a9a;font-size:11px;margin-top:6px;}',
  '.qn-list{margin-top:10px;max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;}',
  '.qn-list::-webkit-scrollbar{width:6px}',
  '.qn-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:3px}',
  '.qn-item{position:relative;background:rgba(255,255,255,.055);border-radius:8px;padding:7px 26px 7px 9px;}',
  '.qn-item:hover{background:rgba(255,255,255,.09)}',
  '.qn-time{font-size:10.5px;color:#9fb0c7;font-family:ui-monospace,Menlo,Consolas,monospace;}',
  '.qn-content{margin-top:2px;white-space:pre-wrap;word-break:break-word;}',
  '.qn-empty{color:#7c8aa0;font-size:12px;text-align:center;padding:14px 0;}',
  '.qn-del{position:absolute;top:5px;right:6px;width:18px;height:18px;line-height:17px;text-align:center;',
  'border-radius:50%;color:#9fb0c7;font-size:12px;cursor:pointer;opacity:.5;}',
  '.qn-del:hover{opacity:1;background:rgba(255,107,107,.25);color:#ff8484}',
  '.qn-capture{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99995;cursor:grabbing;}',
].join('\n')

const name = 'quick-notes-client'

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
    const [notes, setNotes] = US([])
    const [alarms, setAlarms] = US([])
    const [balances, setBalances] = US([])
    const [pos, setPos] = US(null)
    const [drag, setDrag] = US(null)
    const [open, setOpen] = US(true)
    const [text, setText] = US('')
    const [atime, setAtime] = US('')
    const [alabel, setAlabel] = US('')
    const [nowStr, setNowStr] = US('')
    const [silenced, setSilenced] = US({})
    const [err, setErr] = US('')
    const [showPrices, setShowPrices] = US(false)
    const [balEdit, setBalEdit] = US('')
    const [balVal, setBalVal] = US('')
    const [groupMode, setGroupMode] = US('day')
    const [folded, setFolded] = US({})

    UE(() => {
      let live = true
      rpc('/all').then((r) => {
        if (!live || !r || !r.ok) return
        setNotes(Array.isArray(r.notes) ? r.notes : [])
        setAlarms(Array.isArray(r.alarms) ? r.alarms : [])
        setBalances(Array.isArray(r.balances) ? r.balances : [])
      }).catch(() => { if (live) setErr('加载失败：服务不可达') })
      return () => { live = false }
    }, [])

    UE(() => {
      const tick = () => {
        const d = new Date()
        setNowStr((d.getHours() < 10 ? '0' : '') + d.getHours() + ':'
          + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':'
          + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds())
      }
      tick()
      const t = setInterval(tick, 1000)
      return () => clearInterval(t)
    }, [])

    const dueAlarms = alarms.filter((a) => a.time <= nowStr.slice(0, 5) && !silenced[a.id])
    const firing = dueAlarms.length > 0
    const fireText = firing
      ? (dueAlarms[0].label || '闹钟时间到') + (dueAlarms.length > 1 ? '（等 ' + dueAlarms.length + ' 个闹钟）' : '')
      : ''

    const addNote = () => {
      const c = text.trim()
      if (!c) { setErr('请先填写内容'); return }
      rpc('/add', { content: c }).then((r) => {
        if (r && r.ok) { setNotes(r.notes || []); setText(''); setErr('') }
        else setErr((r && r.error) || '保存失败')
      }).catch(() => setErr('保存失败'))
    }
    const delNote = (ev, id) => {
      ev.stopPropagation()
      rpc('/note-delete', { id }).then((r) => { if (r && r.ok) setNotes(r.notes || []) })
    }
    const setAlarmFn = () => {
      const t = (atime || '').trim()
      if (!/^\d{1,2}:\d{2}$/.test(t)) { setErr('请选择闹钟时间'); return }
      const pp = t.split(':')
      const norm = (pp[0].length < 2 ? '0' + pp[0] : pp[0]) + ':' + pp[1]
      rpc('/alarm-add', { time: norm, label: alabel.trim().slice(0, 80) }).then((r) => {
        if (r && r.ok) { setAlarms(r.alarms || []); setAtime(''); setAlabel(''); setErr('') }
        else setErr((r && r.error) || '设置失败')
      }).catch(() => setErr('设置失败'))
    }
    const delAlarm = (ev, id) => {
      ev.stopPropagation()
      rpc('/alarm-delete', { id }).then((r) => { if (r && r.ok) setAlarms(r.alarms || []) })
    }
    const stopFire = (ev) => {
      ev.stopPropagation()
      const ids = dueAlarms.map((a) => a.id)
      setSilenced((prev) => {
        const nx = Object.assign({}, prev)
        for (const id of ids) nx[id] = true
        return nx
      })
      for (const id of ids) rpc('/alarm-delete', { id }).then((r) => {
        if (r && r.ok) setAlarms(r.alarms || [])
      })
    }
    const headDown = (ev) => {
      ev.preventDefault()
      const r = ev.currentTarget.getBoundingClientRect()
      setPos({ x: r.left, y: r.top })
      setDrag({ mx: ev.clientX, my: ev.clientY, bx: r.left, by: r.top })
    }

    const hms = nowStr || '--:--:--'
    const dateTxt = (() => { const d = new Date(); return (d.getMonth() + 1) + '月' + d.getDate() + '日 周' + '日一二三四五六'[d.getDay()] })()

    const groups = []
    if (groupMode === 'flat') {
      if (notes.length > 0) groups.push({ key: '__all__', label: '', items: notes, count: notes.length })
    } else {
      const index = new Map()
      for (const n of notes) {
        const g = groupKeyLabel(groupMode, Number(n.ts) || 0)
        let g0 = index.get(g.key)
        if (!g0) { g0 = { key: g.key, label: g.label, items: [], count: 0 }; index.set(g.key, g0); groups.push(g0) }
        g0.items.push(n); g0.count += 1
      }
    }
    const toggleFold = (key) => setFolded((prev) => Object.assign({}, prev, { [key]: !prev[key] }))

    const itemEl = (n) => E('div', { className: 'qn-item', key: n.id },
      E('div', { className: 'qn-time' }, '🕓 ' + n.time),
      E('div', { className: 'qn-content' }, n.content),
      E('div', { className: 'qn-del', title: '删除该条', onClick: (ev) => delNote(ev, n.id) }, '×'),
    )
    const listChildren = []
    if (groups.length === 0) listChildren.push(E('div', { className: 'qn-empty' }, '暂无条目——写下第一条吧'))
    for (const g of groups) {
      if (g.label) {
        listChildren.push(E('div', { className: 'qn-ghead', key: 'g:' + g.key, onClick: () => toggleFold(g.key) },
          E('span', { className: 'qn-gcaret' }, folded[g.key] ? '▸' : '▾'),
          E('span', null, g.label),
          E('span', { className: 'qn-gcount' }, g.count + ' 条'),
        ))
      }
      if (!folded[g.key]) for (const n of g.items) listChildren.push(itemEl(n))
    }

    const pRow = (cols) => E('div', { className: 'qn-prow', key: cols[0] },
      E('span', { className: 'qn-pname', title: cols[0] }, cols[0]),
      E('span', { className: 'qn-pval' }, cols[1]),
      E('span', { className: 'qn-pval' }, cols[2]),
      E('span', { className: 'qn-pval' }, cols[3]),
    )
    const pHead = () => E('div', { className: 'qn-phead' },
      E('span', { className: 'qn-phm' }, '模型'),
      E('span', { className: 'qn-phv' }, '缓存命中'),
      E('span', { className: 'qn-phv' }, '输入'),
      E('span', { className: 'qn-phv' }, '输出'),
    )

    const balRecordOf = (pid) => balances.find((b) => b.provider === pid)
    const balRow = (bm) => {
      const rec = balRecordOf(bm.id)
      const editing = balEdit === bm.id
      const amtCls = !rec || !rec.amount ? 'qn-balnone'
        : String(rec.amount).trim().charAt(0) === '-' ? 'qn-balneg' : 'qn-balok'
      const amountTxt = rec && rec.amount ? rec.currency + ' ' + rec.amount : '未登记'
      const updTxt = rec && rec.updatedAt ? '登记于 ' + String(rec.updatedAt).replace('T', ' ').slice(0, 16) : ''
      return editing
        ? E('div', { className: 'qn-balrow', key: bm.id },
          E('span', { className: 'qn-balprov' }, bm.label),
          E('input', {
            className: 'qn-balin', autoFocus: true, placeholder: '如 102.35 或 -0.86', value: balVal,
            onChange: (ev) => setBalVal(ev.target.value),
            onKeyDown: (ev) => { if (ev.key === 'Enter') saveBal(); if (ev.key === 'Escape') setBalEdit('') },
          }),
          E('button', { className: 'qn-balsave', onClick: saveBal }, '保存'),
          E('span', { className: 'qn-baledit', title: '取消', onClick: () => setBalEdit('') }, '×'),
        )
        : E('div', { className: 'qn-balrow', key: bm.id },
          E('span', { className: 'qn-balprov' }, bm.label),
          E('span', { className: 'qn-balamt ' + amtCls }, amountTxt),
          E('span', { className: 'qn-baledit', title: '登记/更新余额', onClick: () => { setBalEdit(bm.id); setBalVal(rec ? String(rec.amount) : '') } }, '✎'),
          rec && rec.hint ? E('span', { className: 'qn-balhint' }, rec.hint) : null,
          updTxt ? E('span', { className: 'qn-balupd' }, updTxt) : null,
        )
    }
    const saveBal = () => {
      const pid = balEdit
      const v = balVal.trim()
      if (!/^[-+]?\d+(\.\d+)?$/.test(v)) { setErr('余额应为数字（可带负号）'); return }
      rpc('/balance-set', { provider: pid, amount: v }).then((r) => {
        if (r && r.ok) { setBalances(r.balances || []); setBalEdit(''); setErr('') }
        else setErr((r && r.error) || '保存失败')
      }).catch(() => setErr('保存失败'))
    }

    const pricesBlock = showPrices ? E('div', { className: 'qn-prices' },
      E('div', { className: 'qn-ptitle' },
        'API 价格速览（元/百万 tokens）',
        E('span', { className: 'qn-psnap' }, '快照 ' + PRICE_SNAPSHOT),
      ),
      E('div', { className: 'qn-pnote' }, 'DeepSeek 分高峰/空闲价；下表为高峰价（空闲减半）'),
      E('div', { className: 'qn-psub' }, 'DeepSeek（api.deepseek.com）'),
      pHead(),
      PRICES.ds.map((row) => pRow(row)),
      E('div', { className: 'qn-psub' }, '智谱 BigModel（open.bigmodel.cn）'),
      pHead(),
      PRICES.glm.map((row) => pRow(row)),
      E('div', { className: 'qn-pnote' }, 'GLM 为统一价（无峰谷）；上线初期有半价促销，以官网结算为准'),
      E('div', { className: 'qn-plinks' },
        E('a', { className: 'qn-plink', href: 'https://platform.deepseek.com/usage', target: '_blank', rel: 'noopener noreferrer' }, '↗ DeepSeek 用量/余额'),
        E('a', { className: 'qn-plink', href: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing', target: '_blank', rel: 'noopener noreferrer' }, '↗ DeepSeek 定价页'),
        E('a', { className: 'qn-plink', href: 'https://bigmodel.cn/finance-center/finance/overview', target: '_blank', rel: 'noopener noreferrer' }, '↗ 智谱财务中心'),
        E('a', { className: 'qn-plink', href: 'https://bigmodel.cn/pricing', target: '_blank', rel: 'noopener noreferrer' }, '↗ 智谱定价页'),
      ),
      E('div', { className: 'qn-pnote' }, '两平台用量为登录态页面，点链接新开标签查看实时账单'),
      E('div', { className: 'qn-ptitle', style: { marginTop: '10px' } },
        '💰 API 余额',
        E('span', { className: 'qn-psnap' }, '点击 ✎ 登记/更新'),
      ),
      BAL_PROVIDERS.map((pm) => balRow(pm)),
      E('div', { className: 'qn-pnote' }, 'DeepSeek 行为官方 /user/balance 接口实测值；智谱无公开余额接口，可在财务中心查看后手动登记'),
    ) : null

    const bodyEl = !open ? null : E('div', { className: 'qn-body', onClick: firing ? stopFire : undefined },
      firing ? E('div', { className: 'qn-firebanner' },
        '⏰ 提醒：点击任意处停止',
        E('span', { className: 'qn-firemsg' }, fireText),
      ) : null,
      E('div', { className: 'qn-clock' },
        E('span', { className: 'qn-hms' }, hms),
        E('span', { className: 'qn-date' }, dateTxt),
      ),
      E('div', { className: 'qn-alarmrow' },
        E('input', {
          className: 'qn-timein', type: 'time', value: atime,
          onChange: (ev) => { setAtime(ev.target.value); if (err) setErr('') },
        }),
        E('button', { className: 'qn-bell', onClick: setAlarmFn }, '🔔 设闹钟'),
      ),
      E('div', { className: 'qn-alarmrow2' },
        E('input', {
          className: 'qn-lblin', placeholder: '提醒内容（可选，最多 80 字）', value: alabel,
          onChange: (ev) => { setAlabel(ev.target.value); if (err) setErr('') },
          onKeyDown: (ev) => { if (ev.key === 'Enter') setAlarmFn() },
        }),
      ),
      alarms.length ? E('div', { className: 'qn-chips' },
        alarms.map((a) => E('span', { className: 'qn-chip', key: a.id, title: a.label || a.time },
          '🔔 ' + a.time,
          a.label ? E('span', { className: 'qn-chiplbl' }, a.label) : null,
          E('span', { className: 'qn-chipx', title: '删除闹钟', onClick: (ev) => delAlarm(ev, a.id) }, '×'),
        )),
      ) : null,
      pricesBlock,
      E('textarea', {
        className: 'qn-text',
        placeholder: '输入条目内容…（回车记录，Shift+回车换行）',
        value: text,
        onChange: (ev) => { setText(ev.target.value); if (err) setErr('') },
        onKeyDown: (ev) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); addNote() } },
      }),
      E('div', { className: 'qn-addrow' },
        E('button', { className: 'qn-add', onClick: addNote }, '+ 记录'),
        E('span', { className: 'qn-hint' }, '时间自动插入'),
      ),
      err ? E('div', { className: 'qn-err' }, err) : null,
      E('div', { className: 'qn-gmodes' },
        E('span', { className: 'qn-gmlabel' }, '分组：'),
        [['day', '日'], ['week', '周'], ['month', '月'], ['year', '年'], ['flat', '平铺']].map((gm) =>
          E('button', {
            className: 'qn-gchip' + (groupMode === gm[0] ? ' qn-on' : ''), key: gm[0],
            onClick: () => setGroupMode(gm[0]),
          }, gm[1])),
      ),
      E('div', { className: 'qn-list' }, listChildren),
    )

    const panelStyle = pos
      ? { left: pos.x + 'px', top: pos.y + 'px', pointerEvents: 'auto' }
      : { right: '26px', bottom: '92px', pointerEvents: 'auto' }

    return [
      drag ? E('div', {
        className: 'qn-capture',
        onMouseMove: (ev) => setPos({ x: drag.bx + (ev.clientX - drag.mx), y: drag.by + (ev.clientY - drag.my) }),
        onMouseUp: () => setDrag(null),
      }) : null,
      E('div', {
        className: 'qn-panel' + (firing ? ' qn-firing' : ''),
        style: panelStyle,
        onClick: firing ? stopFire : undefined,
        title: firing ? '点击停止提醒' : undefined,
      },
        E('div', { className: 'qn-head', onMouseDown: headDown, title: '按住拖动移动位置' },
          E('span', { className: 'qn-dot' }),
          E('span', { className: 'qn-title' }, '快速记录'),
          E('span', { className: 'qn-count' }, String(notes.length)),
          E('span', {
            className: 'qn-min',
            onMouseDown: (ev) => ev.stopPropagation(),
            onClick: (ev) => { ev.stopPropagation(); setShowPrices((v) => !v) },
            title: showPrices ? '收起价格/余额' : '展开价格与余额',
            style: showPrices ? { background: 'rgba(79,140,255,.42)', color: '#fff' } : undefined,
          }, '¥'),
          E('span', {
            className: 'qn-min',
            onMouseDown: (ev) => ev.stopPropagation(),
            onClick: (ev) => { ev.stopPropagation(); setOpen((v) => !v) },
            title: open ? '收起' : '展开',
          }, open ? '−' : '＋'),
        ),
        bodyEl,
      ),
    ]
  }

  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'quick-notes', order: 8000 },
    (props) => reactDom.createPortal(E(App, props), document.body),
  ))
}

exports.name = name;
exports.apply = apply;
exports.inject = ['slots'];
return module.exports;
  }
});
