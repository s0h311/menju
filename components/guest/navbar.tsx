import Image from 'next/image'

type NavbarProps = {
  logoUrl: string
}

export default function Navbar({ logoUrl }: NavbarProps) {
  return (
    <header className='w-full h-[9dvh] flex items-center'>
      {logoUrl && (
        <div className='h-full py-2'>
          <Image
            className='w-auto h-full'
            src={logoUrl}
            width={0}
            height={0}
            sizes='40dvw'
            alt='Restaurant Logo'
            priority
          />
        </div>
      )}
    </header>
  )
}
