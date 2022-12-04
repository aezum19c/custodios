import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DominioModel } from 'src/app/models/dominio.model';
import { RespuestaServicio } from 'src/app/models/respuesta_servicio.model';
import { TitularModel } from 'src/app/models/titular.model';
import { UserModel } from 'src/app/models/user.model';
import { CustodiosService } from 'src/app/service/custodio.service';
import { DocumentoService } from 'src/app/service/documento.service';
import { DominiosService } from 'src/app/service/dominio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-publica',
  templateUrl: './consulta-publica.component.html',
  styleUrls: ['./consulta-publica.component.css'],
  providers : [DatePipe]
})
export class ConsultaPublicaComponent implements OnInit {


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
          this.totalRegistros = data.content[0].totalRegistros ?? 0;
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

  verDatosCustodio(titular: TitularModel){
    localStorage.removeItem('titular');
    localStorage.removeItem('accion_titular');

    localStorage.setItem('titular', JSON.stringify(titular));
    localStorage.setItem('accion_titular', JSON.stringify('V'));

    this.router.navigate(['/titulares/nuevo']);
  }
  reporte(){
    if(this.selectedTipoCustodio!='00'){
      this.abrirCargando();
      this._documentoService.getReporteCustodio(this.filtro, this.selectedTipoCustodio).subscribe((data: any) => {
          const blobdata = new Blob([data], { type: 'application/octet-stream' });
          const blob = new Blob([blobdata], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = 'reporte_custodios.xls';
          anchor.href = url;
          anchor.click();

          this.cerrarCargando();
      });
    }else{
      Swal.fire('Eliga el Tipo de Custodio', '', 'info');
    }
    
  }

  ficha(titular: TitularModel){
    this.abrirCargando();
    this._documentoService.getFicha(titular.titularId!).subscribe((data: any) => {
      const blobdata = new Blob([data], { type: 'application/octet-stream' });
      const blob = new Blob([blobdata], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'Ficha_RCFFS.pdf';
      anchor.href = url;
      anchor.click();

      this.cerrarCargando();
    });
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
