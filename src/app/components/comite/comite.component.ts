import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdjuntoModel } from 'src/app/models/adjunto.model';
import { TitularModel } from 'src/app/models/titular.model';
import { UserModel } from 'src/app/models/user.model';
import { CustodiosService } from 'src/app/service/custodio.service';
import { DocumentoService } from 'src/app/service/documento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comite',
  templateUrl: './comite.component.html',
  styleUrls: ['./comite.component.css']
})
export class ComiteComponent implements OnInit {

  @ViewChild('btncerrarComite') btncerrarComite!: ElementRef<HTMLElement>;
  @ViewChild('btnselectSolicitudRenocomiento') btnselectSolicitudRenocomiento!: ElementRef<HTMLElement>;

  formComite: FormGroup = new FormGroup({});
  
  comite: TitularModel = {};
  correlativo!: string;
  accion: string = '';
  usuarioSession: UserModel = {};
  titularId: number=0;
  
  tieneRenovacion: string = '1';

  adjuntoModelSolicitudReconomiento : AdjuntoModel = new AdjuntoModel; 
  adjuntoSolicitudReconomiento!: File;
  ocultarBtnGuardar!: boolean;

  constructor(
    private _documentoService: DocumentoService,
    private custodioService: CustodiosService,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );

    this.crearFormulario();

    if (this.accion === 'A') {
      
      this.formComite.get('adjuntodocprimera')?.setValue('');
      this.formComite.get('fechaSolicitud')?.setValue(this.comite.fechaSolicitud);
      this.formComite.get('comiteActoReconocimiento')?.setValue(this.comite.comiteActoReconocimiento);
      this.formComite.get('fechaActoReconocimiento')?.setValue(this.comite.fechaActoReconocimiento);
      this.formComite.get('vigencia')?.setValue(this.comite.vigencia);
      this.formComite.get('periodoDesde')?.setValue(this.comite.periodoDesde);
      this.formComite.get('periodoHasta')?.setValue(this.comite.periodoHasta);
    }
  }


  crearFormulario() {
    this.formComite = this.fb.group({
      adjuntodocprimera : '',
      fechaSolicitud : [this.comite.fechaSolicitud],
      comiteActoReconocimiento : [this.comite.comiteActoReconocimiento],
      fechaActoReconocimiento : [this.comite.fechaActoReconocimiento],
      vigencia : [this.comite.vigencia],
      periodoDesde : [this.comite.periodoDesde],
      periodoHasta : [this.comite.periodoHasta],
    });
  }

  guardarComite(){
    this.comite.fechaSolicitud = this.formComite.get('fechaSolicitud')?.value;
    this.comite.comiteActoReconocimiento = this.formComite.get('comiteActoReconocimiento')?.value;
    this.comite.fechaActoReconocimiento = this.formComite.get('fechaActoReconocimiento')?.value;
    this.comite.vigencia = this.formComite.get('vigencia')?.value;
    this.comite.periodoDesde = this.formComite.get('periodoDesde')?.value;
    this.comite.periodoHasta = this.formComite.get('periodoHasta')?.value;

    this.comite.titularId = this.titularId;    
    this.comite.accion = this.accion;
    this.comite.usuarioRegistro = this.usuarioSession.usuarioId;
    
    this.abrirCargando();
    this.ocultarBtnGuardar = true;
    this.custodioService.modificarTitular(this.comite).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.comite.accion = 'A';
          this.cerrar_modal(true);
          this.mostrarMsjError('Guardado',false);
        }
      }
      this.ocultarBtnGuardar = false;
    },  error => {
      this.ocultarBtnGuardar = false;
      this.mostrarMsjError('Ingrese los campos y vuelva a intentarlo',true);
    })
  }

  mostrarMsjError(mensaje: string, esError: boolean){
    Swal.close();
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

    this.btncerrarComite.nativeElement.click();
  }

  onSelected(value:string): void {
		this.tieneRenovacion = value;
	}


/*********** ARCHIVO ADJUNTO DE LA PRIMERA PESTAÑA ************/
elegirArchivoSolicitudRenococimiento() {
  this.btnselectSolicitudRenocomiento.nativeElement.click();
}

seleccion_archivo_solicitud_reconocimiento(event: any){
  if (event && event.target.files && event.target.files[0]) {
      this.adjuntoSolicitudReconomiento = event.target.files[0]; 
      this.formComite.get('adjuntodocprimera')?.setValue(this.adjuntoSolicitudReconomiento.name);
  }
}

guardarDocumentoSolicitudRenococimiento(){
  let extension = '';
  if(this.adjuntoSolicitudReconomiento!=null) extension = this.adjuntoSolicitudReconomiento.name.split('.').pop()!;
  this.comite.nombreAdjunto = this.adjuntoSolicitudReconomiento.name;
    this._documentoService.uploadAdjuntoTitular(this.adjuntoSolicitudReconomiento, this.titularId!, extension!, this.comite.nombreAdjunto!).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          break;
        }
          default: { 
            break; 
        } 
      }
    });
}

eliminarDocumentoSolicitudRenococimiento(){
  this.adjuntoModelSolicitudReconomiento.titularId = this.comite.titularId;

  Swal.fire({
    text: '¿Está seguro(a) de eliminar el adjunto?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, ¡Eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
     
      this._documentoService.eliminarAdjuntoTitular(this.adjuntoModelSolicitudReconomiento).subscribe((data: any) => {
          this.comite.nombreAdjunto = '';
      },
      (error) => {
        this.mostrarMsjError('Ocurrió un error al eliminar el documento', true);
        return;
      });
    }
  });
}

descargarDocumentoSolicitudRenococimiento(){
  Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        text: 'Descargando documento. Espere por favor...'
  });
  
  const filename = this.comite.nombreAdjunto || '';
  this._documentoService.downloadAdjuntoTitular(this.comite.titularId!).subscribe(resp => {
    const blobdata = new Blob([resp], { type: 'application/octet-stream' });
    const blob = new Blob([blobdata], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    anchor.click();

    Swal.close();
  },
  (error) => {
    this.mostrarMsjError('No se puede descargar el archivo.', true);
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
