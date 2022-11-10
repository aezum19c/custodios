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
    capacitacionNombre?: string;
    capacitacionRuta?: string;
    fechaSolicitud?: Date;
    reconocimientoNombre?: string;
    reconocimientoRuta?: string;
    actoAdministrativo?: string;
    perdidaActoAdmNombre?: string;
    perdidaActoAdmRuta?: string;
    actoAdministrativoFecha?: Date;
    actoAdministrativoVigencia?: number;
    vigenciaDesde?: Date;
    vigenciaHasta?: Date;
    carneCodigo?: string;
    carneNombre?: string;
    carneRuta?: string;
    perdidaFlag?: number;
    perdidaMotivo?: string;
    perdidaMotivoDes?: string;
    perdidaFecha?: string;
    cargo?: string;
    estado?: number;
    usuarioRegistro?: number;
    accion?: string;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;
}