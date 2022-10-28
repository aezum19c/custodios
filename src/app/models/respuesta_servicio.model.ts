import { DominioModel } from "./dominio.model";
import { CustodioModel } from "./custodio.model";
import { UserModel } from "./user.model";

export class RespuestaServicio {
    restsult_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    usuario? : UserModel;
    content! : CustodioModel[];
    detalle!: DominioModel[];
}