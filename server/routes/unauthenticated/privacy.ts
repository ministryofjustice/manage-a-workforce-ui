import type { Request, Response } from 'express'

export default function Privacy() {
  return (req: Request, res: Response): void => {
    res.render(`pages/privacy-notice`)
  }
}
