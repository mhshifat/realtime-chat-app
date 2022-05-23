import { HTMLAttributes, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { API } from '../../api';
import { useAuth } from '../../providers/Auth';
import { Avatar, Loader } from './../common';
import { IMessage } from './Content';
import { IUser } from './SidebarUser';

export interface DashboardOthersProps {
  selectedUser: IUser | null
  activeUsers: IUser[]
}

export default function DashboardOthers({
  selectedUser,
  activeUsers,
}: DashboardOthersProps) {
  const { data: messages, isLoading: messagesLoading } = useQuery(
    [API.MESSAGE.GET_MESSAGES.name, { receiver: selectedUser?._id }],
    API.MESSAGE.GET_MESSAGES,
    {
      enabled: !!selectedUser?._id,
    }
  )

  return (
    <div className="h-full w-full p-5">
      <div className="flex flex-col items-center gap-1 px-5 py-10">
        <Avatar
          src={selectedUser?.avatar || 'https://picsum.photos/100'}
          width={70}
          height={70}
        />
        {activeUsers.some((u) => u._id === selectedUser?._id) && (
          <span className="text-base font-semibold text-green-700">Active</span>
        )}
        <span className="text-base font-semibold">
          {selectedUser?.firstName} {selectedUser?.lastName}
        </span>
      </div>

      <div className="mt-3 w-full">
        <div className="flex items-center justify-between text-base font-semibold">
          <h2>Customize Chat</h2>
          <FaChevronDown />
        </div>
        <div></div>
      </div>
      <div className="mt-3 w-full">
        <div className="flex items-center justify-between text-base font-semibold">
          <h2>Privacy & Support</h2>
          <FaChevronDown />
        </div>
        <div></div>
      </div>
      <div className="mt-3 w-full">
        <div className="flex items-center justify-between text-base font-semibold">
          <h2>Shared Media</h2>
          <FaChevronDown />
        </div>
        <>
          {messagesLoading ? (
            <Loader />
          ) : (
            <div>
              {!messages?.data?.result.filter((item: IMessage) =>
                item.body.includes('base64')
              )?.length ? (
                <div className="flex h-full w-full flex-col items-center justify-center p-5 py-10">
                  <p>No files found. 😊</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 py-5">
                  {messages?.data?.result
                    .filter((item: IMessage) => item.body.includes('base64'))
                    .map((message: IMessage) => (
                      <div
                        key={message._id}
                        className="cursor-pointer rounded bg-slate-200 p-3"
                      >
                        <img
                          className="aspect-video object-contain"
                          src={message.body || 'https://picsum.photos/300'}
                          alt=""
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  )
}