"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { useSearchParams } from "next/navigation";
import personasJson from "@/src/content/personas.json";

export type PersonaId = "custodian" | "requestor" | "scientist";
export type Persona = {
  id: PersonaId;
  label: string;
  description?: string;
  allowedSteps: number[];
  allowedAppendices: number[];
  defaultLanding?: string;
};

type PersonaContextType = {
  personas: Persona[];
  persona: Persona | null;
  setPersonaById: (id: PersonaId) => void;
  clearPersona: () => void;
  isStepVisible: (n: number) => boolean;
  isAppendixVisible: (n: number) => boolean;
};

const LS_KEY = "synd.persona.v1";

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const personas = useMemo(() => (personasJson as { personas: Persona[] }).personas, []);
  const searchParams = useSearchParams();
  const personaParam = searchParams?.get("persona") ?? null;

  const [persona, setPersona] = useState<Persona | null>(null);

  const findPersona = useCallback(
    (id: string | null | undefined) => (id ? personas.find((p) => p.id === id) ?? null : null),
    [personas],
  );

  const setPersonaById = useCallback(
    (id: PersonaId) => {
      const found = findPersona(id);
      startTransition(() => {
        setPersona(found);
      });
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(found ? { id: found.id } : null));
      } catch {
        // ignore persistence failures (private browsing, etc.)
      }
    },
    [findPersona],
  );

  const clearPersona = useCallback(() => {
    startTransition(() => {
      setPersona(null);
    });
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LS_KEY);
      }
    } catch {
      // ignore persistence failures
    }
  }, []);

  // Load previously selected persona.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.id) {
        const stored = findPersona(parsed.id);
        if (stored) {
          startTransition(() => {
            setPersona(stored);
          });
        }
      }
    } catch {
      // ignore JSON / storage issues
    }
  }, [findPersona]);

  // Allow query-string overrides (?persona=custodian) to set context.
  useEffect(() => {
    if (!personaParam) return;

    const matched = findPersona(personaParam);
    if (!matched) return;

    if (persona?.id === matched.id) return;
    setPersonaById(matched.id);
  }, [findPersona, persona?.id, personaParam, setPersonaById]);

  const isStepVisible = useCallback(
    (n: number) => (!persona ? true : persona.allowedSteps.includes(n)),
    [persona],
  );

  const isAppendixVisible = useCallback(
    (n: number) => (!persona ? true : persona.allowedAppendices.includes(n)),
    [persona],
  );

  const value = useMemo(
    () => ({
      personas,
      persona,
      setPersonaById,
      clearPersona,
      isStepVisible,
      isAppendixVisible,
    }),
    [clearPersona, isAppendixVisible, isStepVisible, persona, personas, setPersonaById],
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}
