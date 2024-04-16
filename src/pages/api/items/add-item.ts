import { fetchApi } from '@/src/lib/fetchApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { DEAS_API_BASE } from '@/src/constants';
import { ApiErrorInterface } from '@/src/lib/definitions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies.jwt_token;
  const { title, done, id } = req.body;

  try {
    const body = {
      id,
      title,
      done,
    };
    const response = await fetchApi(
      'POST',
      `${DEAS_API_BASE}/to-do-items`,
      body,
      token,
    );
    res.status(200).json(response.data);
  } catch (e) {
    const error = e as ApiErrorInterface;
    console.log(error, 'error - add-item.ts');
    res
      .status(error.response?.status || 500)
      .json({ message: 'Item creation failed' });
  }
}
