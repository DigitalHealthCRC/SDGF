"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import "vis-network/styles/vis-network.css"
import {
  DataSet,
  Network,
  type Edge,
  type Node,
  type Options,
} from "vis-network/standalone/esm/vis-network.js"

import { ROLE_BADGE_STYLES, type FrameworkRole } from "./RoleBadge"
type GraphNode = Node & { node_type?: string }
interface GovernanceGraphProps {
  onSelectStep?: (phaseNumber: number) => void
}

const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const createNodeSvg = (title: string, groups: { label: string; roles: FrameworkRole[] }[]) => {
  const width = 320
  const height = 180

  // Convert styles to CSS string
  const getStyleString = (role: FrameworkRole) => {
    const style = ROLE_BADGE_STYLES[role] || ROLE_BADGE_STYLES.DEFAULT
    return `
      background: ${style.background};
      color: ${style.text};
      border: 1px solid ${style.border};
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #f8fafc;
          padding: 20px;
          box-sizing: border-box;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(52, 211, 153, 0.4);
          border-radius: 20px;
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
        ">
          <div style="font-size: 18px; font-weight: 700; line-height: 1.3; margin-bottom: 16px; white-space: pre-wrap; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${escapeHtml(title)}</div>
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: center; width: 100%;">
            ${groups
      .map(
        (g) => `
              <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #cbd5e1; font-weight: 500;">
                <span>${escapeHtml(g.label)}</span>
                <div style="display: flex; gap: 6px;">
                  ${g.roles.map((r) => `<span style="${getStyleString(r)}">${escapeHtml(r)}</span>`).join("")}
                </div>
              </div>
            `,
      )
      .join("")}
          </div>
        </div>
      </foreignObject>
    </svg>
  `
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: "start",
    shape: "image",
    image: createNodeSvg("START:\nInitiate Request", [
      { label: "Accountable:", roles: ["DP"] },
      { label: "Support:", roles: ["DR", "GC"] },
    ]),
    size: 50,
    title: "START: Initiate Request\nAccountable: DP\nSupport: DR, GC",
    x: -970,
    y: 4478,
    fixed: true,
  },
  {
    id: "step1",
    shape: "image",
    image: createNodeSvg("STEP 1:\nAssess the Use Case", [
      { label: "Accountable:", roles: ["DP"] },
      { label: "Support:", roles: ["DR", "GC"] },
    ]),
    size: 50,
    title: "STEP 1: Assess the Use Case\nAccountable: DP\nSupport: DR, GC",
    x: -968,
    y: 4778,
    fixed: true,
  },
  {
    id: "step2",
    shape: "image",
    image: createNodeSvg("STEP 2:\nAssess the Data", [
      { label: "Accountable:", roles: ["DP"] },
      { label: "Support:", roles: ["DR", "DS"] },
    ]),
    size: 50,
    title: "STEP 2: Assess the Data\nAccountable: DP\nSupport: DR, DS",
    x: -979,
    y: 5292,
    fixed: true,
  },
  {
    id: "step3",
    shape: "image",
    image: createNodeSvg("STEP 3:\nPrepare the Data", [
      { label: "Accountable:", roles: ["DS"] },
      { label: "Support:", roles: ["DP", "DR"] },
    ]),
    size: 50,
    title: "STEP 3: Prepare the Data\nAccountable: DS\nSupport: DP, DR",
    x: -981,
    y: 5888,
    fixed: true,
  },
  {
    id: "step4",
    shape: "image",
    image: createNodeSvg("STEP 4:\nAssess Risk & Utility", [
      { label: "Accountable:", roles: ["DS"] },
      { label: "Support:", roles: ["DP", "DR"] },
    ]),
    size: 50,
    title: "STEP 4: Assess Risk & Utility\nAccountable: DS\nSupport: DP, DR",
    x: -981,
    y: 6188,
    fixed: true,
  },
  {
    id: "step5",
    shape: "image",
    image: createNodeSvg("STEP 5:\nFinal Review", [
      { label: "Accountable:", roles: ["DP"] },
      { label: "Support:", roles: ["DR", "GC"] },
    ]),
    size: 50,
    title: "STEP 5: Final Review\nAccountable: DP\nSupport: DR, GC",
    x: -981,
    y: 6638,
    fixed: true,
  },
  {
    id: "approved",
    shape: "image",
    image: createNodeSvg("APPROVED:\nRelease Data", [
      { label: "Accountable:", roles: ["DP"] },
      { label: "Support:", roles: ["DR", "GC"] },
    ]),
    size: 50,
    title: "APPROVED: Release Data\nAccountable: DP\nSupport: DR, GC",
    x: -997,
    y: 7035,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app4",
    label: "Appendix 4:\nFive Safes\nFramework",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 4: Five Safes Framework",
    x: -1179,
    y: 4904,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app5",
    label: "Appendix 5:\nData Breach\nResponse Plan",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 5: Data Breach Response Plan",
    x: -768,
    y: 4904,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app6",
    label: "Appendix 6:\nData Quality\nFramework",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 6: Data Quality Framework",
    x: -782,
    y: 5438,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app7",
    label: "Appendix 7:\nPrivacy Preserving\nTechniques",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 7: Privacy Preserving Techniques",
    x: -441,
    y: 6436,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app10",
    label: "Appendix 10:\nData Sharing\nAgreement",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 10: Data Sharing Agreement",
    x: -779,
    y: 6680,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "reid_assess",
    label: "Re-ID Risk\nAssessment",
    node_type: "process",
    shape: "box",
    size: 25,
    title: "Re-ID Risk Assessment",
    x: -741,
    y: 6188,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "utility_assess",
    label: "Data Utility\nAssessment",
    node_type: "process",
    shape: "box",
    size: 25,
    title: "Data Utility Assessment",
    x: -1221,
    y: 6188,
    fixed: true,
  },
  {
    color: "#2ECC71",
    font: { color: "#f8fafc" },
    id: "app11",
    label: "Appendix 11:\nRequest & Assessment\nOutcomes Form",
    node_type: "documentation",
    shape: "ellipse",
    size: 20,
    title: "Appendix 11: Request & Assessment Outcomes Form",
    x: -997,
    y: 7185,
    fixed: true,
  },
  {
    color: "#F39C12",
    font: { color: "#f8fafc" },
    id: "decision1",
    label: "Use Case\nAcceptable?",
    node_type: "decision",
    shape: "diamond",
    size: 25,
    title: "Use Case Acceptable?",
    x: -979,
    y: 5004,
    fixed: true,
  },
  {
    color: "#F39C12",
    font: { color: "#f8fafc" },
    id: "decision2",
    label: "Source Data\nFit for Purpose?",
    node_type: "decision",
    shape: "diamond",
    size: 25,
    title: "Source Data Fit for Purpose?",
    x: -982,
    y: 5588,
    fixed: true,
  },
  {
    color: "#F39C12",
    font: { color: "#f8fafc" },
    id: "decision4a",
    label: "Re-ID Risk\nVery Low?",
    node_type: "decision",
    shape: "diamond",
    size: 25,
    title: "Re-ID Risk Very Low?",
    x: -741,
    y: 6436,
    fixed: true,
  },
  {
    color: "#F39C12",
    font: { color: "#f8fafc" },
    id: "decision4b",
    label: "Data Utility\nSufficient?",
    node_type: "decision",
    shape: "diamond",
    size: 25,
    title: "Data Utility Sufficient?",
    x: -1315,
    y: 6438,
    fixed: true,
  },
  {
    color: "#F39C12",
    font: { color: "#f8fafc" },
    id: "decision5",
    label: "Can Share\nSafely?",
    node_type: "decision",
    shape: "diamond",
    size: 25,
    title: "Can Share Safely?",
    x: -779,
    y: 6830,
    fixed: true,
  },
  {
    color: "#E74C3C",
    font: { color: "#f8fafc" },
    id: "complex",
    label: "COMPLEX SCENARIO:\nPause Project",
    node_type: "pause",
    shape: "box",
    size: 28,
    title: "COMPLEX SCENARIO: Pause Project",
    x: -338,
    y: 5784,
    fixed: true,
  },
  {
    color: "#C0392B",
    font: { color: "#f8fafc" },
    id: "terminate",
    label: "TERMINATE:\nRequest Rejected",
    node_type: "termination",
    shape: "box",
    size: 25,
    title: "TERMINATE: Request Rejected",
    x: -529,
    y: 6974,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app8",
    label: "Appendix 8:\nDecision Tree for\nComplex Scenarios",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 8: Decision Tree for Complex Scenarios",
    x: -562,
    y: 5586,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app9",
    label: "Appendix 9:\nIdentifying Exceptional\nCircumstances",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 9: Identifying Exceptional Circumstances",
    x: -563,
    y: 5928,
    fixed: true,
  },
  {
    color: "#C0392B",
    font: { color: "#f8fafc" },
    id: "pia",
    label: "Privacy Impact\nAssessment (PIA)",
    node_type: "external",
    shape: "ellipse",
    size: 20,
    title: "Privacy Impact Assessment (PIA)",
    x: -781,
    y: 5737,
    fixed: true,
  },
  {
    color: "#C0392B",
    font: { color: "#f8fafc" },
    id: "hrec",
    label: "Human Research\nEthics Committee\n(HREC)",
    node_type: "external",
    shape: "ellipse",
    size: 20,
    title: "Human Research Ethics Committee (HREC)",
    x: -771,
    y: 5508,
    fixed: true,
  },
]

