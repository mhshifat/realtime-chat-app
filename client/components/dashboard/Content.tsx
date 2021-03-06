import Avatar from "../common/Avatar";
import { BsEmojiSmileFill, BsPlusCircle, BsSearch, BsThreeDots } from "react-icons/bs";
import { IoIosCall, IoMdVideocam } from "react-icons/io";
import { RiMessage2Fill, RiUser2Fill, RiUser2Line } from "react-icons/ri";
import { FaRegEdit, FaUser } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { AiFillHeart, AiOutlineFileImage, AiOutlineGift } from "react-icons/ai";
import { EmojiPicker, Loader } from "../common";
import { IUser } from "./SidebarUser";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API } from "../../api";
import { useCallback, useEffect, useRef, useState } from "react";
import { sendPromiseToastMessage } from "../../lib";
import { useAuth, UserDocument } from "../../providers/Auth";
import moment from "moment";
import { SOCKET_EVENTS } from '../../constants'
import toast from 'react-hot-toast'
import { useMessage } from '../../providers/Message'

export interface MessageFormValues {
  receiver: string
  body: string
  seen?: boolean
}
export interface DashboardContentProps {
  selectedUser: IUser | null
  activeUsers: IUser[]
  toggleUserProfile: () => void
  socket: any
}
export interface IMessage {
  _id?: string
  sender: UserDocument
  receiver: UserDocument
  body: string
  createdAt: string
  seen: boolean
}

