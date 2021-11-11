import type { Request, Response } from 'express'

export default function Cookies() {
  return (req: Request, res: Response): void => {
    res.render(`pages/cookie-policy`)
  }
}
