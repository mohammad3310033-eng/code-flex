export default function LoadingBrands() {
  return <div className="animate-pulse"><div className="h-8 w-52 rounded-lg bg-black/8" /><div className="mt-7 grid gap-3 xl:grid-cols-[minmax(0,1fr)_24rem]"><div className="space-y-2">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-20 rounded-xl bg-black/6" />)}</div><div className="h-52 rounded-2xl bg-black/6" /></div></div>;
}
