import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Location } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { DotacionService } from '../dotacion.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario-dotacion',
  templateUrl: './inventario-dotacion.component.html',
  styleUrls: ['./inventario-dotacion.component.scss']
})
export class InventarioDotacionComponent implements OnInit {

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  }

  public Inventarios: any[] = [];
  public Lista_Grupos_Inventario: any = [];


  public loading: boolean = false;
  public filtrando: boolean = true;
  public filtro_codigo: string = '';
  public filtro_nombre: string = '';
  public filtro_calidad: string = '';
  public filtro_tipo: string = '';
  public nombreGrupo: any;

  // public nombreGrupo = '';


  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private _dotation: DotacionService
  ) { }

  ngOnInit() {
    this.ListaInventario(1);
    this.listarGrupo()
  }
  ListaInventario(page) {
    this.pagination.page = page;
    let params = this.route.snapshot.queryParams;
    let queryString = '';
    this.loading = true;
    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.pagination.page = params.pag ? params.pag : 1;
      this.filtro_codigo = params.codigo ? params.codigo : '';
      this.filtro_nombre = params.nombre ? params.nombre : '';
      this.filtro_calidad = params.calidad ? params.calidad : '';
      this.filtro_tipo = params.tipo ? params.tipo : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }

    this._dotation.getInventary(this.pagination).subscribe((r: any) => {
      this.loading = false;
      this.Inventarios = r.data.data;

      this.pagination.collectionSize = r.data.total;
    })
  }
  GuardarGrupo(form: NgForm) {
    Swal.fire({
      title: '¿Seguro?',
      text: 'Va a modificar los grupos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!'
    }).then(result => {
      if (result.value) {
        this.sendData(form)
      }
    });

  }

  sendData(form) {
    this._dotation.saveProductDotationTypes(form.value).subscribe((data: any) => {
      if (data.code == 200) {
        Swal.fire({
          title: 'Opersación exitosa',
          text: 'Felicidades, se han creado una nueva categoria',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
        this.listarGrupo()
        form.reset()
      } else {
        Swal.fire({
          title: 'Operación denegada',
          text: 'Ha ocorrido un erro',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
      }
    });
  }
  listarGrupo() {
    this._dotation.getProductDotationTypes().subscribe((data: any) => {
      this.Lista_Grupos_Inventario = data.data;
    });
  }

  filtros() {
    let params: any = {};

    params.pag = this.pagination.page = 1;

    if (this.filtro_codigo != "") {
      params.codigo = this.filtro_codigo;
    }
    if (this.filtro_nombre != "") {
      params.nombre = this.filtro_nombre;
    }
    if (this.filtro_calidad != "") {
      params.calidad = this.filtro_calidad;
    }
    if (this.filtro_tipo != "") {
      params.tipo = this.filtro_tipo;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/inventariodotacion', queryString);

    /* 
    this.loading = true;
    this.http.get(this.globales.ruta + 'php/dotaciones/lista_inventario.php?' + queryString).subscribe((data: any) => {
      this.loading = false;
      this.Inventarios = data.Listado;
      this.TotalItems = data.numReg;
    }); */
  }
  paginacion() {
    let params: any = {
      pag: this.pagination.page
    };
    if (this.filtro_codigo != "") {
      params.codigo = this.filtro_codigo;
    }
    if (this.filtro_nombre != "") {
      params.nombre = this.filtro_nombre;
    }
    if (this.filtro_calidad != "") {
      params.calidad = this.filtro_calidad;
    }
    if (this.filtro_tipo != "") {
      params.tipo = this.filtro_tipo;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/inventariodotacion', queryString);

    /*
    this.loading = true;
     this.http.get(this.globales.ruta + 'php/dotaciones/lista_inventario.php?' + queryString).subscribe((data: any) => {
      this.loading = false;
      this.Inventarios = data.Listado;
      this.TotalItems = data.numReg;
    }); */

  }
}

