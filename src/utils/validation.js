const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const MIN_DIGEST_FREQUENCY = 1
const MAX_DIGEST_FREQUENCY = 30

export function validateProfile(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }

  if (!values.username.trim()) {
    errors.username = 'Username is required.'
  }

  return errors
}

export function validateSecurity(values) {
  const errors = {}

  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required.'
  }

  if (!values.newPassword) {
    errors.newPassword = 'New password is required.'
  } else if (values.newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.'
  } else if (
    values.newPassword &&
    values.confirmPassword !== values.newPassword
  ) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function validateNotifications(values) {
  const errors = {}
  const raw = values.digestFrequency

  if (raw === '' || raw === null || raw === undefined) {
    errors.digestFrequency = 'Digest frequency is required.'
  } else {
    const numeric = Number(raw)
    const isWholeNumber = Number.isInteger(numeric)

    if (!isWholeNumber) {
      errors.digestFrequency = 'Digest frequency must be a whole number.'
    } else if (
      numeric < MIN_DIGEST_FREQUENCY ||
      numeric > MAX_DIGEST_FREQUENCY
    ) {
      errors.digestFrequency = `Digest frequency must be between ${MIN_DIGEST_FREQUENCY} and ${MAX_DIGEST_FREQUENCY} days.`
    }
  }

  return errors
}
