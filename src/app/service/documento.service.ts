import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { URL_API } from 'src/app/utils/constantes.constant';
import { AdjuntoModel } from 'src/app/models/adjunto.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor( 
    private _http: HttpClient
  ) { }

  getListadoAdjuntos( custodioId: Number, pag : Number, regxPag: Number ){
    let url = URL_API + 'adjuntos?custodioId='+custodioId + '&pagina=' + pag + '&regxpag=' + regxPag;
    
    return this._http.get(url);
  }

  uploadAdjunto(adjunto: File, usuarioId: number,custodioId: number, asunto: string, extension: string, nombre: string){
    const url = `${ URL_API }uploadAdjunto`;

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;',
      'asunto': asunto,
      //'adjuntoId':adjuntoId
      'extension': extension,
      'custodioId': custodioId+'',
      'usuarioId': usuarioId+'',
      'nombre': nombre,//sin extension
    });

    return this._http.post(url, adjunto, {headers})
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  downloadAdjunto(infractorId: number, adjuntoId: number){
      const url = `${ URL_API }downloadAdjunto`;

      const headers = new HttpHeaders({
        'infractorId': infractorId+'',
        'adjuntoId': adjuntoId+'',
      });

      return this._http.get(url, {headers, responseType: 'arraybuffer'});
  }

  insertarDocumento(doc: AdjuntoModel){
      const url = `${ URL_API }regGpaDocumento`;
      return this._http.post(url, doc)
        .pipe(
          map( resp => {
            return resp;
          })
        );
  }

  updateDocumento(doc: AdjuntoModel){
      const url = `${ URL_API }modificarAdjunto`;
      
      return this._http.post(url, doc)
        .pipe(
          map( resp => {
            return resp;
          })
        );
  }

  eliminarDocumento(doc: AdjuntoModel){
      const url = `${ URL_API }eliminarAdjunto`;
      return this._http.post(url, doc)
        .pipe(
          map( resp => {
            return resp;
          })
        );
  }

  getReporte(filtro: string){
    const url = `${ URL_API }reporte`;
    const headers = new HttpHeaders({
      'buscar': filtro+'',
    });

    return this._http.get(url, {headers, responseType: 'arraybuffer'});
  }
}
