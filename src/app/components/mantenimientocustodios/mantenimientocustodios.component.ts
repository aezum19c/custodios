import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdjuntoModel } from 'src/app/models/adjunto.model';
import { CustodioModel } from 'src/app/models/custodio.model';
import { DocumentoModel } from 'src/app/models/documento.model';
import { DominioModel } from 'src/app/models/dominio.model';
import { UserModel } from 'src/app/models/user.model';
import { CustodiosService } from 'src/app/service/custodio.service';
import { DocumentoService } from 'src/app/service/documento.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DocumentosComponent } from '../documento/documentos/documentos.component';
import { TitularModel } from 'src/app/models/titular.model';
import { ContratoModel } from 'src/app/models/contrato.model';
import { ContratoComponent } from '../contrato/contrato.component';
import { ContratoService } from 'src/app/service/contrato.service';
import { RespuestaRenovacionModel } from 'src/app/models/respuesta_renovacion.model';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-mantenimientocustodios',
  templateUrl: './mantenimientocustodios.component.html',
  styleUrls: ['./mantenimientocustodios.component.css'],
  providers : [DatePipe]
})
export class MantenimientocustodiosComponent implements OnInit {
  @ViewChild('btnselectCapacitacion') btnselectCapacitacion!: ElementRef<HTMLElement>;
  @ViewChild('btnselectReconocimiento') btnselectReconocimiento!: ElementRef<HTMLElement>;
  @ViewChild('btnselectCarnet') btnselectCarnet!: ElementRef<HTMLElement>;
  @ViewChild('btnselectPerdidaActo') btnselectPerdidaActo!: ElementRef<HTMLElement>;
  adjuntoCapacitacion!: File;
  adjuntoReconocimiento!: File;
  adjuntoCarnet!: File;
  adjuntoPerdidaActo!: File;
  adjuntoModelCapacitacion : AdjuntoModel = new AdjuntoModel; 
  adjuntoModelReconocimiento : AdjuntoModel = new AdjuntoModel; 
  adjuntoModelCarnet : AdjuntoModel = new AdjuntoModel; 
  adjuntoModelPerdidaActo : AdjuntoModel = new AdjuntoModel; 

  contratos! : ContratoModel[]; 
  formCustodio! : FormGroup;
  custodio : CustodioModel = new CustodioModel();
  dominioMotivosPerdida! : DominioModel[]; 
  dominioObservacion! : DominioModel[];
  adjuntos! : AdjuntoModel[]; 
  documento : DocumentoModel = new DocumentoModel();
  usuarioSession : UserModel = new UserModel();
  respuestaServicio : RespuestaRenovacionModel = new RespuestaRenovacionModel();

  page: number = 1;
  regxpag: number = 10;
  totalAdjuntos: number = 0;
  accion_custodio: string = '';
  mostrar: boolean = false;
  custodioSelected: string = '01';

  selectedMotivoPerdida: string = '';
  ocultarBtnGuardar!: boolean;

  constructor( 
    private _documentoService: DocumentoService,
    private custodioService: CustodiosService,
    private contratoService: ContratoService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private _dialog: MatDialog

    ) { 
    }

  ngOnInit(): void {
    this.crearFormulario();
    this.crearTablaContratos();
  }

  crearFormulario(){
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
    this.custodio = JSON.parse( localStorage.getItem('custodio') || '{}' );
    this.dominioMotivosPerdida = JSON.parse( localStorage.getItem('motivosPerdida') || '[]' );

    this.custodioSelected= this.custodio.tipoCustodio!;

    this.accion_custodio = JSON.parse( localStorage.getItem('accion_custodio') || '' );
  
    this.custodio.capacitacionNombre = this.custodio.capacitacionNombre ?? '';
    this.custodio.reconocimientoNombre = this.custodio.reconocimientoNombre ?? '';
    this.custodio.carneNombre = this.custodio.carneNombre ?? '';
    this.custodio.perdidaActoAdmNombre = this.custodio.perdidaActoAdmNombre ?? '';

    if(this.accion_custodio == 'N' ){ this.mostrar =false; } else { this.mostrar = true}; 

    this.formCustodio = this.fb.group({
      nombre : [this.custodio.nombre],
      apellidos : [this.custodio.apellidos],
      dni : [this.custodio.dni],
      capacitacionFlag : [this.custodio.capacitacionFlag],
      capacitacionFecha : [this.custodio.capacitacionFecha],
      capacitacionNumero : [this.custodio.capacitacionNumero],
      fechaSolicitud: [this.custodio.fechaSolicitud],
      actoAdministrativo: [this.custodio.actoAdministrativo],
      actoAdministrativoFecha: [this.custodio.actoAdministrativoFecha],
      actoAdministrativoVigencia: [this.custodio.actoAdministrativoVigencia],
      vigenciaDesde: [this.custodio.vigenciaDesde],
      vigenciaHasta: [this.custodio.vigenciaHasta],
      carneCodigo: [this.custodio.carneCodigo],
      perdidaFlag: [this.custodio.perdidaFlag],
      perdidaMotivo: [this.custodio.perdidaMotivo],
      perdidaFecha: [this.custodio.perdidaFecha],
      cargo : [this.custodio.cargo],
      estado : [this.custodio.estado],

      adjuntodoccapacitacion: '',
      adjuntodocreconocimiento: '',
      adjuntodoccarnet :  '',
      adjuntodocperdidaacto : '',
    });
  }

