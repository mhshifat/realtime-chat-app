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

export interface MessageFormValues {
  receiver: string
  body: string
}
export interface DashboardContentProps {
  selectedUser: IUser | null;
  toggleUserProfile: () => void;
}
export interface IMessage {
  _id?: string;
  sender: UserDocument;
  receiver: UserDocument;
  body: string;
  createdAt: string;
}

export default function DashboardContent({ toggleUserProfile, selectedUser }: DashboardContentProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<any>(null);
  const { data: messages, isLoading: messagesLoading, isFetched } = useQuery([API.MESSAGE.GET_MESSAGES.name, { receiver: selectedUser?._id }], API.MESSAGE.GET_MESSAGES, {
    enabled: !!selectedUser?._id,
  });
  const { mutateAsync: createMessage } = useMutation(API.MESSAGE.CREATE_MESSAGE);
  const [value, setValue] = useState("");

  const sendMessage = useCallback(async (values: MessageFormValues) => {
    await sendPromiseToastMessage(
      createMessage(values),
      "Sending",
      "Successfully sent your message"
    )
    await queryClient.refetchQueries(API.MESSAGE.GET_MESSAGES.name);
    setValue("");
  }, [])

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  })

  if (!selectedUser) return (
    <div className="w-full flex flex-col h-full justify-center items-center">
      <p>Please select a friend to chat with. 😊</p>
    </div>
  )
  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full h-16 flex items-center px-5 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar status="active" src={selectedUser?.avatar || "https://picsum.photos/100"} width={40} height={40} />
          <span className="text-xl font-semibold">{selectedUser?.firstName} {selectedUser?.lastName}</span>
        </div>

        <div className="flex gap-3">
          <button className="bg-slate-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"><IoIosCall /></button>
          <button className="bg-slate-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"><IoMdVideocam /></button>
          <button className="bg-slate-100 w-[30px] h-[30px] rounded-full flex justify-center items-center" onClick={toggleUserProfile}><FaUser /></button>
        </div>
      </div>

      <div className="w-full h-full overflow-y-auto scrollbar flex flex-col-reverse">
        {false ? (
          <div className="flex flex-col items-center px-5 py-10 gap-1">
            <Avatar src={selectedUser?.avatar || "https://picsum.photos/100"} width={70} height={70} />
            <span className="text-xl font-semibold">{selectedUser?.firstName} {selectedUser?.lastName}</span>
            <span className="text-base font-medium">{selectedUser?.firstName} {selectedUser?.lastName} is Connected</span>
            <span className="text-base font-medium">3 days ago</span>
          </div>
        ) : (
          <div className={`p-5 pb-0 ${!messages?.data?.result?.length ? "h-full" : ""}`}>
            {messagesLoading ? (
              <Loader />
            ) : !messages?.data?.result?.length ? (
              <div className="w-full flex flex-col h-full justify-center items-center p-5 py-10">
                <p>No messages found. 😊</p>
              </div>
            ) : (
              <>
                <div className="h-full flex flex-col gap-5">
                  {messages?.data?.result?.map((message: IMessage) => message.body.includes("base64") ? (
                    <div key={message._id} className="flex gap-3 items-start flex-row-reverse">
                      <Avatar src={message.sender._id === user?._id ? message.sender.avatar || "https://picsum.photos/100" : message.receiver.avatar || "https://picsum.photos/100"} width={30} height={30} />
                      <div className="flex flex-col items-end">
                        <img src={message.body} className="bg-slate-200 p-3 aspect-video object-contain max-h-20" alt="" />
                        <small className="text-xs text-slate-500">{moment(message.createdAt).startOf('second').fromNow()}</small>
                      </div>
                    </div>
                  ) : (
                    <div key={message._id} className={`flex gap-3 items-start ${message.sender._id === user?._id ? "flex-row-reverse" : ""}`}>
                      <Avatar src={message.sender._id === user?._id ? message.sender.avatar || "https://picsum.photos/100" : message.receiver.avatar || "https://picsum.photos/100"} width={30} height={30} />
                      <div className={`flex flex-col ${message.sender._id === user?._id ? "items-end" : ""}`}>
                        <span className="bg-slate-200 px-3 py-1 rounded-sm w-max">{message.body}</span>
                        <small className="text-xs text-slate-500">{moment(message.createdAt).startOf('second').fromNow()}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full p-5 flex gap-1 items-center">
        <button className="w-[30px] h-[30px] rounded-full flex justify-center items-center"><BsPlusCircle className="w-5 h-5" /></button>
        <label className="cursor-pointer w-[30px] h-[30px] rounded-full flex justify-center items-center" htmlFor="image-send">
          <input type="file" hidden id="image-send" onChange={({ target }) => {
            const reader = new FileReader();
            reader.readAsDataURL(target?.files?.[0]!);
            reader.onload = ({ target }) => {
              sendMessage({
                body: target?.result as string,
                receiver: selectedUser._id!
              })
            }
          }} />
          <FiImage className="w-5 h-5" />
        </label>
        <button className="w-[30px] h-[30px] rounded-full flex justify-center items-center"><AiOutlineFileImage className="w-5 h-5" /></button>
        <button className="w-[30px] h-[30px] rounded-full flex justify-center items-center"><AiOutlineGift className="w-5 h-5" /></button>
        <div className="flex flex-1 items-center bg-slate-100 rounded-full shadow-sm px-1">
          <input type="text" placeholder="Aa" className="bg-transparent flex-1 outline-none border-none pl-3 h-10" value={value} onChange={({ target }) => setValue(target.value)} />
          <EmojiPicker onClick={(emoji) => sendMessage({
          body: emoji,
          receiver: selectedUser._id!
        })}>
            <button className="w-[30px] h-[30px] rounded-full flex justify-center items-center"><BsEmojiSmileFill className="w-5 h-5" /></button>
          </EmojiPicker>
        </div>
        <button className="w-[30px] h-[30px] rounded-full flex justify-center items-center" onClick={() => sendMessage({
          body: value || "❤",
          receiver: selectedUser._id!
        })}><AiFillHeart className="w-5 h-5" /></button>
      </div>
    </div>
  )
}