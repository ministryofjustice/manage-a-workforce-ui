import { Request, ParamsDictionary, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

export default class AllocateCasesController {
  
    constructor(
     
    ) {}

    getDataByTeams(req: Request, res: Response) {
        res.render('pages/allocate-cases-by-team', {
            title: 'Allocate cases by team | Manage a workforce',
            teams: [],
            pduCode: "",
          })
      }

}