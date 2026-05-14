import { useState } from "react";

const SCORES = [
  { val: 1, label: "No cumple", color: "#ef4444" },
  { val: 2, label: "Cumple parcialmente", color: "#f97316" },
  { val: 3, label: "Cumple", color: "#eab308" },
  { val: 4, label: "Supera lo esperado", color: "#22c55e" },
  { val: 5, label: "Desempeño destacado", color: "#3b82f6" },
];

const SECTIONS = [
  { id: "responsabilidad", title: "RESPONSABILIDAD", items: ["Asistencia y puntualidad", "Actitud para completar tareas según metas y plazos"] },
  { id: "resultados", title: "RESULTADOS COMERCIALES", items: ["Cumplimiento de objetivos de ventas", "Volumen de operaciones generadas", "Mix de productos (0km, usados, consignación, etc.)", "Capacidad de cierre"] },
  { id: "gestion", title: "GESTIÓN DEL PROCESO DE VENTA", items: ["Seguimiento de oportunidades", "Orden y actualización de información (AppSheet / Kommo)", "Cumplimiento de procesos comerciales", "Calidad del pipeline"] },
  { id: "captacion", title: "CAPTACIÓN Y DESARROLLO COMERCIAL", items: ["Generación de nuevos clientes", "Trabajo con Leads (Kommo)", "Proactividad comercial", "Desarrollo de referidos"] },
  { id: "atencion", title: "CALIDAD DE ATENCIÓN AL CLIENTE", items: ["Trato y comunicación", "Claridad en la información", "Seguimiento post contacto", "Experiencia general del cliente"] },
  { id: "disciplina", title: "CUMPLIMIENTO Y DISCIPLINA COMERCIAL", items: ["Respeto de procesos", "Cumplimiento de tareas", "Puntualidad y compromiso", "Uso correcto de herramientas"] },
  { id: "actitud", title: "ACTITUD Y PERFIL COMERCIAL", items: ["Proactividad", "Orientación a resultados", "Adaptabilidad", "Actitud frente a desafíos"] },
  { id: "equipo", title: "TRABAJO EN EQUIPO Y RELACIÓN INTERNA", items: ["Relación con el equipo comercial", "Coordinación con otras áreas", "Colaboración", "Actitud frente al equipo"] },
];

const OPEN_EMPLEADO = [
  { id: "fortalezas", label: "¿Cuáles considerás tus principales fortalezas?" },
  { id: "mejora", label: "¿En qué aspectos creés que podés mejorar?" },
  { id: "necesitas", label: "¿Qué necesitás para mejorar tu desempeño?" },
];

const OPEN_JEFE = [
  { id: "fortalezas", label: "Fortalezas principales del colaborador" },
  { id: "mejora", label: "Aspectos a mejorar" },
  { id: "autonomia", label: "Nivel de autonomía" },
  { id: "potencial", label: "Potencial de desarrollo" },
  { id: "objetivos", label: "Objetivos de mejora (Plan de Acción)" },
  { id: "acciones", label: "Acciones concretas (Plan de Acción)" },
  { id: "seguimiento", label: "Seguimiento (Plan de Acción)" },
];

