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
import { forkJoin } from "rxjs";

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
  selectedTipoCustodio: string = '00';
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
    this.llamarServicios();

    /* this.custodiosServices.getTitulares(0, this.filtro,  this.selectedTipoCustodio, this.page, this.regxpag).subscribe((data: any) => {
      console.log('data');
      console.log(data);
      switch (data.result_code){
        case 200 : {
          
          this.respuestaServicio = data;
          this.titulares = this.respuestaServicio.content;
          //this.totalRegistros = this.titulares[0].totalRegistros!;
          this.totalRegistros = this.titulares.length ?? 0;

          console.log('Titulares');
          console.log(this.titulares);
          break;
        }
        default: { 
          break; 
       } 
      }
    }); */
  }


  llamarServicios(){
    this.abrirCargando();
    forkJoin([
      this.dominiosServices.getDominioTiposCustodio(),
      this.dominiosServices.getDominioTiposPersona(),
      this.dominiosServices.getDominioMotivosPerdida(),
      this.custodiosServices.getTitulares(0, this.filtro,  this.selectedTipoCustodio, this.page, this.regxpag),
    ]).subscribe({
      next: ([
        data0,
        data1,
        data2,
        data3,
      ]: [
        any,
        any,
        any,
        any,
      ]) => {
        this.dominioTipoCustodio = data0.detalle!;
        this.dominioObservacion = data1.detalle!;
        this.dominioMotivos = data2.detalle!;
        this.titulares = data3.content!;
      },
      error: (error: any) => {
        //this.alertService.error(`${error.codigo} - ${error.mensaje}`);
        //this.changeDetectorRef.markForCheck();
        this.mostrarMsjError('Vuelva a intentarlo',true);
      },
      complete: () => {
        //Datos corrrectos del servicio getDominioTipoCustodio
        this.dominioTipoCustodio.unshift({
          codigoDetalle: '00',
          valorDetalle: '-- Todos --'
        });
        localStorage.removeItem('tipoCustodio');
        localStorage.setItem('tipoCustodio', JSON.stringify(this.dominioTipoCustodio));

        //Datos corrrectos del servicio getDominioTiposPersona
        localStorage.removeItem('tipoPersona');
        localStorage.setItem('tipoPersona', JSON.stringify(this.dominioObservacion));

        //Datos corrrectos del servicio getDominioMotivosPerdida
        localStorage.removeItem('motivosPerdida');
        localStorage.setItem('motivosPerdida', JSON.stringify(this.dominioMotivos));

        //Datos corrrectos del servicio getTitulares
        this.totalRegistros = this.titulares.length ?? 0;
      
        this.mostrarMsjError('¡Listado Custodios!',false);
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
        this.abrirCargando();
        this.custodiosServices.activaDesactivarTitular(titular).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.crearFormulario();
              this.mostrarMsjError('Registro Desactivado!',false);
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

  activarRegistro(titular: TitularModel){
    titular.accion ='E';
    Swal.fire({
      title: '¿Seguro de ACTIVAR el registro?',
      showCancelButton: true,
      icon: 'error',
      confirmButtonText: 'SI',
    }).then((result) => {
      if(result.isConfirmed){
        this.abrirCargando();
        this.custodiosServices.activaDesactivarTitular(titular).subscribe((data: any) => {
          switch (data.result_code){
            case 200 : {
              this.crearFormulario();

              this.mostrarMsjError('Registro activado!',false);
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
    Swal.close();
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 15,
      timer: 1000,
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
