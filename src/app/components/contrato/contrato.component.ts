import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContratoModel } from 'src/app/models/contrato.model';
import { UserModel } from 'src/app/models/user.model';
import { ContratoService } from 'src/app/service/contrato.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html'
})
export class ContratoComponent implements OnInit {
  @ViewChild('btncerrarCont') btncerrarCont!: ElementRef<HTMLElement>;

  formContrato: FormGroup = new FormGroup({});
  
  contrato: ContratoModel = {};
  correlativo!: string;
  accion: string = '';
  usuarioSession: UserModel = {};
  custodioId: number=0;
  
  tieneRenovacion: string = '1';

  constructor(private _contratoService: ContratoService,) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
    
    //this.inicio = JSON.parse( localStorage.getItem('inicio') || '{}' );
    //this.usuario = JSON.parse( localStorage.getItem('usuario') || '{}' );
    //this.menu = JSON.parse( localStorage.getItem('menu') || '{}' );

    this.crearFormulario();

    if (this.accion === 'M') {
      this.formContrato.get('renovacion')?.setValue(this.contrato.renovaciones);
      this.formContrato.get('actoAdministrativo')?.setValue(this.contrato.actoAdministrativo);
    }
  }


  crearFormulario() {
    this.formContrato = new FormGroup({
      asunto: new FormControl('', [Validators.required]),
      adjuntodoc: new FormControl('', [Validators.required])
    });
  }


  get asuntoNoValido() {
    return this.formContrato.get('renovacion')?.invalid && this.formContrato.get('renovacion')?.touched;
  }

  preGuardarContrato(){
    if (this.formContrato.invalid) {
      return Object.values(this.formContrato.controls).forEach( control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  guardarContrato(){

    let extension = '';
    //if(this.contrato!=null) extension = this.contrato..split('.').pop()!;
    let nombre = this.formContrato.get('renovacion')?.value;
    
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
      this.contrato.renovaciones = this.formContrato.get('renovacion')?.value;
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
    localStorage.setItem('cerrarContrato', '1');

    if (!exito){
      localStorage.setItem('cerrarContrato', '2');
    }

    this.btncerrarCont.nativeElement.click();
  }

  onSelected(value:string): void {
		this.tieneRenovacion = value;
	}
}
