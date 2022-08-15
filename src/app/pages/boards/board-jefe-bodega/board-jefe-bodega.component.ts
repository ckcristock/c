
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/takeWhile';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, map, elementAt } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-board-jefe-bodega',
  templateUrl: './board-jefe-bodega.component.html',
  styleUrls: ['./board-jefe-bodega.component.scss']
})
export class BoardJefeBodegaComponent implements OnInit {
  globales = {ruta: 'https://sigespro.com.co/'}
  public Funcionarios:any[]=[];
  public Notas:any[]=[];
  public Movimientos:any[]=[];
  public Remisiones:any[]=[];
  public Id_Funcionario='';
  public user:any = {};
  public Ajuste_Salida:any = [];
  public alertOptionAprobar:SweetAlertOptions = {};
  public alertOptionAnular:SweetAlertOptions = {};
  loading1: boolean = false
  loading2: boolean = false
  loading3: boolean = false
  loading4: boolean = false
  ListaNacional = [];
  @ViewChild('confirmacionSwal') confirmacionSwal:any;
  @ViewChild('modalRemisionesFuncionario') modalRemisionesFuncionario: any;
  @ViewChild('modalAjusteSalida') modalAjusteSalida: any;
  public AjustesPendientesSalida: any[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private location: Location) {
    this.alertOptionAnular = {
      title: "¿Está Seguro?",
      text: "Se dispone a Anular la salida de Inventario",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Anular',
      showLoaderOnConfirm: true,
      focusCancel: false,
/*       type: 'warning',
 */      preConfirm: (data) => {
        return new Promise((resolve) => {   
           this.ActualizarAjuste('Anular');
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
    this.alertOptionAprobar = {
      title: "¿Está Seguro?",
      text: "Se dispone a Aprobar la salida de Inventario",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Aprobar',
      showLoaderOnConfirm: true,
      focusCancel: false,
      /* type: 'warning', */
      preConfirm: (data) => {
        
        return new Promise((resolve) => {
          this.ActualizarAjuste('Aprobar');
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
   }

  ngOnInit() {
    this.loading1 = true
    this.loading2 = true
    this.loading3 = true
    this.loading4 = true
    this.user = JSON.parse(localStorage.getItem("User"));

    this.ListaAjustesPendientesSalida();

    this.http.get(this.globales.ruta + 'php/tablero_jefe_bodega/lista_auxiliar_bodega.php').subscribe((data: any) => {
      this.Funcionarios = data;
    });
    this.http.get(this.globales.ruta + 'php/tablero_jefe_bodega/lista_nota_pendiente.php').subscribe((data: any) => {
      this.Notas = data;
      this.loading1 = false
    });
    this.ListarMovimientos();
    this.http.get(this.globales.ruta + 'php/bodega/lista_compras_pendientes.php', {
      params: { compra: 'Nacional' }
    }).subscribe((data: any) => {
      this.ListaNacional = data;
      this.loading3 = false
    });

  }
  ListarMovimientos(){
    this.http.get(this.globales.ruta + 'php/tablero_jefe_bodega/lista_movimientos.php').subscribe((data: any) => {
      this.Movimientos = data;
      this.loading2 = false
    });
  }
  VerRemisiones(id_funcionario){
    this.Id_Funcionario=id_funcionario;
    this.http.get(this.globales.ruta + 'php/tablero_jefe_bodega/remisones_funcionarios.php',{  params: { funcionario: id_funcionario }
    }).subscribe((data: any) => {
      this.Remisiones = data;
      this.modalRemisionesFuncionario.show();
      // console.log(this.Remisiones);
      
      
    });
  }
  ProductosAjustePendienteSalida(id_ajuste){
 
    this.http.get(this.globales.ruta + 'php/ajuste_individual_nuevo/ajuste_por_aprobar_salida.php',{  params: { id_ajuste }
    }).subscribe((data: any) => {
       this.Ajuste_Salida = data;
       this.modalAjusteSalida.show();
    }); 

  }

  ActualizarAjuste(tipo){
    let id_ajuste = this.Ajuste_Salida.Id_Ajuste_Individual;
    
    let data = new FormData();
  
    data.append('id_ajuste',id_ajuste);
    data.append('tipo',tipo);
    data.append('funcionario',this.user.Identificacion_Funcionario);
    data.append('id_clase_ajuste_individual',this.Ajuste_Salida.Id_Clase_Ajuste_Individual);

    if(tipo=='Aprobar') data.append( 'productos', JSON.stringify(this.Ajuste_Salida.Productos) );
    this.http.post(this.globales.ruta + 'php/ajuste_individual_nuevo/cambiar_estado_salida.php', data ).subscribe((data: any) => {
      this.confirmacionSwal.title=data.title;
      this.confirmacionSwal.text= data.text;
      this.confirmacionSwal.type= data.type;
      this.confirmacionSwal.show();

      if( data.type == 'success' ){
        let pos = this.AjustesPendientesSalida.findIndex( ajuste => ajuste.Id_Ajuste == id_ajuste );
        this.AjustesPendientesSalida.splice(pos,1);
      }
      this.Ajuste_Salida = {};
    }); 
  
    
    this.modalAjusteSalida.hide()
  }

  ListaAjustesPendientesSalida(){
    this.loading4 = true
    let funcionario = this.user.Identificacion_Funcionario;
    this.http.get(this.globales.ruta + 'php/ajuste_individual_nuevo/lotes_pendiente_aprobacion_salida.php',{  params: { funcionario }
    }).subscribe((data: any) => {
       this.AjustesPendientesSalida = data;
       this.loading4 = false
    });
  }


  LiberarRemision(id, pos){


    let datos = new FormData();
    if((this.Remisiones[pos].Fase_1!='' ||this.Remisiones[pos].Fase_1!=0) && this.Remisiones[pos].Estado_Alistamiento==0){
      datos.append("tipo",'fase1');
    }else if((this.Remisiones[pos].Fase_2!='' && this.Remisiones[pos].Estado_Alistamiento==1 )){
      datos.append("tipo",'fase2');
    }

    datos.append("Id",id);
    this.http.post(this.globales.ruta + 'php/tablero_jefe_bodega/actualizar_remision.php',datos).subscribe((data:any)=>{
      this.confirmacionSwal.title="Guardado Correctamente";
      this.confirmacionSwal.text= data.mensaje;
      this.confirmacionSwal.type= data.tipo;
      this.confirmacionSwal.show();
      this.VerRemisiones(this.Id_Funcionario);
      
     });
    
  }
  AceptarMovimiento(pos,observacion){
    let id = this.Movimientos[pos].Id_Movimiento_Vencimiento;
    console.log(id);
    let user=(JSON.parse(localStorage.getItem("User"))).Identificacion_Funcionario;
    let datos = new FormData();
    datos.append("Id",id);
    datos.append("user",user);
    datos.append("observacion",observacion);
    this.http.post(this.globales.ruta + 'php/tablero_jefe_bodega/actualizar_movimiento_vencimiento.php',datos).subscribe((data:any)=>{
      this.confirmacionSwal.title="Guardado Correctamente";
      this.confirmacionSwal.text= data.mensaje;
      this.confirmacionSwal.type= data.tipo;
      this.confirmacionSwal.show();
      this.ListarMovimientos();
      
     });
  }

}
