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
import { ComunidadModel } from 'src/app/models/comunidad.model';
import { ComunidadService } from 'src/app/service/comunidad.service';
import { ComunidadComponent } from '../comunidad/comunidad.component';
import { UbigeoModel } from 'src/app/models/ubigeo.model';
import { DominiosService } from 'src/app/service/dominio.service';
import { RespuestaServicio } from 'src/app/models/respuesta_servicio.model';
import { TituloModel } from 'src/app/models/titulos.model';
import { RespuestaCustodioModel } from 'src/app/models/respuesta_custodio.model';
/* import { timeStamp } from 'console'; */

@Component({
  selector: 'app-titulares',
  templateUrl: './titulares.component.html',
  styleUrls: ['./titulares.component.css'],
  providers : [DatePipe],
})
export class TitularesComponent implements OnInit {
  @ViewChild('btnselectSolicitudRenocomiento') btnselectSolicitudRenocomiento!: ElementRef<HTMLElement>;
  
  contratos! : ContratoModel[]; 
  formTitulares! : FormGroup;
  titular : TitularModel = new TitularModel();
  dominioTipoCustodio! : DominioModel[]; 
  dominioTipoPersona! : DominioModel[];
  adjuntos! : AdjuntoModel[]; 
  documento : DocumentoModel = new DocumentoModel();
  usuarioSession : UserModel = new UserModel();

  custodios! : CustodioModel[]; 
  comunidades! : ComunidadModel[];

  page: number = 1;
  regxpag: number = 10;
  totalAdjuntos: number = 0;
  accion_titular: string = '';
  mostrar: boolean = false;
  custodioSelected: string = '1';

  dominioDepartamentos! : UbigeoModel[];
  dominioProvincias! : UbigeoModel[];
  dominioDistritos! : UbigeoModel[];
  respuestaServicio : RespuestaServicio = new RespuestaServicio();
  tituloServicio : TituloModel = new TituloModel();
  custodioServicio: RespuestaCustodioModel = new RespuestaCustodioModel();

  departamentoSelected: string='';
  selectedTipoPersona: string = '';

  adjuntoModelSolicitudReconomiento : AdjuntoModel = new AdjuntoModel; 
  adjuntoSolicitudReconomiento!: File;

  constructor( 
    private _documentoService: DocumentoService,
    private custodioService: CustodiosService,
    private comunidadService: ComunidadService,
    private dominiosService: DominiosService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private _dialog: MatDialog,

    ) { 
      this.adjuntos = [{adjuntoId:1, nombre:'nuevo adjunto file', descripcion :'Traer adjunto', fecha:'2022-05-16'}];
    }

  ngOnInit(): void {
    //const 
    this.cargarDepartamentos();
    this.crearFormulario();
    this.obtenerComunidades();
    this.obtenerCustodios();
    
    this.obtenerDominiosTipoCustodio();
  }