  crearTablaContratos(){
    this.obtenerContratos();
  }

  obtenerContratos(){
    this.contratoService.getContrato(this.custodio.custodioId!).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.contratos = this.respuestaServicio.content;
          break;
        }
        default: { 
          break; 
       } 
      }
    });
  }


  formatearFecha(fecha?: Date): any {
    if (fecha === null){
      return null;
    } else {
      return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }
  }

  getDateFormatString(): string {
      return 'DD/MM/YYYY';
  }

  guardar(){
    this.ocultarBtnGuardar = true;

    Swal.fire({
      title: '??Quieres guardar los cambios?',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.custodio.nombre = this.formCustodio.get('nombre')?.value;
        this.custodio.apellidos = this.formCustodio.get('apellidos')?.value;
        this.custodio.dni = this.formCustodio.get('dni')?.value;
        this.custodio.capacitacionFlag = this.formCustodio.get('capacitacionFlag')?.value;
        this.custodio.capacitacionFecha = this.formCustodio.get('capacitacionFecha')?.value;
        this.custodio.capacitacionNumero = this.formCustodio.get('capacitacionNumero')?.value;
        this.custodio.fechaSolicitud = this.formCustodio.get('fechaSolicitud')?.value;
        this.custodio.actoAdministrativo = this.formCustodio.get('actoAdministrativo')?.value;
        this.custodio.actoAdministrativoFecha = this.formCustodio.get('actoAdministrativoFecha')?.value;
        this.custodio.actoAdministrativoVigencia = this.formCustodio.get('actoAdministrativoVigencia')?.value;
        this.custodio.vigenciaDesde = this.formCustodio.get('vigenciaDesde')?.value;
        this.custodio.vigenciaHasta = this.formCustodio.get('vigenciaHasta')?.value;
        this.custodio.carneCodigo = this.formCustodio.get('carneCodigo')?.value;
        this.custodio.perdidaFlag = this.formCustodio.get('perdidaFlag')?.value;
        this.custodio.perdidaMotivo = this.formCustodio.get('perdidaMotivo')?.value;
        this.custodio.perdidaFecha = this.formCustodio.get('perdidaFecha')?.value;
        this.custodio.estado = this.formCustodio.get('estado')?.value;
        this.custodio.cargo = this.formCustodio.get('cargo')?.value;
        this.custodio.usuarioRegistro = this.usuarioSession.usuarioId;

        if(this.custodio.custodioId == 0){
          this.custodio.accion = 'I';
          this.custodio.usuarioRegistro = this.usuarioSession.usuarioId;
          
          this.abrirCargando();
          this.custodioService.crearCustodio(this.custodio).subscribe((data: any) => {
            switch (data.result_code){
              case 200 : {
                this.mostrar = true;
                this.custodio.custodioId = data.code;
                this.accion_custodio = 'U';
                this.custodio.accion = 'U';

                this.mostrarMsjError('Guardado!', false);
              }
            }
            this.ocultarBtnGuardar = false;
          }, error => {
            this.ocultarBtnGuardar = false;
            this.mostrarMsjError('Ocurrio un error vuelva a intentarlo',true);
          });
        } else {
          this.custodio.accion = 'U';
          this.custodio.usuarioRegistro = this.usuarioSession.usuarioId;
          this.custodioService.modificarCustodio(this.custodio).subscribe((data: any) => {
            switch (data.result_code){
              case 200 : {
                this.mostrarMsjError('Guardado!', false);
              }
            }
            this.ocultarBtnGuardar = false;
          }, error => {
            this.ocultarBtnGuardar = false;
            this.mostrarMsjError('Ocurrio un error vuelva a intentarlo',true);
          });
        }

      } else {
        this.ocultarBtnGuardar = false;
        Swal.fire('Cancelado', '', 'info')
      }
    })

  }

  get fechaSesionNoValido() {
    return this.formCustodio.get('fecha')?.invalid && this.formCustodio.get('fecha')?.touched;
  }

  regresar(){
    if(this.custodio.tipoCustodio === '01' ){
      this.router.navigate(['/titulares/:id']);    
      localStorage.removeItem('titulares');
    } else {
      this.router.navigate(['custodios-comite']);    
    }
  }

  cerrarSession(){
    Swal.fire({
      title: '??Seguro de salir de la Session?',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if(result.isConfirmed){
        this.router.navigate(['/login']);
      }
    })
  }

  paginar(e: any) {
    this.page = e.pageIndex + 1;
  }



  descargarDocumento(adjunto: AdjuntoModel){
    Swal.fire({
          allowOutsideClick: false,
          showConfirmButton: false,
          icon: 'info',
          text: 'Descargando documento. Espere por favor...'
    });
    
    const filename = adjunto.nombre || '';
    this._documentoService.downloadAdjunto(adjunto.custodioId!, '').subscribe(resp => {
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

  nuevoDocumento(){
    let doc: AdjuntoModel = {};

    const dialogRef = this._dialog.open(DocumentosComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.documento = doc;
    dialogRef.componentInstance.accion = 'I';
    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListar('cerrarDocumento');
    });
  }

  editarDocumento(adjunto: AdjuntoModel){
    const dialogRef = this._dialog.open(DocumentosComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.documento = adjunto;
    dialogRef.componentInstance.accion = 'M';

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListar('cerrarDocumento');
    });
  }

  eliminarDocumento(adjunto: AdjuntoModel){
    Swal.fire({
      text: '??Est?? seguro(a) de eliminar los datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'S??, ??Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this._documentoService.eliminarDocumento(adjunto).subscribe((data: any) => {
            this.page = 1;
        },
        (error) => {
          this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
          return;
        });
      }
    });
  }

  nuevoContrato(){
    let contrato: ContratoModel = {};
    contrato.custodioId = this.custodio.custodioId;
    contrato.secuenciaId = 0;
    contrato.tipoCustodio = this.custodioSelected;

    const dialogRef = this._dialog.open(ContratoComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.contrato = contrato;

  
    dialogRef.componentInstance.accion = 'I';

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarContrato('cerrarContrato');
    });
  }

  verContrato(contrato: ContratoModel){
    const dialogRef = this._dialog.open(ContratoComponent, {
      disableClose: true
    });

    contrato.tipoCustodio = this.custodioSelected;

    dialogRef.componentInstance.contrato = contrato;
    dialogRef.componentInstance.accion = 'M';

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarContrato('cerrarComunidad');
    });
  }

  validarAntesDeListarContrato(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    if (cerrar === '1'){
      this.crearTablaContratos();
    }

    localStorage.removeItem(strItem);
  }

  desactivarRegistro(contrato: ContratoModel){

  }
  validarAntesDeListar(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    if (cerrar === '1'){
      this.page = 1;
    }

    localStorage.removeItem(strItem);
  }

  activarContrato(contrato: ContratoModel){
    contrato.accion = 'E'
    Swal.fire({
      title: '??Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.abrirCargando();
        this.contratoService.desactivaActivaContrato(contrato).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.crearTablaContratos();
              this.mostrarMsjError('Registro Activado', false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo', true);
              break; 
            } 
          }
        },
        (error) => {
          this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
        });
      }
    })
  }


  desactivarContrato(contrato: ContratoModel){
    contrato.accion = 'D'
    Swal.fire({
      title: '??Seguro de DESACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){

        this.abrirCargando();

        this.contratoService.desactivaActivaContrato(contrato).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.crearTablaContratos();
              this.mostrarMsjError('Registro Desactivado', false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo', true);
              break; 
            } 
          }
        },
        (error) => {
          this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
        });
      }
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

  onSelectMotivoPerdida(event:Event):void{
    this.selectedMotivoPerdida = (event.target as HTMLInputElement).value;
  }
  onSelectedRecibioCapacitacion(value:string): void {
		this.custodio.capacitacionFlag = +value;
	}
  onSelectedPerdidaAcreditacion(value:string): void {
		this.custodio.perdidaFlag = +value;
	}

