import React from 'react'
import SettingSummary from '../settingSummary/SettingSummary'

interface Setting {
  id: number,
  setting: string,
  value: number
}

interface Props {
  settings: Setting[],
  onUpdate?: () => void
}

const SettingsList = ({ settings, onUpdate }: Props) => {
  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <SettingSummary
          key={setting.id}
          id={setting.id}
          setting={setting.setting}
          value={setting.value}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}

export default SettingsList
