import { Component, OnInit, Input, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modalplancuentas',
  templateUrl: './modalplancuentas.component.html',
  styleUrls: ['./modalplancuentas.component.scss']
})
export class ModalplancuentasComponent implements OnInit {
  
  @Input('abrirPlanesCuenta') abrirPlanesCuenta : EventEmitter<string>;
  @ViewChild('ModalPlanes') ModalPlanes;
  public tipoCierre = '';
  public Planes_Cuentas = [];
  public loading = false;
  public filtros = {
    nombre:'',
    codigo:'',
    tipoCierre:''
  }
  constructor(public http : HttpClient) { }

  ngOnInit() {

    this.abrirPlanesCuenta.subscribe(data=>{
      console.log(data);
      this.tipoCierre = data;
      this.loading = true;
      this.ModalPlanes.show();
      setTimeout(() => {
        this.buscarPlanes();
      }, 300);
     
    
    });

  }

  buscarPlanes(){
    this.loading = true;
    let filtros = JSON.stringify(this.filtros);
    this.http.get(environment.ruta+'/php/plancuentas/get_planes_cuentas.php?filtros='+filtros+'&tipoCierre='+this.tipoCierre).subscribe(planes=>{
      this.Planes_Cuentas = planes['query_result'];
      this.loading = false;     
   
    })

  }

  setTipoPlan(plan){
    console.log(plan);
    
    let data = new FormData();
    data.append('tipo_cierre',this.tipoCierre);
    data.append('id_plan_cuenta',plan.Id_Plan_Cuentas);
    data.append('valor_actualizar',plan['Tipo_Cierre_'+this.tipoCierre]);
    
    this.http.post(environment.ruta +'/php/plancuentas/set_plan_cuentas_tipo_cierre.php',data)
    .toPromise( ).catch(err=>{
      console.error(err);
    })

  }  


    OnDestroy(){
      this.abrirPlanesCuenta.unsubscribe();
    }

    ocultar(){
      this.Planes_Cuentas = [];
      this.ModalPlanes.hide();
    }
}
