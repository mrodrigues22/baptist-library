import React from 'react'
import UserSummary from '../userSummary/userSummary'

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

interface Props {
  users: User[]
}

const UserList = ({ users }: Props) => {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserSummary
          key={user.id}
          id={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          phoneNumber={user.phoneNumber}
          role={user.role}
          active={user.active}
        />
      ))}
    </div>
  )
}

export default UserList
