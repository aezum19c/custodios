import { AdjuntoModel } from "./adjunto.model";
import { ContratoModel } from "./contrato.model";

export class CustodioModel {
    custodioId?: number;
    titularId?: number;
    nombre?: string;
    apellidos?: string;
    dni?: string;
    capacitacionFlag?: number;
    capacitacionFecha?: string;
    capacitacionNumero?: string;
    fechaSolicitud?: Date;
    actoAdministrativo?: string;
    actoAdministrativoFecha?: Date;
    actoAdministrativoVigencia?: number;
    vigenciaDesde?: Date;
    vigenciaHasta?: Date;
    carneCodigo?: string;
    perdidaFlag?: number;
    perdidaMotivo?: string;
    perdidaFecha?: string;
    cargo?: string;
    estado?: number;
    usuarioRegistro?: number;
    accion?: string;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;

    /*contrato?: ContratoModel[];
    adjunto?: AdjuntoModel; */

    capacitacionFlagAdjunto?: number;
    capacitacionNombreAdjunto?: string;
    capacitacionRutaAdjunto?: string;

    reconocimientoFlagAdjunto?: number;
    reconocimientoNombreAdjunto?: string;
    reconocimientoRutaAdjunto?: string;

    carnetFlagAdjunto?: number;
    carnetNombreAdjunto?: string;
    carnetRutaAdjunto?: string;

    perdidaActoFlagAdjunto?: number;
    perdidaActoNombreAdjunto?: string;
    perdidaActoRutaAdjunto?: string;
}