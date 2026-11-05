"use client";
import { useEffect, useMemo, useState } from "react";
import { ApplicationRow, statuses } from "../../lib/application";
export default function Dashboard() {
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<ApplicationRow | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("received");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/applications", { cache: "no-store" });
      const d = (await r.json()) as {
        error?: string;
        applications?: ApplicationRow[];
      };
      if (!r.ok) throw new Error(d.error);
      setRows(d.applications || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    async function initialLoad() {
      try {
        const r = await fetch("/api/applications", {
          cache: "no-store",
          signal: controller.signal,
        });
        const d = (await r.json()) as {
          error?: string;
          applications?: ApplicationRow[];
        };
        if (!r.ok) throw new Error(d.error);
        if (!controller.signal.aborted) setRows(d.applications || []);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(
            e instanceof Error ? e.message : "Could not load applications.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void initialLoad();
    return () => controller.abort();
  }, []);
  const shown = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          `${r.fullName} ${r.company} ${r.email} ${r.city} ${r.state}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [rows, query, filter],
  );
  function choose(r: ApplicationRow) {
    setSelected(r);
    setNotes(r.notes);
    setStatus(r.status);
    setNotice("");
  }
  async function save() {
    if (!selected) return;
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch(`/api/applications/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const d = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(d.error);
      const next = { ...selected, status, notes };
      setRows((p) => p.map((x) => (x.id === next.id ? next : x)));
      setSelected(next);
      setNotice("Saved. No email was sent.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not save changes.");
    } finally {
      setBusy(false);
    }
  }
  const statusLabel = (s: string) => statuses[s as keyof typeof statuses] || s;
  return (
    <>
      <div className="admin-toolbar">
        <input
          aria-label="Search applications"
          placeholder="Search owner, firm or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Filter applications by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All stages</option>
          {Object.entries(statuses).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <button className="button outline" onClick={load} disabled={loading}>
          Refresh
        </button>
        <a className="button" href="/api/applications?format=csv" download>
          Export CSV
        </a>
      </div>
      <p className="admin-total" style={{ marginBottom: 15 }}>
        {shown.length} SHOWN / {rows.length} APPLICATIONS
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-empty">Loading applications…</p>
        ) : !shown.length ? (
          <p className="admin-empty">
            {rows.length
              ? "No applications match your filters."
              : "Your first application will appear here. The list is ready."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>OWNER / FIRM</th>
                <th>LOCATION</th>
                <th>SIZE</th>
                <th>STAGE</th>
                <th>RECEIVED</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button onClick={() => choose(r)}>{r.company}</button>
                    <small>
                      {r.fullName} · {r.role}
                    </small>
                  </td>
                  <td>
                    {r.city}, {r.state}
                  </td>
                  <td>
                    {r.revenue}
                    <small>{r.team} people</small>
                  </td>
                  <td>
                    <span className="status-pill">{statusLabel(r.status)}</span>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selected && (
        <section className="admin-detail" aria-label="Selected application">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
              <p className="eyebrow">APPLICATION DETAIL</p>
              <h2>{selected.company}</h2>
            </div>
            <button className="form-back" onClick={() => setSelected(null)}>
              Close ×
            </button>
          </div>
          <dl className="review-list">
            {[
              ["OWNER", `${selected.fullName} · ${selected.role}`],
              ["EMAIL", selected.email],
              ["PHONE", selected.phone || "Not provided"],
              ["LOCATION", `${selected.city}, ${selected.state}`],
              ["WEBSITE", selected.website || "Not provided"],
              [
                "REVENUE / TEAM",
                `${selected.revenue} · ${selected.team} people`,
              ],
              ["SERVICE AREA", selected.serviceArea],
              [
                "SERVICES",
                (() => {
                  try {
                    return JSON.parse(selected.services).join(", ");
                  } catch {
                    return selected.services;
                  }
                })(),
              ],
              ["SHARING", selected.sharing],
              ["SOURCE", selected.source || "Direct"],
              ["REFERENCE", selected.id],
              ["BUSINESS QUESTION", selected.challenge],
            ].map(([a, b]) => (
              <div key={a} className={a === "BUSINESS QUESTION" ? "wide" : ""}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
          <label className="field">
            <span>Application stage</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(statuses).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="field" style={{ marginTop: 20 }}>
            <span>Private organiser notes</span>
            <textarea
              maxLength={5000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Group fit, competitor overlap and next conversation…"
            />
          </label>
          <div className="form-actions">
            <button className="button" onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save review"}
            </button>
            <a
              className="button outline"
              href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent("Your Field Council application")}&body=${encodeURIComponent(`Hi ${selected.fullName.split(" ")[0]},\n\nThanks for applying to Field Council. I’d like to learn more about ${selected.company} and what you’re looking for in an owners’ group.\n\nWould you be available for a short conversation? Please send a couple of times that suit you, including your time zone.\n\nThanks`)}`}
            >
              Draft a fit-call email ↗
            </a>
          </div>
          <p className="micro" style={{ marginTop: 15 }}>
            The email opens in your mail app for review. No booking link has
            been added yet.
          </p>
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
        </section>
      )}
    </>
  );
}
