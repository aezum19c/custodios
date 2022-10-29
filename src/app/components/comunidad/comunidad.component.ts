import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComunidadModel } from 'src/app/models/comunidad.model';
import { UserModel } from 'src/app/models/user.model';
import { ComunidadService } from 'src/app/service/comunidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html'
})
export class ComunidadComponent implements OnInit {
  @ViewChild('btncerrarComu') btncerrarCont!: ElementRef<HTMLElement>;

  formComunidad: FormGroup = new FormGroup({});
  
  comunidad: ComunidadModel = {};
  correlativo!: string;
  accion: string = '';
  usuarioSession: UserModel = {};
  custodioId: number=0;
  
  tieneRenovacion: string = '1';

  constructor(private _comunidadService: ComunidadService) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
    
    //this.inicio = JSON.parse( localStorage.getItem('inicio') || '{}' );
    //this.usuario = JSON.parse( localStorage.getItem('usuario') || '{}' );
    //this.menu = JSON.parse( localStorage.getItem('menu') || '{}' );

    this.crearFormulario();

    if (this.accion === 'M') {
      this.formComunidad.get('nroTituloHabilitante')?.setValue(this.comunidad.nroTituloHabilitante);
      this.formComunidad.get('extension')?.setValue(this.comunidad.extension);
    }
  }


  crearFormulario() {
    this.formComunidad = new FormGroup({
      asunto: new FormControl('', [Validators.required]),
      adjuntodoc: new FormControl('', [Validators.required])
    });
  }


  get asuntoNoValido() {
    return this.formComunidad.get('nroTituloHabilitante')?.invalid && this.formComunidad.get('nroTituloHabilitante')?.touched;
  }

  preGuardarContrato(){
    if (this.formComunidad.invalid) {
      return Object.values(this.formComunidad.controls).forEach( control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  guardarComunidad(){

    let extension = '';
    //if(this.contrato!=null) extension = this.contrato..split('.').pop()!;
    let nombre = this.formComunidad.get('nroTituloHabilitante')?.value;
    
    if (this.accion === 'I'){
      /*this._contratoService.uploadAdjunto(this.adjunto, this.usuarioSession.usuarioId! ,this.custodioId!, this.formDocumento.get('asunto')?.value, extension!, nombre!).subscribe((data: any) => {
        switch (data.result_code){
          case 200 : {
            this.cerrar_modal(true);
            break;
          }
            default: { 
              this.cerrar_modal(true);
              break; 
          } 
        }
      });*/
    }

    if (this.accion === 'M'){
      this.comunidad.nroTituloHabilitante = this.formComunidad.get('nroTituloHabilitante')?.value;
      /* this._contratoService.updateDocumento(this.contrato).subscribe((data: any) => {
      
        switch (data.result_code){
          case 200 : {

            //this.mostrarMsjError('Actualización exitosa', false);
            this.cerrar_modal(true);
            break;
          }
            default: { 
              this.cerrar_modal(true);
              break; 
          } 
        }
      }); */
    }
  }

  mostrarMsjError(mensaje: string, esError: boolean){
    //Swal.close();
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 15,
      timer: 2000,
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: (esError ? 'error' : 'success')
    });
  }

  cerrar_modal(exito: boolean){
    localStorage.setItem('cerrarComunidad', '1');

    if (!exito){
      localStorage.setItem('cerrarComunidad', '2');
    }

    this.btncerrarCont.nativeElement.click();
  }

  onSelected(value:string): void {
		this.tieneRenovacion = value;
	}

}
