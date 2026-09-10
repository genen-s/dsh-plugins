// dsh-plugin-agent-monitor — Host half (real Node ESM): a webServer JSON route
// aggregating running sessions and their active subagents.
export const name = 'agent-monitor'
// 硬依赖 webServer：让 cordis 等 webServer 服务激活后再 apply，
// 否则 apply 时 ctx.get('webServer') 为 undefined，路由静默不注册。
export const inject = ['webServer']

export function apply(ctx) {
  function firstTextOf(data) {
    try {
      const c = data && data.content
      if (Array.isArray(c)) {
        for (const b of c) {
          if (b && typeof b.text === 'string' && b.text.trim()) return b.text.trim()
        }
      } else if (data && typeof data.content === 'string' && data.content.trim()) {
        return data.content.trim()
      }
    } catch {}
    return ''
  }

  function describe(agent, bwdScanCap) {
    const out = {
      ok: true, id: '', name: '', brief: '', model: '', provider: '',
      status: 'idle', kind: '会话', turns: 0, effort: '', maxTokens: 0,
    }
    try {
      out.id = typeof agent.id === 'string' ? agent.id : ''
      out.status = agent.status === 'running' ? 'running' : 'idle'
      const opts = agent.options || {}
      out.provider = typeof opts.provider === 'string' ? opts.provider : ''
      out.model = typeof opts.model === 'string' ? opts.model : ''
      const s = agent.session
      if (!s) return out
      const header = s.header || {}
      const title = typeof header.title === 'string' ? header.title : ''
      const events = Array.isArray(s.events) ? s.events : []
      out.turns = Math.max(0, events.length - (Number(header.seedLength) || 0))

      let brief = '', reqModel = '', reqProvider = '', reqEffort = '', reqMax = 0
      let subLabel = '', subMode = '', subModel = ''
      const cap = Math.min(events.length, Math.max(0, Number(bwdScanCap) || 0))
      let scanned = 0
      for (let i = events.length - 1; i >= 0 && scanned < cap; i--, scanned++) {
        const ev = events[i]
        if (!ev) continue
        const t = ev.type
        const d = ev.data
        if (!brief && t === 'user/message') brief = firstTextOf(d)
        if (!subLabel && t === 'subagent/descriptor' && d) {
          subLabel = typeof d.label === 'string' ? d.label : ''
          subMode = typeof d.mode === 'string' ? d.mode : ''
          subModel = typeof d.agentModel === 'string' ? d.agentModel : ''
        }
        if (brief && subLabel) break
      }
      // Latest actual route wins: request/header events carry the per-request
      // resolved route at data.header.config (older shapes may be flat), while
      // agent.options.model is the creation-time default and goes stale after a
      // mid-session model switch. Scan the full tail for the newest header
      // instead of the capped window so long sessions still report the real one.
      for (let i = events.length - 1; i >= 0; i--) {
        const ev = events[i]
        if (!ev || ev.type !== 'request/header') continue
        const d = ev.data || {}
        const cfg = (d.header && d.header.config) ? d.header.config : d
        reqModel = typeof cfg.model === 'string' ? cfg.model : ''
        reqProvider = typeof cfg.provider === 'string' ? cfg.provider : ''
        reqEffort = typeof cfg.reasoningEffort === 'string' ? cfg.reasoningEffort : ''
        reqMax = typeof cfg.maxTokens === 'number' ? cfg.maxTokens : 0
        break
      }

      const isSub = !!(subLabel || subMode)
      out.kind = isSub ? '子代理' : '会话'
      out.name = (isSub && subLabel) ? subLabel : title
      out.brief = brief.slice(0, 120)
      out.model = reqModel || out.model || subModel || ''
      out.provider = reqProvider || out.provider || ''
      out.effort = reqEffort
      out.maxTokens = reqMax
    } catch (error) {
      try { console.error('agent-monitor: describe failed', error) } catch {}
    }
    return out
  }

  const webServer = ctx.get('webServer')
  if (!webServer || typeof webServer.register !== 'function') return

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/plugins/local/agent-monitor/snapshot',
    handler: async (req, res) => {
      const send = (status, body) => {
        res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(body))
      }
      const rows = []
      let registryOk = false
      try {
        const agentsSvc = ctx.get('agents')
        registryOk = !!agentsSvc
        const list = agentsSvc && typeof agentsSvc.list === 'function' ? agentsSvc.list() : []
        const byId = new Map()
        for (const a of list) byId.set(String(a.id), a)

        const running = list.filter((a) => a.status === 'running')
        const subSvc = ctx.get('subagents')

        for (const a of running) {
          const row = describe(a, 4000)
          row.kind = '会话'
          const kids = []
          if (subSvc && typeof subSvc.listChildren === 'function') {
            try {
              const entries = await subSvc.listChildren(a.id)
              for (const e of entries) {
                if (!e || e.kind !== 'child' || e.activity !== 'running') continue
                const kid = {
                  ok: true,
                  id: String(e.id || ''),
                  name: typeof e.label === 'string' && e.label ? e.label : '',
                  brief: '', model: '', provider: '',
                  status: 'running',
                  kind: e.mode === 'continuable' ? '子代理·可续' : '子代理',
                  turns: 0, effort: '', maxTokens: 0,
                }
                const liveA = byId.get(kid.id)
                if (liveA) {
                  const d2 = describe(liveA, 400)
                  kid.name = kid.name || d2.name
                  kid.brief = d2.brief
                  kid.model = d2.model
                  kid.provider = d2.provider
                  kid.effort = d2.effort
                  kid.maxTokens = d2.maxTokens
                  kid.status = d2.status === 'running' ? 'running' : kid.status
                  kid.turns = d2.turns
                }
                kids.push(kid)
              }
            } catch (error) {
              try { console.error('agent-monitor: listChildren failed', error) } catch {}
            }
          }
          row.children = kids
          rows.push(row)
        }
      } catch (error) {
        try { console.error('agent-monitor: snapshot failed', error) } catch {}
      }
      send(200, { ok: true, registryOk, agents: rows, ts: Date.now() })
    },
  }), 'agent-monitor:route-snapshot')
}
