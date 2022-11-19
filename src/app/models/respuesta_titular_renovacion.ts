import { TitularRenovacionModel } from "./titular_renovacion.model";

export class RespuestaComiteModel {
    result_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    content!: TitularRenovacionModel[];
}