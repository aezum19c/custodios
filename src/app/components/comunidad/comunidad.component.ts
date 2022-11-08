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
  titularId!: number;
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
      this.formComunidad.get('fechaPeriodoInicio')?.setValue(this.comunidad.vigenciaInicio);
      this.formComunidad.get('fechaPeriodoFin')?.setValue(this.comunidad.vigenciaFin);
    }
  }

  crearFormulario() {
    this.formComunidad = new FormGroup({
      nroTituloHabilitante: new FormControl('', [Validators.required]),
      fechaPeriodoInicio: new FormControl('', [Validators.required]),
      fechaPeriodoFin: new FormControl('', [Validators.required]),
    });
  }

  get nroTituloNoValido() {
    return this.formComunidad.get('nroTituloHabilitante')?.invalid && this.formComunidad.get('nroTituloHabilitante')?.touched;
  }
  get fechPeriodoInicioNoValido() {
    return this.formComunidad.get('fechaPeriodoInicio')?.invalid && this.formComunidad.get('fechaPeriodoInicio')?.touched;
  }
  get fechPeriodoFinNoValido() {
    return this.formComunidad.get('fechaPeriodoFin')?.invalid && this.formComunidad.get('fechaPeriodoFin')?.touched;
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
    this.comunidad.nroTituloHabilitante = this.formComunidad.get('nroTituloHabilitante')?.value;
    this.comunidad.vigenciaInicio = this.formComunidad.get('fechaPeriodoInicio')?.value;
    this.comunidad.vigenciaFin = this.formComunidad.get('fechaPeriodoFin')?.value;

    if (this.accion === 'I'){
      this.comunidad.accion = 'I';
      this.comunidad.secuenciaId = 0;
      this.comunidad.titularId = this.titularId;
      
      this._comunidadService.insertarComunidad(this.comunidad).subscribe((data: any) => {
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
      this.comunidad.accion = 'U';
      this.comunidad.nroTituloHabilitante = this.formComunidad.get('nroTituloHabilitante')?.value;
      this.comunidad.vigenciaInicio = this.formComunidad.get('fechaPeriodoInicio')?.value;
      this.comunidad.vigenciaFin = this.formComunidad.get('fechaPeriodoFin')?.value;

      this._comunidadService.updateComunidad(this.comunidad).subscribe((data: any) => {
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
