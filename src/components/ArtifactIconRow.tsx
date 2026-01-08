"use client";

import {
  Youtube,
  Twitter,
  Github,
  Globe,
  BookOpen,
  Mic,
  FileText,
  Presentation,
} from "lucide-react";
import { Artifact } from "@/types";

interface ArtifactIconRowProps {
  artifacts: Artifact[];
  size?: "sm" | "md";
}

const iconMap: Record<string, React.ElementType> = {
  youtube: Youtube,
  x: Twitter,
  github: Github,
  website: Globe,
  substack: BookOpen,
  podcast: Mic,
  article: FileText,
  talk: Presentation,
};

export function ArtifactIconRow({ artifacts, size = "sm" }: ArtifactIconRowProps) {
  const iconSize = size === "sm" ? 16 : 20;
  const seenTypes = new Set<string>();
  const uniqueArtifacts = artifacts.filter((a) => {
    if (seenTypes.has(a.type)) return false;
    seenTypes.add(a.type);
    return true;
  });

  return (
    <div className="flex items-center gap-2">
      {uniqueArtifacts.map((artifact, i) => {
        const Icon = iconMap[artifact.type] || Globe;
        return (
          <a
            key={i}
            href={artifact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-600 transition-colors"
            title={artifact.title}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}

