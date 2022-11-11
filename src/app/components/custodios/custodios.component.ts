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
  dominioTipoCustodio! : DominioModel[]; 
  dominioObservacion! : DominioModel[]; 
  dominioMotivos! : DominioModel[]; 
  usuarioSession : UserModel = new UserModel();
  
  page: number = 1;
  regxpag: number = 10;
  totalRegistros: number = 0;
  selectedTipoCustodio: string = '';
  filtro: string='';

  constructor( 
    private custodiosServices: CustodiosService,
    private dominiosServices: DominiosService,
    private router: Router,
    private datePipe: DatePipe,
    private _documentoService: DocumentoService
  ) {
    this.obtenerDominios();
    this.crearFormulario();
   }

  ngOnInit(): void {
  }

  get custodes(){
    return this.formCustodios.get('custodes') as FormArray;
  }

  crearFormulario(){
    this.usuarioSession = JSON.parse( localStorage.getItem('usuariosession') || '{}' );
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
    this.custodiosServices.getTitulares(0, this.filtro,  this.selectedTipoCustodio, this.page, this.regxpag).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          
          this.respuestaServicio = data;
          this.totalRegistros = data.content[0].totalRegistros!;
          this.titulares = this.respuestaServicio.content;

          console.log('Titulares');
          console.log(this.titulares);
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

  nuevoCustodio(){
    let titular : TitularModel = {};
    localStorage.removeItem('titular');
    localStorage.removeItem('accion_titular');

    localStorage.setItem('titular', JSON.stringify(titular));
    localStorage.setItem('accion_titular', JSON.stringify('N'));

    this.router.navigate(['/titulares/nuevo']);
  }

  verDatosCustodio(titular: TitularModel){
    localStorage.removeItem('titular');
    localStorage.removeItem('accion_titular');

    localStorage.setItem('titular', JSON.stringify(titular));
    localStorage.setItem('accion_titular', JSON.stringify('U'));

    this.router.navigate(['/titulares/nuevo']);
  }

  desactivarRegistro(titular: TitularModel){
    titular.accion ='D';
    console.log('Titular:Descativar');
    console.log(titular);
    Swal.fire({
      title: '¿Seguro de DESACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.custodiosServices.activaDesactivarTitular(titular).subscribe((data: any) => {
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
    })
  }

  activarRegistro(titular: TitularModel){
    titular.accion ='E';
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.custodiosServices.activaDesactivarTitular(titular).subscribe((data: any) => {
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
    })
  }

  reporte(){
    if(this.selectedTipoCustodio!='00'){
      /*this._documentoService.getReporte(this.filtro).subscribe((data: any) => {
              const blobdata = new Blob([data], { type: 'application/octet-stream' });
              const blob = new Blob([blobdata], { type: 'application/octet-stream' });
              const url = window.URL.createObjectURL(blob);
              const anchor = document.createElement('a');
              anchor.download = 'reporte_custodios.xls';
              anchor.href = url;
              anchor.click();
          });*/
    }else{
      Swal.fire('Eliga el Tipo de Custodio', '', 'info');
    }
    
  }

  ficha(titular: TitularModel){
    /*this._documentoService.getFicha(infractor.infractorId!).subscribe((data: any) => {
      const blobdata = new Blob([data], { type: 'application/octet-stream' });
      const blob = new Blob([blobdata], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'Ficha_RIFFS.pdf';
      anchor.href = url;
      anchor.click();
    });*/
  }

  obtenerDominios(){

    this.dominiosServices.getDominioTiposCustodio().subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioTipoCustodio = this.respuestaServicio.detalle;
          this.dominioTipoCustodio.unshift({
            codigoDetalle: '00',
            valorDetalle: '-- Todos --'
          });
          localStorage.removeItem('tipoCustodio');
          localStorage.setItem('tipoCustodio', JSON.stringify(this.dominioTipoCustodio));

          this.selectedTipoCustodio = '00';
          this.crearFormulario();
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })

    this.dominiosServices.getDominioTiposPersona().subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioObservacion = this.respuestaServicio.detalle;

          localStorage.removeItem('tipoPersona');
          localStorage.setItem('tipoPersona', JSON.stringify(this.dominioObservacion));
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })


    this.dominiosServices.getDominioMotivosPerdida().subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.respuestaServicio = data;
          this.dominioMotivos = this.respuestaServicio.detalle;

          localStorage.removeItem('motivosPerdida');
          localStorage.setItem('motivosPerdida', JSON.stringify(this.dominioMotivos));
          break;
        }
        default: { 
          //statements; 
          break; 
       } 
      }
    })
  }

  onSelectTipoCustodio(event:Event):void{
    this.selectedTipoCustodio = (event.target as HTMLInputElement).value;
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
