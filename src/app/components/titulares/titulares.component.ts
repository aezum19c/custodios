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
import { ComunidadModel } from 'src/app/models/comunidad.model';
import { ComunidadService } from 'src/app/service/comunidad.service';
import { ComunidadComponent } from '../comunidad/comunidad.component';
import { UbigeoModel } from 'src/app/models/ubigeo.model';
import { DominiosService } from 'src/app/service/dominio.service';
import { RespuestaServicio } from 'src/app/models/respuesta_servicio.model';
import { TituloModel } from 'src/app/models/titulos.model';
import { RespuestaCustodioModel } from 'src/app/models/respuesta_custodio.model';
import { ComiteService } from 'src/app/service/comite.service';
import { ComiteComponent } from '../comite/comite.component';
import { TitularRenovacionModel } from 'src/app/models/titular_renovacion.model';
import { ComiteRenovacionComponent } from '../comite-renovacion/comite-renovacion.component';
import { RespuestaComiteModel } from 'src/app/models/respuesta_titular_renovacion';
/* import { timeStamp } from 'console'; */

@Component({
  selector: 'app-titulares',
  templateUrl: './titulares.component.html',
  styleUrls: ['./titulares.component.css'],
  providers : [DatePipe],
})
export class TitularesComponent implements OnInit {
  @ViewChild('btnselectSolicitudRenocomiento') btnselectSolicitudRenocomiento!: ElementRef<HTMLElement>;
  
  titularRenovacion! : TitularRenovacionModel[]; 
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
  custodioSelected: string = '01';

  dominioDepartamentos! : UbigeoModel[];
  dominioProvincias! : UbigeoModel[];
  dominioDistritos! : UbigeoModel[];
  respuestaServicio : RespuestaServicio = new RespuestaServicio();
  tituloServicio : TituloModel = new TituloModel();
  custodioServicio: RespuestaCustodioModel = new RespuestaCustodioModel();
  comiteRespuestaServicio: RespuestaComiteModel = new RespuestaComiteModel();
  departamentoSelected: string='';
  selectedTipoPersona: string = '';

  adjuntoModelSolicitudReconomiento : AdjuntoModel = new AdjuntoModel; 
  adjuntoSolicitudReconomiento!: File;

  totalComites: number = 0;

  ocultarBtnGuardar!: boolean;

  constructor( 
    private _documentoService: DocumentoService,
    private custodioService: CustodiosService,
    private comunidadService: ComunidadService,
    private comiteService: ComiteService,
    private dominiosService: DominiosService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private _dialog: MatDialog,
    private custodiosServices: CustodiosService,
    ) { 
      
      /* this.titularRenovacion =[{titularId:1, comiteRenovacionId:1, flagRenovacion:0, resolucion:'resolucion', resolucionFecha:'2022-05-16',
      resolucionVigencia:1, vigenciaDesde:'2022-05-16', vigenciaHasta:'2022-05-18', estado:1},
      {titularId:1, comiteRenovacionId:2, flagRenovacion:0, resolucion:'resolucion', resolucionFecha:'2022-05-16',
      resolucionVigencia:1, vigenciaDesde:'2022-05-17', vigenciaHasta:'2022-05-20', estado:1}]; */
    }