  crearFormulario(){

    this.titular = JSON.parse( localStorage.getItem('titular') || '{}' );
    //this.dominioTipoCustodio = JSON.parse( localStorage.getItem('tipoCustodio') || '[]' );
    this.dominioTipoPersona = JSON.parse( localStorage.getItem('tipoPersona') || '[]' );
    this.accion_titular = JSON.parse( localStorage.getItem('accion_titular') || '' );
  
    this.titular.nombreAdjunto = this.titular.nombreAdjunto ?? '';
    this.titular.titularId = this.titular.titularId ?? 0;
    this.custodioSelected = this.titular.tipoCustodio ?? '01';

    if(this.accion_titular == 'N' ){ this.mostrar =false; } else { this.mostrar = true}; 

    this.formTitulares = this.fb.group({
      tipoCustodio : [this.titular.tipoCustodio],
      /* tipoCustodioDes : [this.titular.tipoCustodioDes], */
      nroTituloHabilitante : [this.titular.nroTituloHabilitante],
      nombreTituloHabilitante : [this.titular.nombreTituloHabilitante],
      tipoPersona: [this.titular.tipoPersona],
      /* tipoPersonaDes: [this.titular.tipoPersonaDes], */
      dniRucTitular : [this.titular.dniRucTitular],
      nombreRepLegal : [this.titular.nombreRepLegal],
      dniRucRepLegal : [this.titular.dniRucRepLegal],
      nombreTitularComunidad : [this.titular.nombreTitularComunidad],
      ambitoTerritorial: [this.titular.ambitoTerritorial],
      extension: [this.titular.extension],
      departamento: [this.titular.departamento],
      /* departamentoNombre : [this.titular.departamentoNombre], */
      provincia:[this.titular.provincia],
      /* provinciaNombre :[this.titular.provinciaNombre], */
      distrito: [this.titular.distrito],
      /* distritoNombre : [this.titular.distritoNombre], */
      //adjuntodocprimera:[this.titular.nombreAdjunto],
      /* rutaAdjunto:[this.titular.rutaAdjunto], */
      fechaSolicitud:[this.titular.fechaSolicitud],
      comiteActoReconocimiento: [this.titular.comiteActoReconocimiento],
      fechaActoReconocimiento: [this.titular.fechaActoReconocimiento],
      vigencia: [this.titular.vigencia],
      vigenciaInicio : [this.titular.vigenciaInicio],
      vigenciaFin: [this.titular.vigenciaFin],
      /* ubigeoId: [this.titular.ubigeoId],  
      nombreUbigeo: [this.titular.nombreUbigeo],
      periodoDesde: [this.titular.periodoDesde],
      periodoHasta: [this.titular.periodoHasta], */

      adjuntodocprimera: '',
    });


    if(this.accion_titular == 'U'){
      this.dominiosService.getProvincias('P', this.titular.departamento!).subscribe((data: any) => {
        switch (data.result_code){
          case 200 : {
            this.respuestaServicio = data;
            this.dominioProvincias = this.respuestaServicio.ubigeos;
  
            //localStorage.removeItem('caducidad');
            //localStorage.setItem('caducidad', JSON.stringify(this.dominioCaducidad));
            break;
          }
          default: { 
            //statements; 
            break; 
         } 
        }
      })

      this.dominiosService.getDistritos('I', this.titular.departamento!,  this.titular.provincia!).subscribe((data: any) => {
        switch (data.result_code){
          case 200 : {
            this.respuestaServicio = data;
            this.dominioDistritos = this.respuestaServicio.ubigeos;
  
            //localStorage.removeItem('caducidad');
            //localStorage.setItem('caducidad', JSON.stringify(this.dominioCaducidad));
            break;
          }
          default: { 
            //statements; 
            break; 
         } 
        }
      })
    }

  }

  formatearFecha(fecha?: Date): any {
    if (fecha === null){
      return null;
    } else {
      return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }
  }

