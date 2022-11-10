import { ContratoModel } from "./contrato.model";

export class RespuestaRenovacionModel {
    result_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    content!: ContratoModel[];
}