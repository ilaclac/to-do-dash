import { lusitana } from '@/src/ui/fonts';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/src/ui/button';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/src/lib/fetchApi';
import { LOGIN_ROUTE } from '@/src/constants';
import { LoginData } from '@/src/lib/definitions';
import Router from 'next/router';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const [errorMessage, setErrorMessage] = useState(false);

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      await fetchApi('POST', LOGIN_ROUTE, {
        email: data.email,
        password: data.password,
      }).then((res) => {
        if (res.status === 200) {
          Router.push('/');
        } else {
          setErrorMessage(true);
        }
      });
    } catch (e) {
      setErrorMessage(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(false);
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timeout on component unmount
  }, [errorMessage]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                {...register('email', { required: 'Field is required.' })}
                placeholder="Enter your email address"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="pt-1 text-red-500">{errors.email?.message}</p>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                {...register('password', {
                  required: 'Field is required.',
                  minLength: {
                    value: 4,
                    message: 'Min length is 4 characters.',
                  },
                })}
                placeholder="Enter password"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="pt-1 text-red-500">{errors.password?.message}</p>
          </div>
          {errorMessage && (
            <p className="inline-flex items-center pt-1 text-red-500">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              Wrong email or password entered.
            </p>
          )}
        </div>
        <LoginButton />
        <div className="mt-5">
          <p className={`${lusitana.className} text-md mb-1`}>
            Don&apos;t have an account?
          </p>
          <Link
            href="/register"
            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            <span>Register</span>{' '}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Link>
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  return (
    <Button className="mt-4 w-full" type="submit">
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
