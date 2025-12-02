'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke monitoring service (Sentry, dll) di sini jika ada
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Something went wrong!</h2>
      <p className="text-slate-500">{error.message}</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        variant="destructive"
      >
        Try again
      </Button>
    </div>
  );
}