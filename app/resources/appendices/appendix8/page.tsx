"use client";

import { useState } from "react";

type Node = {
  id: string;
  question: string;
  yes?: string;
  no?: string;
  result?: string;
};

const tree: Record<string, Node> = {
  start: {
    id: "start",
    question:
      "Is the synthetic data intended for public release or sharing outside your organisation?",
    yes: "riskAssessment",
    no: "ethicsCheck"
  },
  riskAssessment: {
    id: "riskAssessment",
    question:
      "Has a re-identification risk assessment been completed and rated 'very low'?",
    yes: "proceed",
    no: "reviewRisk"
  },
  ethicsCheck: {
    id: "ethicsCheck",
    question:
      "Does the use case involve potentially sensitive or vulnerable populations?",
    yes: "ethicsRequired",
    no: "proceed"
  },
  reviewRisk: {
    id: "reviewRisk",
    result:
      "Re-identification risk must be mitigated or synthesis parameters adjusted before proceeding."
  },
  ethicsRequired: {
    id: "ethicsRequired",
    result:
      "Submit the proposal for ethics or governance review prior to data synthesis."
  },
  proceed: {
    id: "proceed",
    result:
      "The scenario meets governance expectations. You may proceed to Step 3 (Generate Synthetic Data)."
  }
};

export default function Appendix8Page() {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  const current = tree[currentId];

  const answer = (response: "yes" | "no") => {
    const next = current[response];
    setHistory([...history, { q: current.question, a: response }]);
    if (next) setCurrentId(next);
  };

  const reset = () => {
    setCurrentId("start");
    setHistory([]);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json"
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "appendix8_decisiontree.json";
    a.click();
  };

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">
        Appendix 8 – Decision Tree for Complex Scenarios
      </h1>
      <p className="text-muted-foreground">
        Use this interactive decision tree to determine whether your scenario
        requires additional governance, ethics, or risk review before
        generating synthetic data.
      </p>

      {current.result ? (
        <div className="space-y-4 border rounded-xl p-6 bg-emerald-50">
          <h2 className="font-medium text-emerald-800">Outcome</h2>
          <p className="text-emerald-700">{current.result}</p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={reset}
              className="bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
            >
              Restart
            </button>
            <button
              onClick={downloadJSON}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Download Path (JSON)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border rounded-xl p-6">
          <h2 className="font-medium">{current.question}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => answer("yes")}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Yes
            </button>
            <button
              onClick={() => answer("no")}
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <section className="mt-8">
          <h3 className="font-medium mb-2">Your Path so far</h3>
          <ul className="text-sm list-disc list-inside space-y-1">
            {history.map((h, i) => (
              <li key={i}>
                <strong>{h.q}</strong> → <span>{h.a.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
