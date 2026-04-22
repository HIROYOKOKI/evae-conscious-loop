<div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
  <Link
    href="/demo/safe?resolved=1"
    className="inline-flex h-[72px] w-full items-center justify-center gap-3 rounded-[20px] bg-[#FF4500] px-6 text-xl font-semibold text-white shadow-sm transition hover:opacity-95"
  >
    <RefreshIcon />
    <span>{blockMock.actions.primary}</span>
  </Link>

  <button
    type="button"
    className="inline-flex h-[72px] w-full items-center justify-center gap-3 rounded-[20px] border border-orange-300 bg-white px-6 text-xl font-semibold text-[#FF4500] transition hover:bg-orange-50"
  >
    <UserIcon />
    <span>{blockMock.actions.secondary}</span>
  </button>

  <button
    type="button"
    className="inline-flex h-[72px] w-full items-center justify-center gap-3 rounded-[20px] border border-red-300 bg-white px-6 text-xl font-semibold text-[#DC2626] transition hover:bg-red-50"
  >
    <TriangleAlertIcon className="h-7 w-7" />
    <span>{blockMock.actions.danger}</span>
  </button>

  <div className="xl:col-span-3">
    <div className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-[15px] font-semibold text-[#DC2626]">
      <TriangleAlertIcon className="h-5 w-5" />
      <span>{blockMock.overrideWarning}</span>
    </div>
  </div>
</div>
