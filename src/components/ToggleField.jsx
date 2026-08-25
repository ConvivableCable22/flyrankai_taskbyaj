/**
 * Accessible on/off toggle built on a native checkbox so it is
 * keyboard operable (Space/Tab) and works with screen readers
 * out of the box. State is communicated with visible text
 * ("On"/"Off"), not just color, per the accessibility requirements.
 *
 * The <label> only contains the field's own text and is linked to
 * the checkbox via htmlFor/id, so its accessible name stays exactly
 * the field label (e.g. "Email Notifications") rather than being
 * diluted by the adjacent state text.
 */
function ToggleField({ id, label, checked, onChange }) {
  return (
    <div className="toggle-field">
      <label htmlFor={id} className="toggle-label-text">
        {label}
      </label>
      <span className="toggle-switch">
        <input
          id={id}
          name={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={onChange}
          aria-checked={checked}
        />
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-state-text" aria-hidden="true">
          {checked ? 'On' : 'Off'}
        </span>
      </span>
    </div>
  )
}

export default ToggleField
