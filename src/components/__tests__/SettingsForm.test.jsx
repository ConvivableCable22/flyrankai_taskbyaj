import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsForm from '../SettingsForm.jsx'

function renderForm() {
  const user = userEvent.setup()
  render(<SettingsForm />)
  return { user }
}

async function goToTab(user, name) {
  await user.click(screen.getByRole('tab', { name }))
}

describe('Profile section', () => {
  it('shows required-field errors when submitted empty', async () => {
    const { user } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(screen.getByText('Full name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email address is required.')).toBeInTheDocument()
    expect(screen.getByText('Username is required.')).toBeInTheDocument()
  })

  it('rejects an invalid email format', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('Full Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email Address'), 'not-an-email')
    await user.type(screen.getByLabelText('Username'), 'ada')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Enter a valid email address, like name@example.com.'),
    ).toBeInTheDocument()
  })

  it('shows a success message on valid submission', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('Full Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email Address'), 'ada@example.com')
    await user.type(screen.getByLabelText('Username'), 'ada')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Your profile has been updated.'),
    ).toBeInTheDocument()
  })
})

describe('Security section', () => {
  it('shows required-field errors when submitted empty and stays on Security', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Security')

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Current password is required.'),
    ).toBeInTheDocument()
    expect(screen.getByText('New password is required.')).toBeInTheDocument()
    expect(
      screen.getByText('Please confirm your new password.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('rejects a new password shorter than 8 characters', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Security')

    await user.type(screen.getByLabelText('Current Password'), 'oldpass1')
    await user.type(screen.getByLabelText('New Password'), 'short')
    await user.type(screen.getByLabelText('Confirm New Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('New password must be at least 8 characters.'),
    ).toBeInTheDocument()
  })

  it('rejects mismatched password confirmation', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Security')

    await user.type(screen.getByLabelText('Current Password'), 'oldpass1')
    await user.type(screen.getByLabelText('New Password'), 'newpassword1')
    await user.type(
      screen.getByLabelText('Confirm New Password'),
      'differentpassword',
    )
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
  })

  it('shows a success message and stays on Security for a valid submission', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Security')

    await user.type(screen.getByLabelText('Current Password'), 'oldpass1')
    await user.type(screen.getByLabelText('New Password'), 'newpassword1')
    await user.type(
      screen.getByLabelText('Confirm New Password'),
      'newpassword1',
    )
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Your password has been updated.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})

describe('Notifications section', () => {
  it('has the correct default toggle states', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Notifications')

    expect(screen.getByLabelText('Email Notifications')).toBeChecked()
    expect(screen.getByLabelText('Push Notifications')).not.toBeChecked()
    expect(screen.getByLabelText('Product Updates')).not.toBeChecked()
  })

  it('rejects a digest frequency below 1', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Notifications')

    const input = screen.getByLabelText('Digest Frequency (days)')
    await user.clear(input)
    await user.type(input, '0')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Digest frequency must be between 1 and 30 days.'),
    ).toBeInTheDocument()
  })

  it('rejects a digest frequency above 30', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Notifications')

    const input = screen.getByLabelText('Digest Frequency (days)')
    await user.clear(input)
    await user.type(input, '31')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Digest frequency must be between 1 and 30 days.'),
    ).toBeInTheDocument()
  })

  it('accepts a valid digest frequency and shows a success message, staying on Notifications', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Notifications')

    const input = screen.getByLabelText('Digest Frequency (days)')
    await user.clear(input)
    await user.type(input, '14')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByText('Your notification preferences have been updated.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Notifications' }),
    ).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Cross-section behavior', () => {
  it('keeps the user on the current section after a failed save', async () => {
    const { user } = renderForm()
    await goToTab(user, 'Notifications')

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      screen.getByRole('tab', { name: 'Notifications' }),
    ).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeVisible()
  })

  it('does not clear entered values when switching between sections', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('Full Name'), 'Grace Hopper')
    await user.type(screen.getByLabelText('Email Address'), 'grace@example.com')

    await goToTab(user, 'Security')
    await user.type(screen.getByLabelText('Current Password'), 'oldpass1')

    await goToTab(user, 'Profile')

    expect(screen.getByLabelText('Full Name')).toHaveValue('Grace Hopper')
    expect(screen.getByLabelText('Email Address')).toHaveValue(
      'grace@example.com',
    )

    await goToTab(user, 'Security')
    expect(screen.getByLabelText('Current Password')).toHaveValue('oldpass1')
  })
})
