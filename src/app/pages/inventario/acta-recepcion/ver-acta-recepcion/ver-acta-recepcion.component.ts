import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ver-acta-recepcion',
  templateUrl: './ver-acta-recepcion.component.html',
  styleUrls: ['./ver-acta-recepcion.component.scss']
})
export class VerActaRecepcionComponent implements OnInit {
  envi:any = {ruta:''}
  public Fecha=new Date();
  public id=  this.route.snapshot.params["id"];
  public Datos:any = {};
  public Productos:any[]=[];
  public Facturas:any[]=[];
 /* TODO User auth */
  public user = {Identificacion_Funcionario:'1'};
  /* TODO Permiso aprobar acta */
  public permiso: boolean = true;
  public SubTotalFinal = 0;
  public IvaFinal = 0;
  public TotalFinal = 0;
  public ActividadesActa:any[] = [];
  public Tipo:string = "Bodega";

  public reducer_subt = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_iva = (accumulator, currentValue) => accumulator + (parseFloat(currentValue.Subtotal) * (parseInt(currentValue.Impuesto)/100));

  @ViewChild('confirmacionSwal') confimracionSwal:any;

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

    ngOnInit() {
      this.envi = environment
      this.init();
    }

    init() {

      let queryParams = this.route.snapshot.queryParams;

      let params:any = {};
      params.id = this.id;

      if (queryParams.tipo != undefined) {
        this.Tipo = "Punto_Dispensacion";
        params.Tipo = "Punto_Dispensacion";
      }

      this.http.get(environment.ruta + 'php/bodega_nuevo/detalle_acta_recepcion.php', {
        params: params
      }).subscribe((data: any) => {
        this.Datos=data.Datos2;
        this.Productos=data.ProductosNuevo;
        this.Facturas=data.Facturas;

        // console.log(this.Datos);

      });

      this.http.get(environment.ruta+'php/actarecepcion/detalle_perfil.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
       //TODO Permiso de aceptar
        /*  this.permiso = data.status; */
       this.permiso = true;
      })

      this.GetActividadesActa();
    }

    aprobarActa(id,Id_Bodega_Nuevo){

      let datos = new FormData();

      datos.append('id', id);
      datos.append('Id_Bodega_Nuevo', Id_Bodega_Nuevo);
      datos.append('funcionario', this.user.Identificacion_Funcionario);

      this.http.post(environment.ruta+'php/actarecepcion_nuevo/aprobar_acta.php', datos).subscribe((data:any) => {
        this.confimracionSwal.title = data.titulo;
        this.confimracionSwal.text = data.mensaje;
        this.confimracionSwal.icon = data.tipo;
        this.confimracionSwal.fire();
        this.init();
      })
    }

    GetActividadesActa(){
      this.http.get(environment.ruta+'php/actarecepcion/actividades_acta_recepcion_compra.php',{
        params : { id_acta : this.id }
      }).subscribe((data:any)=>{
        this.ActividadesActa=data.query_result;
        // console.log(this.ActividadesActa);
      });
    }

    AsignarClaseLabel(estado:string):string{
      var clase = 'label';

      switch(estado){
        case 'Creacion':
          clase += ' label-info';
          break;

        case 'Edicion':
          clase += ' label-warning';
          break;

        case 'Creacion':
          clase += ' label-danger';
          break;

        case 'Anulada':
          clase += ' label-info';
          break;

        case 'Aprobacion':
          clase += ' label-success';
          break;

        case 'Recepcion':
          clase += ' label-1';
          break;

        default:
          break;
      }

      return clase;

    }


}
