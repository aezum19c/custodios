import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/app/utils/constantes.constant';
import { CustodioModel } from '../models/custodio.model';

@Injectable({
  providedIn: 'root'
})
export class CustodiosService {

  constructor(private http: HttpClient) { }

  getCustodios( usuarioId : Number, filtro: String, pag : Number, regxPag: Number ){
    let url = URL_API + 'listado?buscar='+filtro + '&pagina=' + pag + '&regxpag=' + regxPag;
    
    return this.http.get(url);
  }

  crearCustodio(custodio: CustodioModel){
    let url = URL_API + 'crear';
    return this.http.post(url, custodio);
  }

  modificarCustodio(custodio: CustodioModel){
    let url = URL_API + 'modificar';
    return this.http.post(url, custodio);
  }

  activarCustodio(params: { custodioId: number, usuarioRegistro: number }){
    let url = URL_API + 'activar';

    return this.http.post(url, params);
  }

  desactivarCustodio(params: { custodioId: number, usuarioRegistro: number }){
    let url = URL_API + 'desactivar';

    return this.http.post(url, params);
  }
}
