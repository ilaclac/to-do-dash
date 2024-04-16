import LoginForm from '@/src/ui/forms/login-form';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Deas Group</title>
      </Head>
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="center flex h-20 w-full items-center justify-center rounded-lg bg-blue-500 p-3 md:h-32">
            <div className="w-32 text-white md:w-36">
              <Link href="/">
                <Image
                  src="/deas-logo.webp"
                  width={150}
                  height={150}
                  className=" md:block"
                  alt="Deas Group Logo"
                />
              </Link>
            </div>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
