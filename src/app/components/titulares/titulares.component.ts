import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
/* import { timeStamp } from 'console'; */

@Component({
  selector: 'app-titulares',
  templateUrl: './titulares.component.html',
  styleUrls: ['./titulares.component.css'],
  providers : [DatePipe],
})
export class TitularesComponent implements OnInit {

  contratos! : ContratoModel[]; 
  formCustodio! : FormGroup;
  titular : TitularModel = new TitularModel();
  dominioCaducidad! : DominioModel[]; 
  dominioObservacion! : DominioModel[];
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

  constructor( 
    private _documentoService: DocumentoService,
    private custodioService: CustodiosService,
    private comuniddadService: ComunidadService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private _dialog: MatDialog

    ) { 
      this.adjuntos = [{adjuntoId:1, nombre:'nuevo adjunto file', descripcion :'Traer adjunto', fecha:'2022-05-16'}];
    }

  ngOnInit(): void {
    //const 
    this.crearFormulario();
    this.obtenerCustodios();
    this.obtenerComunidades();
    //this.cargarAdjuntos();
  }

  onSelected(value:string): void {
		this.custodioSelected = value;
	}

  crearFormulario(){

    this.titular = JSON.parse( localStorage.getItem('titular') || '{}' );
    this.dominioCaducidad = JSON.parse( localStorage.getItem('caducidad') || '[]' );
    this.dominioObservacion = JSON.parse( localStorage.getItem('observacion') || '[]' );

    this.accion_titular = JSON.parse( localStorage.getItem('accion_titular') || '' );
  

    if(this.accion_titular == 'N' ){ this.mostrar =false; } else { this.mostrar = true}; 

    this.formCustodio = this.fb.group({
      
      nroTituloHabilitante : [this.titular.nroTituloHabilitante],
      nombreTituloHabilitante : [this.titular.nombreTituloHabilitante],
      nombreTitularHabilitante : [this.titular.nombreTitularHabilitante],
      dniRuc : [this.titular.dniRuc],
      nombres : '',
      apellidos : '',
      dniCe : '',
      recibioCapacitacion : '',
      fechaCapacitacion : new Date,
      numeroConstanciaCapacitacion : '',
      solicitudReconocimiento: '',
      fechaSolicitud: '',
      actoAdministrativo: '',
      fechaActoAdministrativo: new Date,
      vigencia: '',
      inicioVigencia: '',
      finVigencia: '',
      codigoCarneAcreditacion: '',
      perdidaAcreditacion: '',
      motivo: '',
      fechaActoAdminPerdidadAcredi : '',
      renovaciones : '',
      actoAdministrativoRenovacion : '',
      fechaActoAdministrativoRenovacion: '',
      periodoVigencia: '',
      inicioPeriodoVigencia: '',
      finPeriodoVigencia: '',
      tipoCustodio:'',
      nombreComunidad: '',
      ambitoTerritorial: '',
      provincia:'',
      distrito:'',
      extension:'',
      cargo:'',

      /* nombreComunidad: [this.titular.nombreComunidad], */

       
      /* atributoCustorioAcreditado: [this.titular.custodio?],
      nroTituloHabilitante: [this.titular.nroTituloHabilitante],
      tipoTituloHabilitante: [this.titular.tipoTituloHabilitante],
      tipoConcesion: [this.titular.tipoConcesion],
      ubigeoHabilitante: [this.titular.ubigeoHabilitante],
      nroOcurrenciaDetectada: [this.titular.nroOcurrenciaDetectada],
      fechaExpiracion: [this.titular.fechaExpiracion],
      vigencia: [this.titular.vigencia],
      fichaTituloHabilitante: [this.titular.fichaTituloHabilitante],
      alertaCorreoElectronico : [this.titular.alertaCorreoElectronico],
      estado : [this.titular.estado], */

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
    Swal.fire({
      title: '¿Quieres guardar los cambios?',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      /* if (result.isConfirmed) {
        this.custodio.area = this.formCustodio.get('area')?.value;
        this.custodio.nombresApellido = this.formCustodio.get('nombresApellido')?.value;
        this.custodio.dniCarnetExtranjeria = this.formCustodio.get('dniCarnetExtranjeria')?.value;
        this.custodio.actoAdministrativo = this.formCustodio.get('actoAdministrativo')?.value;
        this.custodio.credenciales = this.formCustodio.get('credenciales')?.value;
        this.custodio.atributoCustorioAcreditado = this.formCustodio.get('atributoCustorioAcreditado')?.value;
        this.custodio.nroTituloHabilitante = this.formCustodio.get('nroTituloHabilitante')?.value;
        this.custodio.tipoTituloHabilitante = this.formCustodio.get('tipoTituloHabilitante')?.value;
        this.custodio.tipoConcesion = this.formCustodio.get('tipoConcesion')?.value;
        this.custodio.ubigeoHabilitante = this.formCustodio.get('ubigeoHabilitante')?.value;
        this.custodio.nroOcurrenciaDetectada = this.formCustodio.get('nroOcurrenciaDetectada')?.value;
        this.custodio.fechaExpiracion = this.formCustodio.get('fechaExpiracion')?.value;
        this.custodio.vigencia = this.formCustodio.get('vigencia')?.value;
        this.custodio.fichaTituloHabilitante = this.formCustodio.get('fichaTituloHabilitante')?.value;
        this.custodio.alertaCorreoElectronico = this.formCustodio.get('alertaCorreoElectronico')?.value;
        this.custodio.estado = this.formCustodio.get('estado')?.value;

        if(this.custodio.custodioId == 0){
          this.custodioService.crearCustodio(this.custodio).subscribe((data: any) => {
            switch (data.result_code){
              case 200 : {
                this.mostrar = true;
                localStorage.removeItem('custodio');
                Swal.fire('Guardado!', '', 'success');
                this.router.navigate(['/custodios']);
              }
            }
          });
        } else {
          this.custodioService.modificarCustodio(this.custodio).subscribe((data: any) => {
            switch (data.result_code){
              case 200 : {
                localStorage.removeItem('custodio');
                Swal.fire('Guardado!', '', 'success');
                this.router.navigate(['/custodios']);
              }
            }
          });
        }

        
      } else if (result.isDenied) {
        Swal.fire('Volver a cargar', '', 'info')
      } */
    })

  }

  get fechaSesionNoValido() {
    return this.formCustodio.get('fecha')?.invalid && this.formCustodio.get('fecha')?.touched;
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
    this._documentoService.downloadAdjunto(adjunto.custodioId!, adjunto.adjuntoId!).subscribe(resp => {
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
    this._documentoService.getListadoAdjuntos(this.titular.tituloId!, this.page, 1000).subscribe((data: any) => {
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
    dialogRef.componentInstance.custodioId = this.titular.tituloId!;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListar('cerrarDocumento');
    });
  }

  editarDocumento(adjunto: AdjuntoModel){
    const dialogRef = this._dialog.open(DocumentosComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.documento = adjunto;
    dialogRef.componentInstance.custodioId = this.titular.tituloId!;
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

  nuevoCustodio(){

  }

  verCustodio(custodio: CustodioModel){

  }
  desactivarRegistro(custodio: CustodioModel){

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
  nuevoTipoCustodio(){
    let custodio : TitularModel = {};
    custodio.tituloId = 0;
    custodio.tipoCustodio =  this.custodioSelected;
    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    localStorage.setItem('accion_custodio', JSON.stringify('N'));

    this.router.navigate(['/mantenimientocustodios/nuevo']);
  }
  
  obtenerCustodios(){
    /*this.custodiosServices.getCustodios(0, this.filtro, this.page, this.regxpag).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.totalRegistros = data.content[0].totalRegistros;
          this.custodios = this.respuestaServicio.content;
          break;
        }
        default: { 
          break; 
       } 
      }
    });*/

    this.custodios = [
      { custodioId: 1,
        nombres: 'Custodio 1',
        apellidos: '',
        dniCe: '12341234',
        cargo: 'cargo 1',
        recibioCapacitacion: 'COMUNIDAD',
        fechaCapacitacion: '11/10/2022',
        numeroConstanciaCapacitacion: '',
        solicitudReconocimiento: '',
        actoAdministrativo: '',
        fechaActoAdministrativo: new Date,
        vigencia: 2,
        inicioVigencia:new Date,
        finVigencia:new Date,
        codigoCarneAcreditacion:'',
        perdidaAcreditacion:'',
        motivo:'',
        motivoDes:'',
        actoAdminPerdidaAcredi:'',
        fechaActoAdminPerdidadAcredi: new Date,
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { custodioId: 2,
        nombres: 'Custodio 2',
        apellidos: '',
        dniCe: '364523453',
        cargo: 'cargo 2',
        recibioCapacitacion: 'COMUNIDAD',
        fechaCapacitacion: '10/10/2022',
        numeroConstanciaCapacitacion: '',
        solicitudReconocimiento: '',
        actoAdministrativo: '',
        fechaActoAdministrativo: new Date,
        vigencia: 2,
        inicioVigencia:new Date,
        finVigencia:new Date,
        codigoCarneAcreditacion:'',
        perdidaAcreditacion:'',
        motivo:'',
        motivoDes:'',
        actoAdminPerdidaAcredi:'',
        fechaActoAdminPerdidadAcredi: new Date,
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { custodioId: 3,
        nombres: 'Custodio 3',
        apellidos: '',
        dniCe: '248583738',
        cargo: 'cargo 3',
        recibioCapacitacion: 'COMUNIDAD',
        fechaCapacitacion: '09/10/2022',
        numeroConstanciaCapacitacion: '',
        solicitudReconocimiento: '',
        actoAdministrativo: '',
        fechaActoAdministrativo: new Date,
        vigencia: 2,
        inicioVigencia:new Date,
        finVigencia:new Date,
        codigoCarneAcreditacion:'',
        perdidaAcreditacion:'',
        motivo:'',
        motivoDes:'',
        actoAdminPerdidaAcredi:'',
        fechaActoAdminPerdidadAcredi: new Date,
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
    ];
  }



  verComunidad(comunidad: ComunidadModel){
  }

  obtenerComunidades(){
    /*this.custodiosServices.getCustodios(0, this.filtro, this.page, this.regxpag).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.totalRegistros = data.content[0].totalRegistros;
          this.custodios = this.respuestaServicio.content;
          break;
        }
        default: { 
          break; 
       } 
      }
    });*/

    this.comunidades = [
      { comunidadId: 1,
        nroTituloHabilitante: 'NRTH-7113-ZALOI',
        extension: 'EXTENSION 1',
        fechaPeriodoInicio:'11/10/2022',
        fechaPeriodoFin: '11/10/2022',
        vigencia: 2,
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { comunidadId: 2,
        nroTituloHabilitante: 'NRTH-7113-ZALOI',
        extension: 'EXTENSION 2',
        fechaPeriodoInicio:'11/10/2022',
        fechaPeriodoFin: '11/10/2022',
        vigencia: 2,
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { comunidadId: 3,
        nroTituloHabilitante: 'NRTH-7373-ZAHJ',
        extension: 'EXTENSION 3',
        fechaPeriodoInicio:'11/10/2022',
        fechaPeriodoFin: '11/10/2022',
        vigencia: 2,
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
    ];
  }


  nuevaComunidad(){
    let comunidad: ComunidadModel = {};

    const dialogRef = this._dialog.open(ComunidadComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.comunidad = comunidad;
    dialogRef.componentInstance.accion = 'I';
    dialogRef.componentInstance.custodioId = 1;

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarComunidad('cerrarComunidad');
    });
  }
  validarAntesDeListarComunidad(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    /* if (cerrar === '1'){
      this.page = 1;
      this.cargarAdjuntos();
    } */

    localStorage.removeItem(strItem);
  }
}
