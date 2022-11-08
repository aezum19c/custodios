import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { URL_API } from 'src/app/utils/constantes.constant';
import { ComunidadModel } from '../models/comunidad.model';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  constructor( private _http: HttpClient ) { }

  getComunidad( titularId : number){
    let url = URL_API + 'titulos?titularId='+titularId;
    
    return this._http.get(url);
  }

  
  insertarComunidad(comunidad: ComunidadModel){
    const url = `${ URL_API }crudTitulo`;
    return this._http.post(url, comunidad)
      .pipe(
        map( resp => {
          return resp;
        })
      );
    }

  updateComunidad(comunidad: ComunidadModel){
    const url = `${ URL_API }crudTitulo`;
    
    return this._http.post(url, comunidad)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  desactivaActivaComunidad(comunidad: ComunidadModel){
    const url = `${ URL_API }crudTitulo`;
    return this._http.post(url, comunidad)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }
}