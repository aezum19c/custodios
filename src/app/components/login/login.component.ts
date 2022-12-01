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

    this.abrirCargando();
    this.usarioService.getUsuario( this.usermodel ).subscribe( ( data: any ) => {
  
      switch( data.result_code ) { 
        case 200: { 
            this.respuestaServicio = data;
            
            localStorage.removeItem( 'usuariosession' );
            localStorage.setItem( 'usuariosession', JSON.stringify( this.respuestaServicio.usuario ) );

            this.router.navigate( ['/custodios']) ;

            this.cerrarCargando();
            //this.mostrarMsjError('Bienvenido al Sistema de Custodios',false);
           break; 
        } 
        case 401: { 
          this.mostrarMsjError('No ha podido iniciar la sesión, ingrese los datos correctos',true);
           break; 
        } 
        case 402: { 
          this.mostrarMsjError('No tiene Roles asignados',true);
            break; 
        } 
        case 501: { 
          this.mostrarMsjError('No se ha podido iniciar la sesión, vuelva a intentar',true);
          
            break; 
        } 
        default: { 
          this.mostrarMsjError('No se ha podido iniciar la sesión, vuelva a intentar',true);
           break; 
        } 
     } 
    } );
  }


  mostrarMsjError(mensaje: string, esError: boolean){
    Swal.close();
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 15,
      timer: 1000,
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: (esError ? 'error' : 'success')
    });
  }


  abrirCargando(){
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
  }

  cerrarCargando(){
    Swal.close();
  }

}
