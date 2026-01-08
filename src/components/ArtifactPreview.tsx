"use client";

import { useState } from "react";
import { Artifact } from "@/types";
import {
  Youtube,
  Twitter,
  Github,
  Globe,
  BookOpen,
  Mic,
  FileText,
  Presentation,
  ExternalLink,
  Play,
  Star,
  GitFork,
} from "lucide-react";

interface ArtifactPreviewProps {
  artifact: Artifact;
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

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract GitHub repo info from URL
function getGitHubInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) return { owner: match[1], repo: match[2] };
  return null;
}

function YouTubePreview({ artifact }: { artifact: Artifact }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const videoId = getYouTubeId(artifact.url);

  if (!videoId) {
    return <DefaultPreview artifact={artifact} />;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (showEmbed) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowEmbed(true)}
      className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer w-full"
    >
      <img
        src={thumbnailUrl}
        alt={artifact.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to lower quality thumbnail
          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-medium text-sm truncate">{artifact.title}</p>
      </div>
    </button>
  );
}

function GitHubPreview({ artifact }: { artifact: Artifact }) {
  const info = getGitHubInfo(artifact.url);

  if (!info) {
    return <DefaultPreview artifact={artifact} />;
  }

  return (
    <a
      href={artifact.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-stone-900 dark:bg-stone-950 rounded-xl text-white hover:bg-stone-800 dark:hover:bg-stone-900 transition-colors group"
    >
      <div className="flex items-center gap-3 mb-3">
        <Github size={24} />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-stone-400">{info.owner}</div>
          <div className="font-semibold truncate">{info.repo}</div>
        </div>
        <ExternalLink size={16} className="text-stone-500 group-hover:text-stone-300" />
      </div>
      <p className="text-sm text-stone-300 line-clamp-2">{artifact.title}</p>
      <div className="flex items-center gap-4 mt-3 text-sm text-stone-400">
        <div className="flex items-center gap-1">
          <Star size={14} />
          <span>—</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork size={14} />
          <span>—</span>
        </div>
      </div>
    </a>
  );
}

function TwitterPreview({ artifact }: { artifact: Artifact }) {
  return (
    <a
      href={artifact.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 dark:hover:border-stone-600 transition-colors group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-stone-900 dark:text-stone-100 truncate">{artifact.title}</div>
          <div className="text-sm text-stone-500">X / Twitter</div>
        </div>
        <ExternalLink size={16} className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" />
      </div>
    </a>
  );
}

function DefaultPreview({ artifact }: { artifact: Artifact }) {
  const Icon = iconMap[artifact.type] || Globe;

  return (
    <a
      href={artifact.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center group-hover:bg-stone-200 dark:group-hover:bg-stone-600 transition-colors">
          <Icon size={24} className="text-stone-500 dark:text-stone-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-stone-900 dark:text-stone-100 truncate">
            {artifact.title}
          </div>
          <div className="text-sm text-stone-400 dark:text-stone-500 capitalize">
            {artifact.type}
          </div>
        </div>
        <ExternalLink
          size={16}
          className="text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors"
        />
      </div>
    </a>
  );
}

export function ArtifactPreview({ artifact }: ArtifactPreviewProps) {
  switch (artifact.type) {
    case "youtube":
      return <YouTubePreview artifact={artifact} />;
    case "github":
      return <GitHubPreview artifact={artifact} />;
    case "x":
      return <TwitterPreview artifact={artifact} />;
    default:
      return <DefaultPreview artifact={artifact} />;
  }
}