const GRAPH_EDGES: Edge[] = [
  { arrows: "to", color: "#2ECC71", from: "start", label: "initiate", to: "step1", width: 2 },
  { arrows: "to", color: "#7F8C8D", from: "step1", label: "refer to", to: "app4", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "step1", label: "refer to", to: "app5", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "app4", label: "evaluate", to: "decision1", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "app5", label: "evaluate", to: "decision1", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "step2", label: "refer to", to: "app6", width: 1 },
  { arrows: "to", color: "#2ECC71", from: "step3", label: "proceed to", to: "step4", width: 2 },
  { arrows: "to", color: "#7F8C8D", from: "step4", label: "conduct", to: "reid_assess", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "step4", label: "conduct", to: "utility_assess", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "step5", label: "refer to", to: "app10", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "approved", label: "document", to: "app11", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "app6", label: "evaluate", to: "decision2", width: 1 },
  { arrows: "to", color: "#F39C12", dashes: true, from: "app7", label: "loop back", to: "reid_assess", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "reid_assess", label: "evaluate", to: "decision4a", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "utility_assess", label: "evaluate", to: "decision4b", width: 1 },
  { arrows: "to", color: "#7F8C8D", from: "app10", label: "evaluate", to: "decision5", width: 1 },
  { arrows: "to", color: "#27AE60", from: "decision1", label: "YES", to: "step2", width: 1 },
  { arrows: "to", color: "#E74C3C", from: "decision1", label: "NO", to: "complex", width: 1 },
  { arrows: "to", color: "#27AE60", from: "decision2", label: "YES", to: "step3", width: 1 },
  { arrows: "to", color: "#E74C3C", from: "decision2", label: "NO", to: "terminate", width: 1 },
  { arrows: "to", color: "#27AE60", from: "decision4a", label: "YES", to: "decision4b", width: 1 },
  {
    arrows: "to",
    color: "#F39C12",
    dashes: true,
    from: "decision4a",
    label: "NO - Apply more\ntechniques",
    to: "app7",
    width: 1,
  },
  {
    arrows: "to",
    color: "#E74C3C",
    from: "decision4a",
    label: "NO - Cannot\nreduce further",
    to: "complex",
    width: 1,
  },
  { arrows: "to", color: "#27AE60", from: "decision4b", label: "YES", to: "step5", width: 1 },
  {
    arrows: "to",
    color: "#F39C12",
    dashes: true,
    from: "decision4b",
    label: "NO - Regenerate",
    to: "step3",
    width: 1,
  },
  { arrows: "to", color: "#27AE60", from: "decision5", label: "YES", to: "approved", width: 1 },
  { arrows: "to", color: "#E74C3C", from: "decision5", label: "NO", to: "terminate", width: 1 },
  { arrows: "to", color: "#E67E22", dashes: true, from: "complex", label: "consult", to: "app8", width: 1 },
  { arrows: "to", color: "#E67E22", dashes: true, from: "complex", label: "consult", to: "app9", width: 1 },
  { arrows: "to", color: "#C0392B", from: "complex", label: "if cannot resolve", to: "terminate", width: 1 },
  {
    arrows: "to",
    color: "#C0392B",
    dashes: true,
    from: "app8",
    label: "may require",
    to: "pia",
    width: 1,
  },
  {
    arrows: "to",
    color: "#C0392B",
    dashes: true,
    from: "app9",
    label: "determine pathway",
    to: "pia",
    width: 1,
  },
  { arrows: "to", color: "#C0392B", from: "pia", label: "often leads to", to: "hrec", width: 1 },
  { arrows: "to", color: "#27AE60", dashes: true, from: "hrec", label: "if approved", to: "step2", width: 1 },
]

