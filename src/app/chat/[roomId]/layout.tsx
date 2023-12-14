import NavLink from '@/components/ui/NavLink'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FleetFox AI | Chatbot v0.1',
  description: 'Generated by create next app',
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex overflow-hidden text-white">
    <aside className="p-4 h-screen w-64 bg-zinc-900 flex flex-col">
      <Image
        src={"/images/logo-dark.png"}
        width={350}
        height={150}
        alt={"FleetFox.ai"}
        quality={100}
        className="w-44 mx-auto"
      />
      <section className="flex flex-col justify-between h-full">
        <Link
          href={"/chat/random-new-chat"}
          className="my-5 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-md text-center">
          New chat
        </Link>
        <ul className="flex flex-col gap-2 overflow-y-auto max-h-[550px] sidebar-scrollbar">
          {[...Array(16)].map((a,i) => (
            <li key={i}>
              <NavLink
                href={`/chat/chat-${i+1}`}
                className="p-2 hover:bg-zinc-800 transition-colors rounded-md block truncate relative after:absolute after:h-full after:w-12 after:bg-gradient-to-l after:from-zinc-900 after:right-0 after:top-0" ActiveClass="bg-zinc-700 after:hidden">
                this is fake chat {i+1} and this is
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="mt-5 flex p-2 hover:bg-zinc-800 transition-colors rounded-md items-center gap-3">
          <Image src={'/images/avatar.jpg'} width={30} height={30} alt='Avatar' quality={100} className='rounded-full'/>
          <div>
            MooudMohammadi
          </div>
        </button>
      </section>
    </aside>
    <main className="flex-1 bg-zinc-800">{children}</main>
  </div>
  )
}