"use client";

import {
  Wallet,
  Shield,
  Lock,
  Server,
  Palette,
  GraduationCap,
  FlaskConical,
  TrendingUp,
  Users,
  Image,
  Gamepad2,
  MessageCircle,
  Fingerprint,
  Cpu,
  Zap,
} from "lucide-react";
import { cn, getSignalColor } from "@/lib/utils";

interface SignalIconProps {
  signal: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

const iconMap: Record<string, React.ElementType> = {
  wallets: Wallet,
  aa: Zap,
  zk: Lock,
  infra: Server,
  ux: Palette,
  education: GraduationCap,
  research: FlaskConical,
  defi: TrendingUp,
  security: Shield,
  privacy: Lock,
  dao: Users,
  nft: Image,
  gaming: Gamepad2,
  social: MessageCircle,
  identity: Fingerprint,
};

const signalLabels: Record<string, string> = {
  wallets: "Wallets",
  aa: "AA",
  zk: "ZK",
  infra: "Infra",
  ux: "UX",
  education: "Edu",
  research: "Research",
  defi: "DeFi",
  security: "Security",
  privacy: "Privacy",
  dao: "DAO",
  nft: "NFT",
  gaming: "Gaming",
  social: "Social",
  identity: "Identity",
};

export function SignalIcon({ signal, selected = false, onClick, size = "md" }: SignalIconProps) {
  const Icon = iconMap[signal] || Cpu;
  const color = getSignalColor(signal);
  const label = signalLabels[signal] || signal;

  const sizeClasses = size === "sm"
    ? "w-14 h-14 text-[10px]"
    : "w-16 h-16 text-xs";

  const iconSize = size === "sm" ? 20 : 24;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl transition-all flex-shrink-0",
        sizeClasses,
        !selected && "hover:bg-[--muted] text-[--muted-foreground]"
      )}
      style={{
        backgroundColor: selected ? `${color}20` : undefined,
        color: selected ? color : undefined,
        boxShadow: selected ? `0 0 0 2px ${color}, 0 0 20px ${color}30` : undefined,
      }}
      title={label}
    >
      <Icon size={iconSize} />
      <span className="mt-0.5 font-medium">{label}</span>
    </button>
  );
}
