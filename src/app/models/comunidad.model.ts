import { TitularModel } from "./titular.model";

export class ComunidadModel {
    comunidadId?: number;
    nroTituloHabilitante?: string;
    extension?: string;
    fechaPeriodoInicio?: string;
    fechaPeriodoFin?: string;
    vigencia?: number;
    estado?: number;
    usuarioRegistro?: number;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;
    titular?: TitularModel[];
}