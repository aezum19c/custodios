import { AdjuntoModel } from "./adjunto.model";

export class DocumentoModel {
    restsult_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    content?:AdjuntoModel[];
}