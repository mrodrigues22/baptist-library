import React, { useState } from 'react'
import EditSettingModal from '../EditSettingModal'

interface Props {
    id: number,
    setting: string,
    value: number,
    onUpdate?: () => void
}

const SettingSummary = ({ id, setting, value, onUpdate }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleClick = () => {
    setIsModalOpen(true);
  };
  
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    onUpdate?.();
  };
  
  return (
    <>
      <div 
        onClick={handleClick}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {setting}
            </h3>
            <p className="text-gray-600 text-sm">Valor atual: {value}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary">{value}</span>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <EditSettingModal
          settingId={id}
          settingName={setting}
          currentValue={value}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}

export default SettingSummary
