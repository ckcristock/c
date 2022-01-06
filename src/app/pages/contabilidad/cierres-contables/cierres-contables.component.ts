import { Component, OnInit, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { HttpClient } from '@angular/common/http';
import { CierrecontableService } from './cierrecontable.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cierres-contables',
  templateUrl: './cierres-contables.component.html',
  styleUrls: ['./cierres-contables.component.scss']
})
export class CierresContablesComponent implements OnInit {
  public abrirPlanesCuenta: EventEmitter<string> = new EventEmitter();
  public modalCierre: Subject<any> = new Subject();
  envirom: any = {}
  public Cierres:any = {
    Mes: [],
    Anio: []
  }

  constructor(
    private cierresContableService: CierrecontableService,
    private swalService: SwalService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.listaCierres();
    this.envirom = environment
  }

  abrirModalCierre(tipo) {
    this.modalCierre.next(tipo);
  }

  nombreMes(mes) {
    let pos = parseInt(mes) - 1;
    return this.cierresContableService.getMes(pos);
  }

  listaCierres() {
    this.http.get(environment.ruta + 'php/contabilidad/cierres/lista_cierre.php').subscribe((data:any) => {
      this.Cierres.Mes = data.Mes;
      this.Cierres.Anio = data.Anio;
    });
  }

  anularCierreAnio(id) {
    let p:any = {id:id}
    this.http.get(environment.ruta+'php/contabilidad/cierres/anular_cierre.php',{params: p}).subscribe((data:any) => {
      // this.swalService.ShowMessage(data);
      Swal.fire({
        icon: data.codigo,
        title: data.titulo,
        text: data.mensaje
      })
      this.listaCierres();
    })
  }
  
  OnDestroy(){
    this.abrirPlanesCuenta.unsubscribe();
    this.modalCierre.unsubscribe();
  }

}
