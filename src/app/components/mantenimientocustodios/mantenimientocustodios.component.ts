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
import { ContratoComponent } from '../contrato/contrato.component';

@Component({
  selector: 'app-mantenimientocustodios',
  templateUrl: './mantenimientocustodios.component.html',
  styleUrls: ['./mantenimientocustodios.component.css'],
  providers : [DatePipe]
})
export class MantenimientocustodiosComponent implements OnInit {
  contratos! : ContratoModel[]; 
  formCustodio! : FormGroup;
  titular : TitularModel = new TitularModel();
  dominioCaducidad! : DominioModel[]; 
  dominioObservacion! : DominioModel[];
  adjuntos! : AdjuntoModel[]; 
  documento : DocumentoModel = new DocumentoModel();
  usuarioSession : UserModel = new UserModel();

  page: number = 1;
  regxpag: number = 10;
  totalAdjuntos: number = 0;
  accion_custodio: string = '';
  mostrar: boolean = false;
  custodioSelected: string = '1';

  constructor( 
    private _documentoService: DocumentoService,
    private custodioService: CustodiosService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private _dialog: MatDialog

    ) { 
      
      
    }

  ngOnInit(): void {
    //const 
    this.crearFormulario();
    //this.cargarAdjuntos();
    this.crearTablaContratos();
    this.adjuntos = [{adjuntoId:1, nombre:'nuevo adjunto file', descripcion :'Traer adjunto', fecha:'2022-05-16'}];
  }

  crearFormulario(){

    this.titular = JSON.parse( localStorage.getItem('custodio') || '{}' );
    this.dominioCaducidad = JSON.parse( localStorage.getItem('caducidad') || '[]' );
    this.dominioObservacion = JSON.parse( localStorage.getItem('observacion') || '[]' );

    this.accion_custodio = JSON.parse( localStorage.getItem('accion_custodio') || '' );
  

    this.custodioSelected = this.titular.tipoCustodio ?? '';
    //console.log('Titulo o Comite elegido');
    //console.log(this.custodioSelected);

    if(this.accion_custodio == 'N' ){ this.mostrar =false; } else { this.mostrar = true}; 

    this.formCustodio = this.fb.group({
      
      nroTituloHabilitante : [this.titular.nroTituloHabilitante],
      nombreTituloHabilitante : [this.titular.nombreTituloHabilitante],
      /* nombreTitularHabilitante : [this.titular.nombreTitularHabilitante], */
      dniRuc : [this.titular.dniRucTitular],
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

  crearTablaContratos(){
    //this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
    this.obtenerContratos();
  }

  obtenerContratos(){
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

    this.contratos = [
      { contratoId: 1,
        tipoContrato: '0JDK96',
        renovaciones: 'NOMBRE TITULO',
        resolucionRenovacion: 'TITULAR',
        actoAdministrativo: '63737838',
        fechaActoAdministrativo: '10/10/2022',
        vigencia: 1,
        inicioVigencia: 2,
        finVigencia: '',
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { contratoId: 2,
        tipoContrato: '0JDK96',
        renovaciones: 'NOMBRE TITULO',
        resolucionRenovacion: 'TITULAR',
        actoAdministrativo: '83393',
        fechaActoAdministrativo:  '09/10/2022',
        vigencia: 1,
        inicioVigencia: 2,
        finVigencia: '',
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { contratoId: 3,
        tipoContrato: '0JDK96',
        renovaciones: 'NOMBRE TITULO',
        resolucionRenovacion: 'TITULAR',
        actoAdministrativo: '2777272',
        fechaActoAdministrativo:  '08/10/2022',
        vigencia: 1,
        inicioVigencia: 2,
        finVigencia: '',
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
    ];
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
    this.router.navigate(['/titulares/:id']);
    localStorage.removeItem('titulares');
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

  
  nuevoContrato(){
    let contrato: ContratoModel = {};

    const dialogRef = this._dialog.open(ContratoComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.contrato = contrato;
    dialogRef.componentInstance.contrato.tipoContrato = this.custodioSelected;
    dialogRef.componentInstance.accion = 'I';
    dialogRef.componentInstance.custodioId = 1;/* this.infractor.custodioId!; */

    dialogRef.afterClosed().subscribe(result => {
      this.validarAntesDeListarContrato('cerrarContrato');
    });
  }
  validarAntesDeListarContrato(strItem: string){
    let cerrar: string = localStorage.getItem(strItem) || '';
    /* if (cerrar === '1'){
      this.page = 1;
      this.cargarAdjuntos();
    } */

    localStorage.removeItem(strItem);
  }

  verContrato(contrato: ContratoModel){

  }
  desactivarRegistro(contrato: ContratoModel){

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

  
}
