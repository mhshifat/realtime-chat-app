import moment from 'moment'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { API } from '../../api'
import { useAuth } from '../../providers/Auth'
import Avatar from '../common/Avatar'

export interface IUser {
  _id?: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
}
export interface SidebarUserProps {
  item: IUser
  selectedUser: IUser | null
  onClick: () => void
}

export default function SidebarUser({
  item,
  onClick,
  selectedUser,
}: SidebarUserProps) {
  const { user } = useAuth()
  const { mutateAsync: updateMessage } = useMutation(API.MESSAGE.UPDATE_MESSAGE)
  const { data: lastMessage, refetch } = useQuery(
    [API.MESSAGE.GET_LAST_MESSAGE.name, { receiver: item._id }],
    API.MESSAGE.GET_LAST_MESSAGE,
    {
      onSuccess: ({ data }) => {
        if (selectedUser?._id !== item._id || !data?.data?.result?._id) return
        updateMessage({ id: lastMessage?.data?.result?._id, seen: true }).then(
          () => {
            refetch()
          }
        )
      },
    }
  )

  return (
    <div
      className={`flex cursor-pointer items-center py-2 px-5 transition-all duration-500 hover:bg-slate-100 ${
        selectedUser?._id === item._id ? 'bg-slate-100' : ''
      }`}
      onClick={(e) => {
        if (lastMessage?.data?.result?._id) {
          updateMessage({
            id: lastMessage?.data?.result?._id,
            seen: true,
          }).then(() => {
            refetch()
          })
        }
        onClick()
      }}
    >
      <div className="flex w-full items-center gap-3">
        <Avatar
          src={item.avatar || 'https://picsum.photos/100'}
          width={55}
          height={55}
        />
        <div className="flex w-full flex-col gap-1">
          <span className="flex items-center justify-between text-base font-medium">
            {item.firstName} - {item.lastName}
            {lastMessage?.data?.result?.sender?._id !== user?._id &&
              lastMessage?.data?.result?.sender?._id !== selectedUser?._id &&
              lastMessage?.data?.result?.seen === false && (
                <span className="flex h-2 w-2 items-center justify-center rounded-full bg-blue-600"></span>
              )}
          </span>
          {lastMessage?.data?.result ? (
            <small className="flex justify-between text-xs text-slate-500">
              {lastMessage?.data?.result?.sender?._id === user?._id
                ? 'You'
                : `${lastMessage?.data?.result?.sender?.firstName} ${lastMessage?.data?.result?.sender?.lastName}`}{' '}
              - {lastMessage?.data?.result?.body}{' '}
              <span>
                {moment(lastMessage?.data?.result?.body?.createdAt)
                  .startOf('second')
                  .fromNow()}
              </span>
            </small>
          ) : (
            <small className="flex justify-between text-xs text-slate-500">
              Send your first message...
            </small>
          )}
        </div>
      </div>
    </div>
  )
}
