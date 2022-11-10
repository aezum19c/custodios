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

  getContrato( custodioId : Number ){
    let url = URL_API + 'renovaciones?custodioId='+custodioId;
    
    return this._http.get(url);
  }

  
  insertarContrato(contrato: ContratoModel){
    const url = `${ URL_API }crudRenovacion`;
    return this._http.post(url, contrato)
      .pipe(
        map( resp => {
          return resp;
        })
      );
    }

  updateContrato(contrato: ContratoModel){
    const url = `${ URL_API }crudRenovacion`;
    
    return this._http.post(url, contrato)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  desactivaActivaContrato(contrato: ContratoModel){
    const url = `${ URL_API }crudRenovacion`;
    return this._http.post(url, contrato)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }
}