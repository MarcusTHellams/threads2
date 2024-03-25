import { Response, CookieOptions } from 'express';

export const time = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 /* 7 days*/);

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  expires: time,
};

export const tokenAndCookieSender = (
  resp: Response,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) => {
  resp
    .cookie('refreshToken', refreshToken, cookieOptions)
    .send({ accessToken });
};
