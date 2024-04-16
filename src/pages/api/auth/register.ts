import { NextApiRequest, NextApiResponse } from 'next';
import { fetchApi } from '@/src/lib/fetchApi';
import { serialize } from 'cookie';
import { DEAS_API_BASE } from '@/src/constants';
import { ApiErrorInterface } from '@/src/lib/definitions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, email, password } = req.body;

  try {
    const response = await fetchApi('POST', `${DEAS_API_BASE}/users`, {
      name,
      email,
      password,
    });

    if (!response.success) {
      return res.status(response.status).json({
        message: response.message,
        status: response.status,
      });
    }

    const token = response.data.token;
    if (token) {
      const cookie = serialize('jwt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Secure in prod
        path: '/',
        sameSite: 'strict', // CSRF protection
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      res.setHeader('Set-Cookie', cookie);
    }

    return res
      .status(200)
      .json({ message: 'Registered successfully', status: 200 });
  } catch (e) {
    const error = e as ApiErrorInterface;
    console.log(error, 'error - register.ts');
    res
      .status(error.response?.status || 500)
      .json({ message: 'Registration failed' });
  }
}
