import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { URL_API } from 'src/app/utils/constantes.constant';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor( private http: HttpClient) { }

  getUsuario( usuario: UsuarioModel ){
    const user = {
      ...usuario
    };

    let url = URL_API + 'login';

    return this.http.post(url, user);
  }
}