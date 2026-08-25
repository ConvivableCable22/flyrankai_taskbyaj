import { useState } from 'react'
import FormField from '../FormField.jsx'
import { validateProfile } from '../../utils/validation.js'

function ProfileSection({ values, onChange }) {
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleFieldChange = (field) => (event) => {
    onChange({ ...values, [field]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateProfile(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setSuccessMessage('Your profile has been updated.')
    } else {
      setSuccessMessage('')
    }
  }

  return (
    <form
      className="settings-section"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="profile-heading"
    >
      <h2 id="profile-heading">Profile</h2>

      <FormField
        id="fullName"
        label="Full Name"
        value={values.fullName}
        onChange={handleFieldChange('fullName')}
        error={errors.fullName}
        autoComplete="name"
      />

      <FormField
        id="email"
        label="Email Address"
        type="email"
        value={values.email}
        onChange={handleFieldChange('email')}
        error={errors.email}
        autoComplete="email"
      />

      <FormField
        id="username"
        label="Username"
        value={values.username}
        onChange={handleFieldChange('username')}
        error={errors.username}
        autoComplete="username"
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

export default ProfileSection
