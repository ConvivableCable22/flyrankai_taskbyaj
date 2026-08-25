import { useState, useMemo } from "react";

/* ---------- validation ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

function validate(name, value, all) {
  switch (name) {
    case "fullName":
      if (!value.trim()) return "Enter your full name";
      if (value.trim().length < 2) return "Must be at least 2 characters";
      return "";
    case "email":
      if (!value.trim()) return "Enter your email";
      if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address";
      return "";
    case "username":
      if (!value.trim()) return "Enter a username";
      if (!USERNAME_RE.test(value.trim()))
        return "3–20 characters: letters, numbers, underscores";
      return "";
    case "currentPassword":
      if (all.newPassword && !value)
        return "Enter your current password to change it";
      return "";
    case "newPassword":
      if (!value) return "";
      if (value.length < 8) return "Use at least 8 characters";
      if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value))
        return "Add an uppercase letter, lowercase letter, and a number";
      return "";
    case "confirmPassword":
      if (!all.newPassword) return "";
      if (!value) return "Confirm your new password";
      if (value !== all.newPassword) return "Passwords don't match";
      return "";
    case "digestFrequency": {
      if (!String(value).trim()) return "Set a frequency";
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > 30)
        return "Enter a whole number between 1 and 30";
      return "";
    }
    default:
      return "";
  }
}

const SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    code: "PROF",
    fields: ["fullName", "email", "username"],
  },
  {
    id: "security",
    label: "Security",
    code: "SEC",
    fields: ["currentPassword", "newPassword", "confirmPassword"],
  },
  {
    id: "notifications",
    label: "Notifications",
    code: "ALRT",
    fields: ["digestFrequency"],
  },
];

const FIELD_META = {
  fullName: { label: "Full name", type: "text", placeholder: "Ada Lovelace" },
  email: { label: "Email address", type: "email", placeholder: "ada@example.com" },
  username: { label: "Username", type: "text", placeholder: "ada_l" },
  currentPassword: { label: "Current password", type: "password", placeholder: "••••••••" },
  newPassword: { label: "New password", type: "password", placeholder: "Leave blank to keep current" },
  confirmPassword: { label: "Confirm new password", type: "password", placeholder: "Repeat new password" },
  digestFrequency: { label: "Digest frequency (days)", type: "number", placeholder: "7" },
};

const INITIAL = {
  fullName: "",
  email: "",
  username: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  digestFrequency: "7",
  emailNotifs: true,
  pushNotifs: false,
  marketingNotifs: false,
};

/* ---------- component ---------- */

