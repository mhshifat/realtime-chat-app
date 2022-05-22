import { PrivateRoute } from '../components/auth'
import { UserPage } from './../components/layouts'
import { DashboardSidebar, DashboardContent, DashboardOthers } from './../components/dashboard';
import { useCallback, useState } from 'react';
import { IUser } from '../components/dashboard/SidebarUser';
import { useAuth } from '../providers/Auth';
import { useQuery } from 'react-query';
import { API } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [showUserProfile, setShowUserProfile] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  useQuery([API.USER.GET_FRIENDS.name, { id: user?._id }], API.USER.GET_FRIENDS, {
    enabled: !!user?._id,
    onSuccess: ({ data }) => {
      setSelectedUser(data?.result?.filter((item: IUser) => item._id !== user?._id)?.[0])
    }
  });

  const toggleUserProfile = useCallback(() => setShowUserProfile(value => !value), [])
  const selectUser = useCallback((user: IUser | null) => setSelectedUser(user), [])

  return (
    <PrivateRoute>
      <UserPage title="ChatApp | Dashboard">
        <div className='flex w-full h-screen'>
          <div className='w-96 shadow-md'>
            <DashboardSidebar selectedUser={selectedUser} selectUser={selectUser} />  
          </div>
          <div className='flex-1'>
            <DashboardContent selectedUser={selectedUser} toggleUserProfile={toggleUserProfile} />
          </div>
          {(showUserProfile && selectedUser) && <div className='w-96 shadow-md'>
            <DashboardOthers selectedUser={selectedUser} />  
          </div>}
        </div>
      </UserPage>
    </PrivateRoute>
  )
}