  obtenerDominiosTipoCustodio(){
    this.dominiosService.getDominioTiposCustodio().subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioTipoCustodio = this.respuestaServicio.detalle;
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })
  }

  getDateFormatString(): string {
      return 'DD/MM/YYYY';
  }

  guardar(){
    Swal.fire({
      title: '¿Quieres guardar los cambios?',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.titular.tipoCustodio = this.formTitulares.get('tipoCustodio')?.value;
        this.titular.nroTituloHabilitante = this.formTitulares.get('nroTituloHabilitante')?.value;
        this.titular.nombreTituloHabilitante = this.formTitulares.get('nombreTituloHabilitante')?.value;
        this.titular.tipoPersona = this.formTitulares.get('tipoPersona')?.value;
        this.titular.dniRucTitular = this.formTitulares.get('dniRucTitular')?.value;
        this.titular.nombreTitularComunidad = this.formTitulares.get('nombreTitularComunidad')?.value;
        this.titular.ambitoTerritorial = this.formTitulares.get('ambitoTerritorial')?.value;
        this.titular.extension = this.formTitulares.get('extension')?.value;
        this.titular.departamento = this.formTitulares.get('departamento')?.value;
        this.titular.provincia = this.formTitulares.get('provincia')?.value;
        this.titular.distrito = this.formTitulares.get('distrito')?.value;
        this.titular.fechaSolicitud = this.formTitulares.get('fechaSolicitud')?.value;
        this.titular.comiteActoReconocimiento = this.formTitulares.get('comiteActoReconocimiento')?.value;
        this.titular.fechaActoReconocimiento = this.formTitulares.get('fechaActoReconocimiento')?.value;
        this.titular.vigencia = this.formTitulares.get('vigencia')?.value;
        this.titular.vigenciaInicio = this.formTitulares.get('vigenciaInicio')?.value;
        this.titular.vigenciaFin = this.formTitulares.get('vigenciaFin')?.value;

        this.titular.tipoCustodio = this.custodioSelected;

        if(this.titular.titularId == 0){
          this.titular.accion = 'I';
          this.custodioService.crearTitular(this.titular).subscribe((data: any) => {
            switch (data.result_code){
              case 200 : {
                this.titular.titularId = data.code;
                this.accion_titular = 'U';
                this.titular.accion = 'U';

                localStorage.removeItem('titular');
                localStorage.setItem('titular', JSON.stringify(this.titular));
                Swal.fire('Guardado!', '', 'success');
              }
            }
          });
        } else {
          this.titular.accion = 'U';
          this.custodioService.modificarTitular(this.titular).subscribe((data: any) => {
            switch (data.result_code){
              case 200 : {
                this.mostrar = true;
                this.titular.titularId = data.code;
                this.accion_titular = 'U';
                this.titular.accion = 'U';

                localStorage.removeItem('titular');
                localStorage.setItem('titular', JSON.stringify(this.titular));
                Swal.fire('Guardado!', '', 'success');
              }
            }
          });
        }

        
      } else if (result.isDenied) {
        Swal.fire('Volver a cargar', '', 'info')
      }
    })

  }

  get fechaSesionNoValido() {
    return this.formTitulares.get('fecha')?.invalid && this.formTitulares.get('fecha')?.touched;
  }

  regresar(){
    this.router.navigate(['/custodios']);
    localStorage.removeItem('custodio');
  }

  cerrarSession(){
    Swal.fire({
      title: '¿Seguro de salir de la Session?',
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
    //this.obtenerInfractores();
    //this.cargarAdjuntos();
  }

  descargarDocumento(adjunto: AdjuntoModel){
    Swal.fire({
          allowOutsideClick: false,
          showConfirmButton: false,
          icon: 'info',
          text: 'Descargando documento. Espere por favor...'
    });
    
    const filename = adjunto.nombre || '';
    this._documentoService.downloadAdjunto(adjunto.titularId!, '').subscribe(resp => {
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

  cargarAdjuntos(){
    this._documentoService.getListadoAdjuntos(this.titular.titularId!, this.page, 1000).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.documento = data;
          if(data.content && data.content.length>0) {
            this.totalAdjuntos = data.content[0].totalRegistros;
          } else {
            this.totalAdjuntos = 0;
          }
          this.adjuntos = this.documento.content!;
          break;
        }
        default: {  
          break; 
       } 
      }
    });
  }

  nuevoDocumento(){
    let doc: AdjuntoModel = {};

    const dialogRef = this._dialog.open(DocumentosComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.documento = doc;
    dialogRef.componentInstance.accion = 'I';
    dialogRef.componentInstance.custodioId = this.titular.titularId!;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListar('cerrarDocumento');
    });
  }

  editarDocumento(adjunto: AdjuntoModel){
    const dialogRef = this._dialog.open(DocumentosComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.documento = adjunto;
    dialogRef.componentInstance.custodioId = this.titular.titularId!;
    dialogRef.componentInstance.accion = 'M';

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListar('cerrarDocumento');
    });
  }

  eliminarDocumento(adjunto: AdjuntoModel){
    Swal.fire({
      text: '¿Está seguro(a) de eliminar los datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this._documentoService.eliminarDocumento(adjunto).subscribe((data: any) => {
            this.page = 1;
            //zthis.cargarAdjuntos();
        },
        (error) => {
          this.mostrarMsjError('Ocurrió un error al eliminar el documento', true);
          return;
        });
      }
    });
  }

  validarAntesDeListar(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    if (cerrar === '1'){
      this.page = 1;
      this.cargarAdjuntos();
    }

    localStorage.removeItem(strItem);
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


  /* *********************** */
  obtenerCustodios(){
    this.custodioService.getCustodios(this.titular.titularId!, '', this.page, this.regxpag).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.custodioServicio = data;
          /* this.totalRegistros = data.content[0].totalRegistros; */
          console.log('custodioServicio');
          console.log(this.custodioServicio.content);
          this.custodios = this.custodioServicio.content;
          break;
        }
        default: { 
          break; 
       } 
      }
    });
  }

  nuevoCustodio(){
    let custodio : CustodioModel = {};
    /* custodio.tipoCustodio =  this.custodioSelected; */
    custodio.custodioId = 0;

    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');
    localStorage.removeItem('titularId');
    localStorage.removeItem('tipoCustodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    localStorage.setItem('accion_custodio', JSON.stringify('N'));
    localStorage.setItem('titularId', JSON.stringify(this.titular.titularId));
    localStorage.setItem('tipoCustodio', JSON.stringify(this.titular.tipoCustodio));

    this.router.navigate(['/mantenimientocustodios/nuevo']);
  }

  verCustodio(custodio: CustodioModel){
    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');
    localStorage.removeItem('titularId');
    localStorage.removeItem('tipoCustodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    localStorage.setItem('accion_custodio', JSON.stringify('M'));
    localStorage.setItem('titularId', JSON.stringify(this.titular.titularId));
    localStorage.setItem('tipoCustodio', JSON.stringify(this.titular.tipoCustodio));

    this.router.navigate(['/mantenimientocustodios/nuevo']);
  }
  
  desactivarCustodio(custodio: CustodioModel){
    custodio.accion ='D';
    console.log('Custodio:Descativar');
    console.log(custodio);
    Swal.fire({
      title: '¿Seguro de DESACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.custodioService.activaDesactivarCustodio(custodio).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerCustodios();
              break;
            }
            default: { 
              break; 
          } 
          }
        })
      }
    })
  }

  activarCustodio(custodio: CustodioModel){
    custodio.accion ='E';
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.custodioService.activaDesactivarCustodio(custodio).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerCustodios();
              break;
            }
            default: { 
              break; 
          } 
          }
        })
      }
    })
  }

  /************** Titulares Habilitantes ************/
  obtenerComunidades(){
    this.comunidadService.getComunidad(this.titular.titularId!).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.tituloServicio = data;
          console.log(this.tituloServicio);
          this.comunidades = this.tituloServicio.content;
          break;
        }
        default: { 
          break; 
       } 
      }
    });
  }

  nuevaComunidad(){
    let comunidad: ComunidadModel = {};

    const dialogRef = this._dialog.open(ComunidadComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.comunidad = comunidad;
    dialogRef.componentInstance.accion = 'I';
    dialogRef.componentInstance.titularId = this.titular.titularId!;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarComunidad('cerrarComunidad');
    });
  }

  verComunidad(comunidad: ComunidadModel){
    const dialogRef = this._dialog.open(ComunidadComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.comunidad = comunidad;
    dialogRef.componentInstance.accion = 'M';
    dialogRef.componentInstance.titularId = this.titular.titularId!;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarComunidad('cerrarComunidad');
    });
  }
  
  validarAntesDeListarComunidad(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    if (cerrar === '1'){
      this.obtenerComunidades();
    }

    localStorage.removeItem(strItem);
  }


  activarComunidad(comunidad: ComunidadModel){
    comunidad.accion = 'E'
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.comunidadService.desactivaActivaComunidad(comunidad).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerComunidades();
              break;
            }
            default: { 
              break; 
          } 
          }
        })
      }
    })
  }


  desactivarComunidad(comunidad: ComunidadModel){
    comunidad.accion = 'D'
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.comunidadService.desactivaActivaComunidad(comunidad).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerComunidades();
              break;
            }
            default: { 
              break; 
          } 
          }
        })
      }
    })
  }


  cargarDepartamentos(){
    this.dominiosService.getDepartamentos('D').subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioDepartamentos = this.respuestaServicio.ubigeos;
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })
  }

  cargarProvincias(event: Event){
    this.dominiosService.getProvincias('P', (event.target as HTMLInputElement).value).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioProvincias = this.respuestaServicio.ubigeos;
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })
  }

  cargarDistritos(event: Event){
    this.dominiosService.getDistritos('I', this.departamentoSelected,  (event.target as HTMLInputElement).value).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioDistritos = this.respuestaServicio.ubigeos;

          //localStorage.removeItem('caducidad');
          //localStorage.setItem('caducidad', JSON.stringify(this.dominioCaducidad));
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })
  }

  onSelectDepartamento(event:Event):void{
    this.departamentoSelected = (event.target as HTMLInputElement).value;
    this.cargarProvincias(event);
  }

  onSelectProvincia(event:Event):void{
    this.cargarDistritos(event);
  }

  onSelectDistrito(event:Event):void{
    this.titular.ubigeoId = (event.target as HTMLInputElement).value;
  }

  onSelectTipoCustodio(event:Event):void{
    this.custodioSelected = (event.target as HTMLInputElement).value;
  }

  onSelectTipoPersona(event:Event):void{
    this.selectedTipoPersona = (event.target as HTMLInputElement).value;
  }

