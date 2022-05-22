import Image from 'next/image';

export interface AvatarProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  status?: "active";
  statusPlacement?: "bottom-right";
}

export default function Avatar({ src, status, alt, statusPlacement = "bottom-right", width, height }: AvatarProps) {
  return (
    <div className='rounded-full relative flex justify-center items-center shrink-0 cursor-pointer'>
      <Image src={src} alt={alt} width={width} height={height} className="rounded-full" />
      {status && <span className={`absolute w-[10px] h-[10px] rounded-full flex justify-center items-center ${
        status === "active" ? "bg-green-500" : ""
      } ${
        statusPlacement === "bottom-right" ? "bottom-[1px] right-[1px]" : ""
      }`} />}
    </div>
  )
}
