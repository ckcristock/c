import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { HttpClient } from '@angular/common/http';

import { IMyDrpOptions } from 'mydaterangepicker';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
/* import swal,{ SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@toverux/ngx-sweetalert2'; */
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DotacionService } from '../dotacion.service';
import { PersonService } from '../../../ajustes/informacion-base/persons/person.service';

@Component({
  selector: 'app-dotaciones',
  templateUrl: './dotaciones.component.html',
  styleUrls: ['./dotaciones.component.scss']
})
export class DotacionesComponent implements OnInit {

  public maxSize = 15;
  public TotalItems: number;
  public page = 1;
  public fecha: Date = new Date();
  public filtro_fecha: any = '';
  public filtro_cod: string = '';
  public filtro_entrega: string = '';
  public filtro_recibe: string = '';
  public filtro_detalles: string = '';
  public filtro_valor: string = '';
  public Totales: any = {
    Cantidad: 0,
    Valor: 0
  }
  public TotalesMes: any = {}
  public SumaMes: any = {}
  public Cantidades: any = {
    Camisas: 0,
    Pantalones: 0,
    Delantales: 0,
    Chaquetas: 0,
    Overoles: 0,
    Gorras: 0,
    Guantes: 0,
    Petos: 0,
    Botas: 0,
    Unas: 0
  };
  selectedMes: number;
  public Meses: any = [
    { id: 1, name: "Enero" },
    { id: 2, name: "Febrero" },
    { id: 3, name: "Marzo" },
    { id: 4, name: "Abril" },
    { id: 5, name: "Mayo" },
    { id: 6, name: "Junio" },
    { id: 7, name: "Julio" },
    { id: 8, name: "Agosto" },
    { id: 9, name: "Septiembre" },
    { id: 10, name: "Octubre" },
    { id: 11, name: "Noviembre" },
    { id: 12, name: "Diciembre" }
  ];

  public Lista_Dotaciones: any = [];
  public Lista_Grupos: any = [];
  public Lista_Grupos_Inventario: any = [];
  public Lista_Grupos_Inventario1: any = [];
  public Pro_Van: any = {
    Empleado: '',
    Fecha: '',
    prod: [],
    Detalles_Entrega: ''
  };
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '100px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  public Cargando: boolean = true;
  public cam: boolean = false;

  /*  public func : any  = JSON.parse(localStorage.getItem('User')); */
  public Empleado_Entrega: any = [];
  public Entrega: any = {
    Identificacion_Funcionario: '',
    Funcionario_Recibe: this.Empleado_Entrega.Identificacion_Funcionario,
    Costo: 0,
    Detalles_Entrega: '',
    Tipo: 'Dotacion'
  }
  public Devolucion: any = {
    Detalles: '',
    Entrega: '',
    Recibe: '',
    Fecha_Entrega: ''
  }
  public alertOptionEntrega: any
  public alertOptionDevolucion: any
  @ViewChild('confirmacionEntrega') private confirmacionEntrega;
  @ViewChild('confirmacionDevolucion') private confirmacionDevolucion;
  @ViewChild('modalEntrega') modalEntrega: any;
  @ViewChild('modalDevolver') modalDevolver: any;
  @ViewChild('Swal') Swal: any;
  public Empleados: any[] = [];
  public Productos: any[] = [];
  public Productos_Devolver: any[] = [];
  public personas: any = [];
  public valores: any = [];
  public CantidadTotal: '';


  public studentChartData: any;
  public studentChartOption: any;
  @ViewChild('dotacion_chart') dotacion_chart: ElementRef;
  public facturacionChartTag: CanvasRenderingContext2D;

  constructor(
    private _dotation: DotacionService,
    private location: Location, private route: ActivatedRoute,
    private _person : PersonService
    ) {

  }