/*********** ARCHIVO ADJUNTO DE LA PRIMERA PESTAÑA ************/
elegirArchivoSolicitudRenococimiento() {
  this.btnselectSolicitudRenocomiento.nativeElement.click();
}

seleccion_archivo_solicitud_reconocimiento(event: any){
  if (event && event.target.files && event.target.files[0]) {
      this.adjuntoSolicitudReconomiento = event.target.files[0]; 
      this.formTitulares.get('adjuntodocprimera')?.setValue(this.adjuntoSolicitudReconomiento.name);
  }
}

guardarDocumentoSolicitudRenococimiento(){
  let extension = '';
  if(this.adjuntoSolicitudReconomiento!=null) extension = this.adjuntoSolicitudReconomiento.name.split('.').pop()!;
  this.titular.nombreAdjunto = this.adjuntoSolicitudReconomiento.name;
                                                                                                 
    this._documentoService.uploadAdjuntoTitular(this.adjuntoSolicitudReconomiento, this.titular.titularId!, extension!, this.titular.nombreAdjunto!).subscribe((data: any) => {
                                          
      switch (data.result_code){
        case 200 : {
          console.log('guardado');
          /* this.cargarAdjuntoPrimeraInstancia(); */
          break;
        }
          default: { 
            /* this.cargarAdjuntoPrimeraInstancia(); */
            break; 
        } 
      }
    });
}

eliminarDocumentoSolicitudRenococimiento(){
  this.adjuntoModelSolicitudReconomiento.titularId = this.titular.titularId;

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
          this.titular.nombreAdjunto = '';
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
  
  const filename = this.titular.nombreAdjunto || '';
  this._documentoService.downloadAdjuntoTitular(this.titular.titularId!).subscribe(resp => {
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

}
