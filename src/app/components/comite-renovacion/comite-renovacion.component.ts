import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitularRenovacionModel } from 'src/app/models/titular_renovacion.model';
import { UserModel } from 'src/app/models/user.model';
import { ComiteService } from 'src/app/service/comite.service';
import { ContratoService } from 'src/app/service/contrato.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comite-renovacion',
  templateUrl: './comite-renovacion.component.html',
})
export class ComiteRenovacionComponent implements OnInit {
  @ViewChild('btncerrarComite') btncerrarCont!: ElementRef<HTMLElement>;

  formContrato: FormGroup = new FormGroup({});
  
  titularRenovacion: TitularRenovacionModel = {};
  correlativo!: string;
  accion: string = '';
  accion_titular: string = '';
  usuarioSession: UserModel = {};
  titularId: number=0;
  
  tieneRenovacion: string = '1';

  constructor(
    private _comiteService: ComiteService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );

    this.titularRenovacion.flagRenovacion = this.titularRenovacion.flagRenovacion ?? 0;

    if(this.titularRenovacion.flagRenovacion == 0){
      this.tieneRenovacion = '0';
    }

    this.crearFormulario();

    if (this.accion === 'M') {
      this.formContrato.get('flagRenovacion')?.setValue(this.titularRenovacion.flagRenovacion);
      this.formContrato.get('resolucion')?.setValue(this.titularRenovacion.resolucion);
      this.formContrato.get('resolucionFecha')?.setValue(this.titularRenovacion.resolucionFecha);
      this.formContrato.get('resolucionVigencia')?.setValue(this.titularRenovacion.resolucionVigencia);
      this.formContrato.get('vigenciaDesde')?.setValue(this.titularRenovacion.vigenciaDesde);
      this.formContrato.get('vigenciaHasta')?.setValue(this.titularRenovacion.vigenciaHasta);
    }
  }


  crearFormulario() {
    
    /* this.formContrato = new FormGroup({
      asunto: new FormControl('', [Validators.required]),
      adjuntodoc: new FormControl('', [Validators.required])
    }); */

    this.formContrato = this.fb.group({
      flagRenovacion : [this.titularRenovacion.flagRenovacion],
      resolucion : [this.titularRenovacion.resolucion],
      resolucionFecha : [this.titularRenovacion.resolucionFecha],
      resolucionVigencia : [this.titularRenovacion.resolucionVigencia],
      vigenciaDesde : [this.titularRenovacion.vigenciaDesde],
      vigenciaHasta : [this.titularRenovacion.vigenciaHasta],
    });

    console.log('titularRenovacion');
      console.log(this.titularRenovacion);
      console.log('titularRenovacionoFIN');
  }

  guardarComiteRenovacion(){
    this.titularRenovacion.flagRenovacion = this.formContrato.get('flagRenovacion')?.value;
    this.titularRenovacion.resolucion = this.formContrato.get('resolucion')?.value;
    this.titularRenovacion.resolucionFecha = this.formContrato.get('resolucionFecha')?.value;
    this.titularRenovacion.resolucionVigencia = this.formContrato.get('resolucionVigencia')?.value;
    this.titularRenovacion.vigenciaDesde = this.formContrato.get('vigenciaDesde')?.value;
    this.titularRenovacion.vigenciaHasta = this.formContrato.get('vigenciaHasta')?.value;

    this.titularRenovacion.titularId = this.titularId;
    this.titularRenovacion.tipoRenovacion = 'R';

    if (this.accion === 'I'){
      this.titularRenovacion.accion = 'I';
      
      /* this.contrato.custodioId = this.custodioId; */
      
      this._comiteService.insertarComite(this.titularRenovacion).subscribe((data: any) => {
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
      this.titularRenovacion.accion = 'U';
      this.titularRenovacion.flagRenovacion = this.formContrato.get('flagRenovacion')?.value;
      this.titularRenovacion.resolucion = this.formContrato.get('resolucion')?.value;
      this.titularRenovacion.resolucionFecha = this.formContrato.get('resolucionFecha')?.value;
      this.titularRenovacion.resolucionVigencia = this.formContrato.get('resolucionVigencia')?.value;
      this.titularRenovacion.vigenciaDesde = this.formContrato.get('vigenciaDesde')?.value;
      this.titularRenovacion.vigenciaHasta = this.formContrato.get('vigenciaHasta')?.value;

      this._comiteService.updateComite(this.titularRenovacion).subscribe((data: any) => {
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
    localStorage.setItem('cerrarComite', '1');

    if (!exito){
      localStorage.setItem('cerrarComite', '2');
    }

    this.btncerrarCont.nativeElement.click();
  }

  onSelected(value:string): void {
		this.tieneRenovacion = value;
	}

}
