import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private _contratoService: ContratoService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
    this.contrato.flagRenovacion = this.contrato.flagRenovacion ?? 0;
    if(this.contrato.flagRenovacion == 0){
      this.tieneRenovacion = '0';
    }
    
    //this.inicio = JSON.parse( localStorage.getItem('inicio') || '{}' );
    //this.usuario = JSON.parse( localStorage.getItem('usuario') || '{}' );
    //this.menu = JSON.parse( localStorage.getItem('menu') || '{}' );

    this.crearFormulario();

    if (this.accion === 'M') {
      this.formContrato.get('flagRenovacion')?.setValue(this.contrato.flagRenovacion);
      this.formContrato.get('resolucion')?.setValue(this.contrato.resolucion);
      this.formContrato.get('resolucionFecha')?.setValue(this.contrato.resolucionFecha);
      this.formContrato.get('resolucionVigencia')?.setValue(this.contrato.resolucionVigencia);
      this.formContrato.get('vigenciaDesde')?.setValue(this.contrato.vigenciaDesde);
      this.formContrato.get('vigenciaHasta')?.setValue(this.contrato.vigenciaHasta);
    }
  }


  crearFormulario() {
    /* this.formContrato = new FormGroup({
      asunto: new FormControl('', [Validators.required]),
      adjuntodoc: new FormControl('', [Validators.required])
    }); */

    this.formContrato = this.fb.group({
      flagRenovacion : [this.contrato.flagRenovacion],
      resolucion : [this.contrato.resolucion],
      resolucionFecha : [this.contrato.resolucionFecha],
      resolucionVigencia : [this.contrato.resolucionVigencia],
      vigenciaDesde : [this.contrato.vigenciaDesde],
      vigenciaHasta : [this.contrato.vigenciaHasta],
    });

    console.log('contrato');
      console.log(this.contrato);
      console.log('contratoFIN');
  }


  /* get asuntoNoValido() {
    return this.formContrato.get('flagRenovacion')?.invalid && this.formContrato.get('flagRenovacion')?.touched;
  } */

  /* preGuardarContrato(){
    if (this.formContrato.invalid) {
      return Object.values(this.formContrato.controls).forEach( control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
  } */

  guardarContrato(){
    this.contrato.flagRenovacion = this.formContrato.get('flagRenovacion')?.value;
    this.contrato.resolucion = this.formContrato.get('resolucion')?.value;
    this.contrato.resolucionFecha = this.formContrato.get('resolucionFecha')?.value;
    this.contrato.resolucionVigencia = this.formContrato.get('resolucionVigencia')?.value;
    this.contrato.vigenciaDesde = this.formContrato.get('vigenciaDesde')?.value;
    this.contrato.vigenciaHasta = this.formContrato.get('vigenciaHasta')?.value;

    if (this.accion === 'I'){
      this.contrato.accion = 'I';
      this.contrato.secuenciaId = 0;
      /* this.contrato.custodioId = this.custodioId; */
      
      this._contratoService.insertarContrato(this.contrato).subscribe((data: any) => {
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
      });
    }

    if (this.accion === 'M'){
      this.contrato.accion = 'U';
      this.contrato.flagRenovacion = this.formContrato.get('flagRenovacion')?.value;
      this.contrato.resolucion = this.formContrato.get('resolucion')?.value;
      this.contrato.resolucionFecha = this.formContrato.get('resolucionFecha')?.value;
      this.contrato.resolucionVigencia = this.formContrato.get('resolucionVigencia')?.value;
      this.contrato.vigenciaDesde = this.formContrato.get('vigenciaDesde')?.value;
      this.contrato.vigenciaHasta = this.formContrato.get('vigenciaHasta')?.value;

      this._contratoService.updateContrato(this.contrato).subscribe((data: any) => {
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
      });
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