function scoreAvg(scores) {
  const vals = Object.values(scores).filter((v) => v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function performanceLevel(avg) {
  if (avg >= 4.5) return { label: "🟢 ALTO", color: "#22c55e" };
  if (avg >= 3)   return { label: "🟡 MEDIO", color: "#eab308" };
  return               { label: "🔴 BAJO",  color: "#ef4444" };
}

function buildContent(role, datos, scores, comments, open) {
  const openQ = role === "empleado" ? OPEN_EMPLEADO : OPEN_JEFE;
  const avg   = scoreAvg(scores);
  const level = avg > 0 ? performanceLevel(avg) : null;
  const date  = new Date().toLocaleDateString("es-AR");
  const sep   = "=".repeat(60);
  let t = `EVALUACIÓN DE DESEMPEÑO - TUTU AUTOMOTORES\n`;
  t += `Tipo: ${role === "empleado" ? "Autoevaluación (Empleado)" : "Evaluación por Jefe"}\n`;
  t += `Fecha: ${date}\n${sep}\n\n`;
  t += `DATOS DEL COLABORADOR\n`;
  t += `Nombre y Apellido : ${datos.nombre}\n`;
  t += `Puesto            : ${datos.puesto}\n`;
  t += `Fecha de Ingreso  : ${datos.fechaIngreso}\n`;
  t += `Evaluador         : ${datos.evaluador}\n`;
  t += `Período Evaluado  : ${datos.periodo}\n\n${sep}\n`;
  t += `ÁREAS DE DESEMPEÑO\n${sep}\n\n`;
  SECTIONS.forEach((sec) => {
    t += `[${sec.title}]\n`;
    sec.items.forEach((item) => {
      const val  = scores[`${sec.id}_${item}`] || 0;
      const desc = SCORES.find((s) => s.val === val)?.label || "Sin puntaje";
      t += `  ${item}\n    → ${val > 0 ? `${val} - ${desc}` : "Sin selección"}\n`;
    });
    if (comments[sec.id]) t += `  Comentarios: ${comments[sec.id]}\n`;
    t += "\n";
  });
  t += `${sep}\nRESULTADO FINAL\n${sep}\n`;
  t += `Promedio General   : ${avg.toFixed(2)}\n`;
  if (level) t += `Nivel de Desempeño : ${level.label}\n`;
  t += `\n${sep}\nPREGUNTAS ABIERTAS\n${sep}\n`;
  openQ.forEach((q) => { t += `\n${q.label}:\n${open[q.id] || "(Sin respuesta)"}\n`; });
  return t;
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [screen,   setScreen]   = useState("home");
  const [role,     setRole]     = useState(null);
  const [password, setPassword] = useState("");
  const [pwError,  setPwError]  = useState("");
  const [submitErr,setSubmitErr]= useState("");

  const [datos,    setDatos]    = useState({ nombre: "", puesto: "", fechaIngreso: "", evaluador: "", periodo: "" });
  const [scores,   setScores]   = useState({});
  const [comments, setComments] = useState({});
  const [open,     setOpen]     = useState({});

  const totalItems = SECTIONS.reduce((a, s) => a + s.items.length, 0);
  const scored     = Object.values(scores).filter((v) => v > 0).length;
  const progress   = totalItems ? Math.round((scored / totalItems) * 100) : 0;
  const avg        = scoreAvg(scores);
  const level      = avg > 0 ? performanceLevel(avg) : null;

  function handleLogin() {
    const correct = role === "empleado" ? "ventas2026" : "tutu2026";
    if (password === correct) { setScreen("form"); setPwError(""); }
    else setPwError("Contraseña incorrecta. Intentá de nuevo.");
  }

  function handleSubmit() {
    if (!datos.nombre.trim()) { setSubmitErr("Por favor ingresá el nombre del empleado."); return; }
    const date     = new Date().toLocaleDateString("es-AR").replace(/\//g, "-");
    const filename = `Evaluacion_${datos.nombre.replace(/\s+/g, "_")}_${date}.txt`;
    const content  = buildContent(role, datos, scores, comments, open);
    downloadFile(filename, content);
    setScreen("success");
  }

  function reset() {
    setScreen("home"); setRole(null); setPassword("");
    setDatos({ nombre: "", puesto: "", fechaIngreso: "", evaluador: "", periodo: "" });
    setScores({}); setComments({}); setOpen({});
  }

  const openQ = role === "empleado" ? OPEN_EMPLEADO : OPEN_JEFE;

  if (screen === "home") return (
    <div style={pg}>
      <div style={card}>
        <Logo />
        <h1 style={h1}>Evaluación de Desempeño</h1>
        <p style={sub}>Seleccioná el tipo de evaluación para continuar</p>
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <RoleCard color="linear-gradient(135deg,#1e3a8a,#1e40af)" icon="👤" label="Soy Empleado" desc="Autoevaluación"
            onClick={() => { setRole("empleado"); setScreen("login"); }} />
          <RoleCard color="linear-gradient(135deg,#4c1d95,#7c3aed)" icon="🏆" label="Soy Jefe" desc="Evaluar colaborador"
            onClick={() => { setRole("jefe"); setScreen("login"); }} />
        </div>
        <p style={{ color: "#334155", fontSize: 11, marginTop: 20 }}>
          Al finalizar se descarga el archivo automáticamente
        </p>
      </div>
    </div>
  );

  if (screen === "login") return (
    <div style={pg}>
      <div style={{ ...card, maxWidth: 400 }}>
        <button style={backBtn} onClick={() => setScreen("home")}>← Volver</button>
        <div style={{ fontSize: 52, margin: "10px 0" }}>{role === "empleado" ? "👤" : "🏆"}</div>
        <h2 style={h1}>{role === "empleado" ? "Acceso Empleados" : "Acceso Jefes"}</h2>
        <p style={sub}>Ingresá la contraseña para acceder</p>
        <input type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={inputSt} />
        {pwError && <p style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>{pwError}</p>}
        <button style={{ ...btnSt, background: role === "empleado" ? "#1e40af" : "#7c3aed" }} onClick={handleLogin}>
          Ingresar →
        </button>
      </div>
    </div>
  );

  if (screen === "success") return (
    <div style={pg}>
      <div style={{ ...card, maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 10 }}>✅</div>
        <h2 style={h1}>¡Evaluación completada!</h2>
        <p style={sub}>El archivo se descargó automáticamente en tu dispositivo</p>
        <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 16px", color: "#f59e0b", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          📄 Evaluacion_{datos.nombre.replace(/\s+/g, "_")}_...txt
        </div>
        {level && (
          <div style={{ background: level.color + "18", border: `2px solid ${level.color}`, color: level.color, borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 16, display: "inline-block", marginBottom: 16 }}>
            {level.label} — Promedio: {avg.toFixed(2)}
          </div>
        )}
        <p style={{ color: "#475569", fontSize: 13, marginBottom: 20 }}>
          📩 Enviá el archivo descargado a Recursos Humanos por WhatsApp o email.
        </p>
        <button style={btnSt} onClick={reset}>Nueva evaluación</button>
      </div>
    </div>
  );

  return (
    <div style={pg}>
      <div style={{ width: "100%", maxWidth: 820 }}>
        <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: "13px 20px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
          <Logo small />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ width: 160, height: 5, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#f59e0b", borderRadius: 4, transition: "width .3s" }} />
            </div>
            <span style={{ fontSize: 11, color: "#475569" }}>{progress}% completado ({scored}/{totalItems})</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <h2 style={{ ...h1, textAlign: "left", fontSize: 20 }}>
              {role === "empleado" ? "Autoevaluación de Desempeño" : "Evaluación de Colaborador"}
            </h2>
            <p style={{ color: "#475569", fontSize: 13 }}>Tutu Automotores — {new Date().toLocaleDateString("es-AR")}</p>
          </div>

          <Sec title="📋 Datos del Colaborador">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Fld label="Nombre y Apellido *" value={datos.nombre}       onChange={(v) => setDatos((p) => ({ ...p, nombre: v }))} />
              <Fld label="Puesto"              value={datos.puesto}       onChange={(v) => setDatos((p) => ({ ...p, puesto: v }))} />
              <Fld label="Fecha de Ingreso"    value={datos.fechaIngreso} onChange={(v) => setDatos((p) => ({ ...p, fechaIngreso: v }))} type="date" />
              <Fld label="Evaluador"           value={datos.evaluador}    onChange={(v) => setDatos((p) => ({ ...p, evaluador: v }))} />
              <Fld label="Período evaluado"    value={datos.periodo}      onChange={(v) => setDatos((p) => ({ ...p, periodo: v }))} placeholder="Ej: Enero–Junio 2026" full />
            </div>
          </Sec>

          <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 18px", display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {SCORES.map((s) => (
              <div key={s.val} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                <span style={{ color: "#94a3b8", fontSize: 12 }}><b style={{ color: s.color }}>{s.val}</b> — {s.label}</span>
              </div>
            ))}
          </div>

          {SECTIONS.map((sec) => (
            <Sec key={sec.id} title={sec.title}>
              {sec.items.map((item) => {
                const key    = `${sec.id}_${item}`;
                const chosen = scores[key] || 0;
                return (
                  <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #0a0f1e" }}>
                    <span style={{ color: "#cbd5e1", fontSize: 14, flex: 1, paddingRight: 12 }}>{item}</span>
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      {SCORES.map((s) => (
                        <button key={s.val} title={`${s.val} — ${s.label}`}
                          style={{ width: 34, height: 34, borderRadius: 7, border: `2px solid ${chosen === s.val ? s.color : "#1e293b"}`, background: chosen === s.val ? s.color : "transparent", color: chosen === s.val ? "#fff" : "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s", transform: chosen === s.val ? "scale(1.12)" : "scale(1)" }}
                          onClick={() => setScores((p) => ({ ...p, [key]: s.val }))}>
                          {chosen === s.val ? "✓" : s.val}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 10 }}>
                <label style={{ color: "#334155", fontSize: 12 }}>Comentarios opcionales:</label>
                <textarea style={taSt} rows={2} placeholder="Observaciones..."
                  value={comments[sec.id] || ""}
                  onChange={(e) => setComments((p) => ({ ...p, [sec.id]: e.target.value }))} />
              </div>
            </Sec>
          ))}

          {avg > 0 && level && (
            <div style={{ background: "#0a0f1e", border: `1px solid ${level.color}44`, borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 20 }}>
              <div>
                <div style={{ fontSize: 44, fontWeight: 900, color: "#f59e0b", lineHeight: 1 }}>{avg.toFixed(2)}</div>
                <div style={{ color: "#475569", fontSize: 12 }}>Promedio general</div>
              </div>
              <div style={{ background: level.color + "18", border: `2px solid ${level.color}`, color: level.color, borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 16 }}>
                {level.label}
              </div>
            </div>
          )}

          <Sec title={role === "empleado" ? "🧠 Autoevaluación" : "📝 Evaluación Final"}>
            {openQ.map((q) => (
              <div key={q.id} style={{ marginBottom: 16 }}>
                <label style={{ color: "#cbd5e1", fontSize: 14, fontWeight: 500, display: "block", marginBottom: 4 }}>{q.label}</label>
                <textarea style={{ ...taSt, minHeight: 80 }} rows={3} placeholder="Escribí tu respuesta..."
                  value={open[q.id] || ""}
                  onChange={(e) => setOpen((p) => ({ ...p, [q.id]: e.target.value }))} />
              </div>
            ))}
          </Sec>

          {submitErr && (
            <div style={{ background: "#2d0e0e", border: "1px solid #7f1d1d", borderRadius: 8, padding: "12px 16px", color: "#fca5a5", fontSize: 13 }}>
              ⚠️ {submitErr}
            </div>
          )}

          <button style={{ ...btnSt, width: "100%", fontSize: 16, padding: 16, marginTop: 4 }}
            onClick={handleSubmit}>
            💾 Descargar Evaluación
          </button>
          <p style={{ textAlign: "center", color: "#1e293b", fontSize: 11, margin: "4px 0 32px" }}>
            Se descarga un archivo .txt — enviáselo a RRHH por WhatsApp o email
          </p>
        </div>
      </div>
    </div>
  );
}

function Logo({ small }) {
  return (
    <div style={{ marginBottom: small ? 0 : 8 }}>
      <span style={{ fontSize: small ? 18 : 26, fontWeight: 900, color: "#f59e0b", letterSpacing: 2 }}>TUTU</span>
      {small
        ? <span style={{ fontSize: 10, color: "#334155", letterSpacing: 4, marginLeft: 6 }}>AUTOMOTORES</span>
        : <span style={{ fontSize: 9, color: "#334155", letterSpacing: 5, display: "block", marginTop: -2 }}>AUTOMOTORES</span>}
    </div>
  );
}

function RoleCard({ color, icon, label, desc, onClick }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, border: "none", borderRadius: 14, padding: "20px 12px", cursor: "pointer", background: color, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <span style={{ fontSize: 38 }}>{icon}</span>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{desc}</span>
    </button>
  );
}

function Sec({ title, children }) {
  return (
    <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: "18px 22px" }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

function Fld({ label, value, onChange, type = "text", placeholder, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label style={{ color: "#475569", fontSize: 12, display: "block", marginBottom: 4 }}>{label}</label>
      <input type={type} style={inputSt} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const pg      = { minHeight: "100vh", background: "linear-gradient(160deg,#030712 0%,#0d1117 50%,#030712 100%)", display: "flex", justifyContent: "center", padding: "24px 16px", fontFamily: "'DM Sans','Segoe UI',sans-serif" };
const card    = { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 20, padding: "40px 32px", width: "100%", maxWidth: 520, textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", alignSelf: "flex-start" };
const h1      = { fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "10px 0 6px" };
const sub     = { color: "#475569", fontSize: 14, margin: "0 0 20px" };
const backBtn = { background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, marginBottom: 12 };
const inputSt = { width: "100%", background: "#030712", border: "1px solid #1e293b", borderRadius: 8, padding: "11px 13px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" };
const btnSt   = { background: "#1e40af", color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 14 };
const taSt    = { width: "100%", background: "#030712", border: "1px solid #1e293b", borderRadius: 8, padding: "9px 12px", color: "#f1f5f9", fontSize: 13, resize: "vertical", outline: "none", marginTop: 4, boxSizing: "border-box" };