export default function SettingsForm() {
  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [active, setActive] = useState("profile");
  const [banner, setBanner] = useState(null); // { type, message }

  const errors = useMemo(() => {
    const e = {};
    for (const s of SECTIONS) {
      for (const f of s.fields) {
        e[f] = validate(f, values[f], values);
      }
    }
    return e;
  }, [values]);

  const sectionState = (sectionId) => {
    const fields = SECTIONS.find((s) => s.id === sectionId).fields;
    const anyTouched = fields.some((f) => touched[f]);
    const anyError = fields.some((f) => touched[f] && errors[f]);
    if (!anyTouched) return "idle";
    return anyError ? "error" : "ok";
  };

  function update(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    if (banner) setBanner(null);
  }

  function blur(name) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function fieldStatus(name) {
    if (!touched[name]) return "idle";
    return errors[name] ? "error" : "ok";
  }

  function handleSave() {
    const allFields = SECTIONS.flatMap((s) => s.fields);
    const nextTouched = {};
    allFields.forEach((f) => (nextTouched[f] = true));
    setTouched(nextTouched);

    const firstBadSection = SECTIONS.find((s) =>
      s.fields.some((f) => errors[f])
    );

    if (firstBadSection) {
      setActive(firstBadSection.id);
      setBanner({
        type: "error",
        message: "Fix the flagged fields before saving.",
      });
      return;
    }

    setBanner({ type: "ok", message: "Settings saved." });
    setValues((v) => ({
      ...v,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setTouched((t) => ({
      ...t,
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    }));
  }

  const section = SECTIONS.find((s) => s.id === active);

  return (
    <div className="sf-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .sf-root {
          --bg: #F3F5F1;
          --panel: #FFFFFF;
          --ink: #1B241F;
          --ink-soft: #5B665F;
          --line: #DCE3DC;
          --accent: #1F6F5C;
          --accent-soft: #E4F0EA;
          --warn: #B54708;
          --warn-soft: #FCEEE3;
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'IBM Plex Sans', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;

          background: var(--bg);
          color: var(--ink);
          font-family: var(--font-body);
          padding: 32px 16px;
          min-height: 100%;
          box-sizing: border-box;
        }
        .sf-root * { box-sizing: border-box; }

        .sf-shell {
          max-width: 840px;
          margin: 0 auto;
        }

        .sf-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .sf-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .sf-subtitle {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ink-soft);
          letter-spacing: 0.04em;
        }

        .sf-banner {
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 4px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid transparent;
        }
        .sf-banner.ok {
          background: var(--accent-soft);
          color: var(--accent);
          border-color: #BFDFD3;
        }
        .sf-banner.error {
          background: var(--warn-soft);
          color: var(--warn);
          border-color: #F0C9A6;
        }

        .sf-layout {
          display: grid;
          grid-template-columns: 176px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 620px) {
          .sf-layout { grid-template-columns: 1fr; }
        }

        .sf-nav {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
        }
        .sf-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--line);
          cursor: pointer;
          text-align: left;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--ink);
        }
        .sf-nav-item:last-child { border-bottom: none; }
        .sf-nav-item:hover { background: #F6F8F5; }
        .sf-nav-item.active {
          background: var(--accent-soft);
          color: var(--accent);
          font-weight: 600;
        }
        .sf-nav-code {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--ink-soft);
          letter-spacing: 0.06em;
        }
        .sf-nav-item.active .sf-nav-code { color: var(--accent); }

        .sf-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-left: auto;
          background: #C7CFC7;
        }
        .sf-dot.ok { background: var(--accent); }
        .sf-dot.error { background: var(--warn); }

        .sf-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 22px 24px 24px;
        }

        .sf-panel-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .sf-panel-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 17px;
          margin: 0;
        }
        .sf-panel-code {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-soft);
          border: 1px solid var(--line);
          border-radius: 3px;
          padding: 2px 6px;
        }

        .sf-field { margin-bottom: 16px; }
        .sf-field:last-child { margin-bottom: 0; }

        .sf-field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .sf-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink);
        }
        .sf-status {
          font-family: var(--font-mono);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sf-status.idle { color: #A3ACA3; }
        .sf-status.ok { color: var(--accent); }
        .sf-status.error { color: var(--warn); }

        .sf-input {
          width: 100%;
          font-family: var(--font-body);
          font-size: 14px;
          padding: 10px 12px;
          border-radius: 5px;
          border: 1px solid var(--line);
          background: #FBFCFA;
          color: var(--ink);
          outline: none;
          transition: border-color 0.15s ease;
        }
        .sf-input:focus {
          border-color: var(--accent);
          background: #fff;
        }
        .sf-input.has-error { border-color: var(--warn); }

        .sf-help {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--warn);
          margin-top: 5px;
        }
        .sf-hint {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-soft);
          margin-top: 5px;
        }

        .sf-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--line);
        }
        .sf-toggle-row:last-of-type { border-bottom: none; }
        .sf-toggle-copy { max-width: 70%; }
        .sf-toggle-title { font-size: 13.5px; font-weight: 500; }
        .sf-toggle-desc { font-size: 12px; color: var(--ink-soft); margin-top: 2px; }

        .sf-switch {
          position: relative;
          width: 38px;
          height: 22px;
          border-radius: 999px;
          background: #D3DAD3;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .sf-switch.on { background: var(--accent); }
        .sf-switch-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.15s ease;
        }
        .sf-switch.on .sf-switch-knob { transform: translateX(16px); }

        .sf-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .sf-save {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          background: var(--ink);
          color: #fff;
          cursor: pointer;
        }
        .sf-save:hover { background: #303B33; }
        .sf-save:focus-visible, .sf-nav-item:focus-visible, .sf-switch:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
      `}</style>

      <div className="sf-shell">
        <div className="sf-head">
          <h1 className="sf-title">Account settings</h1>
          <span className="sf-subtitle">STATUS: {SECTIONS.every(s => sectionState(s.id) !== "error") ? "NOMINAL" : "ATTENTION REQUIRED"}</span>
        </div>

        {banner && (
          <div className={`sf-banner ${banner.type}`}>
            {banner.type === "ok" ? "✓" : "!"} {banner.message}
          </div>
        )}

        <div className="sf-layout">
          <nav className="sf-nav">
            {SECTIONS.map((s) => {
              const state = sectionState(s.id);
              return (
                <button
                  key={s.id}
                  className={`sf-nav-item ${active === s.id ? "active" : ""}`}
                  onClick={() => setActive(s.id)}
                  type="button"
                >
                  <span>{s.label}</span>
                  <span className="sf-nav-code">{s.code}</span>
                  <span className={`sf-dot ${state === "idle" ? "" : state}`} />
                </button>
              );
            })}
          </nav>

          <div className="sf-panel">
            <div className="sf-panel-head">
              <h2 className="sf-panel-title">{section.label}</h2>
              <span className="sf-panel-code">{section.code}</span>
            </div>

            {section.id !== "notifications" &&
              section.fields.map((name) => {
                const meta = FIELD_META[name];
                const status = fieldStatus(name);
                return (
                  <div className="sf-field" key={name}>
                    <div className="sf-field-label-row">
                      <label className="sf-label" htmlFor={name}>{meta.label}</label>
                      <span className={`sf-status ${status}`}>
                        {status === "ok" && "✓ valid"}
                        {status === "error" && "! error"}
                        {status === "idle" && "· pending"}
                      </span>
                    </div>
                    <input
                      id={name}
                      className={`sf-input ${status === "error" ? "has-error" : ""}`}
                      type={meta.type}
                      placeholder={meta.placeholder}
                      value={values[name]}
                      onChange={(e) => update(name, e.target.value)}
                      onBlur={() => blur(name)}
                    />
                    {status === "error" ? (
                      <div className="sf-help">{errors[name]}</div>
                    ) : name === "newPassword" ? (
                      <div className="sf-hint">8+ characters, with a mix of case and a number. Leave blank to keep your current password.</div>
                    ) : null}
                  </div>
                );
              })}

            {section.id === "notifications" && (
              <>
                <div className="sf-field">
                  <div className="sf-field-label-row">
                    <label className="sf-label" htmlFor="digestFrequency">
                      {FIELD_META.digestFrequency.label}
                    </label>
                    <span className={`sf-status ${fieldStatus("digestFrequency")}`}>
                      {fieldStatus("digestFrequency") === "ok" && "✓ valid"}
                      {fieldStatus("digestFrequency") === "error" && "! error"}
                      {fieldStatus("digestFrequency") === "idle" && "· pending"}
                    </span>
                  </div>
                  <input
                    id="digestFrequency"
                    className={`sf-input ${fieldStatus("digestFrequency") === "error" ? "has-error" : ""}`}
                    type="number"
                    min="1"
                    max="30"
                    placeholder={FIELD_META.digestFrequency.placeholder}
                    value={values.digestFrequency}
                    onChange={(e) => update("digestFrequency", e.target.value)}
                    onBlur={() => blur("digestFrequency")}
                    style={{ maxWidth: "120px" }}
                  />
                  {fieldStatus("digestFrequency") === "error" && (
                    <div className="sf-help">{errors.digestFrequency}</div>
                  )}
                </div>

                <div style={{ marginTop: "18px" }}>
                  <div className="sf-toggle-row">
                    <div className="sf-toggle-copy">
                      <div className="sf-toggle-title">Email notifications</div>
                      <div className="sf-toggle-desc">Get a summary sent to your inbox on your chosen schedule.</div>
                    </div>
                    <button
                      type="button"
                      className={`sf-switch ${values.emailNotifs ? "on" : ""}`}
                      onClick={() => update("emailNotifs", !values.emailNotifs)}
                      aria-pressed={values.emailNotifs}
                      aria-label="Toggle email notifications"
                    >
                      <span className="sf-switch-knob" />
                    </button>
                  </div>
                  <div className="sf-toggle-row">
                    <div className="sf-toggle-copy">
                      <div className="sf-toggle-title">Push notifications</div>
                      <div className="sf-toggle-desc">Real-time alerts on your device for important activity.</div>
                    </div>
                    <button
                      type="button"
                      className={`sf-switch ${values.pushNotifs ? "on" : ""}`}
                      onClick={() => update("pushNotifs", !values.pushNotifs)}
                      aria-pressed={values.pushNotifs}
                      aria-label="Toggle push notifications"
                    >
                      <span className="sf-switch-knob" />
                    </button>
                  </div>
                  <div className="sf-toggle-row">
                    <div className="sf-toggle-copy">
                      <div className="sf-toggle-title">Product updates</div>
                      <div className="sf-toggle-desc">Occasional news about new features and changes.</div>
                    </div>
                    <button
                      type="button"
                      className={`sf-switch ${values.marketingNotifs ? "on" : ""}`}
                      onClick={() => update("marketingNotifs", !values.marketingNotifs)}
                      aria-pressed={values.marketingNotifs}
                      aria-label="Toggle product update emails"
                    >
                      <span className="sf-switch-knob" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="sf-footer">
          <button type="button" className="sf-save" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
