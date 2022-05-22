import { RiMessageLine } from 'react-icons/ri'

export interface LogoProps {}

export default function Logo({}: LogoProps) {
  return (
    <button className="flex items-center border-none bg-none text-base font-semibold uppercase tracking-tighter outline-none">
      <RiMessageLine className="mr-1 text-lg text-slate-600" />
      <span className="text-slate-600">Chat</span>
      <span className="text-blue-400">App</span>
      <span className="text-slate-600">.</span>
    </button>
  )
}
