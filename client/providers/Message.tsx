import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { IUser } from '../components/dashboard/SidebarUser'
import { IMessage } from './../components/dashboard/Content'

interface MessageProviderProps {
  children: ReactElement | ReactElement[]
}

interface MessageCTXProps {
  messages: Record<string, IMessage[]>
  setMessages: Dispatch<SetStateAction<Record<string, IMessage[]>>>
}

const MessageCTX = createContext<MessageCTXProps | null>(null)
export default function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<Record<string, IMessage[]>>({})

  console.log(messages['629372fb144728edd17be113'])

  return (
    <MessageCTX.Provider value={{ messages, setMessages }}>
      {children}
    </MessageCTX.Provider>
  )
}

export const useMessage = () => {
  const state = useContext(MessageCTX)
  if (!state) throw new Error('Message Context is null')
  return state
}
