import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdjuntoModel } from 'src/app/models/adjunto.model';
import { UserModel } from 'src/app/models/user.model';
import { DocumentoService } from 'src/app/service/documento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styles: [
  ]
})
export class DocumentosComponent implements OnInit {
  @ViewChild('btncerrarDoc') btncerrarDoc!: ElementRef<HTMLElement>;
  @ViewChild('btnselectDoc') btnselectDoc!: ElementRef<HTMLElement>;

  formDocumento: FormGroup = new FormGroup({});
  adjunto!: File;


  documento: AdjuntoModel = {};
  correlativo!: string;
  accion: string = '';
  usuarioSession: UserModel = {};
  custodioId: number=0;

  constructor(
    private _documentoService: DocumentoService,
  ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );

    this.crearFormulario();

    if (this.accion === 'M') {
      this.formDocumento.get('asunto')?.setValue(this.documento.descripcion);
      this.formDocumento.get('adjuntodoc')?.setValue(this.documento.nombre);
    }
  }

  crearFormulario() {
    this.formDocumento = new FormGroup({
      asunto: new FormControl('', [Validators.required]),
      adjuntodoc: new FormControl('', [Validators.required])
    });
  }


  get asuntoNoValido() {
    return this.formDocumento.get('asunto')?.invalid && this.formDocumento.get('asunto')?.touched;
  }

  get adjuntodocNoValido() {
    return this.formDocumento.get('adjuntodoc')?.invalid && this.formDocumento.get('adjuntodoc')?.touched;
  }

  elegirArchivo() {
    this.btnselectDoc.nativeElement.click();
  }

  seleccion_archivo(event: any){
    if (event && event.target.files && event.target.files[0]) {
      this.adjunto = event.target.files[0];
      this.formDocumento.get('adjuntodoc')?.setValue(this.adjunto.name);
    }
  }

  preGuardarDocumento(){
    if (this.formDocumento.invalid) {
      return Object.values(this.formDocumento.controls).forEach( control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  guardarDocumento(){
    let extension = '';
    if(this.adjunto!=null) extension = this.adjunto.name.split('.').pop()!;
    let nombre = this.formDocumento.get('asunto')?.value;

    if (this.accion === 'I'){
      this._documentoService.uploadAdjunto(this.adjunto, this.custodioId!, this.formDocumento.get('asunto')?.value, extension!, nombre!).subscribe((data: any) => {
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
      this.documento.descripcion = this.formDocumento.get('asunto')?.value;
      this._documentoService.updateDocumento(this.documento).subscribe((data: any) => {
      
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
    localStorage.setItem('cerrarDocumento', '1');

    if (!exito){
      localStorage.setItem('cerrarDocumento', '2');
    }

    this.btncerrarDoc.nativeElement.click();
  }
}
