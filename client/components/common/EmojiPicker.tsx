import { cloneElement, ReactElement, useState } from 'react';
import dynamic from "next/dynamic";
let Picker: any;
if ((process as any).browser) {
  Picker = dynamic(() => import("emoji-picker-react"))
}

export interface EmojiPickerProps {
  children: ReactElement;
  onClick: (value: string) => void;
}

export default function EmojiPicker({ children, onClick }: EmojiPickerProps) {
  const [toggleEmoji, setToggleEmoji] = useState(false);

  return (
    <span className='relative'>
      {cloneElement(children, {
        onClick: () => setToggleEmoji(value => !value)
      })}
      {toggleEmoji && <div className='absolute right-0 bottom-full mb-5'>
        <Picker onEmojiClick={(_: any, selected: any) => {
          onClick(selected.emoji);
          setToggleEmoji(value => !value);
        }} />
      </div>}
    </span>
  )
}