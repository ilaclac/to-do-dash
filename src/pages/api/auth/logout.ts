import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    'jwt_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  );
  res.status(200).send({ message: 'Logged out successfully' });
}
