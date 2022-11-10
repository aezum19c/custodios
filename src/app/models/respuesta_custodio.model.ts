import { CustodioModel } from "./custodio.model";

export class RespuestaCustodioModel {
    result_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    content!: CustodioModel[];
}