import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'src/app/utils/constantes.constant';
import { CustodioModel } from '../models/custodio.model';
import { TitularModel } from '../models/titular.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustodiosService {

  constructor(private http: HttpClient) { }

  getTitulares( usuarioId : Number, filtro: string, tipoCustodio: string,  pag : Number, regxPag: Number ){
    let url = URL_API + 'titulares?tipo=' + tipoCustodio + '&buscar='+filtro + '&desde='  + '' + '&hasta=' + '' + '&pagina=' + pag + '&regxpag=' + regxPag;
    
    return this.http.get(url);
  }

  crearTitular(titular: TitularModel){
    const url = `${ URL_API }crudTitular`;
    return this.http.post(url, titular)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  modificarTitular(titular: TitularModel){
    const url = `${ URL_API }crudTitular`;
    return this.http.post(url, titular)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }

  activaDesactivarTitular(titular: TitularModel){
    const url = `${ URL_API }crudTitular`;
    let obj = {
      titularId: titular.titularId,
      accion: titular.accion
    }
    return this.http.post(url, obj)
      .pipe(
        map( resp => {
          return resp;
        })
      );
  }
}
