import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { donutChart } from './data'
import { ChartType } from '../../../core/interfaces/chart.interface';
@Component({
  selector: 'app-llegadas-tardes',
  templateUrl: './llegadas-tardes.component.html',
  styleUrls: ['./llegadas-tardes.component.scss']
})
export class LlegadasTardesComponent implements OnInit {
  donutChart: ChartType = donutChart;

  public Cargando = true;
  public studentChartOption: any = '';
  public Llegadas: any = [

    { id: '1',Nombres: 'Carlos Cardona', Tiempo_Promedio: '15 Min.', Llegadas_Tardes: '5' },
  ];
  public Detalles_LLegadas: any = [];
  public llegadasTardeChartData: any;
  public llegadas: any[] = [];
  public dias_mes: any = [];
  firstDay: any;
  lastDay: any
  public total_llegadas_tarde: any = 0;
  public llegadasChartTag: CanvasRenderingContext2D;
  public llegadasTardeChartOption: any;
  public maxSize = 10;
  public TotalItems: number;
  public page = 1;
  public filtro_nom: any = '';

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('studentChart') studentChart: ElementRef;
  public facturacionChartTag: CanvasRenderingContext2D;
  public funcionarios_tarde: any = [];
  mes: any = [];
  studentChartData: any;
  public Estadisticas: any = [];
  Grafica: any;
  options: { position: string[]; maxStack: number; timeOut: number; showProgressBar: boolean; pauseOnHover: boolean; lastOnBottom: boolean; clickToClose: boolean; preventDuplicates: boolean; preventLastDuplicates: boolean; theClass: string; rtl: boolean; animate: string; };
  feedbackData: {
    datasets: {
      data: any[]; // aqui son los valores de la gráfica
      backgroundColor: any[]; // aquí los colores de la gráfica
      label: string; borderWidth: number;
    }[]; labels: any[];
  };
  feedbackOption: { responsive: boolean; legend: { display: boolean; }; title: { display: boolean; }; animation: { animateScale: boolean; animateRotate: boolean; }; };

  public Contadores: any = {};

  constructor(private http: HttpClient, private location: Location) {


    /* this.http.get(environment.base_url+ 'php/llegadastarde/indicadores.php').subscribe((data: any) => {
      this.Contadores = data.Contadores;
    }); */
    /* 
    this.LlegadasTardeMes(); */
  }

  ngOnInit() {

    let fecha = new Date();
    let hoy = (fecha.toISOString()).split('T')[0];
    this.lastDay = hoy;
    this.firstDay = (new Date(fecha.setDate(fecha.getDate() - 2))).toISOString().split("T")[0];
    this.LoadChart();
    this.filtroFecha()

  }

  ngAfterViewInit() {


  }

  getFecha(tipo) {
    // console.log(tipo,"getFecha");

    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let Fecha: any;

    if (tipo == 'inicial') {
      Fecha = new Date(y, m, 1);
      //Fecha=new Date();
    } else if (tipo == 'final') {
      Fecha = new Date(y, m + 1, 0);
    }

    let mes = Fecha.getMonth() < 10 ? '0' + parseInt(Fecha.getMonth() + 1) : Fecha.getMonth() + 1;
    let dia = Fecha.getDate() < 10 ? '0' + Fecha.getDate() : Fecha.getDate();

    return Fecha.getFullYear() + '-' + mes + '-' + dia;
  }

  Detalle(id, modal) {
    // console.log(id, "id" );
    // console.log(modal, "modal");

    let fecha_inicio = (document.getElementById('Fecha_Inicio') as HTMLInputElement).value;
    let fecha_fin = (document.getElementById('Fecha_Fin') as HTMLInputElement).value;

    let params = {
      id: id,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin
    };
    this.http.get(environment.base_url + 'php/llegadastarde/detalles.php', { params: params }).subscribe((data: any) => {
      this.Detalles_LLegadas = data;
    });
    modal.show();
    // console.log(this.Detalles_LLegadas);

  }

  filtroFecha() {

    var fecha_inicio = this.firstDay;
    var fecha_fin = this.lastDay;
    // console.log("Fecha inicio:", fecha_inicio);
    // console.log("Fecha fin:", fecha_fin);


    if (fecha_inicio != "") {
      if (fecha_fin != "") {
        this.http.get(environment.base_url + 'php/llegadastarde/llegadastarde.php', { params: { fecha_inicio: fecha_inicio, fecha_fin: fecha_fin } }).subscribe((data: any) => {
          this.Llegadas = data.Llegadas;
          this.TotalItems = data.numReg;
          this.Cargando = false;
        });

        this.cargarGrafica(fecha_inicio, fecha_fin);
      }

    } else if (fecha_inicio == "" && fecha_fin == "") {
      this.http.get(environment.base_url + 'php/llegadastarde/llegadastarde.php').subscribe((data: any) => {
        this.Llegadas = data.Llegadas;
        this.TotalItems = data.numReg;
        this.Cargando = false;
      });
    } else {
      this.confirmacionSwal.title = "Fecha Vacía";
      this.confirmacionSwal.text = "Debes seleccionar la fecha de inicio para filtrar.";
      this.confirmacionSwal.type = "error";
      this.confirmacionSwal.show();
    }

  }

