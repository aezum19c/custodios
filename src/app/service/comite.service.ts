import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { URL_API } from 'src/app/utils/constantes.constant';
import { ContratoModel } from '../models/contrato.model';


@Injectable({
  providedIn: 'root'
})
export class ComiteService {

  constructor( private _http: HttpClient ) { }

  getComite( titularId : number, pag: number, regxPag: number){
    let url = URL_API + 'comites?titularId='+titularId + '&pag=' + pag + '&regxpag=' + regxPag;
    
    return this._http.get(url);
  }

  
  insertarComite(comite: ContratoModel){
    const url = `${ URL_API }crudComite`;
    return this._http.post(url, comite)
      .pipe(
        map( resp => {
          return resp;
        })
      );
    }

  updateComite(comite: ContratoModel){
    const url = `${ URL_API }crudComite`;
    
    return this._http.post(url, comite)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  desactivaActivaComite(comite: ContratoModel){
    const url = `${ URL_API }crudComite`;
    return this._http.post(url, comite)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }
}