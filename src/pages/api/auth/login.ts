import { NextApiRequest, NextApiResponse } from 'next';
import { fetchApi } from '@/src/lib/fetchApi';
import { DEAS_API_BASE } from '@/src/constants';
import { ApiErrorInterface } from '@/src/lib/definitions';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email, password } = req.body;

  try {
    const loginResponse = await fetchApi(
      'POST',
      `${DEAS_API_BASE}/users/login`,
      {
        email,
        password,
      },
    );

    if (!loginResponse.success) {
      return res.status(loginResponse.status).json({
        message: loginResponse.message,
        status: loginResponse.status,
      });
    }

    const { data } = loginResponse;

    res.setHeader(
      'Set-Cookie',
      `jwt_token=${data.token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${24 * 60 * 60}; Secure`,
    );
    console.log(res.status, 'RES');
    res.status(200).json({ message: 'Logged in successfully', status: 200 });
  } catch (e) {
    const error = e as ApiErrorInterface;
    console.log(error, 'error - login.ts');
    res
      .status(error.response?.status || 500)
      .json({ message: 'Authentication failed' });
  }
}
