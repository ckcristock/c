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
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-inventario-dotacion',
  templateUrl: './inventario-dotacion.component.html',
  styleUrls: ['./inventario-dotacion.component.scss']
})
export class InventarioDotacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  donwloading = false;
  firstDay: any;
  lastDay: any;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  }
  nombre: string = '';
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
  @ViewChild('tablestock') private tablestock;
  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private _dotation: DotacionService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit() {
    this.ListaInventario(1);
    this.listarGrupo();
    this.Graficar()
  }
  findName() {

    this.tablestock.getData(1, this.nombre);
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Categorías'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];
  graphicData: any = {}

  Graficar() {

    // this._dotation.getDotationTotalByCategory({ cantMes: this.selectedMes }).subscribe((d: any) => {
    this._dotation.getTotatInventary(
      {
        // firstDay: this.firstDay,
        // lastDay: this.lastDay,
        // person: this.people_id,
        //  persontwo: this.people_id_two,
        //  cod: this.cod,
        //  type: this.type,
        //  delivery: this.delivery,
        //  art: this.art,

      }).subscribe((d: any) => {

        let totals: any[] = d.data;

        if (totals) {
          this.barChartData = totals.reduce((acc, el) => {
            let daSet = { data: [el.value], label: [el.name] }
            return [...acc, daSet]
          }, [])
        }
      })

  }

  DownloadInventoryDotation() {
    // let params = this.getParams();
    let fecha = new Date();
    let fecha2 = new Date();
    this.firstDay = new Date(fecha.setDate(fecha.getDate() - 30)).toISOString().split('T')[0];
    this.lastDay = new Date(fecha2.setDate(fecha2.getDate())).toISOString().split('T')[0];
    let params = '';
    this.donwloading = true;
    this._dotation.DownloadInventoryDotation(this.firstDay, this.lastDay, params).subscribe((response: BlobPart) => {
      // this._dotation.downloadDotations().subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte_inventario';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
      this.donwloading = false;
    }),
      (error) => {
        this.donwloading = false;
      },
      () => {
        this.donwloading = false;
      };
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
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
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Vas a modificar los grupos',
    }).then(result => {
      if (result.value) {
        this.sendData(form)
      }
    });

  }

  sendData(form) {
    this._dotation.saveProductDotationTypes(form.value).subscribe((data: any) => {
      if (data.code == 200) {
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          showCancel: false,
          text: 'Categoria guardada',
          timer: 1000
        })
        this.listarGrupo()
        form.reset()
        this.modalService.dismissAll();
      } else {
        this._swal.show({
          icon: 'error',
          title: 'Operación denegada',
          showCancel: false,
          text: 'Ha ocurrido un error',
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
      params.code = this.filtro_codigo;
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
    this.loading = true;
    this._dotation.getInventary(params).subscribe((r: any) => {
      this.loading = false;
      this.Inventarios = r.data.data;

      this.pagination.collectionSize = r.data.total;
    })


    /* this.http.get(this.globales.ruta + 'php/dotaciones/lista_inventario.php?' + queryString).subscribe((data: any) => {
      this.loading = false;
      this.Inventarios = data.Listado;
      this.TotalItems = data.numReg;
    });  */
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

