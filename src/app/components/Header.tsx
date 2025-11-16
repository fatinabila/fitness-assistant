'use client';
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from 'next-auth/react';

export function Header()

{
    const { data: session } = useSession();

    return <div className="flex items-center mb-4">

      <div className="w-14">

        {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            )}

      </div>


      <div className="w-64">
        Hello, 

        <h1 className="font-bold">{session?.user?.name}</h1>
      </div>
      

              


    </div>
}