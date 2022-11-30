import { DominioModel } from "./dominio.model";
import { UserModel } from "./user.model";
import { TitularModel } from "./titular.model";
import { UbigeoModel } from "./ubigeo.model";
import { ComunidadModel } from "./comunidad.model";

export class RespuestaServicio {
    result_code?: Number;
    error_description?: String;
    response_date?: String;
    accessToken?:String;
    usuario? : UserModel;
    content! : TitularModel[];
    detalle!: DominioModel[];
    ubigeos!: UbigeoModel[];
    titulos!: ComunidadModel[];
    titular!: TitularModel;
}