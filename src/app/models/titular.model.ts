import { CustodioModel } from "./custodio.model";

export class TitularModel {
    titularId?: number;
    tipoCustodio?: string;
    tipoCustodioDes?: string;
    nroTituloHabilitante?: string;
    vigenciaInicio?: string;
    vigenciaFin?: string;
    nombreTituloHabilitante?: string;
    tipoPersona?: string;
    tipoPersonaDes?: string;
    nombreTitularComunidad?: string;
    dniRucTitular?: string;
    nombreRepLegal?: string;
    dniRucRepLegal?: string;
    ambitoTerritorial?: string;
    ubigeoId?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    departamentoNombre?: string;
    provinciaNombre?: string;
    distritoNombre?: string;
    nombreUbigeo?: string;
    extension?: string;
    comiteActoReconocimiento?: string;
    fechaActoReconocimiento?: string;
    vigencia?: string;
    periodoDesde?: string;
    periodoHasta?: string;
    fechaSolicitud?: string;
    nombreAdjunto?: string;
    rutaAdjunto?: string;
    custodioNombres?: string;
    custodioCarne?: string;
    custodioActoAdministrativo?: string;
    custodioActoAdministrativoFecha?: string;
    estado?: number;
    usuarioRegistro?: number;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;
    accion?: string;
    
    custodio?: CustodioModel[];
}