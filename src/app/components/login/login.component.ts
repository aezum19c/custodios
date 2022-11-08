import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RespuestaServicio } from '../../models/respuesta_servicio.model';
import { UsuarioService } from 'src/app/service/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usermodel : UsuarioModel = new UsuarioModel();
  respuestaServicio : RespuestaServicio = new RespuestaServicio();

  constructor(
    private router: Router,
    private usarioService: UsuarioService
    ) { }

  ngOnInit(): void {
  }

  login( form: NgForm){
    
    if( form.invalid ) { return; }

    this.usarioService.getUsuario( this.usermodel ).subscribe( ( data: any ) => {
  
      switch( data.result_code ) { 
        case 200: { 
            this.respuestaServicio = data;
            
            localStorage.removeItem( 'usuariosession' );
            localStorage.setItem( 'usuariosession', JSON.stringify( this.respuestaServicio.usuario ) );

            this.router.navigate( ['/custodios']) ;

            Swal.fire({
              title: '¡Bienvenido!',
              text:'Bienvenido al Sistema de Infractores',
              icon: 'success',
              allowOutsideClick: false
            });

           break; 
        } 
        case 401: { 
          Swal.fire({
            title: 'Datos Incorrectos',
            text:'No ha podido iniciar la sesión, ingrese los datos correctos',
            icon: 'error',
            allowOutsideClick: false
          });
           break; 
        } 
        case 402: { 
          Swal.fire({
            title: 'Sin Roles',
            text:'No tiene Roles asignados',
            icon: 'info',
            allowOutsideClick: false
          });
            break; 
        } 
        case 501: { 
          Swal.fire({
            title: 'Problemas',
            text:'No se ha podido iniciar la sesión, vuelva a intentar',
            icon: 'error',
            allowOutsideClick: false
          });
            break; 
        } 
        default: { 
           break; 
        } 
     } 
    } );
  }

}