/*********** ARCHIVO ADJUNTO PARA CAPACITACION ************/
elegirArchivoCapacitacion() {
  this.btnselectCapacitacion.nativeElement.click();
}

seleccion_archivo_capacitacion(event: any){
  if (event && event.target.files && event.target.files[0]) {
      this.adjuntoCapacitacion = event.target.files[0]; 
      this.formCustodio.get('adjuntodoccapacitacion')?.setValue(this.adjuntoCapacitacion.name);
  }
}

guardarDocumentoCapacitacion(){
  let extension = '';
  if(this.adjuntoCapacitacion!=null) extension = this.adjuntoCapacitacion.name.split('.').pop()!;
  this.custodio.capacitacionNombre = this.adjuntoCapacitacion.name;                                                             

  this.abrirCargando();
                                                                         /* 1 = origen = capacitacion */
  this._documentoService.uploadAdjuntoCustodio(this.adjuntoCapacitacion, this.custodio.custodioId!, '1', extension!, this.custodio.capacitacionNombre!).subscribe((data: any) => {                          
    switch (data.result_code){
      case 200 : {
        
        this.mostrarMsjError('Archivo guardado',false);
        break;
      }
        default: { 
          this.mostrarMsjError('Vuelva a intentarlo',true);
          break; 
      } 
    }
  });
}

