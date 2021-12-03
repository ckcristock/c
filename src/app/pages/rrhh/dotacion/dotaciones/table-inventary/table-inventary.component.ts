import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { DotacionService } from '../../dotacion.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-table-inventary',
  templateUrl: './table-inventary.component.html',
  styleUrls: ['./table-inventary.component.scss']
})
export class TableInventaryComponent implements OnInit {


  @ViewChild('tablestock') private tablestock;
  @ViewChild('modalEntrega') modalEntrega: any;

  public flagDotacionApp:  string = '';
  selectedMes: string;
  nombre:string = '';

  public TotalesMes = 0
  public Totales = 0
  public TotalesDotaciones = 0
  public totalEpp = 0
  public CantidadTotal: 0;
  public SumaMes = 0

  people: any[] = [];
  firstDay: any;
  lastDay: any;
  people_id = '';
  people_id_two = '';
  cod = '';
  type = '';
  delivery = '';
  art = ''

  filtrosVer = false;
  donwloading = false;

  public Empleados: any[] = [];
  public Lista_Dotaciones: any = [];

  filtros:any = {
    cod: '',
    type: '',
    recibe: '',
    entrega: '',
    name: '',
    description: '',
    fechaD: '',
    delivery: '',
    state: ''
  }

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  }
  loading = false;

  myDateRangePickerOptions: IMyDrpOptions = {
    width: '100px',
    height: '33px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };


  constructor(private _dotation: DotacionService,private _person: PersonService){

   }

  ngOnInit(): void {
    this.loading = false;
    let fecha = new Date();
    let fecha2 = new Date();
    this.selectedMes = moment().format('Y-MM');
    this.firstDay = new Date(fecha.setDate(fecha.getDate() - 30)).toISOString().split('T')[0];
    this.lastDay = new Date(fecha2.setDate(fecha2.getDate())).toISOString().split('T')[0];
    this.getPeople()
    this.listarTotales(this.selectedMes)
    this.Graficar();
    this.ListarDotaciones();
    this.Lista_Empleados();
    this.loading = true;

  }

  listarTotales(cantMes) {
    // this._dotation.getCuantityDispatched({ cantMes }).subscribe((r: any) => {
    this._dotation.getCuantityDispatched(
       {

         firstDay: this.firstDay,
         lastDay: this.lastDay,
         person: this.people_id,
         persontwo: this.people_id_two,
         cod: this.cod,
         type: this.type,
         delivery: this.delivery,
         art: this.art,

       }).subscribe((r: any) => {
      this.TotalesMes = r.data.month.totalMes;
      this.SumaMes = r.data.month.totalCostoMes;

      this.CantidadTotal = r.data.year.totalAnual
      this.Totales = r.data.year.totalCostoAnual

      this.TotalesDotaciones = r.data.td.totalDotacion
      this.totalEpp = r.data.te.totalEpp
    });

  }

  closeModal(){
    this.modalEntrega.hide();
    this.ListarDotaciones();
    // this.flagDotacionApp = ''
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
  public barChartData : ChartDataSets[] = [];
  graphicData:any = {}

  Graficar() {

    // this._dotation.getDotationTotalByCategory({ cantMes: this.selectedMes }).subscribe((d: any) => {
    this._dotation.getDotationTotalByCategory(
      {
        firstDay: this.firstDay,
        lastDay: this.lastDay,
        person: this.people_id,
         persontwo: this.people_id_two,
         cod: this.cod,
         type: this.type,
         delivery: this.delivery,
         art: this.art,

      }).subscribe((d: any) => {

    let totals: any[] = d.data;

    if (totals) {
      this.barChartData = totals.reduce((acc, el) => {
        let daSet = {data: [ el.value], label: [el.name]}
        return [ ...acc,daSet]
      }, [])
    }
    })

  }

  downloadDeliveries() {

    let params = '';
    this.donwloading = true;

    console.log(this.firstDay);
    console.log(this.lastDay);

    this._dotation.downloadDeliveries(this.firstDay, this.lastDay, params).subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_inventario';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.donwloading = false;
      }),
      (error) => {
        console.log('Error downloading the file');
        this.donwloading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloading = false;
      };
  }

  ListarDotaciones(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros,
      firstDay: this.firstDay,
      lastDay: this.lastDay,
      person: this.people_id,
      persontwo: this.people_id_two,
      cod: this.cod,
      type: this.type,
      delivery: this.delivery,
      art: this.art,
    }
    this.loading = true;
    this._dotation.getDotations(params).subscribe((r:any) => {
      this.Lista_Dotaciones = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }


  configEntrega(value: string) {
    // this.flagDotacionApp = value;
    // console.log(this.flagDotacionApp);

    this.tablestock.search(value);
    this.modalEntrega.show()
  }

  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.filtros.fechaD = event.formatted;
      this.ListarDotaciones()
    } else {
      this.filtros.fechaD = '';
      this.ListarDotaciones()
    }
  }

  getPeople() {
    this._person.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: 0 });
    });
  }

  Lista_Empleados() {
    this._person.getPeopleIndex().subscribe((r: any) => {
      this.Empleados = r.data;
    });
  }

  anularDotacion(id) {

    Swal.fire({
      title: '¿Seguro?',
      text: 'Va a cambiar el estado de la dotación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!'
    }).then(result => {
      if (result.value) {
        this._dotation.setDotation({ id, data: { state: 'Anulada' } }).subscribe((r: any) => {
          if (r.code == 200) {
            Swal.fire({
              title: 'Opersación exitosa',
              text: 'Felicidades, se han actualizado la dotación',
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
            })
            this.ListarDotaciones()
          } else {
            Swal.fire({
              title: 'Operación denegada',
              text: r.err,
              icon: 'error',
              allowOutsideClick: false,
              allowEscapeKey: false,
            })
          }
        })
      }
    });

  }
  aprobarDotacion(id) {

    Swal.fire({
      title: '¿Seguro?',
      text: 'Va a aprobar la dotación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!'
    }).then(result => {
      if (result.value) {
        this._dotation.approveDotation({ id, data: { state: 'Aprobado' } }).subscribe((r: any) => {
          if (r.code == 200) {
            Swal.fire({
              title: 'Opersación exitosa',
              text: 'Felicidades, aprobó la dotación',
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
            })
            this.ListarDotaciones()
          } else {
            Swal.fire({
              title: 'Operación denegada',
              text: r.err,
              icon: 'error',
              allowOutsideClick: false,
              allowEscapeKey: false,
            })
          }
        })
      }
    });

  }







}
