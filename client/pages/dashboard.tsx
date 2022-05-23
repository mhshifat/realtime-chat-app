import { PrivateRoute } from '../components/auth'
import { UserPage } from './../components/layouts'
import { DashboardSidebar, DashboardContent, DashboardOthers } from './../components/dashboard';
import { useCallback, useEffect, useRef, useState } from 'react'
import { IUser } from '../components/dashboard/SidebarUser'
import { useAuth } from '../providers/Auth'
import { useQuery } from 'react-query'
import { API } from '../api'
import { io } from 'socket.io-client'
import { SOCKET_EVENTS } from '../constants'

export default function Dashboard() {
  const { user } = useAuth()
  const socketRef = useRef<any>(null)
  const [showUserProfile, setShowUserProfile] = useState(true)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [activeUsers, setActiveUsers] = useState<IUser[]>([])
  useQuery(
    [API.USER.GET_FRIENDS.name, { id: user?._id }],
    API.USER.GET_FRIENDS,
    {
      enabled: !!user?._id,
      onSuccess: ({ data }) => {
        setSelectedUser(
          data?.result?.filter((item: IUser) => item._id !== user?._id)?.[0]
        )
      },
    }
  )

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URI!)
  }, [])

  useEffect(() => {
    if (!user) return
    socketRef.current.on(SOCKET_EVENTS.ACTIVE_USERS, (users: any) => {
      setActiveUsers(users.filter((u: IUser) => u._id !== user?._id))
    })
  }, [user])

  const toggleUserProfile = useCallback(
    () => setShowUserProfile((value) => !value),
    []
  )
  const selectUser = useCallback(
    (user: IUser | null) => setSelectedUser(user),
    []
  )

  if (!socketRef.current) return null
  return (
    <PrivateRoute>
      <UserPage title="ChatApp | Dashboard">
        <div className="flex h-screen w-full">
          <div className="w-96 shadow-md">
            <DashboardSidebar
              selectedUser={selectedUser}
              selectUser={selectUser}
              activeUsers={activeUsers}
              socket={socketRef.current}
            />
          </div>
          <div className="flex-1">
            <DashboardContent
              selectedUser={selectedUser}
              activeUsers={activeUsers}
              toggleUserProfile={toggleUserProfile}
              socket={socketRef.current}
            />
          </div>
          {showUserProfile && selectedUser && (
            <div className="w-96 shadow-md">
              <DashboardOthers
                selectedUser={selectedUser}
                activeUsers={activeUsers}
              />
            </div>
          )}
        </div>
      </UserPage>
    </PrivateRoute>
  )
}
