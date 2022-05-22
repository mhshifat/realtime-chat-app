import Avatar from "../common/Avatar";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}
export interface SidebarUserProps {
  item: IUser;
  selectedUser: IUser | null;
  onClick: () => void;
}

export default function SidebarUser({ item, onClick, selectedUser }:SidebarUserProps) {
  return (
    <div className={`flex py-2 px-5 items-center hover:bg-slate-100 transition-all duration-500 cursor-pointer ${selectedUser?._id === item._id ? "bg-slate-100" : ""}`} onClick={onClick}>
      <div className="flex items-center gap-3">
        <Avatar src={item.avatar || "https://picsum.photos/100"} width={55} height={55} />
        <span className="text-base font-medium">{item.firstName} - {item.lastName}</span>
      </div>
    </div>
  )
}