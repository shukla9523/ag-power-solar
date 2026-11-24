import Link from "next/link"

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-2xl mb-4">
        404
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Admin Resource Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The requested admin page, record, or settings could not be found or may have been deleted.
      </p>
      <Link
        href="/admin"
        className="rounded-xl bg-brand hover:bg-brand-hover px-5 py-2.5 text-[13px] font-bold text-white transition-all shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
