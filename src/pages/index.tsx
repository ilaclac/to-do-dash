import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/src/ui/fonts';
import Image from 'next/image';
import { Button } from '@/src/ui/button';
import Head from 'next/head';
import useCheckSession from '@/src/hooks/useCheckSession';

export default function Page() {
  const { status, userName, logout } = useCheckSession();

  return (
    <>
      <Head>
        <title>Deas Group</title>
      </Head>
      <main className="flex min-h-screen flex-col p-6">
        <div className="md:h-35 h-30 flex shrink-0 items-end rounded-lg bg-blue-500 p-4">
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
        <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/5 md:px-20">
            <p
              className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
            >
              <strong className="text-5xl text-red-500">
                {status ? userName.toUpperCase() + ',' : ''}
              </strong>
              <br />
              <strong>Welcome to Deas Group.</strong>
            </p>
            {!status ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                  <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                  <span>Register</span>{' '}
                  <ArrowRightIcon className="w-5 md:w-6" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                  <span>Proceed to Dashboard</span>{' '}
                  <ArrowRightIcon className="w-5 md:w-6" />
                </Link>
                <Button
                  onClick={logout}
                  className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                >
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center justify-center p-6 md:w-4/5 md:px-28 md:py-12">
            <Image
              src="/city.webp"
              width={1000}
              height={860}
              className="hidden rounded-3xl md:block"
              alt="City view"
            />
          </div>
        </div>
      </main>
    </>
  );
}
