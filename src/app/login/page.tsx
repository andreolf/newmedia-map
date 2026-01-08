"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthButton } from "@/components/AuthButton";
import { ArrowLeft, AlertCircle } from "lucide-react";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/creators";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <Header />

      <div className="max-w-md mx-auto px-4 py-16">
        <Link
          href="/creators"
          className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-8"
        >
          <ArrowLeft size={16} />
          Back to directory
        </Link>

        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 p-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Sign in to New Media Map
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mb-6">
            Connect your X account to submit your profile, claim existing profiles, and sync your saved creators.
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>
                {error === "OAuthAccountNotLinked"
                  ? "This account is already linked to another user."
                  : "Something went wrong. Please try again."}
              </span>
            </div>
          )}

          <AuthButton />

          <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
              Why sign in?
            </h3>
            <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Submit your own creator profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Claim and edit existing profiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Sync saved creators across devices</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-6">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-stone-400">Loading...</div>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
