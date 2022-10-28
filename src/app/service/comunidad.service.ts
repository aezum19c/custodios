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

  getComunidad( infractorId : Number, pag : Number, regxPag: Number ){
    let url = URL_API + 'adjuntos?infractorId='+infractorId + '&pagina=' + pag + '&regxpag=' + regxPag;
    
    return this._http.get(url);
  }

  
  insertarComunidad(comunidad: ComunidadModel){
    const url = `${ URL_API }regGpaDocumento`;
    return this._http.post(url, comunidad)
      .pipe(
        map( resp => {
          return resp;
        })
      );
    }

  updateComunidad(comunidad: ComunidadModel){
    const url = `${ URL_API }modificarAdjunto`;
    
    return this._http.post(url, comunidad)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  eliminarDocumento(comunidad: ComunidadModel){
    const url = `${ URL_API }eliminarAdjunto`;
    return this._http.post(url, comunidad)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }
}