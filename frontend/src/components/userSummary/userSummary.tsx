import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

const UserSummary = ({ id, firstName, lastName, email, phoneNumber, role, active }: Props) => {
  const navigate = useNavigate();
  const fullName = `${firstName} ${lastName}`;
  
  const handleClick = () => {
    navigate(`/users/${id}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 relative cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {fullName}
          </h3>
          <p className="text-gray-600 text-sm mb-1">{email}</p>
          {phoneNumber && (
            <p className="text-gray-600 text-sm mb-1">{phoneNumber}</p>
          )}
          {role && (
            <p className="text-gray-500 text-sm mt-2">
              <span className="font-semibold">Função:</span> {role}
            </p>
          )}
        </div>
        <div className="ml-4">
          {active ? (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              Ativo
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              Inativo
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSummary
