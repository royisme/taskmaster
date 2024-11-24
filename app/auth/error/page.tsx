// app/auth/error/page.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    default: "An error occurred during authentication.",
    configuration: "There is a problem with the server configuration.",
    accessdenied: "You do not have permission to sign in.",
    verification: "The verification link may have expired or has already been used.",
  };

  const message = error ? errorMessages[error as keyof typeof errorMessages] : errorMessages.default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        <Link
          href="/auth/signin"
          className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
        >
          Try Again
        </Link>

        <Link
          href="/"
          className="inline-block text-sm text-teal-600 hover:text-teal-500"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}