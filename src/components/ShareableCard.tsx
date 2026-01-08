"use client";

import { useRef, useState } from "react";
import { Creator } from "@/types";
import { Avatar } from "./Avatar";
import { TagChip } from "./TagChip";
import { MapPin, Share2, Twitter, Download, Check, Copy } from "lucide-react";
import { getSignalColor } from "@/lib/utils";
import html2canvas from "html2canvas";

interface ShareableCardProps {
  creator: Creator;
}

export function ShareableCard({ creator }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://newmediamap.xyz/creators/${creator.id}`;
  
  const tweetText = encodeURIComponent(
    `🗺️ Just discovered ${creator.name} on @NewMediaMap\n\n"${creator.editorial_reason}"\n\nSignals: ${creator.signals.slice(0, 3).join(", ")}\n\n${profileUrl}`
  );

  const shareToX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `${creator.id}-newmediamap.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const primaryColor = getSignalColor(creator.primary_signal);

  return (
    <div className="space-y-4">
      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
        >
          <Share2 size={18} />
          Share this creator
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden z-50">
            <button
              onClick={shareToX}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-stone-900 dark:text-stone-100">Share on X</div>
                <div className="text-xs text-stone-500">Post with pre-filled tweet</div>
              </div>
            </button>
            
            <button
              onClick={copyLink}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors border-t border-stone-100 dark:border-stone-700"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-stone-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-stone-900 dark:text-stone-100">
                  {copied ? "Copied!" : "Copy link"}
                </div>
                <div className="text-xs text-stone-500">Share profile URL</div>
              </div>
            </button>
            
            <button
              onClick={downloadCard}
              disabled={isGenerating}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors border-t border-stone-100 dark:border-stone-700"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                <Download size={16} className="text-stone-500" />
              </div>
              <div>
                <div className="font-medium text-stone-900 dark:text-stone-100">
                  {isGenerating ? "Generating..." : "Download card"}
                </div>
                <div className="text-xs text-stone-500">Save as image</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Preview Card */}
      <div className="text-xs text-stone-500 dark:text-stone-400 text-center">
        Preview of shareable card:
      </div>
      
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)`,
          border: `1px solid ${primaryColor}30`,
        }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${primaryColor.replace('#', '')}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar
              name={creator.name}
              avatarUrl={creator.avatar_url}
              primarySignal={creator.primary_signal}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 truncate">
                {creator.name}
              </h3>
              <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-sm mt-1">
                <MapPin size={14} />
                <span>
                  {creator.city ? `${creator.city}, ` : ""}
                  {creator.country}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Reason */}
          <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-4 line-clamp-2">
            "{creator.editorial_reason}"
          </p>

          {/* Signals */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {creator.signals.slice(0, 4).map((signal) => (
              <TagChip key={signal} label={signal} variant="signal" size="sm" />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                newmediamap.xyz
              </span>
            </div>
            <div className="text-xs text-stone-400 dark:text-stone-500">
              Discovered via New Media Map
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

