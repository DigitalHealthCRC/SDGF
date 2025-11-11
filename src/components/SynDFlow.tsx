"use client"

import { useMemo, useState, useCallback } from "react"
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  Position,
} from "reactflow"
import "reactflow/dist/style.css"

import flowData from "@/src/content/framework/end_to_end_flow.json"

type FlowPhase = (typeof flowData)[number]

type PhaseNodeData = {
  title: string
  phase: number
  accountable: string
  supportRoles: string[]
  intent: string
  accent: string
  isActive: boolean
}

type DecisionNodeData = {
  question: string
  role: string
  phase: number
  accent: string
}

type TerminalNodeData = {
  label: string
  description?: string
  kind: "pause" | "terminate" | "action"
  actsAsSource?: boolean
}

const PHASE_ACCENTS = ["#34d399", "#a78bfa", "#fb923c", "#f87171", "#fbbf24", "#4ade80", "#2dd4bf", "#60a5fa"]

const getAccent = (phaseNumber: number) => PHASE_ACCENTS[phaseNumber % PHASE_ACCENTS.length]

const ROLE_BADGE_STYLES: Record<
  string,
  { background: string; text: string; border: string }
> = {
  DP: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", text: "#e0f2fe", border: "rgba(59,130,246,0.6)" },
  DR: { background: "linear-gradient(135deg,#047857,#059669)", text: "#d1fae5", border: "rgba(16,185,129,0.7)" },
  DS: { background: "linear-gradient(135deg,#b45309,#d97706)", text: "#fef3c7", border: "rgba(234,179,8,0.7)" },
  GC: { background: "linear-gradient(135deg,#7c3aed,#a855f7)", text: "#ede9fe", border: "rgba(167,139,250,0.7)" },
  DEFAULT: { background: "rgba(30,41,59,0.9)", text: "#f1f5f9", border: "rgba(148,163,184,0.6)" },
}

const RoleBadge = ({ role }: { role: string }) => {
  const normalized = (role ?? "").trim().toUpperCase()
  const theme = ROLE_BADGE_STYLES[normalized] ?? ROLE_BADGE_STYLES.DEFAULT

  return (
    <span
      className="inline-flex min-h-[24px] min-w-[40px] items-center justify-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide shadow-md shadow-slate-900/40"
      style={{ background: theme.background, color: theme.text, border: `1px solid ${theme.border}` }}
    >
      {normalized || role}
    </span>
  )
}

const PhaseNode = ({ data }: NodeProps<PhaseNodeData>) => (
  <div
    className="w-80 rounded-[28px] border bg-slate-950/95 p-6 text-sm text-slate-50 transition duration-200"
    style={{
      borderColor: data.accent,
      boxShadow: data.isActive
        ? `0 0 0 3px ${data.accent}55, 0 25px 45px -30px ${data.accent}AA`
        : `0 25px 45px -30px ${data.accent}AA`,
    }}
  >
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-slate-400">
      <span>Phase {data.phase}</span>
      <span style={{ color: data.accent }}>DP Flow</span>
    </div>
    <h3 className="mt-2 text-xl font-semibold text-white">{data.title}</h3>
    <p className="mt-3 text-[13px] leading-relaxed text-slate-300">{data.intent}</p>
    <dl className="mt-4 space-y-1 text-xs">
      <div>
        <dt className="font-semibold uppercase tracking-wide text-slate-400">Accountable</dt>
        <dd className="mt-1 flex flex-wrap gap-2">
          <RoleBadge role={data.accountable} />
        </dd>
      </div>
      {data.supportRoles.length > 0 && (
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-400">Support</dt>
          <dd className="mt-1 flex flex-wrap gap-2">
            {data.supportRoles.map((role) => (
              <RoleBadge key={`${data.phase}-${role}`} role={role} />
            ))}
          </dd>
        </div>
      )}
    </dl>
    <Handle type="source" position={Position.Bottom} />
  </div>
)

