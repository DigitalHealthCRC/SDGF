import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

import { AppendixDetail } from "../appendix-detail";

export type AppendixRecord = {
  id: string;
  title: string;
  purpose: string;
  template?: boolean;
  description?: string;
  body?: string;
};

const APPENDICES_DIR = path.join(process.cwd(), "src/content/appendices");

export const dynamic = "force-static";
export const dynamicParams = false;

const loadAppendix = (id: string): AppendixRecord | null => {
  const filePath = path.join(APPENDICES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return {
      id: raw.id || id,
      title: raw.title || id,
      purpose: raw.purpose || "Purpose coming soon.",
      template: Boolean(raw.template),
      description: raw.description,
      body: raw.body,
    };
  } catch {
    return null;
  }
};

export function generateStaticParams() {
  if (!fs.existsSync(APPENDICES_DIR)) return [];

  return fs
    .readdirSync(APPENDICES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ id: path.parse(file).name }));
}

export default async function AppendixPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appendix = loadAppendix(id);

  if (!appendix) {
    notFound();
  }

  return <AppendixDetail appendix={appendix} />;
}
