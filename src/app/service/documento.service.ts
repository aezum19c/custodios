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

  uploadAdjunto(adjunto: File, titularId: number, asunto: string, extension: string, nombre: string){
    const url = `${ URL_API }uploadAdjunto`;

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;',
      'asunto': asunto,
      'extension': extension,
      'titularId': titularId+'',
      'nombre': nombre,//sin extension
    });

    return this._http.post(url, adjunto, {headers})
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  downloadAdjunto(infractorId: number, origen: string){
      const url = `${ URL_API }downloadAdjunto`;

      const headers = new HttpHeaders({
        'infractorId': infractorId+'',
        'origen': origen+'',
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

  getReporteCustodio(filtro?: string, tipoCustodio?: string){
    const url = `${ URL_API }reporteCustodio`;
    const headers = new HttpHeaders({
      'buscar': (filtro ?? '') + '',
      'tipoCustodio': (tipoCustodio ?? '') + ''
    });

    return this._http.get(url, {headers, responseType: 'arraybuffer'});
  }

  getFicha(titularId: number ){
    const url = `${ URL_API }fichaCustodio`;
    const headers = new HttpHeaders({
      'titularId': titularId + '',
    });

    return this._http.get(url, {headers, responseType: 'arraybuffer'});
  }

  /* ADJUNTO PARA TITULAR */
  uploadAdjuntoTitular(adjunto: File, titularId: number, extension: string, nombre: string){
    const url = `${ URL_API }uploadTitular`;

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;',
      'extension': extension,
      'titularId': titularId+'',
      'nombre': nombre,//sin extension
    });

    return this._http.post(url, adjunto, {headers})
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }


  downloadAdjuntoTitular(titularId: number){
    const url = `${ URL_API }downloadAdjuntoTitular`;

    const headers = new HttpHeaders({
      'titularId': titularId+'',
    });

    return this._http.get(url, {headers, responseType: 'arraybuffer'});
  }

  eliminarAdjuntoTitular(doc: AdjuntoModel){
    const url = `${ URL_API }eliminarAdjuntoTitular`;
    return this._http.post(url, doc)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  /* ADJUNTOS PARA CUSTODIOS */
  uploadAdjuntoCustodio(adjunto: File, custodioId: number, origen: string, extension: string, nombre: string){
    const url = `${ URL_API }uploadAdjuntoCustodio`;

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;',
      'origen': origen,
      'extension': extension,
      'custodioId': custodioId+'',
      'nombre': nombre,//sin extension
    });

    return this._http.post(url, adjunto, {headers})
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  downloadAdjuntoCustodio(custodioId: number, origen: string){
      const url = `${ URL_API }downloadAdjuntoCustodio`;

      const headers = new HttpHeaders({
        'custodioId': custodioId+'',
        'origen': origen+'',
      });

      return this._http.get(url, {headers, responseType: 'arraybuffer'});
  }

  eliminarDocumentoCustodio(docAdj: AdjuntoModel){
    const url = `${ URL_API }eliminarAdjuntoCustodio`;

    let obj = {
      custodioId: docAdj.custodioId,
      origen: docAdj.origen
    }
    return this._http.post(url, obj)
      .pipe(
        map( resp => {
          return resp;
        })
      );
}
}