eliminarDocumentoCapacitacion(){
  this.adjuntoModelCapacitacion.custodioId = this.custodio.custodioId;
  this.adjuntoModelCapacitacion.origen = '1';

  Swal.fire({
    text: '??Est?? seguro(a) de eliminar los datos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'S??, ??Eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
     
      this._documentoService.eliminarDocumentoCustodio(this.adjuntoModelCapacitacion).subscribe((data: any) => {
          this.custodio.capacitacionNombre = '';
      },
      (error) => {
        this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
        return;
      });
    }
  });
}

descargarDocumentoCapacitacion(){
  Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        text: 'Descargando documento. Espere por favor...'
  });
  
  const filename = this.custodio.capacitacionNombre || '';
  this._documentoService.downloadAdjuntoCustodio(this.custodio.custodioId!, '1').subscribe(resp => {
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



/*********** ARCHIVO ADJUNTO PARA RECONOCIMIENTO ************/
elegirArchivoReconocimiento() {
  this.btnselectReconocimiento.nativeElement.click();
}

seleccion_archivo_reconocimiento(event: any){
  if (event && event.target.files && event.target.files[0]) {
      this.adjuntoReconocimiento = event.target.files[0]; 
      this.formCustodio.get('adjuntodocreconocimiento')?.setValue(this.adjuntoReconocimiento.name);
  }
}


guardarDocumentoReconocimiento(){
  let extension = '';
  if(this.adjuntoReconocimiento!=null) extension = this.adjuntoReconocimiento.name.split('.').pop()!;
  this.custodio.reconocimientoNombre = this.adjuntoReconocimiento.name;

  this.abrirCargando();
                                                                                        /* 2 = origen = segunda instancia */
  this._documentoService.uploadAdjuntoCustodio(this.adjuntoReconocimiento, this.custodio.custodioId!, '2', extension!, this.custodio.reconocimientoNombre!).subscribe((data: any) => {
    switch (data.result_code){
      case 200 : {
        this.mostrarMsjError('Archivo Subido', false);
        
        break;
      }
        default: { 
          this.mostrarMsjError('Vuelva a intentarlo', true);
          break; 
      } 
    }
  });
}

eliminarDocumentoReconocimiento(){
  this.adjuntoModelReconocimiento.custodioId = this.custodio.custodioId;
  this.adjuntoModelReconocimiento.origen = '2';
  
  Swal.fire({
    text: '??Est?? seguro(a) de eliminar los datos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'S??, ??Eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
     
      this._documentoService.eliminarDocumentoCustodio(this.adjuntoModelReconocimiento).subscribe((data: any) => {
          this.custodio.reconocimientoNombre = '';
      },
      (error) => {
        this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
        return;
      });
    }
  });
}

descargarDocumentoReconocimiento(){
  Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        text: 'Descargando documento. Espere por favor...'
  });
  
  const filename = this.custodio.reconocimientoNombre || '';
  this._documentoService.downloadAdjuntoCustodio(this.custodio.custodioId!, '2').subscribe(resp => {
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


/*********** ARCHIVO ADJUNTO CARNET ************/
elegirArchivoCarnet() {
  this.btnselectCarnet.nativeElement.click();
}

seleccion_archivo_carnet(event: any){
  if (event && event.target.files && event.target.files[0]) {
      this.adjuntoCarnet = event.target.files[0]; 
      this.formCustodio.get('adjuntodoccarnet')?.setValue(this.adjuntoCarnet.name);
  }
}

guardarDocumentoCarnet(){
  let extension = '';
  if(this.adjuntoCarnet!=null) extension = this.adjuntoCarnet.name.split('.').pop()!;
  this.custodio.carneNombre = this.adjuntoCarnet.name;                                                              /* 1 = origen = primera instancia */
  
  this.abrirCargando();
  this._documentoService.uploadAdjuntoCustodio(this.adjuntoCarnet, this.custodio.custodioId!, '3', extension!, this.custodio.carneNombre!).subscribe((data: any) => {
                                        
    switch (data.result_code){
      case 200 : {
        
        this.mostrarMsjError('Archivo Subido', false);
        break;
      }
        default: { 
          this.mostrarMsjError('Vuelva a intentarlo', true);
          break; 
      } 
    }
  });
}

eliminarDocumentoCarnet(){
  this.adjuntoModelCarnet.custodioId = this.custodio.custodioId;
  this.adjuntoModelCarnet.origen = '3';

  Swal.fire({
    text: '??Est?? seguro(a) de eliminar los datos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'S??, ??Eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
     
      this._documentoService.eliminarDocumentoCustodio(this.adjuntoModelCarnet).subscribe((data: any) => {
          this.custodio.carneNombre = '';
      },
      (error) => {
        this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
        return;
      });
    }
  });
}

descargarDocumentoCarnet(){
  Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        text: 'Descargando documento. Espere por favor...'
  });
  
  const filename = this.custodio.carneNombre || '';
  this._documentoService.downloadAdjunto(this.custodio.custodioId!, '3').subscribe(resp => {
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

/*********** ARCHIVO ADJUNTO PERDIDA ACTO ADMINISTRATIVO ************/
elegirArchivoPerdidaActo() {
  this.btnselectPerdidaActo.nativeElement.click();
}

seleccion_archivo_perdida_acto(event: any){
  if (event && event.target.files && event.target.files[0]) {
      this.adjuntoPerdidaActo = event.target.files[0]; 
      this.formCustodio.get('adjuntodocperdidaacto')?.setValue(this.adjuntoPerdidaActo.name);
  }
}


guardarDocumentoPerdidaActo(){
  let extension = '';
  if(this.adjuntoPerdidaActo!=null) extension = this.adjuntoPerdidaActo.name.split('.').pop()!;
  this.custodio.perdidaActoAdmNombre = this.adjuntoPerdidaActo.name;

  this.abrirCargando();
                                                                                        /*  = origen = segunda instancia */
  this._documentoService.uploadAdjuntoCustodio(this.adjuntoPerdidaActo, this.custodio.custodioId!, '4', extension!, this.custodio.perdidaActoAdmNombre!).subscribe((data: any) => {
    switch (data.result_code){
      case 200 : {
        this.mostrarMsjError('Adjusnto subido!', false);
        break;
      }
        default: { 
          this.mostrarMsjError('Vuelva a intentarlo', true);
          break; 
      } 
    }
  });
}

eliminarDocumentoPerdidaActo(){

  this.adjuntoModelPerdidaActo.custodioId = this.custodio.custodioId;
  this.adjuntoModelPerdidaActo.origen = '4';
  
  Swal.fire({
    text: '??Est?? seguro(a) de eliminar los datos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'S??, ??Eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
     
      this._documentoService.eliminarDocumentoCustodio(this.adjuntoModelPerdidaActo).subscribe((data: any) => {
          this.custodio.perdidaActoAdmNombre = '';
      },
      (error) => {
        this.mostrarMsjError('Ocurri?? un error al eliminar el documento', true);
        return;
      });
    }
  });
}

descargarDocumentoPerdidaActo(){
  Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        text: 'Descargando documento. Espere por favor...'
  });
  
  const filename = this.custodio.perdidaActoAdmNombre || '';
  this._documentoService.downloadAdjuntoCustodio(this.custodio.custodioId!, '4').subscribe(resp => {
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
