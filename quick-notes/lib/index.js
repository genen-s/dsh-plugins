// @local/quick-notes — Host half (real Node ESM): webServer JSON routes for
// the client panel. Data persists to <workspace>/.dsh-quick-notes.json.
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = '/home/s/桌面/work_space/rnic_req_analysis/dsh/.dsh-quick-notes.json'

export const name = 'quick-notes'
export const inject = ['webServer']

const notes = []
const alarms = []
const balances = []
let loaded = false

const p2 = (n) => String(n).padStart(2, '0')
const fmt = (d) =>
  p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + ' '
  + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds())
const stamp = (d = new Date()) =>
  d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate())
  + 'T' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds())

function loadAll() {
  try {
    const text = readFileSync(FILE, 'utf8')
    const data = JSON.parse(text)
    notes.length = 0
    if (data && Array.isArray(data.notes)) {
      for (const n of data.notes) {
        if (n && typeof n.id === 'string' && typeof n.content === 'string') {
          notes.push({ id: n.id, ts: Number(n.ts) || 0, time: String(n.time || ''), content: n.content })
        }
      }
    }
    alarms.length = 0
    if (data && Array.isArray(data.alarms)) {
      for (const a of data.alarms) {
        if (a && typeof a.id === 'string' && /^\d{1,2}:\d{2}$/.test(String(a.time))) {
          const hp = String(a.time).split(':')
          alarms.push({
            id: a.id,
            time: p2(Number(hp[0]) % 24) + ':' + p2(Number(hp[1]) % 60).slice(-2),
            label: typeof a.label === 'string' ? a.label.slice(0, 80) : '',
          })
        }
      }
    }
    balances.length = 0
    if (data && Array.isArray(data.balances)) {
      for (const b of data.balances) {
        if (b && typeof b.provider === 'string' && b.provider !== '') {
          balances.push({
            provider: b.provider,
            label: String(b.label || b.provider),
            currency: String(b.currency || '¥'),
            amount: String(b.amount == null ? '' : b.amount),
            hint: String(b.hint || ''),
            updatedAt: String(b.updatedAt || ''),
          })
        }
      }
    }
  } catch {
    // 文件不存在或损坏：视为空数据（下次 persist 重建）
  }
  loaded = true
}

function persist() {
  try {
    writeFileSync(FILE, JSON.stringify({ notes, alarms, balances }, null, 2))
    return true
  } catch (error) {
    console.error('quick-notes: persist failed', error)
    return false
  }
}

const snapshot = () => ({
  ok: true,
  persisted: true,
  file: FILE,
  notes: notes.slice(),
  alarms: alarms.slice(),
  balances: balances.slice(),
})

export function apply(ctx) {
  const webServer = ctx.get('webServer')
  if (!webServer || typeof webServer.register !== 'function') return

  function readBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = []
      req.on('data', (c) => chunks.push(c))
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      req.on('error', reject)
    })
  }
  function sendJson(res, status, body) {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(body))
  }
  async function withBody(req, res, fn) {
    try {
      let body = {}
      try { body = JSON.parse((await readBody(req)) || '{}') } catch { body = {} }
      sendJson(res, 200, await fn(body))
    } catch (error) {
      sendJson(res, 500, { ok: false, error: String(error && error.message || error) })
    }
  }

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/quick-notes/all',
    handler: (req, res) => {
      if (!loaded) loadAll()
      sendJson(res, 200, snapshot())
    },
  }), 'quick-notes:route-all')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/quick-notes/add',
    handler: (req, res) => withBody(req, res, async (body) => {
      if (!loaded) loadAll()
      const raw = String(body.content == null ? '' : body.content).trim()
      if (!raw) return { ok: false, error: '内容不能为空' }
      if (raw.length > 4000) return { ok: false, error: '单条最长 4000 字符' }
      const now = new Date()
      const note = {
        id: 'n' + now.getTime() + '-' + Math.floor(Math.random() * 100000),
        ts: now.getTime(), time: fmt(now), content: raw,
      }
      notes.unshift(note)
      if (notes.length > 500) notes.length = 500
      persist()
      return Object.assign(snapshot(), { note })
    }),
  }), 'quick-notes:route-add')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/quick-notes/note-delete',
    handler: (req, res) => withBody(req, res, async (body) => {
      if (!loaded) loadAll()
      const id = typeof body.id === 'string' ? body.id : ''
      const idx = notes.findIndex((n) => n.id === id)
      if (idx >= 0) notes.splice(idx, 1)
      persist()
      return snapshot()
    }),
  }), 'quick-notes:route-note-delete')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/quick-notes/alarm-add',
    handler: (req, res) => withBody(req, res, async (body) => {
      if (!loaded) loadAll()
      const raw = String(body.time == null ? '' : body.time).trim()
      const m = /^(\d{1,2}):(\d{1,2})$/.exec(raw)
      if (!m) return { ok: false, error: '时间格式应为 HH:MM' }
      const hh = Math.min(23, Number(m[1]))
      const mm = Math.min(59, Number(m[2]))
      const label = String(body.label == null ? '' : body.label).trim().slice(0, 80)
      if (alarms.length >= 20) return { ok: false, error: '最多 20 个闹钟' }
      alarms.push({
        id: 'a' + Date.now() + '-' + Math.floor(Math.random() * 100000),
        time: p2(hh) + ':' + p2(mm), label,
      })
      persist()
      return snapshot()
    }),
  }), 'quick-notes:route-alarm-add')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/quick-notes/alarm-delete',
    handler: (req, res) => withBody(req, res, async (body) => {
      if (!loaded) loadAll()
      const id = typeof body.id === 'string' ? body.id : ''
      const idx = alarms.findIndex((a) => a.id === id)
      if (idx >= 0) alarms.splice(idx, 1)
      persist()
      return snapshot()
    }),
  }), 'quick-notes:route-alarm-delete')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/quick-notes/balance-set',
    handler: (req, res) => withBody(req, res, async (body) => {
      if (!loaded) loadAll()
      const pid = typeof body.provider === 'string' ? body.provider.trim() : ''
      const amount = typeof body.amount === 'string' ? body.amount.trim() : ''
      if (!pid || pid.length > 40) return { ok: false, error: 'provider 无效' }
      if (!/^[-+]?\d+(\.\d+)?$/.test(amount)) return { ok: false, error: '余额应为数字' }
      const existing = balances.find((b) => b.provider === pid)
      if (existing) { existing.amount = amount; existing.updatedAt = stamp() }
      else balances.push({ provider: pid, label: pid, currency: '¥', amount, hint: '', updatedAt: stamp() })
      persist()
      return snapshot()
    }),
  }), 'quick-notes:route-balance-set')
}
