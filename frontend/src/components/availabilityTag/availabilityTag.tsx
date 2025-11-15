import React from 'react'

interface Props {
    isAvailable: boolean
}

const AvailabilityTag = ({ isAvailable }: Props) => {
  return (
    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold w-[100px] text-center ${
      isAvailable 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isAvailable ? 'Disponível' : 'Indisponível'}
    </div>
  )
}

export default AvailabilityTag
