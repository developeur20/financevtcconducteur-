import { useState, useEffect, useCallback } from "react";

// ─── PALETTE & STYLES ──────────────────────────────────────────────────────────
const G = {
  primary: "#1D9E75",
  primaryDark: "#0F6E56",
  primaryLight: "#E1F5EE",
  danger: "#E24B4A",
  dangerLight: "#FCEBEB",
  amber: "#EF9F27",
  amberLight: "#FAEEDA",
  blue: "#378ADD",
  blueLight: "#E6F1FB",
  purple: "#7F77DD",
  purpleLight: "#EEEDFE",
  bg: "#F7F9F8",
  card: "#FFFFFF",
  text: "#1A2E26",
  textMuted: "#6B8A7E",
  border: "#D4E8DF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: ${G.bg}; color: ${G.text}; }
  input, button, select { font-family: inherit; }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 4px; }
`;

// ─── MOCK DATA & STORAGE ───────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: "admin", name: "Admin", role: "admin", email: "admin@vtc.sn", password: "admin123", phone: "" },
  { id: "u1", name: "Mamadou Diallo", role: "driver", email: "mamadou@vtc.sn", password: "pass123", phone: "77 123 45 67" },
  { id: "u2", name: "Ibrahima Sow", role: "driver", email: "ibrahima@vtc.sn", password: "pass456", phone: "78 234 56 78" },
];

const INITIAL_TRANSACTIONS = [
  { id: "t1", userId: "u1", type: "revenu", amount: 8500, label: "Course Dakar", time: "08:30", date: today() },
  { id: "t2", userId: "u1", type: "depense", cat: "Carburant", amount: 3000, label: "Carburant", time: "07:15", date: today() },
  { id: "t3", userId: "u1", type: "depense", cat: "Commission", amount: 850, label: "Commission Yango", time: "08:30", date: today() },
  { id: "t4", userId: "u2", type: "revenu", amount: 12000, label: "Course Thiès", time: "09:00", date: today() },
  { id: "t5", userId: "u2", type: "depense", cat: "Carburant", amount: 4500, label: "Carburant", time: "08:00", date: today() },
];

const INITIAL_SAVINGS = [
  { id: "s1", userId: "u1", name: "Nouvelle voiture", goal: 1000000, current: 340000, icon: "🚗" },
  { id: "s2", userId: "u1", name: "Entretien voiture", goal: 100000, current: 70000, icon: "🔧" },
  { id: "s3", userId: "u2", name: "Maison familiale", goal: 5000000, current: 800000, icon: "🏠" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function uid() { return Math.random().toString(36).substr(2, 9); }
function now() { return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
function fmt(n) { return Number(n).toLocaleString("fr-FR"); }

// ─── BILLETS FCFA ──────────────────────────────────────────────────────────────
const BILLETS = [100, 200, 250, 500, 1000, 2000, 5000, 10000];

// ─── ICONS (SVG inline) ────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    trending: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
    wallet: "M21 12V7H5a2 2 0 010-4h14v4M3 7v13a2 2 0 002 2h16a2 2 0 002-2v-5M16 12h.01",
    piggy: "M19 5c-1.5 0-2.5 1-2.5 2.5C16.5 9 17.5 10 19 10s2.5-1 2.5-2.5C21.5 6 20.5 5 19 5zM3 7c0-1.1.9-2 2-2h10a2 2 0 012 2v1a5 5 0 010 10H7l-4 4V12A5 5 0 013 7z",
    chart: "M18 20V10M12 20V4M6 20v-6",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    back: "M19 12H5M12 19l-7-7 7-7",
    check: "M20 6L9 17l-5-5",
    fuel: "M3 22V8l9-5 9 5v14M3 11h18M12 6v16",
    tool: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.55 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012.48 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
    car: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2M7 17a2 2 0 100 4 2 2 0 000-4zM17 17a2 2 0 100 4 2 2 0 000-4z",
    save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
    trash: "M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2",
    add_user: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(paths[name] || "").split("M").filter(Boolean).map((d, i) => <path key={i} d={"M" + d} />)}
    </svg>
  );
};

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "error" ? G.danger : G.primary;
  return (
    <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: bg, color: "#fff", padding: "12px 24px", borderRadius: 40, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: `0 8px 24px ${bg}55`, whiteSpace: "nowrap", animation: "fadeIn .3s ease" }}>
      {msg}
    </div>
  );
}

// ─── BILLET PICKER ─────────────────────────────────────────────────────────────
function BilletPicker({ value, onChange, color = G.primary }) {
  const [manual, setManual] = useState("");
  const add = (v) => { const n = (value || 0) + v; onChange(n); };
  const handleManual = (e) => {
    const v = e.target.value;
    setManual(v);
    if (v) onChange(parseInt(v) || 0);
  };
  return (
    <div>
      <div style={{ background: "#F0FBF7", border: `2px solid ${color}22`, borderRadius: 14, padding: "14px 18px", textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: G.textMuted, marginBottom: 4, fontWeight: 600, letterSpacing: 1 }}>MONTANT FCFA</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: G.text }}>{fmt(value || 0)}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {BILLETS.map(b => (
          <button key={b} onClick={() => add(b)} style={{ flex: "1 1 calc(25% - 8px)", minWidth: 60, padding: "10px 4px", borderRadius: 10, border: `1.5px solid ${color}33`, background: "#fff", color: G.text, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { e.target.style.background = color; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.background = "#fff"; e.target.style.color = G.text; }}>
            {b >= 1000 ? (b / 1000) + "k" : b}
          </button>
        ))}
      </div>
      <input value={manual} onChange={handleManual} type="number" placeholder="Ou taper un montant..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, color: G.text, background: "#fff", outline: "none" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => { onChange(0); setManual(""); }} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${G.border}`, background: "#fff", color: G.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Effacer</button>
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, color = G.primary }) {
  return (
    <div style={{ height: 10, background: "#E8F5EE", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 10, transition: "width .5s" }} />
    </div>
  );
}

