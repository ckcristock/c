import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { User } from 'src/app/core/models/users.model';
import { UserService } from 'src/app/core/services/user.service';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-ver-acta-recepcion',
  templateUrl: './ver-acta-recepcion.component.html',
  styleUrls: ['./ver-acta-recepcion.component.scss']
})
export class VerActaRecepcionComponent implements OnInit {
  @ViewChild('confirmacionSwal') confimracionSwal: any;
  datosCabecera = {
    Titulo: 'Acta de recepción',
    Fecha: '',
    Codigo: ''
  }
  public Fecha = new Date();
  public id = this.route.snapshot.params["id"];
  public Datos: any = {};
  public Productos: any[] = [];
  public Facturas: any[] = [];
  public user = { Identificacion_Funcionario: '1' };
  public SubTotalFinal = 0;
  public IvaFinal = 0;
  public TotalFinal = 0;
  public ActividadesActa: any[] = [];
  loading: boolean;
  public Tipo: string = "Bodega";
  public userF: User;
  public reducer_subt = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_iva = (accumulator, currentValue) => accumulator + (parseFloat(currentValue.Subtotal) * (parseInt(currentValue.Impuesto) / 100));

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _actaRecepcion: ActaRecepcionService,
    private _swal: SwalService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.loading = true;
    let params: any = {};
    params.id = this.id;
    this._actaRecepcion.detalleActa(params).subscribe((data: any) => {
      this.Datos = data.Datos2;
      this.Productos = data.ProductosNuevo;
      this.Facturas = data.Facturas;
      this.loading = false;
    });
    this.getActividadesActa();
  }

  getActividadesActa() {
    let params = {
      id_acta: this.id
    }
    this._actaRecepcion.getActividadesActa(params).subscribe((data: any) => {
      this.ActividadesActa = data.query_result;
    });
  }

  aprobarActa(id, Id_Bodega_Nuevo) {
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'Vamos a aprobar el acta de recepción ',
      icon: 'question',
    }).then(r => {
      if (r.isConfirmed) {
        let datos = new FormData();
        datos.append('id', id);
        datos.append('Id_Bodega_Nuevo', Id_Bodega_Nuevo);
        datos.append('funcionario', this.user.Identificacion_Funcionario);
        this.http.post(environment.base_url + '/php/actarecepcion_nuevo/aprobar_acta.php', datos).subscribe((data: any) => {
          this.confimracionSwal.title = data.titulo;
          this.confimracionSwal.text = data.mensaje;
          this.confimracionSwal.icon = data.tipo;
          this.confimracionSwal.fire();
          this.init();
        })
      }
    })
  }

  AsignarClaseLabel(estado: string): string {
    var clase = 'label';

    switch (estado) {
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
