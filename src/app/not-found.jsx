export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">

        {/* 404 */}
        <div className="text-7xl font-extrabold tracking-tight text-blue-600">
          404
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sorry, the page you are looking for doesn’t exist or may have
          been moved.
        </p>

        {/* Home Button */}
        <a
          href="/"
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
        >
          ← Back to Home
        </a>

      </div>
    </main>
  );
}