import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { URL_API } from 'src/app/utils/constantes.constant';
import { ContratoModel } from '../models/contrato.model';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor( private _http: HttpClient ) { }

  getContrato( infractorId : Number, pag : Number, regxPag: Number ){
    let url = URL_API + 'adjuntos?infractorId='+infractorId + '&pagina=' + pag + '&regxpag=' + regxPag;
    
    return this._http.get(url);
  }

  
  insertarContrato(contrato: ContratoModel){
    const url = `${ URL_API }regGpaDocumento`;
    return this._http.post(url, contrato)
      .pipe(
        map( resp => {
          return resp;
        })
      );
    }

updateContrato(contrato: ContratoModel){
    const url = `${ URL_API }modificarAdjunto`;
    
    return this._http.post(url, contrato)
      .pipe(
        map( resp => {
          return resp;
        })
      );
}

eliminarDocumento(contrato: ContratoModel){
    const url = `${ URL_API }eliminarAdjunto`;
    return this._http.post(url, contrato)
      .pipe(
        map( resp => {
          return resp;
        })
      );
}
}