  cargarGrafica(fecha_inicio?, fecha_fin?) {

    let params: any = {};
    if (fecha_inicio && fecha_fin) {
      params.fecha_inicio = fecha_inicio;
      params.fecha_fin = fecha_fin;
    }

    this.Estadisticas = [];

    this.http.get(environment.base_url + 'php/llegadastarde/indicadores.php', { params: params }).subscribe((data: any) => {
      this.Grafica = data.Grafica;
      this.Contadores = data.Contadores
      // console.log("grafica", this.Grafica);
      let Porcentaje = [];
      let Colores = ['#ffbd5d', '#53A3FF', '#FF657F', '#FE978C', '#3DDBBB', '#CD82AD', '#CC4748'];
      let ColoresGrafica = [];
      let LabelsGrafica = [];


      this.Grafica.forEach((g, i) => {
        Porcentaje.push(g.porcentaje);
        ColoresGrafica.push(Colores[i]);
        LabelsGrafica.push(g.Dependencia);
        let atributos = {
          nombre: g.Dependencia,
          porcentaje: g.porcentaje + '%',
          color: Colores[i]
        };
        this.Estadisticas.push(atributos);
      });
      // console.log(Porcentaje, ColoresGrafica, LabelsGrafica);
      setTimeout(() => {


        this.options = {
          position: ['bottom', 'right'],
          maxStack: 5,
          timeOut: 1500,
          showProgressBar: true,
          pauseOnHover: true,
          lastOnBottom: true,
          clickToClose: true,
          preventDuplicates: false,
          preventLastDuplicates: false,
          theClass: 'bg-c-pink no-icon',
          rtl: false,
          animate: 'rotate',
        };

        this.feedbackData = {
          datasets: [{
            data: Porcentaje, // aqui son los valores de la gráfica
            backgroundColor: ColoresGrafica, // aquí los colores de la gráfica
            label: 'Dataset 1',
            borderWidth: 0
          }], labels: LabelsGrafica
        };

        this.feedbackOption = {
          responsive: true,
          legend: { display: false },
          title: { display: false },
          animation: { animateScale: true, animateRotate: true }
        };

      }, 75);

    });
  }


  LoadChart() {
    setTimeout(() => {
      const llegadas_tag = (((<HTMLCanvasElement>this.studentChart.nativeElement).children));
      this.llegadasChartTag = ((llegadas_tag['llegadas_tarde_chart']).lastChild).getContext('2d');
      const def = (this.llegadasChartTag).createLinearGradient(500, 0, 100, 0);
      def.addColorStop(0, '#2ed8b6');
      def.addColorStop(1, '#7cffe5');
      this.llegadasTardeChartData = {
        labels: this.dias_mes, //Eje X
        datasets: [{
          label: 'Llegadas Tarde',
          borderColor: def,
          pointBorderColor: '#fff',
          pointBackgroundColor: def,
          pointHoverBackgroundColor: def,
          pointHoverBorderColor: def,
          pointBorderWidth: 2,
          pointHoverRadius: 14,
          pointHoverBorderWidth: 1,
          pointRadius: 8,
          fill: false,
          borderWidth: 2,
          data: this.llegadas
          //Eje Y
        }]
      };

    }, 600);
  }

  LlegadasTardeMes() {
    this.http.get(environment.base_url + 'php/recursos_humanos/llegadas_tarde.php').subscribe((data: any) => {
      this.total_llegadas_tarde = data.Total_llegadas_mensual;

      data.llegadas_count.forEach(llegada => {
        this.llegadas.push(llegada.llegadas_tarde);
        this.dias_mes.push(llegada.dia);
      });

      this.funcionarios_tarde = data.funcionarios_llegadas_tarde;
    });
  }

  filtros(pagination: boolean = false) {

    let queryString = this.getQueryString(pagination);

    this.location.replaceState('/llegadastarde', queryString);


    this.http.get(environment.base_url + 'php/llegadastarde/llegadastarde.php' + queryString).subscribe((data: any) => {
      this.Llegadas = data.Llegadas;
      this.TotalItems = data.numReg;

    });

  }
  getQueryString(pagination: boolean = false) {

    let params: any = {};
    let queryString = '';

    if (!pagination) {
      this.page = 1;
    }
    if (this.filtro_nom != '') {
      params.nom = this.filtro_nom;
    }
    if (this.lastDay != '') {
      params.fecha_fin = this.lastDay;
    }
    if (this.firstDay != '') {
      params.fecha_inicio = this.firstDay;
    }

    params.pag = this.page;


    queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;

  }

}
