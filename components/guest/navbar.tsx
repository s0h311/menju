import Image from 'next/image'

type NavbarProps = {
  logoUrl?: string
}

export default function Navbar({ logoUrl }: NavbarProps) {
  return (
    <header className='w-full h-[7dvh] left-0 flex items-center'>
      {logoUrl && (
        <div>
          <Image
            src={logoUrl}
            fill
            alt='Restaurant Logo'
          />
        </div>
      )}
      <h1 className='text-lg'>Menju&nbsp;</h1>
      <h2 className='font-'>| Food Easy</h2>
    </header>
  )
}