const NETWORK_OPTIONS: Options = {
  physics: { enabled: false },
  layout: { hierarchical: { enabled: false } },
  edges: {
    smooth: {
      enabled: true,
      type: "cubicBezier",
      forceDirection: "none",
      roundness: 0.4,
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
    font: {
      size: 14,
      align: "middle",
      background: "white",
    },
  },
  nodes: {
    font: {
      size: 16,
      face: "arial",
      multi: true,
      bold: {
        size: 18,
      },
    },
    borderWidth: 2,
    borderWidthSelected: 4,
  },
  interaction: {
    hover: true,
    tooltipDelay: 100,
    navigationButtons: false,
    keyboard: {
      enabled: true,
    },
    dragNodes: false,
  },
  manipulation: {
    enabled: false,
  },
}

const NODE_STEP_MAP: Record<string, number> = {
  start: 0,
  step1: 1,
  step2: 2,
  step3: 3,
  step4: 4,
  step5: 5,
}

const NODE_APPENDIX_MAP: Record<string, string> = {
  app4: "/resources/appendix4",
  app5: "/resources/appendix5",
  app6: "/resources/appendix6",
  app7: "/resources/appendix7",
  app8: "/resources/appendix8",
  app9: "/resources/appendix9",
  app10: "/resources/appendix10",
  app11: "/resources/appendix11",
}

export function GovernanceGraph({ onSelectStep }: GovernanceGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const networkRef = useRef<Network | null>(null)
  const router = useRouter()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const nodes = new DataSet<GraphNode>(GRAPH_NODES)
    const edges = new DataSet<Edge>(GRAPH_EDGES)
    const network = new Network(container, { nodes, edges }, NETWORK_OPTIONS)
    networkRef.current = network

    const fitNetwork = () => {
      try {
        network.fit({ animation: false })
      } catch {
        // ignore fit errors that can occur during teardown
      }
    }

    fitNetwork()

    const handleResize = () => fitNetwork()
    window.addEventListener("resize", handleResize)

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => fitNetwork())
        : null
    observer?.observe(container)

    const handleClick = (params: { nodes?: string[] }) => {
      const nodeId = params.nodes?.[0]
      if (!nodeId) return

      if (nodeId in NODE_STEP_MAP) {
        onSelectStep?.(NODE_STEP_MAP[nodeId])
        return
      }

      const appendixPath = NODE_APPENDIX_MAP[nodeId]
      if (appendixPath) {
        router.push(appendixPath)
      }
    }

    network.on("click", handleClick)

    return () => {
      window.removeEventListener("resize", handleResize)
      observer?.disconnect()
      network.off("click", handleClick)
      network.destroy()
      networkRef.current = null
    }
  }, [onSelectStep, router])

  return (
    <section className="flex h-full w-full flex-col rounded-3xl border border-emerald-500/30 bg-black/80 p-4">
      <div className="flex-1 rounded-2xl border border-emerald-500/20 bg-black p-2">
        <div ref={containerRef} className="h-full min-h-[900px] w-full rounded-xl bg-black" />
      </div>
    </section>
  )
}

export default GovernanceGraph
