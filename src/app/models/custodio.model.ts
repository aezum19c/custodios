import { AdjuntoModel } from "./adjunto.model";
import { ContratoModel } from "./contrato.model";

export class CustodioModel {
    custodioId?: number;
    nombres?: string;
    apellidos?: string;
    dniCe?: string;
    cargo?: string;
    recibioCapacitacion?: string;
    fechaCapacitacion?: string;
    numeroConstanciaCapacitacion?: string;
    solicitudReconocimiento?: string;
    fechaSolicitud?: Date;
    actoAdministrativo?: string;
    fechaActoAdministrativo?: Date;
    vigencia?: number;
    inicioVigencia?: Date;
    finVigencia?: Date;
    codigoCarneAcreditacion?: string;
    perdidaAcreditacion?: string;
    motivo?: string;
    motivoDes?: string;
    actoAdminPerdidaAcredi?: string;
    fechaActoAdminPerdidadAcredi?: Date;

    estado?: number;
    usuarioRegistro?: number;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;
    contrato?: ContratoModel[];
    adjunto?: AdjuntoModel;
}