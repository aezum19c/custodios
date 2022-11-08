import { ComunidadModel } from "./comunidad.model";

export class TituloModel {
    result_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    content!: ComunidadModel[];
}