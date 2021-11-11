import type { Request, Response } from 'express'

export default function Accessibility() {
  return (req: Request, res: Response): void => {
    res.render(`pages/accessibility-statement`)
  }
}
