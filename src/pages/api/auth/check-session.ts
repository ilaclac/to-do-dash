import { jwtDecode } from 'jwt-decode';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  token?: string;
  isLoggedIn: boolean;
  name?: string;
};

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  exp: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const token = req.cookies['jwt_token'];

    if (!token) {
      return res.status(200).json({ isLoggedIn: false });
    }

    const decoded: DecodedToken = jwtDecode(token);

    if (decoded.exp < Date.now() / 1000) {
      return res.status(200).json({ isLoggedIn: false });
    }

    res.status(200).json({ isLoggedIn: true, name: decoded.name });
  } catch (error) {
    res.status(401).json({ isLoggedIn: false });
  }
}
