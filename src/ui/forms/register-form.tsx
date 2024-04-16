import { lusitana } from '@/src/ui/fonts';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/src/ui/button';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import React, { useState } from 'react';
import { fetchApi } from '@/src/lib/fetchApi';
import { REGISTER_ROUTE } from '@/src/constants';
import { RegisterData } from '@/src/lib/definitions';
import Router from 'next/router';
import { validateEmail } from '@/src/utils';

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    setErrorMessage('');
    if (data.password !== data.confirmPassword) {
      setErrorMessage(`Passwords don't match!`);
      return;
    }

    if (data.password.length < 6) {
      setErrorMessage('String must contain at least 6 character(s)');
      return;
    }

    if (!validateEmail(data.email)) {
      setErrorMessage('Must be a real email');
      return;
    }

    try {
      await fetchApi('POST', REGISTER_ROUTE, {
        name: data.name,
        email: data.email,
        password: data.password,
      }).then((res) => {
        if (res.status === 200) {
          alert('You have been registered! Redirecting to homepage');
          Router.push('/');
        } else {
          setErrorMessage('Registration was not successful!');
        }
      });
    } catch (e) {
      setErrorMessage(`${e}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Register to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="name"
                {...register('name', {
                  required: 'Field is required.',
                  minLength: {
                    value: 3,
                    message: 'Min length is 3 characters.',
                  },
                })}
                placeholder="Enter your name"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="pt-1 text-red-500">{errors.name?.message}</p>
          </div>
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
                    value: 6,
                    message: 'Min length is 6 characters.',
                  },
                })}
                placeholder="Enter password"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="pt-1 text-red-500">{errors.password?.message}</p>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Field is required.',
                  minLength: {
                    value: 6,
                    message: 'Min length is 6 characters.',
                  },
                })}
                placeholder="Confirm password"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <p className="pt-1 text-red-500">
              {errors.confirmPassword?.message}
            </p>
          </div>
          {errorMessage && (
            <p className="inline-flex items-center pt-1 text-red-500">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              {typeof errorMessage === 'string'
                ? errorMessage
                : 'There was an error while registering.'}
            </p>
          )}
        </div>
        <RegisterButton />
        <div className="mt-5">
          <p className={`${lusitana.className} text-md mb-1`}>
            Already have an account?
          </p>
          <Link
            href="/login"
            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            <span>Login</span>{' '}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Link>
        </div>
      </div>
    </form>
  );
}

function RegisterButton() {
  return (
    <Button className="mt-4 w-full">
      Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
