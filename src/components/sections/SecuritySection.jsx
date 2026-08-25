import { useState } from 'react'
import FormField from '../FormField.jsx'
import { validateSecurity } from '../../utils/validation.js'

function SecuritySection({ values, onChange }) {
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleFieldChange = (field) => (event) => {
    onChange({ ...values, [field]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateSecurity(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setSuccessMessage('Your password has been updated.')
    } else {
      setSuccessMessage('')
    }
  }

  return (
    <form
      className="settings-section"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="security-heading"
    >
      <h2 id="security-heading">Security</h2>

      <FormField
        id="currentPassword"
        label="Current Password"
        type="password"
        value={values.currentPassword}
        onChange={handleFieldChange('currentPassword')}
        error={errors.currentPassword}
        autoComplete="current-password"
      />

      <FormField
        id="newPassword"
        label="New Password"
        type="password"
        value={values.newPassword}
        onChange={handleFieldChange('newPassword')}
        error={errors.newPassword}
        autoComplete="new-password"
      />

      <FormField
        id="confirmPassword"
        label="Confirm New Password"
        type="password"
        value={values.confirmPassword}
        onChange={handleFieldChange('confirmPassword')}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {successMessage && (
        <p className="success-message" role="status">
          {successMessage}
        </p>
      )}

      <button type="submit" className="save-button">
        Save Changes
      </button>
    </form>
  )
}

export default SecuritySection
