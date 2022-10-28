import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustodioModel } from 'src/app/models/custodio.model';
import { DominioModel } from 'src/app/models/dominio.model';
import { RespuestaServicio } from 'src/app/models/respuesta_servicio.model';
import { TitularModel } from 'src/app/models/titular.model';
import { UserModel } from 'src/app/models/user.model';
import { CustodiosService } from 'src/app/service/custodio.service';
import { DocumentoService } from 'src/app/service/documento.service';
import { DominiosService } from 'src/app/service/dominio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custodios',
  templateUrl: './custodios.component.html',
  styleUrls: ['./custodios.component.css'
  ],
  providers : [DatePipe]
})

export class CustodiosComponent implements OnInit {

  formCustodios! : FormGroup;
  respuestaServicio : RespuestaServicio = new RespuestaServicio();
  
  titulares! : TitularModel[]; 
  dominioCaducidad! : DominioModel[]; 
  dominioObservacion! : DominioModel[]; 
  usuarioSession : UserModel = new UserModel();
  
  page: number = 1;
  regxpag: number = 3;
  totalRegistros: number = 0;
  filtro: string='';

  constructor( 
    private custodiosServices: CustodiosService,
    private dominiosServices: DominiosService,
    private router: Router,
    private datePipe: DatePipe,
    private _documentoService: DocumentoService
  ) {
    this.crearFormulario();
    this.obtenerDominios();
   }

  ngOnInit(): void {
  }

  get custodes(){
    return this.formCustodios.get('custodes') as FormArray;
  }

  crearFormulario(){
    //this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
    this.obtenerTitulares();
  }

  buscar(){
    this.obtenerTitulares();
  }

  paginar(e: any) {
    this.page = e.pageIndex + 1;
    this.obtenerTitulares();
  }

  obtenerTitulares(){
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

    this.titulares = [
      { tituloId: 1,
        nroTituloHabilitante: '0JDK96',
        nombreTituloHabilitante: 'NOMBRE TITULO',
        nombreTitularHabilitante: 'TITULAR',
        dniRuc: '828632836',
        nombreComunidad: 'COMUNIDAD',
        ambitoTerritorial: '',
        provincia: '',
        distrito: '',
        extension: '',
        inicioVigencia: new Date,
        finVigencia: new Date,
        solicitudReconocimientoComite:'',
        fechaSolicitudComite:'',
        actoAdministrativoComite:'',
        fechaResolucionComite:'',
        vigenciaComite:'',
        inicioVigenciaPermiso:'',
        finVigenciaPermiso:'',
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { tituloId: 2,
        nroTituloHabilitante: '0JDK97',
        nombreTituloHabilitante: 'NOMBRE TITULO',
        nombreTitularHabilitante: 'TITULAR',
        dniRuc: '828632837',
        nombreComunidad: 'COMUNIDAD',
        ambitoTerritorial: '',
        provincia: '',
        distrito: '',
        extension: '',
        inicioVigencia: new Date,
        finVigencia: new Date,
        solicitudReconocimientoComite:'',
        fechaSolicitudComite:'',
        actoAdministrativoComite:'',
        fechaResolucionComite:'',
        vigenciaComite:'',
        inicioVigenciaPermiso:'',
        finVigenciaPermiso:'',
        estado: 1,
        usuarioRegistro: 1,
        fechaRegistro: '',
        totalRegistros: '3',
        totalPaginas: 3,
      },
      { tituloId: 3,
        nroTituloHabilitante: '0JDK98',
        nombreTituloHabilitante: 'NOMBRE TITULO',
        nombreTitularHabilitante: 'TITULAR',
        dniRuc: '828632838',
        nombreComunidad: 'COMUNIDAD',
        ambitoTerritorial: '',
        provincia: '',
        distrito: '',
        extension: '',
        inicioVigencia: new Date,
        finVigencia: new Date,
        solicitudReconocimientoComite:'',
        fechaSolicitudComite:'',
        actoAdministrativoComite:'',
        fechaResolucionComite:'',
        vigenciaComite:'',
        inicioVigenciaPermiso:'',
        finVigenciaPermiso:'',
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

 

  nuevoCustodio(){
    let titular : TitularModel = {};
    titular.tituloId = 0;
    localStorage.removeItem('titular');
    localStorage.removeItem('accion_titular');

    localStorage.setItem('titular', JSON.stringify(titular));
    localStorage.setItem('accion_titular', JSON.stringify('N'));

    this.router.navigate(['/titulares/nuevo']);
  }

  verDatosCustodio(titular: TitularModel){
    /* PRUEBA INICIO */
    titular = new TitularModel;
    titular.tituloId = 0;
    /* PRUEBA INICIO */


    localStorage.removeItem('titular');
    localStorage.removeItem('accion_titular');

    localStorage.setItem('titular', JSON.stringify(titular));
    localStorage.setItem('accion_titular', JSON.stringify('N'));
    /* localStorage.setItem('accion_custodior', JSON.stringify('U')); */

    this.router.navigate(['/titulares/nuevo']);
  }

  desactivarRegistro(titular: CustodioModel){
    /*Swal.fire({
      title: '¿Seguro de DESACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.custodiosServices.desactivarCustodio( { custodioId: custodio.custodioId!, usuarioRegistro: this.usuarioSession.usuarioId! } ).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.crearFormulario();
              break;
            }
            default: { 
              //statements; 
              break; 
          } 
          }
        })
      }
    })*/
  }

  activarRegistro(infractor: CustodioModel){
    /*Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.custodiosServices.activarCustodio({ custodioId: infractor.custodioId!, usuarioRegistro: this.usuarioSession.usuarioId! }).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.crearFormulario();
              break;
            }
            default: { 
              break; 
          } 
          }
        })
      }
    })*/
  }

  reporte(){
    /*this._documentoService.getReporte(this.filtro).subscribe((data: any) => {
        const blobdata = new Blob([data], { type: 'application/octet-stream' });
        const blob = new Blob([blobdata], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'reporte_custodios.xls';
        anchor.href = url;
        anchor.click();
    });*/
  }

  obtenerDominios(){
    /*this.dominiosServices.getDominioCaducidad().subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioCaducidad = this.respuestaServicio.detalle;

          localStorage.removeItem('caducidad');
          localStorage.setItem('caducidad', JSON.stringify(this.dominioCaducidad));
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })

    this.dominiosServices.getDominioObservacion().subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioObservacion = this.respuestaServicio.detalle;

          localStorage.removeItem('observacion');
          localStorage.setItem('observacion', JSON.stringify(this.dominioObservacion));
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })*/
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

}
