import { Avatar, Loader } from "../common";
import { BsChevronRight, BsSearch, BsThreeDots } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import SidebarUser, { IUser } from "./SidebarUser";
import { useQuery } from "react-query";
import { API } from "../../api";
import { useAuth } from "../../providers/Auth";
import { useMemo } from "react";

export interface DashboardSidebarProps {
  selectedUser: IUser | null;
  selectUser: (user: IUser | null) => void;
}

export default function DashboardSidebar({ selectUser, selectedUser }: DashboardSidebarProps) {
  const { user } = useAuth();
  const { data: friends, isLoading: friendsLogin } = useQuery([API.USER.GET_FRIENDS.name, { id: user?._id }], API.USER.GET_FRIENDS, {
    enabled: !!user?._id
  });

  const allFriends = useMemo(() => friends?.data?.result?.filter((item: IUser) => item._id !== user?._id), [friends, user])
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full !h-16 flex items-center px-5 justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar || "https://picsum.photos/100"} width={40} height={40} />
          <span className="text-xl font-semibold">{user?.firstName} {user?.lastName}</span>
        </div>

        <div className="flex gap-3">
          <button className="bg-slate-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"><BsThreeDots /></button>
          <button className="bg-slate-100 w-[30px] h-[30px] rounded-full flex justify-center items-center"><FaRegEdit /></button>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-slate-100 rounded-full flex items-center border border-stone-100 transition-all duration-500 focus-within:border focus-within:border-blue-600">
          <BsSearch className="w-[50px] flex justify-center items-center" />
          <input type="text" className="h-[40px] flex-1 outline-none border-none bg-transparent" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex gap-2 overflow-auto scrollbar-h">
          {new Array(10).fill("").map((_, itemId) => <Avatar key={itemId} src="https://picsum.photos/100" width={45} height={45} status="active" />)}
        </div>
      </div>

      <div className="w-full h-full flex flex-col overflow-y-auto scrollbar">
        {friendsLogin ? (
          <Loader />
        ) : allFriends?.length ? (
          <>
            {allFriends.map((item: IUser) => <SidebarUser selectedUser={selectedUser} onClick={() => selectUser(item)} key={item._id} item={item} />)}
          </>
        ) : (
          <div className="flex justify-center items-center w-full p-5 h-full">
            No result found 😟
          </div>
        )}
      </div>
    </div>
  )
}