import { useState } from 'react'
import FormField from '../FormField.jsx'
import ToggleField from '../ToggleField.jsx'
import { validateNotifications } from '../../utils/validation.js'

const MIN_FREQUENCY = 1
const MAX_FREQUENCY = 30

function NotificationsSection({ values, onChange }) {
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleFrequencyChange = (event) => {
    onChange({ ...values, digestFrequency: event.target.value })
  }

  const handleToggleChange = (field) => (event) => {
    onChange({ ...values, [field]: event.target.checked })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateNotifications(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setSuccessMessage('Your notification preferences have been updated.')
    } else {
      setSuccessMessage('')
    }
  }

  return (
    <form
      className="settings-section"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="notifications-heading"
    >
      <h2 id="notifications-heading">Notifications</h2>

      <FormField
        id="digestFrequency"
        label="Digest Frequency (days)"
        type="number"
        min={MIN_FREQUENCY}
        max={MAX_FREQUENCY}
        step={1}
        value={values.digestFrequency}
        onChange={handleFrequencyChange}
        error={errors.digestFrequency}
      />

      <fieldset className="toggle-group">
        <legend>Notification Channels</legend>

        <ToggleField
          id="emailNotifications"
          label="Email Notifications"
          checked={values.emailNotifications}
          onChange={handleToggleChange('emailNotifications')}
        />

        <ToggleField
          id="pushNotifications"
          label="Push Notifications"
          checked={values.pushNotifications}
          onChange={handleToggleChange('pushNotifications')}
        />

        <ToggleField
          id="productUpdates"
          label="Product Updates"
          checked={values.productUpdates}
          onChange={handleToggleChange('productUpdates')}
        />
      </fieldset>

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

export default NotificationsSection