// ─── KPI CARD ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, color, icon, sub }) {
  return (
    <div style={{ background: G.card, borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${color}22`, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={16} color={color} />
        </div>
        <span style={{ fontSize: 11, color: G.textMuted, fontWeight: 700, letterSpacing: 0.5 }}>{label}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{fmt(value)}</div>
      {sub && <div style={{ fontSize: 11, color: G.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const handle = () => {
    const user = INITIAL_USERS.find(u => u.email === email && u.password === pass);
    if (user) { setErr(""); onLogin(user); }
    else setErr("Email ou mot de passe incorrect");
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${G.primaryDark} 0%, ${G.primary} 50%, #1DB86A 100%)`, padding: 24 }}>
      <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 24, padding: "10px 20px", marginBottom: 24, border: "1.5px solid rgba(255,255,255,0.25)" }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: 2 }}>🚗 VTC SÉNÉGAL</span>
      </div>
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: G.text, marginBottom: 6 }}>Connexion</h1>
        <p style={{ color: G.textMuted, fontSize: 14, marginBottom: 28 }}>Gérez votre argent facilement</p>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: G.textMuted, marginBottom: 6, letterSpacing: 0.5 }}>EMAIL</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.sn" style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${G.border}`, fontSize: 15, marginBottom: 14, outline: "none", color: G.text }} />
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: G.textMuted, marginBottom: 6, letterSpacing: 0.5 }}>MOT DE PASSE</label>
        <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••" style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${G.border}`, fontSize: 15, marginBottom: 6, outline: "none", color: G.text }} onKeyDown={e => e.key === "Enter" && handle()} />
        {err && <div style={{ color: G.danger, fontSize: 13, marginBottom: 10, fontWeight: 600 }}>{err}</div>}
        <button onClick={handle} style={{ width: "100%", padding: "15px", borderRadius: 14, background: G.primary, color: "#fff", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer", marginTop: 10, boxShadow: `0 8px 24px ${G.primary}55` }}>
          Se connecter
        </button>
        <div style={{ marginTop: 20, padding: 14, background: G.bg, borderRadius: 12, fontSize: 12, color: G.textMuted }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: G.text }}>Comptes de test :</div>
          <div>Admin : admin@vtc.sn / admin123</div>
          <div>Chauffeur : mamadou@vtc.sn / pass123</div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
function NavBar({ page, setPage, isAdmin }) {
  const items = isAdmin
    ? [{ id: "home", icon: "home", label: "Accueil" }, { id: "users", icon: "users", label: "Chauffeurs" }]
    : [
        { id: "home", icon: "home", label: "Accueil" },
        { id: "revenu", icon: "plus", label: "Revenu" },
        { id: "depense", icon: "fuel", label: "Dépense" },
        { id: "epargne", icon: "piggy", label: "Épargne" },
        { id: "rapport", icon: "chart", label: "Rapport" },
      ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: `1.5px solid ${G.border}`, display: "flex", zIndex: 100, padding: "6px 0 10px" }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setPage(it.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "none", background: "none", cursor: "pointer", padding: "6px 4px", transition: "all .15s" }}>
          <div style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: page === it.id ? G.primaryLight : "transparent", transition: "all .2s" }}>
            <Icon name={it.icon} size={20} color={page === it.id ? G.primary : G.textMuted} />
          </div>
          <span style={{ fontSize: 10, fontWeight: page === it.id ? 800 : 600, color: page === it.id ? G.primary : G.textMuted }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── HOME PAGE (DRIVER) ────────────────────────────────────────────────────────
function HomePage({ user, transactions, setPage }) {
  const todayTx = transactions.filter(t => t.userId === user.id && t.date === today());
  const rev = todayTx.filter(t => t.type === "revenu").reduce((s, t) => s + t.amount, 0);
  const dep = todayTx.filter(t => t.type === "depense").reduce((s, t) => s + t.amount, 0);
  const ben = rev - dep;
  const marge = rev > 0 ? Math.round((ben / rev) * 100) : 0;

  const weekData = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const dayRev = transactions.filter(t => t.userId === user.id && t.date === ds && t.type === "revenu").reduce((s, t) => s + t.amount, 0);
    const dayDep = transactions.filter(t => t.userId === user.id && t.date === ds && t.type === "depense").reduce((s, t) => s + t.amount, 0);
    const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
    return { label: days[d.getDay() === 0 ? 6 : d.getDay() - 1], rev: dayRev, dep: dayDep };
  });

  const maxVal = Math.max(...weekData.map(d => d.rev), 1);
  const recentTx = [...todayTx].reverse().slice(0, 5);

  return (
    <div style={{ padding: "0 0 100px" }}>
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${G.primaryDark}, ${G.primary})`, padding: "32px 20px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>Bonjour</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>{user.name}</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>
            {user.name.charAt(0)}
          </div>
        </div>
        <div style={{ marginTop: 20, background: "rgba(255,255,255,0.15)", borderRadius: 18, padding: "18px 20px", backdropFilter: "blur(10px)" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>BÉNÉFICE DU JOUR</div>
          <div style={{ color: "#fff", fontSize: 36, fontWeight: 900, margin: "4px 0" }}>{fmt(ben)} <span style={{ fontSize: 16 }}>FCFA</span></div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div style={{ color: "#9FE1CB", fontSize: 13, fontWeight: 700 }}>↑ {fmt(rev)} revenus</div>
            <div style={{ color: "#FAC775", fontSize: 13, fontWeight: 700 }}>↓ {fmt(dep)} dépenses</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ padding: "0 16px", marginTop: -20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <KpiCard label="REVENUS" value={rev} color={G.primary} icon="trending" sub="Aujourd'hui" />
          <KpiCard label="DÉPENSES" value={dep} color={G.danger} icon="minus" sub="Aujourd'hui" />
          <KpiCard label="MARGE" value={marge + "%"} color={G.amber} icon="chart" sub="Rentabilité" />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: G.text, marginBottom: 12 }}>Actions rapides</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "revenu", icon: "plus", label: "Ajouter revenu", color: G.primary, bg: G.primaryLight },
            { id: "depense", icon: "fuel", label: "Ajouter dépense", color: G.danger, bg: G.dangerLight },
            { id: "epargne", icon: "piggy", label: "Épargne", color: G.blue, bg: G.blueLight },
            { id: "rapport", icon: "chart", label: "Mon rapport", color: G.amber, bg: G.amberLight },
          ].map(a => (
            <button key={a.id} onClick={() => setPage(a.id)} style={{ background: a.bg, border: `1.5px solid ${a.color}22`, borderRadius: 16, padding: "18px 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={a.icon} size={20} color={a.color} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: G.text }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MINI CHART */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ background: G.card, borderRadius: 20, padding: 18, border: `1.5px solid ${G.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: G.text, marginBottom: 14 }}>Revenus cette semaine</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: Math.max(d.rev / maxVal * 70, 4), background: d.label === "Sa" || d.label === "Di" ? G.primaryLight : G.primary, borderRadius: "4px 4px 0 0", opacity: i === 6 ? 1 : 0.7 }} />
                <span style={{ fontSize: 9, color: G.textMuted, fontWeight: 700 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT TX */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: G.text, marginBottom: 12 }}>Transactions du jour</div>
        <div style={{ background: G.card, borderRadius: 20, padding: "4px 0", border: `1.5px solid ${G.border}` }}>
          {recentTx.length === 0 && <div style={{ padding: 24, textAlign: "center", color: G.textMuted, fontSize: 14 }}>Aucune transaction aujourd'hui</div>}
          {recentTx.map((tx, i) => (
            <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < recentTx.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.type === "revenu" ? G.primaryLight : G.dangerLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={tx.type === "revenu" ? "plus" : "fuel"} size={18} color={tx.type === "revenu" ? G.primary : G.danger} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{tx.cat || tx.label}</div>
                <div style={{ fontSize: 11, color: G.textMuted }}>{tx.time}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: tx.type === "revenu" ? G.primary : G.danger }}>
                {tx.type === "revenu" ? "+" : "-"}{fmt(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADD TRANSACTION PAGE ──────────────────────────────────────────────────────
function AddTransactionPage({ user, type, onAdd, onBack, showToast }) {
  const isRev = type === "revenu";
  const [amount, setAmount] = useState(0);
  const [cat, setCat] = useState("");
  const [label, setLabel] = useState("");
  const color = isRev ? G.primary : G.danger;
  const cats = ["Carburant ⛽", "Réparation 🔧", "Commission 📱", "Autre ➕"];

  const submit = () => {
    if (!amount || amount <= 0) { showToast("Entrez un montant !", "error"); return; }
    if (!isRev && !cat) { showToast("Choisissez une catégorie !", "error"); return; }
    onAdd({ id: uid(), userId: user.id, type, amount, cat: cat.split(" ")[0] || "", label: label || (isRev ? "Course" : cat.split(" ")[0]), time: now(), date: today() });
    showToast(isRev ? `+${fmt(amount)} FCFA ajouté !` : `-${fmt(amount)} FCFA enregistré !`);
    onBack();
  };

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ background: isRev ? `linear-gradient(135deg, ${G.primaryDark}, ${G.primary})` : `linear-gradient(135deg, #A32D2D, ${G.danger})`, padding: "32px 20px 32px" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
          <Icon name="back" size={16} color="#fff" /> Retour
        </button>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{isRev ? "💰 Ajouter un revenu" : "⛽ Ajouter une dépense"}</div>
      </div>
      <div style={{ padding: "20px 16px 0" }}>
        {!isRev && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: G.text, marginBottom: 10 }}>Catégorie</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{ padding: "12px 10px", borderRadius: 12, border: `2px solid ${cat === c ? G.danger : G.border}`, background: cat === c ? G.dangerLight : "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", color: cat === c ? G.danger : G.text }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {isRev && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: G.text, marginBottom: 6 }}>Description (optionnel)</div>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="ex: Course Dakar..." style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${G.border}`, fontSize: 14, outline: "none", color: G.text }} />
          </div>
        )}
        <div style={{ fontSize: 13, fontWeight: 800, color: G.text, marginBottom: 10 }}>Montant</div>
        <BilletPicker value={amount} onChange={setAmount} color={color} />
        <button onClick={submit} style={{ width: "100%", padding: "16px", borderRadius: 14, background: color, color: "#fff", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer", marginTop: 16, boxShadow: `0 8px 24px ${color}44` }}>
          {isRev ? "Confirmer le revenu" : "Confirmer la dépense"}
        </button>
      </div>
    </div>
  );
}

// ─── ÉPARGNE PAGE ──────────────────────────────────────────────────────────────
function EpargnePage({ user, savings, setSavings, showToast }) {
  const [adding, setAdding] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [amount, setAmount] = useState(0);
  const [newGoal, setNewGoal] = useState({ name: "", goal: 0, icon: "🏠" });
  const [showNew, setShowNew] = useState(false);
  const userSavings = savings.filter(s => s.userId === user.id);
  const total = userSavings.reduce((s, g) => s + g.current, 0);

  const addToGoal = () => {
    if (!amount || amount <= 0) { showToast("Entrez un montant !", "error"); return; }
    if (!selectedGoal) { showToast("Choisissez un objectif !", "error"); return; }
    setSavings(prev => prev.map(s => s.id === selectedGoal ? { ...s, current: s.current + amount } : s));
    showToast(`+${fmt(amount)} FCFA épargnés !`);
    setAmount(0); setSelectedGoal(null); setAdding(false);
  };

  const createGoal = () => {
    if (!newGoal.name || !newGoal.goal) { showToast("Remplissez tous les champs !", "error"); return; }
    setSavings(prev => [...prev, { id: uid(), userId: user.id, name: newGoal.name, goal: newGoal.goal, current: 0, icon: newGoal.icon }]);
    setNewGoal({ name: "", goal: 0, icon: "🏠" });
    setShowNew(false);
    showToast("Objectif créé !");
  };

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ background: `linear-gradient(135deg, #185FA5, ${G.blue})`, padding: "32px 20px 32px" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>🏦 Mon Épargne</div>
        <div style={{ marginTop: 12, background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700 }}>TOTAL ÉPARGNÉ</div>
          <div style={{ color: "#fff", fontSize: 30, fontWeight: 900 }}>{fmt(total)} FCFA</div>
        </div>
      </div>
      <div style={{ padding: "16px 16px 0" }}>
        {userSavings.map(s => {
          const pct = Math.round((s.current / s.goal) * 100);
          return (
            <div key={s.id} onClick={() => { setSelectedGoal(s.id); setAdding(true); }} style={{ background: G.card, borderRadius: 18, padding: 18, marginBottom: 12, border: `1.5px solid ${G.border}`, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: G.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: G.textMuted }}>Objectif: {fmt(s.goal)} FCFA</div>
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: G.blue }}>{pct}%</div>
              </div>
              <ProgressBar pct={pct} color={pct >= 100 ? G.primary : G.blue} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: G.blue }}>{fmt(s.current)} FCFA</span>
                <span style={{ fontSize: 12, color: G.textMuted }}>Reste: {fmt(Math.max(0, s.goal - s.current))}</span>
              </div>
            </div>
          );
        })}

        {adding && (
          <div style={{ background: G.card, borderRadius: 18, padding: 18, border: `2px solid ${G.blue}`, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: G.text }}>Ajouter à l'épargne</div>
            <BilletPicker value={amount} onChange={setAmount} color={G.blue} />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={() => setAdding(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px solid ${G.border}`, background: "#fff", fontWeight: 700, cursor: "pointer", color: G.textMuted }}>Annuler</button>
              <button onClick={addToGoal} style={{ flex: 2, padding: "12px", borderRadius: 12, background: G.blue, color: "#fff", fontWeight: 800, border: "none", cursor: "pointer" }}>Épargner maintenant</button>
            </div>
          </div>
        )}

        {showNew && (
          <div style={{ background: G.card, borderRadius: 18, padding: 18, border: `2px solid ${G.primary}`, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Nouvel objectif</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {["🚗", "🏠", "📱", "✈️", "💊", "🎓"].map(ic => (
                <button key={ic} onClick={() => setNewGoal(g => ({ ...g, icon: ic }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `2px solid ${newGoal.icon === ic ? G.primary : G.border}`, background: "none", fontSize: 18, cursor: "pointer" }}>{ic}</button>
              ))}
            </div>
            <input value={newGoal.name} onChange={e => setNewGoal(g => ({ ...g, name: e.target.value }))} placeholder="Nom de l'objectif" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, marginBottom: 8, outline: "none", color: G.text }} />
            <input value={newGoal.goal || ""} onChange={e => setNewGoal(g => ({ ...g, goal: parseInt(e.target.value) || 0 }))} type="number" placeholder="Montant cible (FCFA)" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, marginBottom: 10, outline: "none", color: G.text }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "11px", borderRadius: 11, border: `1.5px solid ${G.border}`, background: "#fff", fontWeight: 700, cursor: "pointer", color: G.textMuted }}>Annuler</button>
              <button onClick={createGoal} style={{ flex: 2, padding: "11px", borderRadius: 11, background: G.primary, color: "#fff", fontWeight: 800, border: "none", cursor: "pointer" }}>Créer l'objectif</button>
            </div>
          </div>
        )}

        {!showNew && (
          <button onClick={() => setShowNew(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, border: `2px dashed ${G.border}`, background: "none", color: G.primary, fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon name="plus" size={18} color={G.primary} /> Nouvel objectif
          </button>
        )}
      </div>
    </div>
  );
}

// ─── RAPPORT PAGE ──────────────────────────────────────────────────────────────
function RapportPage({ user, transactions }) {
  const [period, setPeriod] = useState("jour");
  const myTx = transactions.filter(t => t.userId === user.id);
  let filtered = myTx;
  if (period === "jour") filtered = myTx.filter(t => t.date === today());
  if (period === "semaine") {
    const d7 = new Date(); d7.setDate(d7.getDate() - 7);
    filtered = myTx.filter(t => new Date(t.date) >= d7);
  }
  const rev = filtered.filter(t => t.type === "revenu").reduce((s, t) => s + t.amount, 0);
  const dep = filtered.filter(t => t.type === "depense").reduce((s, t) => s + t.amount, 0);
  const ben = rev - dep;
  const marge = rev > 0 ? Math.round((ben / rev) * 100) : 0;

  const catMap = {};
  filtered.filter(t => t.type === "depense").forEach(t => { catMap[t.cat] = (catMap[t.cat] || 0) + t.amount; });
  const catItems = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const catColors = { Carburant: G.danger, Commission: G.blue, Réparation: G.amber, Autre: G.purple };

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ background: `linear-gradient(135deg, #854F0B, ${G.amber})`, padding: "32px 20px 32px" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>📊 Mon Rapport</div>
      </div>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["jour", "semaine", "mois"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ flex: 1, padding: "10px 6px", borderRadius: 12, border: `2px solid ${period === p ? G.amber : G.border}`, background: period === p ? G.amberLight : "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer", color: period === p ? "#854F0B" : G.textMuted, textTransform: "capitalize" }}>
              {p === "jour" ? "Aujourd'hui" : p === "semaine" ? "7 jours" : "Ce mois"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <KpiCard label="REVENUS" value={rev} color={G.primary} icon="trending" />
          <KpiCard label="DÉPENSES" value={dep} color={G.danger} icon="minus" />
          <KpiCard label="BÉNÉFICE" value={ben} color={ben >= 0 ? G.primary : G.danger} icon="wallet" />
          <KpiCard label="MARGE" value={marge + "%"} color={G.amber} icon="chart" />
        </div>

        {catItems.length > 0 && (
          <div style={{ background: G.card, borderRadius: 18, padding: 18, border: `1.5px solid ${G.border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: G.text }}>Dépenses par catégorie</div>
            {catItems.map(([c, v]) => (
              <div key={c} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{c}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: catColors[c] || G.primary }}>{fmt(v)} FCFA</span>
                </div>
                <ProgressBar pct={dep > 0 ? Math.round((v / dep) * 100) : 0} color={catColors[c] || G.primary} />
              </div>
            ))}
          </div>
        )}

        <div style={{ background: G.card, borderRadius: 18, padding: 18, border: `1.5px solid ${G.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: G.text }}>Toutes les transactions</div>
          {filtered.length === 0 && <div style={{ color: G.textMuted, textAlign: "center", padding: 20, fontSize: 14 }}>Aucune transaction</div>}
          {[...filtered].reverse().map((tx, i) => (
            <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < filtered.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === "revenu" ? G.primaryLight : G.dangerLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={tx.type === "revenu" ? "plus" : "minus"} size={16} color={tx.type === "revenu" ? G.primary : G.danger} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{tx.cat || tx.label}</div>
                <div style={{ fontSize: 10, color: G.textMuted }}>{tx.date} {tx.time}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: tx.type === "revenu" ? G.primary : G.danger }}>
                {tx.type === "revenu" ? "+" : "-"}{fmt(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage({ users, setUsers, transactions, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const drivers = users.filter(u => u.role === "driver");

  const genPass = () => {
    const p = "vtc" + Math.random().toString(36).substr(2, 5);
    setForm(f => ({ ...f, password: p }));
  };

  const createUser = () => {
    if (!form.name || !form.email || !form.password) { showToast("Remplissez tous les champs !", "error"); return; }
    if (users.find(u => u.email === form.email)) { showToast("Email déjà utilisé !", "error"); return; }
    setUsers(prev => [...prev, { id: uid(), role: "driver", ...form }]);
    setForm({ name: "", email: "", phone: "", password: "" });
    setShowForm(false);
    showToast("Chauffeur créé !");
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast("Compte supprimé");
  };

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ background: `linear-gradient(135deg, ${G.primaryDark}, ${G.primary})`, padding: "32px 20px 32px" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>👥 Gestion Chauffeurs</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 }}>{drivers.length} chauffeur(s) enregistré(s)</div>
      </div>
      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={() => setShowForm(!showForm)} style={{ width: "100%", padding: "14px", borderRadius: 14, background: G.primary, color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <Icon name="add_user" size={18} color="#fff" /> Nouveau chauffeur
        </button>

        {showForm && (
          <div style={{ background: G.card, borderRadius: 18, padding: 20, border: `2px solid ${G.primary}`, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Créer un compte</div>
            {[["Nom complet", "name", "text", "Mamadou Diallo"], ["Email", "email", "email", "chauffeur@vtc.sn"], ["Téléphone", "phone", "tel", "77 000 00 00"]].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: G.textMuted, display: "block", marginBottom: 4, letterSpacing: 0.5 }}>{label.toUpperCase()}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} type={type} placeholder={ph} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, outline: "none", color: G.text }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: G.textMuted, display: "block", marginBottom: 4, letterSpacing: 0.5 }}>MOT DE PASSE</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mot de passe" style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, outline: "none", color: G.text }} />
                <button onClick={genPass} style={{ padding: "11px 14px", borderRadius: 10, background: G.primaryLight, color: G.primary, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>Auto</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px solid ${G.border}`, background: "#fff", fontWeight: 700, cursor: "pointer", color: G.textMuted }}>Annuler</button>
              <button onClick={createUser} style={{ flex: 2, padding: "12px", borderRadius: 12, background: G.primary, color: "#fff", fontWeight: 800, border: "none", cursor: "pointer" }}>Créer le compte</button>
            </div>
          </div>
        )}

        {drivers.map(d => {
          const dTx = transactions.filter(t => t.userId === d.id && t.date === today());
          const dRev = dTx.filter(t => t.type === "revenu").reduce((s, t) => s + t.amount, 0);
          const dDep = dTx.filter(t => t.type === "depense").reduce((s, t) => s + t.amount, 0);
          return (
            <div key={d.id} style={{ background: G.card, borderRadius: 18, padding: 18, marginBottom: 12, border: `1.5px solid ${G.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: G.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: G.primary }}>
                  {d.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: G.text }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: G.textMuted }}>{d.email}</div>
                  {d.phone && <div style={{ fontSize: 12, color: G.textMuted }}>{d.phone}</div>}
                </div>
                <button onClick={() => deleteUser(d.id)} style={{ width: 36, height: 36, borderRadius: 10, background: G.dangerLight, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="trash" size={16} color={G.danger} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, padding: "10px 0", borderTop: `1px solid ${G.border}` }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700 }}>REVENUS</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: G.primary }}>{fmt(dRev)}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", borderLeft: `1px solid ${G.border}` }}>
                  <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700 }}>DÉPENSES</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: G.danger }}>{fmt(dDep)}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", borderLeft: `1px solid ${G.border}` }}>
                  <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700 }}>BÉNÉFICE</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: dRev - dDep >= 0 ? G.primary : G.danger }}>{fmt(dRev - dDep)}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, background: G.bg, borderRadius: 10, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: G.textMuted }}>Mot de passe: <span style={{ fontWeight: 700, color: G.text }}>{d.password}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ADMIN HOME ────────────────────────────────────────────────────────────────
