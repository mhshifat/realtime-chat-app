import Image from 'next/image';

export interface AvatarProps {
  src: string
  alt?: string
  width: number
  height: number
  status?: 'active'
  statusPlacement?: 'bottom-right'
  onClick?: () => void
}

export default function Avatar({
  src,
  onClick,
  status,
  alt,
  statusPlacement = 'bottom-right',
  width,
  height,
}: AvatarProps) {
  return (
    <div
      className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-full"
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-full"
      />
      {status && (
        <span
          className={`absolute flex h-[10px] w-[10px] items-center justify-center rounded-full ${
            status === 'active' ? 'bg-green-500' : ''
          } ${
            statusPlacement === 'bottom-right' ? 'bottom-[1px] right-[1px]' : ''
          }`}
        />
      )}
    </div>
  )
}
