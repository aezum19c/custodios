import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from 'src/app/utils/constantes.constant';

@Injectable({
  providedIn: 'root'
})
export class AdjuntoService {

  constructor( private http: HttpClient ) { }

  getAdjuntos( infractorId : Number, pag : Number, regxPag: Number ){
    let url = URL_API + 'adjuntos?infractorId='+infractorId + '&pagina=' + pag + '&regxpag=' + regxPag;
    
    return this.http.get(url);
  }
}