const DecisionNode = ({ data }: NodeProps<DecisionNodeData>) => (
  <div className="w-56 text-xs text-slate-50">
    <Handle type="target" position={Position.Top} />
    <div
      className="relative mx-auto flex h-36 w-36 items-center justify-center border bg-slate-900/90 px-4 text-center shadow-lg"
      style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", borderColor: data.accent }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          <span>Decision</span>
          <RoleBadge role={data.role} />
        </div>
        <p className="mt-2 text-sm font-semibold text-white leading-snug">{data.question}</p>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
)

const TERMINAL_THEME: Record<TerminalNodeData["kind"], { border: string; bg: string; text: string }> = {
  action: { border: "rgba(14,165,233,0.7)", bg: "rgba(8,47,73,0.9)", text: "#e0f2fe" },
  pause: { border: "rgba(251,191,36,0.8)", bg: "rgba(69,26,3,0.9)", text: "#fef3c7" },
  terminate: { border: "rgba(248,113,113,0.8)", bg: "rgba(69,10,10,0.9)", text: "#fecaca" },
}

const TerminalNode = ({ data }: NodeProps<TerminalNodeData>) => {
  const theme = TERMINAL_THEME[data.kind]
  return (
    <div
      className="w-60 rounded-2xl border px-5 py-4 text-center text-xs shadow-lg"
      style={{ borderColor: theme.border, background: theme.bg, color: theme.text }}
    >
      <Handle type="target" position={Position.Top} />
      <p className="text-sm font-semibold uppercase tracking-wide">{data.label}</p>
      {data.description && <p className="mt-1 text-[11px] leading-relaxed">{data.description}</p>}
      {data.actsAsSource && <Handle type="source" position={Position.Bottom} />}
    </div>
  )
}

const phaseNodeId = (phaseNumber: number) => `phase-${phaseNumber}`
const decisionNodeId = (phaseNumber: number, decisionIndex: number) => `phase-${phaseNumber}-decision-${decisionIndex}`

const coercePhaseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const numeric = Number.parseInt(value.replace(/\D/g, ""), 10)
    if (!Number.isNaN(numeric)) return numeric
  }
  return null
}

const EDGE_STYLE = {
  stroke: "rgba(94,234,212,0.85)",
  strokeWidth: 2,
}

const PHASE_EDGE_STYLE = {
  stroke: "rgba(134,239,172,0.9)",
  strokeWidth: 3,
}

const REVIEW_EDGE_STYLE = {
  stroke: "rgba(251,191,36,0.9)",
  strokeWidth: 2,
}

const STOP_EDGE_STYLE = {
  stroke: "rgba(248,113,113,0.95)",
  strokeWidth: 2.5,
}

const labelBgStyle = { fill: "rgba(2,6,23,0.85)", strokeWidth: 0 }
const labelStyle = { fill: "#f8fafc", fontSize: 11 }