  ngOnInit(): void {
    //const 
    this.cargarDepartamentos();
    this.crearFormulario();
    this.obtenerComunidades();
    this.obtenerCustodios();
    this.obtenerComites();
    
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

    this.departamentoSelected = this.titular.departamento!;
    this.dominioProvincias = [{provincia:'00', nombre:'-- Seleccionar --'}];
    this.dominioDistritos = [{ubigeoId:0, nombre:'-- Seleccionar --'}];

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
      distrito: [this.titular.ubigeoId],
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

      correoTitular: [this.titular.correoTitular],
      celularTitular: [this.titular.celularTitular],
      fechaActualizacion: [this.titular.fechaActualizacion],
    });


    if(this.accion_titular != 'N'){
      
      this.selectedTipoPersona = this.titular.tipoPersona!;

      this.dominiosService.getProvincias('P', this.titular.departamento!).subscribe((data: any) => {
        switch (data.result_code){
          case 200 : {
            this.respuestaServicio = data;
            this.dominioProvincias = this.respuestaServicio.ubigeos;
  
            this.dominioProvincias.unshift({
              provincia: '00',
              nombre: '-- Seleccionar --'
            });
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

            this.dominioDistritos.unshift({
              ubigeoId: 0,
              nombre: '-- Seleccionar --'
            });
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
          //this.custodioSelected = this.titular.tipoCustodio!;
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
    if(this.titular.tipoCustodio =='02'){
      if(this.departamentoSelected != '00'){
        if(this.titular.ubigeoId != '0'){
          if(this.custodioSelected!=''){
            this.guardarTitular();
          }
        }
      } else {
        Swal.fire('Eliga Departamento', '', 'info');
      }
    } else {
      this.guardarTitular();
    }
  }

  guardarTitular(){
    this.ocultarBtnGuardar = true;
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
        this.titular.nombreRepLegal = this.formTitulares.get('nombreRepLegal')?.value;
        this.titular.dniRucRepLegal = this.formTitulares.get('dniRucRepLegal')?.value;
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

        this.titular.correoTitular = this.formTitulares.get('correoTitular')?.value;
        this.titular.celularTitular = this.formTitulares.get('celularTitular')?.value;
        this.titular.fechaActualizacion = this.formTitulares.get('fechaActualizacion')?.value;

        this.titular.tipoCustodio = this.custodioSelected;

        if(this.titular.titularId == 0){
          //console.log('TitularId = 0');
          this.titular.accion = 'I';
          //console.log(this.titular);
          this.custodioService.crearTitular(this.titular).subscribe((data: any) => {
            //console.log('Data');
            //console.log(data);

            switch (data.result_code){
              case 200 : {
                //console.log('Data');
                //console.log(data);
                this.titular.titularId = data.code;
                this.titular.comiteRenovacionId = data.code_adittional;
                this.accion_titular = 'U';
                this.titular.accion = 'U';
                this.mostrar = true;

                localStorage.removeItem('titular');
                localStorage.setItem('titular', JSON.stringify(this.titular));
                Swal.fire('Guardado!', '', 'success');
              }
            }

            this.ocultarBtnGuardar = false;
          });
        } else {
          //console.log('TitularId diferente de 0');
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
            this.ocultarBtnGuardar = false;
          });
        }

        
      } else {
        this.ocultarBtnGuardar = false;
        Swal.fire('Cancelado', '', 'info');
      }
    })
  }

  get fechaSesionNoValido() {
    return this.formTitulares.get('fecha')?.invalid && this.formTitulares.get('fecha')?.touched;
  }

  regresar(){
    if(this.accion_titular!='V'){
      this.router.navigate(['/custodios']);
    } else {
      this.router.navigate(['/consulta-publica']);
    }
    
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



  /* *********************** */
  obtenerCustodios(){
    this.custodioService.getCustodios(this.titular.titularId!, 0, '', this.page, this.regxpag).subscribe((data: any) => {
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

    custodio.custodioId = 0;
    custodio.titularId = this.titular.titularId;
    custodio.comiteRenovacionId = this.titular.comiteRenovacionId;
    custodio.tipoCustodio = '01'  //01 Titulo Habilitante

    custodio.estadoRenovacionComite = 1;

    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    localStorage.setItem('accion_custodio', JSON.stringify('N'));
    

    this.router.navigate(['/mantenimientocustodios/nuevo']);
  }

  verCustodio(custodio: CustodioModel){

    custodio.titularId = this.titular.titularId;
    custodio.comiteRenovacionId = this.titular.comiteRenovacionId;
    custodio.tipoCustodio = '01'  //01 Titulo Habilitante

    custodio.estadoRenovacionComite = 1;

    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    if(this.accion_titular=='V'){
      localStorage.setItem('accion_custodio', JSON.stringify('V'));
    } else {
      localStorage.setItem('accion_custodio', JSON.stringify('M'));
    }

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
        this.abrirCargando();
        this.custodioService.activaDesactivarCustodio(custodio).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerCustodios();
              this.mostrarMsjError('Custodio Desactivado', false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo', true);
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
        this.abrirCargando();
        this.custodioService.activaDesactivarCustodio(custodio).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerCustodios();
              this.mostrarMsjError('Custodio Activado', false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo', true);
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
        this.abrirCargando();
        this.comunidadService.desactivaActivaComunidad(comunidad).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerComunidades();
              this.mostrarMsjError('Titulo Habilitante Activado',false);
              break;
            }
            default: {
              this.mostrarMsjError('Vuelva a intentarlo',true); 
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
      title: '¿Seguro de DESACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.abrirCargando();
        this.comunidadService.desactivaActivaComunidad(comunidad).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerComunidades();
              this.mostrarMsjError('Titulo Habilitante Desactivado',false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo',true);
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
          this.dominioDepartamentos.unshift({
            departamento: '00',
            nombre: '-- Seleccionar --'
          });
          if(this.accion_titular == 'N'){
            this.departamentoSelected = '00';
          }

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

          this.dominioProvincias.unshift({
            provincia: '00',
            nombre: '-- Seleccionar --'
          });
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

          //this.titular.ubigeoId = this.formTitulares.get('distrito')?.value;

          this.dominioDistritos.unshift({
            ubigeoId: 0,
            nombre: '-- Seleccionar --'
          });
          this.titular.ubigeoId = '0';
          //localStorage.removeItem('caducidad');
          //localStorage.setItem('caducidad', JSON.stringify(this.dominioCaducidad));
          break;
        } default: { 
          //statements; 
          break; 
        } 
      }
    })
  }

  onSelectDepartamento(event:Event):void{
    this.departamentoSelected = (event.target as HTMLInputElement).value;
    this.cargarProvincias(event);

    this.dominioDistritos = [{departamento:'', distrito:'', nombre:'-- Seleccionar --', provincia:'00', ubigeoId:0}]
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


  /************** PESTAÑA COMITES ************/
  obtenerComites(){
    this.comiteService.getComite(this.titular.titularId!, 1, 10).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.comiteRespuestaServicio = data;
          this.titularRenovacion = this.comiteRespuestaServicio.content;
          //console.log('TiturlarRenovación');
          //console.log(this.titularRenovacion);
          this.totalComites = this.titularRenovacion.length ?? 0;
          break;
        }
        default: { 
          this.totalComites = 0;
          break; 
       } 
      }
    });
  }

  nuevoComite(){
    const dialogRef = this._dialog.open(ComiteComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.comite = this.titular;
    dialogRef.componentInstance.accion = 'N';
    //console.log('TitularId:')
    //console.log( this.titular.titularId!);
    dialogRef.componentInstance.titularId = this.titular.titularId!;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarComite('cerrarComite');
    });
  }

  nuevaRenovacionComite(){
    let titularRenovacion: TitularRenovacionModel = new TitularRenovacionModel;

    const dialogRef = this._dialog.open(ComiteRenovacionComponent, {
      disableClose: true
    });

    titularRenovacion.comiteRenovacionId = 0;
    dialogRef.componentInstance.titularRenovacion = titularRenovacion;
    dialogRef.componentInstance.accion = 'I';
    dialogRef.componentInstance.accion_titular = this.accion_titular;
    dialogRef.componentInstance.titularId = this.titular.titularId!;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarComite('cerrarComite');
    });
  }

  verComite(titularRenovacion: TitularRenovacionModel){
    if( titularRenovacion.tipoRenovacion === 'C' ){

      const dialogRef = this._dialog.open(ComiteComponent, {
        disableClose: true
      });
  
      this.titular.estado = titularRenovacion.estado;

      dialogRef.componentInstance.comite = this.titular;
      dialogRef.componentInstance.accion = 'A';
      dialogRef.componentInstance.titularId = this.titular.titularId!;
  
      dialogRef.afterClosed().subscribe(result => {
        this.validarAntesDeListarComite('cerrarComite');
      });

    } else if (titularRenovacion.tipoRenovacion === 'R'){

      const dialogRef = this._dialog.open(ComiteRenovacionComponent, {
        disableClose: true
      });
  
      dialogRef.componentInstance.titularRenovacion = titularRenovacion;
      dialogRef.componentInstance.accion = 'M';
      dialogRef.componentInstance.accion_titular = this.accion_titular;
      dialogRef.componentInstance.titularId = this.titular.titularId!;
  
      dialogRef.afterClosed().subscribe(result => {
        this.validarAntesDeListarComite('cerrarComite');
      });

    }
    
  }
  
  validarAntesDeListarComite(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    if (cerrar === '1'){
      //Es necesario actualizar los campos del titular, luego de grabar Nuevo Comite(Para la primera vez).
      //Y poder verComite con estos valores.
    this.obtenerTitulares();
      //this.obtenerComites();
    }

    localStorage.removeItem(strItem);
  }

  obtenerTitulares(){
    this.custodiosServices.getTitular(this.titular.titularId!).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          
          this.respuestaServicio = data;
          
          localStorage.removeItem('titular');
          localStorage.setItem('titular', JSON.stringify(this.respuestaServicio.titular));

          this.obtenerComites();
          break;
        }
        default: { 
          break; 
       } 
      }
    });
  }

  activarComite(comite: TitularRenovacionModel){
    comite.accion = 'E'
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.abrirCargando();
        this.comiteService.desactivaActivaComite(comite).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerComites();
              this.mostrarMsjError('Comite Activado',false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo',true);
              break; 
          } 
          }
        })
      }
    })
  }

  desactivarComite(comite: TitularRenovacionModel){
    comite.accion = 'D'
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.abrirCargando();
        this.comiteService.desactivaActivaComite(comite).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.obtenerComites();
              this.mostrarMsjError('Comite desactivado',false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelva a intentarlo',true);
              break; 
          } 
          }
        })
      }
    })
  }


  abrirCustodiosxComite(renovacionComite: TitularRenovacionModel){
    
    renovacionComite.titularId = this.titular.titularId
    localStorage.removeItem('accion_custodio');
    localStorage.removeItem('renovacionComite');

    if(this.accion_titular=='V'){
      localStorage.setItem('accion_custodio',  JSON.stringify('V')); 
    } else {
      localStorage.setItem('accion_custodio', JSON.stringify(''));
    }

    localStorage.setItem('renovacionComite', JSON.stringify(renovacionComite));

    /* localStorage.removeItem('titularId');
    localStorage.removeItem('comiteRenovacionId');
    localStorage.setItem('titularId', JSON.stringify(this.titular.titularId));
    localStorage.setItem('comiteRenovacionId', JSON.stringify(renovacionComite.comiteRenovacionId)); */
    


    this.router.navigate(['/custodios-comite']);
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