  formatter4 = (x: { Nombres: string }) => x.Nombres;
  search4 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 1 ? []
        : this.Empleados.filter(v => v.Nombres.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
    );
  ngOnInit() {
    this.ListarDotaciones();
    this.listarGrupos();
    this.Lista_Empleados();
    this.Graficar();
    this.Lista_Productos();
  }
  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.filtro_fecha = event.formatted;
    } else {
      this.filtro_fecha = '';
    }
    this.filtros();
  }
  Lista_Empleados() {
    this._person.getPeopleIndex().subscribe((r: any) => {
       this.Empleados = r.data;
     });
  }///FINAL LISTAR EMPLEADOS
  Lista_Productos() {
    /* this.http.get(this.globales.ruta + 'php/lista_generales.php', { params: { modulo: 'Inventario_Dotacion' } }).subscribe((data: any) => {
    this.Productos = data;
    }); */

  }/// FINAL LISTA PRODUCTOS
  TraerProductos(Id_producto) {
    //this.http.get(this.globales.ruta + 'php/dotaciones/lista_productos')
  }
  Graficar() {
    /*   this.http.get(this.globales.ruta + 'php/dotaciones/grafica.php').subscribe((db:any)=>{
       db.forEach(element => {
         this.personas.push(element.Persona);
         this.valores.push(element.Valor);
       });
       setTimeout(() => {
         const facturacion_tag = (((<HTMLCanvasElement>this.dotacion_chart.nativeElement).children));
         this.facturacionChartTag = ((facturacion_tag['dotacion_chart']).lastChild).getContext('2d');
         const def = (this.facturacionChartTag).createLinearGradient(500, 0, 100, 0);
         def.addColorStop(1, '#7cffe5');
         def.addColorStop(1, '#7cffe5');
         this.studentChartData = {
           labels: this.personas,
           datasets: [ {
             label: 'Cantidad en Stock',
             borderColor: def,
             pointBorderColor: '#fff',
             pointBackgroundColor: def,
             pointHoverBackgroundColor: def,
             pointHoverBorderColor: def,
             pointBorderWidth: 2,
             pointHoverRadius: 10,
             pointHoverBorderWidth: 1,
             pointRadius: 8,
             fill: false,
             borderWidth: 2,
             data: this.valores
           }]
         };
 
       }, 75);
     }); */
  }
  listarGrupos() {
    this._dotation.getInventaryGrops().subscribe((data: any) => {
      this.Lista_Grupos = data.data;
    });
  }
  // metodo para listar en pantalla principal
  onChange(inventary_dotation_group_id) {
    this._dotation.getInventaryBYGrops({inventary_dotation_group_id}).subscribe((r:any)=>{
      
      this.Lista_Grupos_Inventario = r.data;
    })
 
  }
  // metodo para listar en el modal
  onChange1(inventary_dotation_group_id) {

    this._dotation.getStok({inventary_dotation_group_id}).subscribe((r: any) => {
    this.Lista_Grupos_Inventario1 = r.data;
    });
  }
  cambio(prod) {
    Object.keys(prod).forEach(x => {
      if (prod["Cantidad_Seleccionada"] > prod["Cantidad"]) {
        this.cam = true;
        console.log("aqui");
      } else {
        this.cam = false;
        console.log("aca");
      }
    });
  }
  maxLengthCheck(object) {
    if (object.value.max > object.max)
      object.value = object.value.slice(0, object.max)
  }
  listarTotales(cantMes) {
   /*   this.http.get(this.globales.ruta + 'php/dotaciones/lista_dotaciones.php', { params: { cantMes: cantMes } }).subscribe((data: any) => {
     this.TotalesMes = data.CantidadMes.CantidadMes;
     this.SumaMes = data.CantidadMes.SumaMes;
     }); */
     this._dotation.getCuantityDispatched({cantMes}).subscribe((r: any) => {
      this.TotalesMes = r.data.CantidadMes;
      this.SumaMes = r.data.SumaMes;
     });

  }
  ListarDotaciones() {
    let params = this.route.snapshot.queryParams;
    let queryString = '';
    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_entrega = params.entrega ? params.entrega : '';
      this.filtro_recibe = params.recibe ? params.recibe : '';
      this.filtro_detalles = params.detalles ? params.detalles : '';
      this.filtro_valor = params.valor ? params.valor : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }
    /*  this.http.get(this.globales.ruta + 'php/dotaciones/lista_dotaciones.php'+queryString).subscribe((data: any) => {
     this.Cargando = false;
     this.Lista_Dotaciones = data.Listado;
     this.TotalItems = data.Totales.Cantidad;
     this.Totales = data.Totales;
     this.Cantidades = data.Cantidades;
     this.CantidadTotal = data.Costos.SumaAno;
   }); */
  }
  filtros() {
    let params: any = {};
    this.page = 1;
    params.pag = this.page;

    if (this.filtro_fecha != "" && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha;
    }
    if (this.filtro_cod != "") {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_entrega != "") {
      params.entrega = this.filtro_entrega;
    }
    if (this.filtro_recibe != "") {
      params.recibe = this.filtro_recibe;
    }
    if (this.filtro_detalles != "") {
      params.detalles = this.filtro_detalles;
    }
    if (this.filtro_valor != "") {
      params.valor = this.filtro_valor;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/dotacion', queryString);

    this.Cargando = true;
    /*  this.http.get(this.globales.ruta + 'php/dotaciones/lista_dotaciones.php?'+queryString).subscribe((data: any) => {
       this.Cargando = false;
       this.Lista_Dotaciones = data.Listado;
       this.TotalItems = data.Totales.Cantidad;
       this.Totales = data.Totales;
       this.CantidadTotal = data.Costos.TotalesCostos;
 
     }); */
  }
  showAlert4(evt: any) {
    this.confirmacionEntrega.show();
  }
  showAlert5(evt: any) {
    this.confirmacionDevolucion.show();
  }
  devolverDotacion(id) {
    /*  this.http.get(this.globales.ruta + 'php/dotaciones/detalle_devolucion.php?id='+id).subscribe((data: any) => {
       this.Productos_Devolver = data.Productos;
       this.Devolucion = data.Datos;
       this.modalDevolver.show();
       this.Lista_Productos();
     }); */
  }
  GuardarDevolucion() {
    this.modalDevolver.hide();
    this.Devolucion.Entrega = ''

    let datos = new FormData();
    /*  let devolucion          =  this.globales.normalize(JSON.stringify(this.Devolucion));
     let prods               =  this.globales.normalize(JSON.stringify(this.Productos_Devolver)); 
     datos.append("Devolucion", devolucion);
     datos.append("Productos", prods);*/
    /* this.http.post(this.globales.ruta + 'php/dotaciones/guardar_devolucion.php', datos).subscribe((data: any) => {
      this.Devolucion = {
        Detalles : '',
        Entrega :'',
        Recibe : '',
        Fecha_Entrega : ''
      }
      this.Lista_Productos();
      this.ListarDotaciones();
      this.Swal.title = 'Devolución de Dotación Guardada Correctamente';
      this.Swal.text  = "Se ha reportado correctamente la Devolución de Dotación";
      this.Swal.type  = "success";
      this.Swal.show();

    }); */
  }
  GuardarEntrega() {
    // this.modalEntrega.hide();
    this.Entrega.Funcionario_Recibe = this.Empleado_Entrega.Identificacion_Funcionario;
   /*  let datos = new FormData();
        let entrega =  this.globales.normalize(JSON.stringify(this.Entrega));
        let prods   =  this.globales.normalize(JSON.stringify(this.Lista_Grupos_Inventario1));
        datos.append("Entrega", entrega);
        datos.append("Productos", prods); 

     this.http.post(this.globales.ruta + 'php/dotaciones/guardar_entrega.php', datos).subscribe((data: any) => { */
    /*   this.Empleado_Entrega = {};
      this.Entrega = {
      
        Funcionario_Recibe : this.Empleado_Entrega.id,
        Costo : 0,
        Detalles_Entrega : '',
        Tipo: 'Dotacion'
      } */
/*       this.Lista_Productos();
      this.Swal.title ='Entrega de Dotación Guardada Correctamente';
      this.Swal.text="Se ha reportado correctamente la entrega de Dotación";
      this.Swal.type="success";
      this.Swal.show();
      this.ListarDotaciones(); 

    });*/
  }
  paginacion() {
  }
  anularDotacion(id) {
    /* this.http.get(this.globales.ruta+'php/dotaciones/anular_dotacion.php',{params: {id:id}}).subscribe((data:any) => {
      this.Swal.title ='Entrega de Dotación Guardada Correctamente';
      this.Swal.text="Se ha reportado correctamente la entrega de Dotación";
      this.Swal.type="success";
      this.Swal.show();
      this.ListarDotaciones();
    }) */
  }

}
