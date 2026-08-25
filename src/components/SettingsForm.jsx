import { useState, useRef } from 'react'
import ProfileSection from './sections/ProfileSection.jsx'
import SecuritySection from './sections/SecuritySection.jsx'
import NotificationsSection from './sections/NotificationsSection.jsx'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
]

const INITIAL_PROFILE = { fullName: '', email: '', username: '' }

const INITIAL_SECURITY = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const INITIAL_NOTIFICATIONS = {
  digestFrequency: '7',
  emailNotifications: true,
  pushNotifications: false,
  productUpdates: false,
}

/**
 * Owns which tab is active and the form values for every section.
 * Values are lifted here (rather than kept inside each section) so
 * switching tabs can never lose what the user typed. Each section
 * panel stays mounted at all times and is only hidden via the
 * native `hidden` attribute when inactive - this also means each
 * section's own validation-error and success-message state survives
 * switching away and back, as required.
 */
function SettingsForm() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profileValues, setProfileValues] = useState(INITIAL_PROFILE)
  const [securityValues, setSecurityValues] = useState(INITIAL_SECURITY)
  const [notificationsValues, setNotificationsValues] = useState(
    INITIAL_NOTIFICATIONS,
  )

  const tabRefs = useRef({})

  const focusTab = (tabId) => {
    tabRefs.current[tabId]?.focus()
  }

  const handleTabKeyDown = (event) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab)
    let nextIndex = null

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      const nextTab = TABS[nextIndex].id
      setActiveTab(nextTab)
      focusTab(nextTab)
    }
  }

  return (
    <div className="settings-form">
      <h1>Account Settings</h1>

      <div
        role="tablist"
        aria-label="Account settings sections"
        className="tab-list"
        onKeyDown={handleTabKeyDown}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el
              }}
              type="button"
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id="profile-panel"
        aria-labelledby="profile-tab"
        hidden={activeTab !== 'profile'}
      >
        <ProfileSection values={profileValues} onChange={setProfileValues} />
      </div>

      <div
        role="tabpanel"
        id="security-panel"
        aria-labelledby="security-tab"
        hidden={activeTab !== 'security'}
      >
        <SecuritySection
          values={securityValues}
          onChange={setSecurityValues}
        />
      </div>

      <div
        role="tabpanel"
        id="notifications-panel"
        aria-labelledby="notifications-tab"
        hidden={activeTab !== 'notifications'}
      >
        <NotificationsSection
          values={notificationsValues}
          onChange={setNotificationsValues}
        />
      </div>
    </div>
  )
}

export default SettingsForm
