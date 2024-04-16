import { fetchApi } from '@/src/lib/fetchApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { DEAS_API_BASE } from '@/src/constants';
import { ApiErrorInterface } from '@/src/lib/definitions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies.jwt_token;
  const { id } = req.body;

  try {
    const response = await fetchApi(
      'DELETE',
      `${DEAS_API_BASE}/to-do-items/${id}`,
      {},
      token,
    );

    if (!response.success) {
      return res.status(response.status).json({
        message: response.message,
        status: response.status,
      });
    }

    res.status(200).json(response.data);
  } catch (e) {
    const error = e as ApiErrorInterface;
    console.log(error, 'error - delete-item.ts');
    res
      .status(error.response?.status || 500)
      .json({ message: 'Item delete failed' });
  }
}
