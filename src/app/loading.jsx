export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center text-center">

        {/* Logo */}
        <div className="relative mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-200">
            <span className="text-2xl">🏠</span>
          </div>

          {/* Pulse */}
          <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-400 opacity-20" />
        </div>

        {/* Brand */}
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Roommate<span className="text-blue-600">Finder</span>
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Finding your perfect place & roommate
        </p>

        {/* Loader */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
        </div>

        <p className="mt-2 text-[11px] font-medium text-slate-400">
          Please wait...
        </p>

      </div>
    </main>
  );
}