function AdminHome({ users, transactions }) {
  const drivers = users.filter(u => u.role === "driver");
  const todayTx = transactions.filter(t => t.date === today());
  const totalRev = todayTx.filter(t => t.type === "revenu").reduce((s, t) => s + t.amount, 0);
  const totalDep = todayTx.filter(t => t.type === "depense").reduce((s, t) => s + t.amount, 0);
  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ background: `linear-gradient(135deg, ${G.primaryDark}, ${G.primary})`, padding: "32px 20px 40px" }}>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>Tableau de bord</div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>Administration VTC</div>
      </div>
      <div style={{ padding: "16px 16px 0", marginTop: -16 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <KpiCard label="CHAUFFEURS" value={drivers.length} color={G.primary} icon="users" sub="Actifs" />
          <KpiCard label="REVENUS" value={totalRev} color={G.amber} icon="trending" sub="Aujourd'hui" />
          <KpiCard label="BÉNÉFICE" value={totalRev - totalDep} color={G.blue} icon="chart" sub="Net" />
        </div>
        <div style={{ background: G.card, borderRadius: 18, padding: 18, border: `1.5px solid ${G.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: G.text }}>Performance du jour</div>
          {drivers.map(d => {
            const dTx = transactions.filter(t => t.userId === d.id && t.date === today());
            const dRev = dTx.filter(t => t.type === "revenu").reduce((s, t) => s + t.amount, 0);
            const dDep = dTx.filter(t => t.type === "depense").reduce((s, t) => s + t.amount, 0);
            const marge = dRev > 0 ? Math.round(((dRev - dDep) / dRev) * 100) : 0;
            return (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: G.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: G.primary }}>{d.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: G.text }}>{d.name}</div>
                  <ProgressBar pct={marge} color={marge > 50 ? G.primary : G.amber} />
                  <div style={{ fontSize: 10, color: G.textMuted, marginTop: 2 }}>Marge {marge}%</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: G.primary }}>{fmt(dRev)}</div>
                  <div style={{ fontSize: 10, color: G.textMuted }}>FCFA</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [savings, setSavings] = useState(INITIAL_SAVINGS);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 2500);
  }, []);

  const addTransaction = (tx) => setTransactions(prev => [...prev, tx]);
  const handleLogout = () => { setUser(null); setPage("home"); };

  if (!user) return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={u => { setUser(u); setPage("home"); }} />
    </>
  );

  const isAdmin = user.role === "admin";

  return (
    <>
      <style>{css}</style>
      <Toast msg={toast.msg} type={toast.type} />
      <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", minHeight: "100vh", background: G.bg }}>
        {/* Logout button */}
        <button onClick={handleLogout} style={{ position: "fixed", top: 16, right: 16, zIndex: 200, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: `1.5px solid ${G.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <Icon name="logout" size={16} color={G.textMuted} />
        </button>

        {isAdmin ? (
          <>
            {page === "home" && <AdminHome users={users} transactions={transactions} />}
            {page === "users" && <AdminPage users={users} setUsers={setUsers} transactions={transactions} showToast={showToast} />}
          </>
        ) : (
          <>
            {page === "home" && <HomePage user={user} transactions={transactions} setPage={setPage} />}
            {page === "revenu" && <AddTransactionPage user={user} type="revenu" onAdd={addTransaction} onBack={() => setPage("home")} showToast={showToast} />}
            {page === "depense" && <AddTransactionPage user={user} type="depense" onAdd={addTransaction} onBack={() => setPage("home")} showToast={showToast} />}
            {page === "epargne" && <EpargnePage user={user} savings={savings} setSavings={setSavings} showToast={showToast} />}
            {page === "rapport" && <RapportPage user={user} transactions={transactions} />}
          </>
        )}

        <NavBar page={page} setPage={setPage} isAdmin={isAdmin} />
      </div>
    </>
  );
}