export default function DashboardContent({
  toggleUserProfile,
  selectedUser,
  activeUsers,
  socket,
}: DashboardContentProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<any>(null)
  const { messages, setMessages } = useMessage()
  useState
  const { isLoading: messagesLoading } = useQuery(
    [API.MESSAGE.GET_MESSAGES.name, { receiver: selectedUser?._id }],
    API.MESSAGE.GET_MESSAGES,
    {
      enabled: !!selectedUser?._id,
      onSuccess: ({ data }) => {
        setMessages((values) => ({
          ...values,
          [selectedUser?._id as string]: data?.result,
        }))
      },
    }
  )
  const { mutateAsync: createMessage } = useMutation(API.MESSAGE.CREATE_MESSAGE)
  const [value, setValue] = useState('')
  const [whoIsTyping, setWhoIsTyping] = useState('')

  const sendMessage = useCallback(
    async (values: MessageFormValues) => {
      const message = await sendPromiseToastMessage(
        createMessage(values),
        'Sending',
        'Successfully sent your message'
      )
      setMessages((values) => ({
        ...values,
        [selectedUser?._id as string]: [
          ...(values?.[selectedUser?._id as string] || []),
          message,
        ],
      }))
      await queryClient.refetchQueries([
        API.MESSAGE.GET_LAST_MESSAGE.name,
        {
          receiver: values.receiver,
        },
      ])
      setValue('')
      socket.emit(SOCKET_EVENTS.MESSAGE_SENT, {
        sender: user,
        receiver: selectedUser,
        message,
      })
    },
    [user, selectedUser, messages]
  )
  const sendShowTyping = useCallback(async () => {
    socket.emit(SOCKET_EVENTS.TYPING, {
      sender: user,
      receiver: selectedUser,
    })
  }, [user, selectedUser])
  const sendTypingEnd = useCallback(async () => {
    socket.emit(SOCKET_EVENTS.TYPING_END, {
      sender: user,
      receiver: selectedUser,
    })
  }, [user, selectedUser])

  useEffect(() => {
    if (!messagesEndRef.current) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  })

  useEffect(() => {
    socket.on(
      SOCKET_EVENTS.MESSAGE_SENT,
      async ({ sender, message }: { sender: IUser; message: IMessage }) => {
        setMessages((values) => {
          const messages = [
            ...(values?.[message?.sender?._id as string] || []),
            message,
          ]
          return {
            ...values,
            [message?.sender?._id as string]: messages,
          }
        })
        toast.success(
          `${sender.firstName} ${sender.lastName} has sent you a message!`
        )
        await queryClient.refetchQueries([
          API.MESSAGE.GET_LAST_MESSAGE.name,
          {
            receiver: sender._id,
          },
        ])
      }
    )
    socket.on(SOCKET_EVENTS.TYPING, ({ sender }: { sender: IUser }) => {
      setWhoIsTyping(`${sender.firstName} ${sender.lastName} is typing...`)
    })
    socket.on(SOCKET_EVENTS.TYPING_END, ({ sender }: { sender: IUser }) => {
      setWhoIsTyping('')
    })
  }, [])

  if (!selectedUser)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p>Please select a friend to chat with. ????</p>
      </div>
    )
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-16 w-full items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar
            {...(activeUsers.some((u) => u._id === selectedUser._id)
              ? { status: 'active' }
              : {})}
            src={selectedUser?.avatar || 'https://picsum.photos/100'}
            width={40}
            height={40}
          />
          <span className="text-xl font-semibold">
            {selectedUser?.firstName} {selectedUser?.lastName}
          </span>
        </div>

        <div className="flex gap-3">
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100">
            <IoIosCall />
          </button>
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100">
            <IoMdVideocam />
          </button>
          <button
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100"
            onClick={toggleUserProfile}
          >
            <FaUser />
          </button>
        </div>
      </div>

      <div className="scrollbar flex h-full w-full flex-col-reverse overflow-y-auto">
        {false ? (
          <div className="flex flex-col items-center gap-1 px-5 py-10">
            <Avatar
              src={selectedUser?.avatar || 'https://picsum.photos/100'}
              width={70}
              height={70}
            />
            <span className="text-xl font-semibold">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </span>
            <span className="text-base font-medium">
              {selectedUser?.firstName} {selectedUser?.lastName} is Connected
            </span>
            <span className="text-base font-medium">3 days ago</span>
          </div>
        ) : (
          <div className={`p-5 pb-0 ${!messages?.length ? 'h-full' : ''}`}>
            {messagesLoading ? (
              <Loader />
            ) : !messages?.[selectedUser?._id as string]?.length ? (
              <div className="flex h-full w-full flex-col items-center justify-center p-5 py-10">
                <p>No messages found. ????</p>
              </div>
            ) : (
              <>
                <div className="flex h-full flex-col justify-end gap-5">
                  {messages?.[selectedUser?._id as string]?.map(
                    (message: IMessage) =>
                      message.body.includes('base64') ? (
                        <div
                          key={message._id}
                          className={`flex items-start gap-3 ${
                            message.sender._id === user?._id
                              ? 'flex-row-reverse'
                              : ''
                          }`}
                        >
                          <Avatar
                            src={
                              message.sender._id === user?._id
                                ? message.sender.avatar ||
                                  'https://picsum.photos/100'
                                : message.receiver.avatar ||
                                  'https://picsum.photos/100'
                            }
                            width={30}
                            height={30}
                          />
                          <div className="flex flex-col items-end">
                            <img
                              src={message.body}
                              className="aspect-video max-h-20 bg-slate-200 object-contain p-3"
                              alt=""
                            />
                            <small className="text-xs text-slate-500">
                              {moment(message.createdAt)
                                .startOf('second')
                                .fromNow()}
                            </small>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={message._id}
                          className={`flex items-start gap-3 ${
                            message.sender._id === user?._id
                              ? 'flex-row-reverse'
                              : ''
                          }`}
                        >
                          <Avatar
                            src={
                              message.sender._id === user?._id
                                ? message.sender.avatar ||
                                  'https://picsum.photos/100'
                                : message.receiver.avatar ||
                                  'https://picsum.photos/100'
                            }
                            width={30}
                            height={30}
                          />
                          <div
                            className={`flex flex-col ${
                              message.sender._id === user?._id
                                ? 'items-end'
                                : ''
                            }`}
                          >
                            <span
                              className="line w-max rounded-sm bg-slate-200 px-[12px] py-[8px] leading-[20px]"
                              dangerouslySetInnerHTML={{
                                __html: message.body.replace(
                                  /(?:\r\n|\r|\n)/g,
                                  '<br>'
                                ),
                              }}
                            />
                            <small className="text-xs text-slate-500">
                              {moment(message.createdAt)
                                .startOf('second')
                                .fromNow()}
                            </small>
                          </div>
                        </div>
                      )
                  )}
                </div>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full items-center gap-1 p-5">
        <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full">
          <BsPlusCircle className="h-5 w-5" />
        </button>
        <label
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full"
          htmlFor="image-send"
        >
          <input
            type="file"
            hidden
            id="image-send"
            onChange={({ target }) => {
              const reader = new FileReader()
              reader.readAsDataURL(target?.files?.[0]!)
              reader.onload = ({ target }) => {
                sendMessage({
                  body: target?.result as string,
                  receiver: selectedUser._id!,
                })
              }
            }}
          />
          <FiImage className="h-5 w-5" />
        </label>
        <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full">
          <AiOutlineFileImage className="h-5 w-5" />
        </button>
        <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full">
          <AiOutlineGift className="h-5 w-5" />
        </button>
        <div className="relative flex flex-1 items-center rounded-full bg-slate-100 px-1 shadow-sm">
          {whoIsTyping && (
            <span className="absolute -top-5 text-xs italic text-stone-500">
              {whoIsTyping}
            </span>
          )}
          <textarea
            placeholder="Aa"
            className="h-10 flex-1 resize-none overflow-y-hidden border-none bg-transparent py-2 pl-3 outline-none"
            value={value}
            onChange={({ target }) => setValue(target.value)}
            onFocus={() => sendShowTyping()}
            onBlur={() => sendTypingEnd()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage({
                  body: e.currentTarget.value,
                  receiver: selectedUser._id!,
                })
              }
            }}
          />
          <EmojiPicker
            onClick={(emoji) =>
              sendMessage({
                body: emoji,
                receiver: selectedUser._id!,
              })
            }
          >
            <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full">
              <BsEmojiSmileFill className="h-5 w-5" />
            </button>
          </EmojiPicker>
        </div>
        <button
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full"
          onClick={() =>
            sendMessage({
              body: value || '???',
              receiver: selectedUser._id!,
            })
          }
        >
          <AiFillHeart className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}