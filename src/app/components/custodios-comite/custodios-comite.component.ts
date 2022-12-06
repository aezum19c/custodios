import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustodioModel } from 'src/app/models/custodio.model';
import { RespuestaCustodioModel } from 'src/app/models/respuesta_custodio.model';
import { TitularModel } from 'src/app/models/titular.model';
import { TitularRenovacionModel } from 'src/app/models/titular_renovacion.model';
import { CustodiosService } from 'src/app/service/custodio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custodios-comite',
  templateUrl: './custodios-comite.component.html',
  styleUrls: ['./custodios-comite.component.css'],
})
export class CustodiosComiteComponent implements OnInit {
  
  custodios! : CustodioModel[]; 
  titular : TitularModel = new TitularModel();
  custodioServicio: RespuestaCustodioModel = new RespuestaCustodioModel();
  
  renovacionComite : TitularRenovacionModel = new TitularRenovacionModel();

  page: number = 1;
  regxpag: number = 10;
  titularId : number = 0;
  comiteRenovacionId: number = 0;

  accion_custodio: string = '';

  constructor(
    private router: Router,
    private custodioService: CustodiosService,
    ) { }

  ngOnInit(): void {
    this.obtenerCustodios();
  }

  obtenerCustodios(){
    this.renovacionComite = JSON.parse( localStorage.getItem('renovacionComite')  || '{}' );
    this.accion_custodio = JSON.parse( localStorage.getItem('accion_custodio') || '' );
  
    this.titularId = this.renovacionComite.titularId!;
    this.comiteRenovacionId = this.renovacionComite.comiteRenovacionId!;
    
    this.abrirCargando();

    this.custodioService.getCustodios(this.titularId!, this.comiteRenovacionId,'', this.page, this.regxpag).subscribe((data: any) => {
      switch (data.result_code){
        case 200 : {
          this.custodioServicio = data;
          this.custodios = this.custodioServicio.content;
          this.mostrarMsjError('Custodios por Comite',false);
          break;
        }
        default: { 
          break; 
       } 
      }
    }, (error) => {
      this.mostrarMsjError('Ocurrió un error vuelva a intentarlo', true);
    });
  }

  nuevoCustodio(){
    let custodio : CustodioModel = {};
    
    custodio.custodioId = 0;
    custodio.titularId = this.titularId;
    custodio.comiteRenovacionId = this.comiteRenovacionId;
    custodio.tipoCustodio = '02' //02 Comite de Vigilancia
    
    custodio.estadoRenovacionComite = this.renovacionComite.estado;

    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    localStorage.setItem('accion_custodio', JSON.stringify('N'));

    this.router.navigate(['/mantenimientocustodios/nuevo']);
  }

  verCustodio(custodio: CustodioModel){
    custodio.titularId = this.titular.titularId;
    custodio.comiteRenovacionId = this.comiteRenovacionId;
    custodio.tipoCustodio = '02' //02 Comite de Vigilancia
    
    custodio.estadoRenovacionComite = this.renovacionComite.estado;
    
    localStorage.removeItem('custodio');
    localStorage.removeItem('accion_custodio');

    localStorage.setItem('custodio', JSON.stringify(custodio));
    if(this.accion_custodio=='V'){
      localStorage.setItem('accion_custodio', JSON.stringify('V'));
    } else {
      localStorage.setItem('accion_custodio', JSON.stringify('M'));
    }
    
    this.router.navigate(['/mantenimientocustodios/nuevo']);
  }
  
  desactivarCustodio(custodio: CustodioModel){
    custodio.accion ='D';

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
              this.mostrarMsjError('Registro Desactivado!', false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelve a intentarlo!', true);
              break; 
          } 
          }
        }, (error) => {
          this.mostrarMsjError('Ocurrió un error vuelva a intentarlo', true);
        });
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
              this.mostrarMsjError('Registro Activado!', false);
              break;
            }
            default: { 
              this.mostrarMsjError('Vuelve a intentarlo!', false);
              break; 
          } 
          }
        }, (error) => {
          this.mostrarMsjError('Ocurrió un error vuelva a intentarlo', true);
        });
      }
    })
  }

  regresar(){
    this.router.navigate(['/titulares/:id']);
    localStorage.removeItem('titulares/:id');
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