const buildGraph = (collapsedPhases: Set<number>, activePhase?: number) => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const phaseX = 0
  const decisionX = 320
  const actionX = 640
  const phaseSpacing = 220
  const decisionSpacing = 180
  const optionSpacing = 120
  let cursorY = 0

  flowData.forEach((phase, index) => {
    const accent = getAccent(phase.phase)
    const phaseId = phaseNodeId(phase.phase)

    nodes.push({
      id: phaseId,
      type: "phase",
      position: { x: phaseX, y: cursorY },
      data: {
        title: phase.title,
        phase: phase.phase,
        accountable: phase.accountable,
        supportRoles: phase.support_roles,
        intent: phase.governance_intent,
        accent,
        isActive: activePhase === phase.phase,
      },
    })

    let blockBottom = cursorY + phaseSpacing
    const isCollapsed = collapsedPhases.has(phase.phase)

    if (!isCollapsed && phase.decisions.length > 0) {
      phase.decisions.forEach((decision, decisionIndex) => {
        const decisionId = decisionNodeId(phase.phase, decisionIndex)
        const decisionY = cursorY + decisionIndex * decisionSpacing + 90

        nodes.push({
          id: decisionId,
          type: "decision",
          position: { x: decisionX, y: decisionY },
          data: {
            question: decision.question,
            role: decision.role,
            phase: phase.phase,
            accent,
          },
        })

        edges.push({
          id: `edge-${phaseId}-${decisionId}`,
          source: phaseId,
          target: decisionId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: EDGE_STYLE,
          label: "Decision",
          labelBgStyle,
          labelStyle,
        })

        decision.options.forEach((option, optionIndex) => {
          const targetPhase =
            coercePhaseNumber(option.next_phase) ??
            coercePhaseNumber(option.resume_to_phase) ??
            coercePhaseNumber(option.loop_to_phase)

          const answerLabel = option.answer?.trim() ?? "Option"
          const description = option.action?.trim()
          const requiresStage = Boolean(option.pause || option.terminate || description)
          const terminalId = `${decisionId}-terminal-${optionIndex}`
          const terminalY = decisionY + optionIndex * optionSpacing

          if (requiresStage) {
            nodes.push({
              id: terminalId,
              type: "terminal",
              position: { x: actionX, y: terminalY },
              data: {
                label: answerLabel,
                description,
                kind: option.terminate ? "terminate" : option.pause ? "pause" : "action",
                actsAsSource: targetPhase !== null,
              },
            })

            edges.push({
              id: `edge-${decisionId}-${terminalId}`,
              source: decisionId,
              target: terminalId,
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: option.terminate ? STOP_EDGE_STYLE : REVIEW_EDGE_STYLE,
              label: answerLabel,
              labelBgStyle,
              labelStyle,
            })

            if (targetPhase !== null) {
              edges.push({
                id: `edge-${terminalId}-${targetPhase}`,
                source: terminalId,
                target: phaseNodeId(targetPhase),
                type: "smoothstep",
                markerEnd: { type: MarkerType.ArrowClosed },
                style: EDGE_STYLE,
                label: option.pause ? "Resume" : "Continue",
                labelBgStyle,
                labelStyle,
              })
            }
          } else if (targetPhase !== null) {
            edges.push({
              id: `edge-${decisionId}-${targetPhase}-${optionIndex}`,
              source: decisionId,
              target: phaseNodeId(targetPhase),
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: EDGE_STYLE,
              label: answerLabel,
              labelBgStyle,
              labelStyle,
            })
          }

          blockBottom = Math.max(blockBottom, terminalY + optionSpacing)
        })
      })
    }

    const nextPhase = flowData[index + 1]
    if (nextPhase) {
      edges.push({
        id: `edge-${phaseId}-${phaseNodeId(nextPhase.phase)}`,
        source: phaseId,
        target: phaseNodeId(nextPhase.phase),
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: PHASE_EDGE_STYLE,
        label: "Continue",
        labelBgStyle,
        labelStyle,
      })
    }

    cursorY = Math.max(blockBottom + 80, cursorY + phaseSpacing)
  })

  return { nodes, edges }
}

const nodeTypes = {
  phase: PhaseNode,
  decision: DecisionNode,
  terminal: TerminalNode,
}

const defaultEdgeOptions = {
  type: "smoothstep" as const,
  labelStyle,
  labelBgStyle,
}


const answerToneClasses = (answer: string) => {
  const normalized = answer.toLowerCase()
  if (normalized.startsWith("yes")) return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
  if (normalized.startsWith("no")) return "border-rose-400/40 bg-rose-500/10 text-rose-100"
  if (normalized.startsWith("unclear")) return "border-amber-400/40 bg-amber-500/10 text-amber-100"
  if (normalized.includes("low")) return "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
  return "border-slate-500/30 bg-slate-700/20 text-slate-100"
}

const summarizeText = (text: string | undefined, maxCharacters = 160) => {
  if (!text) return ""
  if (text.length <= maxCharacters) return text
  return `${text.slice(0, maxCharacters).trim()}…`
}

