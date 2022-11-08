import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URL_API } from 'src/app/utils/constantes.constant';

@Injectable({
  providedIn: 'root'
})
export class DominiosService {
  constructor( private http: HttpClient ) { }

  getDominioTiposCustodio(){
    let url= URL_API + 'tiposCustodio';

    return this.http.get(url);
  }

  getDominioTiposPersona(){
    let url= URL_API + 'tiposPersona';

    return this.http.get(url);
  }

  getDepartamentos(tipo: string ){
    let url = URL_API + 'ubigeos?tipo=' + tipo;
    return this.http.get(url);
  }

  getProvincias(tipo: string, departamento:string ){
    let url = URL_API + 'ubigeos?tipo=' + tipo + '&departamento=' + departamento;
    return this.http.get(url);
  }

  getDistritos(tipo: string, departamento:string, provincia: string ){
    let url = URL_API + 'ubigeos?tipo=' + tipo + '&departamento=' + departamento + '&provincia=' + provincia;
    return this.http.get(url);
  }
}
