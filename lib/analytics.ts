export async function track(event: string, props?: Record<string, unknown>) {
  try { await fetch("/api/analytics",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ event, props, at: new Date().toISOString() })}); } catch {}
}