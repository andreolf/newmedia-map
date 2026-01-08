"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
  className?: string;
  variant?: "default" | "compact";
}

export function AuthButton({ className, variant = "default" }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={cn("w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 animate-pulse", className)} />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {variant === "default" && (
          <div className="flex items-center gap-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                <User size={16} className="text-stone-500" />
              </div>
            )}
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 hidden sm:inline">
              @{(session.user as { twitterHandle?: string }).twitterHandle || session.user.name}
            </span>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
            "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800",
            className
          )}
        >
          <LogOut size={16} />
          {variant === "default" && <span>Sign out</span>}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("twitter")}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
        "bg-black dark:bg-white text-white dark:text-black hover:bg-stone-800 dark:hover:bg-stone-200",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>Sign in with X</span>
    </button>
  );
}

