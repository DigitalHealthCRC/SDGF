"use client"

import { useEffect, useRef } from "react"

import "vis-network/styles/vis-network.css"
import {
  DataSet,
  Network,
  type Edge,
  type Node,
  type Options,
} from "vis-network/standalone/esm/vis-network.js"

type GraphNode = Node & { node_type?: string }

const GRAPH_NODES: GraphNode[] = [
  {
    color: "#2ECC71",
    font: { color: "#f8fafc" },
    id: "start",
    label: "START:\nSynthetic Health Data Request\n[DP + DR]",
    node_type: "start",
    shape: "box",
    size: 30,
    title: "START: Synthetic Health Data Request\nAccountable: DP\nSupport: DR",
    x: -974,
    y: 4587,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "step1",
    label: "STEP 1:\nAssess the Use Case\n[DP accountable]\n[DR, GC support]",
    node_type: "phase",
    shape: "box",
    size: 35,
    title: "STEP 1: Assess the Use Case\nAccountable: DP\nSupport: DR, GC",
    x: -968,
    y: 4778,
    fixed: true,
  },
  {
    color: "#9B59B6",
    font: { color: "#f8fafc" },
    id: "app4",
    label: "Appendix 4:\nUse Case Assessment",
    node_type: "assessment",
    shape: "ellipse",
    size: 25,
    title: "Appendix 4: Use Case Assessment",
    x: -802,
    y: 4921,
    fixed: true,
  },
  {
    color: "#9B59B6",
    font: { color: "#f8fafc" },
    id: "app5",
    label: "Appendix 5:\nImpact Assessment",
    node_type: "assessment",
    shape: "ellipse",
    size: 25,
    title: "Appendix 5: Impact Assessment",
    x: -1172,
    y: 4917,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "step2",
    label: "STEP 2:\nAssess & Prepare\nSource Data\n[DP accountable]\n[DR, DS support]",
    node_type: "phase",
    shape: "box",
    size: 35,
    title: "STEP 2: Assess & Prepare Source Data\nAccountable: DP\nSupport: DR, DS",
    x: -974,
    y: 5201,
    fixed: true,
  },
  {
    color: "#9B59B6",
    font: { color: "#f8fafc" },
    id: "app6",
    label: "Appendix 6:\nTechnical Assessment",
    node_type: "assessment",
    shape: "ellipse",
    size: 25,
    title: "Appendix 6: Technical Assessment",
    x: -981,
    y: 5426,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "step3",
    label: "STEP 3:\nGenerate\nSynthetic Health Data\n[DP accountable]\n[DS, DR support]",
    node_type: "phase",
    shape: "box",
    size: 35,
    title: "STEP 3: Generate Synthetic Health Data\nAccountable: DP\nSupport: DS, DR",
    x: -992,
    y: 5815,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "step4",
    label: "STEP 4:\nAssess & Manage\nRe-identification Risks\n[DP accountable]\n[DS, DR, GC support]",
    node_type: "phase",
    shape: "box",
    size: 35,
    title:
      "STEP 4: Assess & Manage Re-identification Risks\nAccountable: DP\nSupport: DS, DR, GC",
    x: -994,
    y: 6085,
    fixed: true,
  },
  {
    color: "#E67E22",
    font: { color: "#f8fafc" },
    id: "app7",
    label: "Appendix 7:\nDe-identification\nTechniques",
    node_type: "guidance",
    shape: "ellipse",
    size: 20,
    title: "Appendix 7: De-identification Techniques",
    x: -1018,
    y: 6337,
    fixed: true,
  },
  {
    color: "#9B59B6",
    font: { color: "#f8fafc" },
    id: "reid_assess",
    label: "Re-identification\nRisk Assessment",
    node_type: "assessment",
    shape: "ellipse",
    size: 25,
    title: "Re-identification Risk Assessment",
    x: -866,
    y: 6234,
    fixed: true,
  },
  {
    color: "#9B59B6",
    font: { color: "#f8fafc" },
    id: "utility_assess",
    label: "Data Utility\nAssessment",
    node_type: "assessment",
    shape: "ellipse",
    size: 25,
    title: "Data Utility Assessment",
    x: -1107,
    y: 6235,
    fixed: true,
  },
  {
    color: "#3498DB",
    font: { color: "#f8fafc" },
    id: "step5",
    label: "STEP 5:\nManage Residual\nPrivacy Risks\n[DP accountable]\n[DR, DS support]",
    node_type: "phase",
    shape: "box",
    size: 35,
    title: "STEP 5: Manage Residual Privacy Risks\nAccountable: DP\nSupport: DR, DS",
    x: -1008,
    y: 6533,
    fixed: true,
  },
  {
    color: "#9B59B6",
    font: { color: "#f8fafc" },
    id: "app10",
    label: "Appendix 10:\nSafety Assessment",
    node_type: "assessment",
    shape: "ellipse",
    size: 25,
    title: "Appendix 10: Safety Assessment",
    x: -1001,
    y: 6740,
    fixed: true,
  },
  {
    color: "#27AE60",
    font: { color: "#f8fafc" },
    id: "approved",
    label: "APPROVED:\nShare Synthetic\nHealth Dataset\n[DP accountable]\n[DR, DS support]",
    node_type: "outcome",
    shape: "box",
    size: 30,
    title: "APPROVED: Share Synthetic Health Dataset\nAccountable: DP\nSupport: DR, DS",
    x: -998,
    y: 6962,
    fixed: true,
  },
  {
    color: "#95A5A6",
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

export function GovernanceGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const networkRef = useRef<Network | null>(null)

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

    return () => {
      window.removeEventListener("resize", handleResize)
      observer?.disconnect()
      network.destroy()
      networkRef.current = null
    }
  }, [])

  return (
    <section className="flex h-full w-full flex-col rounded-3xl border border-emerald-500/30 bg-black/80 p-4">
      <div className="flex-1 rounded-2xl border border-emerald-500/20 bg-black p-2">
        <div ref={containerRef} className="h-full min-h-[900px] w-full rounded-xl bg-black" />
      </div>
    </section>
  )
}

export default GovernanceGraph