const TimelineDecisionBlock = ({ phase }: { phase: FlowPhase }) => {
  if (!phase.decisions.length) return null

  return (
    <div className="mt-5 space-y-4 rounded-3xl border border-slate-800/60 bg-slate-900/60 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Decision Points ({phase.decisions.length})
      </h4>
      <div className="space-y-4 text-sm text-slate-200">
        {phase.decisions.map((decision, idx) => (
          <div key={decision.question + idx} className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              <span>Role</span>
              <RoleBadge role={decision.role} />
            </div>
            <p className="mt-1 text-base font-semibold text-white">{decision.question}</p>
            <div className="mt-3 space-y-2">
              {decision.options.map((option, optionIdx) => (
                <div
                  key={option.answer + optionIdx}
                  className={`rounded-2xl border px-3 py-2 text-xs ${answerToneClasses(option.answer ?? "Option")}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold uppercase tracking-wide">{option.answer}</span>
                    {option.next_phase !== undefined && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">{`→ Phase ${option.next_phase}`}</span>
                    )}
                    {option.loop_to_phase !== undefined && !option.terminate && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">{`↺ Phase ${option.loop_to_phase}`}</span>
                    )}
                    {option.terminate && (
                      <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-100">Terminate</span>
                    )}
                  </div>
                  {option.action && <p className="mt-1 text-[11px] text-slate-200">{option.action}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PhaseModal = ({ phase, onClose }: { phase: FlowPhase; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
    <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-800 px-8 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Phase {phase.phase}</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">{phase.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-700 px-3 py-1 text-sm font-semibold text-slate-200 hover:bg-slate-800"
        >
          Close
        </button>
      </div>

      <div className="space-y-6 px-8 py-6 text-sm text-slate-200">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-emerald-100">Accountable</span>
            <RoleBadge role={phase.accountable} />
          </div>
          {phase.support_roles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-200">Support:</span>
              {phase.support_roles.map((role) => (
                <RoleBadge key={`${phase.phase}-modal-${role}`} role={role} />
              ))}
            </div>
          )}
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-slate-500">Governance Intent</h4>
          <p className="mt-2 text-base leading-relaxed text-white">{phase.governance_intent}</p>
        </div>
        {phase.outcome && (
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-slate-500">Outcome</h4>
            <p className="mt-2 text-base leading-relaxed text-white">{phase.outcome}</p>
          </div>
        )}
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-slate-500">Operational Evidence</h4>
          <ul className="mt-2 space-y-2 text-base">
            {phase.operational_evidence.map((evidence) => (
              <li key={evidence} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-slate-100">
                {evidence}
              </li>
            ))}
          </ul>
        </div>
        <TimelineDecisionBlock phase={phase} />
      </div>
    </div>
  </div>
)

export default function SynDFlow() {
  const [expandedTimeline, setExpandedTimeline] = useState<Set<number>>(new Set([flowData[0]?.phase ?? 0]))
  const [selectedPhase, setSelectedPhase] = useState<FlowPhase | null>(flowData[0] ?? null)
  const [modalPhase, setModalPhase] = useState<FlowPhase | null>(null)
  const [collapsedFlowPhases] = useState<Set<number>>(new Set())

  const { nodes, edges } = useMemo(
    () => buildGraph(collapsedFlowPhases, selectedPhase?.phase),
    [collapsedFlowPhases, selectedPhase?.phase],
  )

  const collapseTimelinePhase = useCallback((phaseNumber: number) => {
    setExpandedTimeline((prev) => {
      const next = new Set(prev)
      next.delete(phaseNumber)
      return next
    })
  }, [])

  const focusPhase = useCallback((phaseNumber: number) => {
    const phase = flowData.find((item) => item.phase === phaseNumber)
    if (phase) {
      setSelectedPhase(phase)
      setExpandedTimeline((prev) => {
        const next = new Set(prev)
        next.add(phaseNumber)
        return next
      })
    }
  }, [])

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const phaseNumber = (node.data as { phase?: number })?.phase
    if (phaseNumber !== undefined) {
      focusPhase(phaseNumber)
    }
  }, [focusPhase])

  const handleNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const phaseNumber = (node.data as { phase?: number })?.phase
      const phase = flowData.find((item) => item.phase === phaseNumber)
      if (phase) {
        setModalPhase(phase)
      }
    },
    [],
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <div className="flex flex-col items-center space-y-4">
          {flowData.map((phase) => {
            const accent = getAccent(phase.phase)
            const isExpanded = expandedTimeline.has(phase.phase)
            const isActive = selectedPhase?.phase === phase.phase

            return (
              <div
                key={phase.phase}
                className={`w-full max-w-[810px] rounded-[30px] border bg-slate-950/80 p-5 text-slate-200 transition ${
                  isActive ? "ring-2 ring-emerald-300/70" : ""
                }`}
                style={{ borderColor: `${accent}55` }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isExpanded) {
                      collapseTimelinePhase(phase.phase)
                    } else {
                      focusPhase(phase.phase)
                    }
                  }}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex items-center gap-4 text-left">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white"
                      style={{ backgroundColor: `${accent}35`, border: `1px solid ${accent}80` }}
                    >
                      {phase.phase}
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.4em] text-slate-500">Phase</div>
                      <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
                    </div>
                  </div>
                  <span className="text-2xl text-slate-500">{isExpanded ? "−" : "+"}</span>
                </button>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-emerald-100">Accountable</span>
                  <RoleBadge role={phase.accountable} />
                  {phase.support_roles.length > 0 && (
                    <>
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Support:</span>
                      {phase.support_roles.map((role) => (
                        <RoleBadge key={`${phase.phase}-support-${role}`} role={role} />
                      ))}
                    </>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-slate-800/50 bg-slate-950/60 p-4 text-xs text-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Snapshot</span>
                    <span className="text-[11px] text-slate-400">
                      {phase.decisions.length} decisions • {phase.operational_evidence.length} evidence items
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-100">{summarizeText(phase.governance_intent, 180)}</p>
                  {phase.operational_evidence[0] && (
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-500">
                      Key Evidence ·{" "}
                      <span className="normal-case text-slate-200">{phase.operational_evidence[0]}</span>
                    </p>
                  )}
                  {phase.decisions[0] && (
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                      Primary Decision ·{" "}
                      <span className="normal-case text-slate-200">{phase.decisions[0].question}</span>
                    </p>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-100">
                    <div>
                      <h4 className="text-xs uppercase tracking-[0.3em] text-slate-500">Governance Intent</h4>
                      <p className="mt-1 text-slate-200">{phase.governance_intent}</p>
                    </div>
                    {phase.outcome && (
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] text-slate-500">Outcome</h4>
                        <p className="mt-1 text-slate-200">{phase.outcome}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs uppercase tracking-[0.3em] text-slate-500">Operational Evidence</h4>
                      <ul className="mt-1 space-y-1 text-slate-200">
                        {phase.operational_evidence.map((item) => (
                          <li key={item} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-xs">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <TimelineDecisionBlock phase={phase} />
                    <button
                      className="text-xs font-semibold uppercase tracking-wide text-cyan-200 underline underline-offset-4"
                      onClick={() => setModalPhase(phase)}
                    >
                      View full phase dossier
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="relative min-h-[1100px] rounded-3xl border border-emerald-400/30 bg-slate-900/20 p-6 backdrop-blur">
          <div className="absolute right-6 top-6 z-10 space-x-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#34d399" }} />
              Phase
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-400" />
              Decision
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              Pause
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              Stop
            </span>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            minZoom={0.25}
            maxZoom={1.5}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            className="[&_.react-flow__renderer]:text-sm"
          >
            <Background gap={24} size={1} color="rgba(45,212,191,0.2)" />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => {
                if (node.type === "phase") return "#34d399"
                if (node.type === "decision") return "#0ea5e9"
                return node.data?.kind === "terminate" ? "#f87171" : "#facc15"
              }}
            />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      {modalPhase && <PhaseModal phase={modalPhase} onClose={() => setModalPhase(null)} />}
    </div>
  )
}
