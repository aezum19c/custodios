import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URL_API } from 'src/app/utils/constantes.constant';

@Injectable({
  providedIn: 'root'
})
export class DominiosService {
  constructor( private http: HttpClient ) { }

  getDominioCaducidad(){
    let url= URL_API + 'caducidad';

    return this.http.get(url);
  }

  getDominioObservacion(){
    let url= URL_API + 'observacion';

    return this.http.get(url);
  }
}
