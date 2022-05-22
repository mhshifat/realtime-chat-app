import Image from "next/image"

export interface LoaderProps {
  fixed?: boolean
}

export default function Loader({ fixed }: LoaderProps) {
  return fixed ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[image:url('/assets/auth-bg.svg')]">
      <div className="absolute bg-[#000] bg-opacity-70 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        <Image src="/assets/loading.svg" alt="loading..." width={100} height={100} />
      </div>
    </div>
  ) : (
    <div className="relative top-0 left-0 right-0 bottom-0 h-full">
      <div className="absolute bg-[#000/.5] bg-opacity-70 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        <Image src="/assets/loading.svg" alt="loading..." width={100} height={100} />
      </div>
    </div>
  )
}