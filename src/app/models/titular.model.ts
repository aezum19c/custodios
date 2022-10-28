import { CustodioModel } from "./custodio.model";

export class TitularModel {
    tituloId?: number;
    nroTituloHabilitante?: string;
    nombreTituloHabilitante?: string;
    nombreTitularHabilitante?: string;
    dniRuc?: string;
    nombreComunidad?: string;
    ambitoTerritorial?: string;
    provincia?: string;
    distrito?: string;
    extension?: string;
    inicioVigencia?: Date;
    finVigencia?: Date;
    solicitudReconocimientoComite?: string;
    fechaSolicitudComite?: string;
    actoAdministrativoComite?: string;
    fechaResolucionComite?: string;
    vigenciaComite?: string;
    inicioVigenciaPermiso?: string;
    finVigenciaPermiso?: string;
    estado?: number;
    usuarioRegistro?: number;
    fechaRegistro?: string;
    totalRegistros?: string;
    totalPaginas?: number;
    custodio?: CustodioModel[];
    tipoCustodio?: string;
}