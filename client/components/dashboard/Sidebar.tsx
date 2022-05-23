import { Avatar, Loader } from "../common";
import { BsChevronRight, BsSearch, BsThreeDots } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import SidebarUser, { IUser } from "./SidebarUser";
import { useQuery } from "react-query";
import { API } from "../../api";
import { useAuth } from "../../providers/Auth";
import { useEffect, useMemo, useState } from 'react'
import { SOCKET_EVENTS } from '../../constants'

export interface DashboardSidebarProps {
  selectedUser: IUser | null
  activeUsers: IUser[]
  selectUser: (user: IUser | null) => void
  socket: any
}

export default function DashboardSidebar({
  selectUser,
  selectedUser,
  socket,
  activeUsers,
}: DashboardSidebarProps) {
  const { user } = useAuth()

  const { data: friends, isLoading: friendsLogin } = useQuery(
    [API.USER.GET_FRIENDS.name, { id: user?._id }],
    API.USER.GET_FRIENDS,
    {
      enabled: !!user?._id,
    }
  )

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.ADD_USER, {
      socketId: socket.id,
      ...user,
    })
  }, [])

  const allFriends = useMemo(
    () =>
      friends?.data?.result?.filter((item: IUser) => item._id !== user?._id),
    [friends, user]
  )
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex !h-16 w-full items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.avatar || 'https://picsum.photos/100'}
            width={40}
            height={40}
          />
          <span className="text-xl font-semibold">
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <div className="flex gap-3">
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100">
            <BsThreeDots />
          </button>
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100">
            <FaRegEdit />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center rounded-full border border-stone-100 bg-slate-100 transition-all duration-500 focus-within:border focus-within:border-blue-600">
          <BsSearch className="flex w-[50px] items-center justify-center" />
          <input
            type="text"
            className="h-[40px] flex-1 border-none bg-transparent outline-none"
          />
        </div>
      </div>

      {!!activeUsers.length && (
        <div className="p-5">
          <div className="scrollbar-h flex gap-2 overflow-auto">
            {activeUsers.map((user) => (
              <Avatar
                key={user._id}
                src={user.avatar || 'https://picsum.photos/100'}
                width={45}
                height={45}
                status="active"
                onClick={() => selectUser(user)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="scrollbar flex h-full w-full flex-col overflow-y-auto">
        {friendsLogin ? (
          <Loader />
        ) : allFriends?.length ? (
          <>
            {allFriends.map((item: IUser) => (
              <SidebarUser
                selectedUser={selectedUser}
                onClick={() => selectUser(item)}
                key={item._id}
                item={item}
              />
            ))}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-5">
            No result found 😟
          </div>
        )}
      </div>
    </div>
  )
}