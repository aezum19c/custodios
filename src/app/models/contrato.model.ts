import { TitularModel } from "./titular.model";

export class ContratoModel {
    contratoId?: number;
    tipoContrato?: string;
    renovaciones?: string;
    resolucionRenovacion?: string;
    actoAdministrativo?: string;
    fechaActoAdministrativo?: string;
    vigencia?: number;
    inicioVigencia?: number;
    finVigencia?: string;
    estado?: number;
    usuarioRegistro?: number;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;
    titular?: TitularModel[];
}