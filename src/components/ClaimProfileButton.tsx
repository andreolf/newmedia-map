"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { CheckCircle, Shield, Loader2, AlertCircle } from "lucide-react";
import { Creator } from "@/types";

interface ClaimProfileButtonProps {
  creator: Creator;
}

export function ClaimProfileButton({ creator }: ClaimProfileButtonProps) {
  const { data: session, status } = useSession();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error" | "mismatch">("idle");

  // Check if user's Twitter handle matches the creator's X artifact
  const userTwitterHandle = (session?.user as { twitterHandle?: string })?.twitterHandle?.toLowerCase();
  const creatorXArtifact = creator.artifacts.find((a) => a.type === "x");
  const creatorTwitterHandle = creatorXArtifact?.url
    ?.replace("https://x.com/", "")
    ?.replace("https://twitter.com/", "")
    ?.replace("@", "")
    ?.toLowerCase();

  const handlesMatch = userTwitterHandle && creatorTwitterHandle && userTwitterHandle === creatorTwitterHandle;

  const handleClaim = async () => {
    if (!session) {
      signIn("twitter");
      return;
    }

    if (!handlesMatch) {
      setClaimStatus("mismatch");
      return;
    }

    setIsClaiming(true);
    setClaimStatus("idle");

    try {
      // In production, this would call an API to claim the profile
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store claim in localStorage for demo
      const claims = JSON.parse(localStorage.getItem("nmm_claims") || "{}");
      claims[creator.id] = {
        userId: session.user?.email || userTwitterHandle,
        claimedAt: new Date().toISOString(),
      };
      localStorage.setItem("nmm_claims", JSON.stringify(claims));
      
      setClaimStatus("success");
    } catch {
      setClaimStatus("error");
    } finally {
      setIsClaiming(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  if (claimStatus === "success") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">Profile claimed successfully!</span>
      </div>
    );
  }

  if (claimStatus === "mismatch") {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">Handle mismatch</span>
        </div>
        <p className="text-sm text-amber-600 dark:text-amber-500">
          Your X handle (@{userTwitterHandle}) doesn't match this profile's X handle (@{creatorTwitterHandle}). 
          Please sign in with the correct account or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Shield size={18} className="text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Is this you?
        </span>
      </div>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
        {session 
          ? `Verify ownership by confirming your X handle matches @${creatorTwitterHandle || "this profile"}.`
          : "Sign in with X to claim and manage this profile."}
      </p>
      <button
        onClick={handleClaim}
        disabled={isClaiming}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isClaiming ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Claiming...
          </>
        ) : session ? (
          "Claim this profile"
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Sign in to claim
          </>
        )}
      </button>
      {claimStatus === "error" && (
        <p className="text-sm text-red-500 mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}

