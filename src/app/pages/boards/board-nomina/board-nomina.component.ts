import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-board-nomina',
  templateUrl: './board-nomina.component.html',
  styleUrls: ['./board-nomina.component.scss']
})
export class BoardNominaComponent implements OnInit {
  globales = { ruta: 'http://inventario.sigmaqmo.com/' }

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) { }

  public datos_tabla_semaforo: any = {
    personas: [],
    salarios: [],
    seguridad_social: [],
    extras_recargos: [],
    vacaciones: [],
    incapacidades: [],
    ingresos_constitutivos: [],
    ingresos_no_constitutivos: []
  };

  private costosGastosPorGrupo: Array<any> = [];
  private costosGastosPorDependencias: Array<any> = [];

  public meses_tabla: any = {
    mes1: '',
    mes2: ''
  };

  public TotalSueldos: number = 0;
  public TotalAuxilio: number = 0;
  public TotalDeducciones: number = 0;

  public border_color: string = '#ffffff';

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {};
  public lineChartColors: Array<any> = [];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  @ViewChild('costosNominaChart') costosNominaChart: ElementRef;
  public costosNominaChartTag: CanvasRenderingContext2D;
  public costoNominaChartOption: any;
  public costosNominaChartData: any;
  private nominaQuincenasData: any = new Array;


  public ColoresChart = ['#357ff4', '#4834f4', '#34d4f4', '#34f444', '#bcae31', '#d1261d'];
  //public TagsChart = ['Salarios', 'Extras y Recargos', 'Vacaciones', 'Incapacidades', 'Ingresos Constitutivos', 'Ingresos No Constitutivos'];
  public TagsChart = ['Salarios', 'extras y Recargos', 'Vacaciones', 'Incapacidades', 'Ingresos Constitutvos', 'Otros ingresos'];
  public LabelsChart: any = new Array;
  private chartDatasets: any = [];

  public ColoresCostosGastos = ['#357ff4', '#4834f4', '#34d4f4'];
  public TagsCostosGastos = ['Salarios', 'Extras y Recargos', 'Otros Ingresos'];
  public costosGastosOptions: any = [];
  public costosGastosFeedbackData: any = [];
  public costosGastosFeedbackOptions: any = [];
  private nominaData: any = [];

  public ColoresCostosGastosGrupos = ['#357ff4', '#4834f4', '#34d4f4'];
  public TagsCostosGastosGrupos = [];
  public costosGruposOptions: any = [];
  public costosGastosGrupoData: any = {};
  public costosGastosGrupoOptions: any = {};

  public ColoresCostosGastosDependencias = ['#357ff4', '#4834f4', '#34d4f4', '#1b5bc1', '#1d1bc1', '#841b45', '#727212', '#c15c0f', '#c1320e', '#c10d0d', '#1c720e'];
  public TagsCostosGastosDependencias = [];
  public costosDependenciasOptions: any = [];
  public costosGastosDependenciaData: any = {};
  public costosGastosDependenciaOptions: any = {};

  ngOnInit() {
    this.DescargarDatosNomina();
    this.DescargarDatosNominaTotatles();
  }

  ngAfterViewInit() {
    this.ConstruirGrafica();
    this.LoadChart();
    this.ConstruirCostosGastos();
    this.ConstruirCostosGastosGrupos();
    this.ConstruirCostosGastosDependencia();
  }

  DescargarDatosNominaTotatles() {
    this.http.get(this.globales.ruta + 'php/nomina/lista_funcionarios.php' + '').subscribe((data: any) => {
      this.TotalSueldos = data.Total_Sueldos;
      this.TotalAuxilio = data.Total_Auxilio;
      this.TotalDeducciones = data.Total_Deducciones;
    });
  }

  DescargarDatosNomina() {
    this.http.get(this.globales.ruta + 'php/nomina/tablero_nomina.php').subscribe((data: any) => {
      this.meses_tabla.mes1 = data.meses_tabla.mes1;
      this.meses_tabla.mes2 = data.meses_tabla.mes2;

      this.datos_tabla_semaforo.personas = data.tabla_semaforo.personas;
      this.datos_tabla_semaforo.salarios = data.tabla_semaforo.salarios;
      this.datos_tabla_semaforo.seguridad_social = data.tabla_semaforo.seguridad;
      this.datos_tabla_semaforo.extras_recargos = data.tabla_semaforo.extras;
      this.datos_tabla_semaforo.vacaciones = data.tabla_semaforo.vacaciones;
      this.datos_tabla_semaforo.incapacidades = data.tabla_semaforo.incapacidades;
      this.datos_tabla_semaforo.ingresos_constitutivos = data.tabla_semaforo.ingresos_constitutivos;
      this.datos_tabla_semaforo.ingresos_no_constitutivos = data.tabla_semaforo.ingresos_no_constitutivos;

      //Datos grafica lineal
      let costosNominaQuincenas = data.totales_quincenas;

      let indexTags = 0;
      for (const key in costosNominaQuincenas) {

        let i = 0;
        for (const k in costosNominaQuincenas[key]) {

          if (k == 'fechas') {

            this.LabelsChart.push(costosNominaQuincenas[key][k]['inicio'] + " al " + costosNominaQuincenas[key][k]['fin']);

          } else if (k != 'fechas') {
            if (this.nominaQuincenasData[i] === undefined) {
              this.nominaQuincenasData[i] = [];
            }

            this.nominaQuincenasData[i].push(costosNominaQuincenas[key][k]);

            if (i == 0 && indexTags == 0)
              this.TagsChart.push(k);

            i++;
          }
          indexTags++;
        }
      }

      //Datos graficas Donas
      let costosNomina = data.costos_nomina;
      for (const key in costosNomina) {
        let cData = { data: costosNomina[key], costos: 0 };
        this.nominaData.push(costosNomina[key]);
      }

      let costosGastosGrupo = data.costos_nomina_por_grupos;
      for (const key in costosGastosGrupo) {
        this.costosGastosPorGrupo.push(costosGastosGrupo[key]['Porcentaje']);
        this.TagsCostosGastosGrupos.push(key);
      }

      let costosGastosDependencia = data.costos_nomina_por_dependencias;
      for (const key in costosGastosDependencia) {
        this.costosGastosPorDependencias.push(costosGastosDependencia[key]['Porcentaje']);
        this.TagsCostosGastosDependencias.push(key);
      }
    });
  }

  LoadChart() {
    setTimeout(() => {
      const chartTag = (((<HTMLCanvasElement>this.costosNominaChart.nativeElement).children));
      this.costosNominaChartTag = ((chartTag['costos_nomina_chart']).lastChild).getContext('2d');
      const def = (this.costosNominaChartTag).createLinearGradient(500, 0, 100, 0);
      def.addColorStop(0, '#2ed8b6');
      def.addColorStop(1, '#7cffe5');
      this.costosNominaChartData = {
        labels: this.LabelsChart, //Eje X
        datasets: this.chartDatasets
      };

    }, 7000);
  }

  ConstruirGrafica() {
    setTimeout(() => {
      let i = 0;
      this.nominaQuincenasData.forEach(element => {
        let dataset = {
          label: this.TagsChart[i],
          borderColor: this.ColoresChart[i],
          pointBorderColor: '#fff',
          pointBackgroundColor: this.ColoresChart[i],
          pointHoverBackgroundColor: this.ColoresChart[i],
          pointHoverBorderColor: this.ColoresChart[i],
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 1,
          pointRadius: 8,
          fill: true,
          borderWidth: 2,
          data: element //Eje Y
        };

        this.chartDatasets.push(dataset);

        i++;
      });
    }, 5000);

  }

  ConstruirCostosGastos() {
    setTimeout(() => {
      this.costosGastosOptions = {
        position: ['bottom', 'right'],
        maxStack: 8,
        timeOut: 1500,
        showProgressBar: true,
        pauseOnHover: true,
        lastOnBottom: true,
        clickToClose: true,
        preventDuplicates: false,
        preventLastDuplicates: false,
        theClass: 'bg-c-pink no-icon',
        rtl: false,
        animate: 'rotate'
      };

      this.costosGastosFeedbackData = {
        datasets: [{
          data: this.nominaData, // aqui son los valores de la gráfica
          backgroundColor: this.ColoresCostosGastos, // aquí los colores de la gráfica
          label: 'Dataset 1',
          borderWidth: 0
        }], labels: this.TagsCostosGastos
      };

      this.costosGastosFeedbackOptions = {
        responsive: true,
        legend: { display: true },
        title: { display: false },
        animation: { animateScale: true, animateRotate: true }
      };
    }, 5000);

  }

  ConstruirCostosGastosGrupos() {
    setTimeout(() => {
      this.costosGruposOptions = {
        position: ['bottom', 'right'],
        maxStack: 8,
        timeOut: 1500,
        showProgressBar: true,
        pauseOnHover: true,
        lastOnBottom: true,
        clickToClose: true,
        preventDuplicates: false,
        preventLastDuplicates: false,
        theClass: 'bg-c-pink no-icon',
        rtl: false,
        animate: 'rotate'
      };

      this.costosGastosGrupoData = {
        datasets: [{
          data: this.costosGastosPorGrupo, // aqui son los valores de la gráfica
          backgroundColor: this.ColoresCostosGastos, // aquí los colores de la gráfica
          label: 'Dataset 1',
          borderWidth: 0
        }], labels: this.TagsCostosGastosGrupos
      };

      this.costosGastosGrupoOptions = {
        responsive: true,
        legend: { display: true },
        title: { display: false },
        animation: { animateScale: true, animateRotate: true }
      };
    }, 5000);
  }

  ConstruirCostosGastosDependencia() {
    setTimeout(() => {
      this.costosDependenciasOptions = {
        position: ['bottom', 'right'],
        maxStack: 8,
        timeOut: 1500,
        showProgressBar: true,
        pauseOnHover: true,
        lastOnBottom: true,
        clickToClose: true,
        preventDuplicates: false,
        preventLastDuplicates: false,
        theClass: 'bg-c-pink no-icon',
        rtl: false,
        animate: 'rotate'
      };

      this.costosGastosDependenciaData = {
        datasets: [{
          data: this.costosGastosPorDependencias, // aqui son los valores de la gráfica
          backgroundColor: this.ColoresCostosGastosDependencias, // aquí los colores de la gráfica
          borderColor: this.border_color,
          label: 'Dataset 1',
          borderWidth: 1
        }], labels: this.TagsCostosGastosDependencias
      };

      this.costosGastosDependenciaOptions = {
        responsive: true,
        legend: { display: true },
        title: { display: false },
        animation: { animateScale: true, animateRotate: true }
      };
    }, 5500);
  }

  ConstruirGraficaDona(graphOptionContainer: any, graphDataContainer: any, data: Array<any>, colores: Array<string>, tags: Array<string>) {

    setTimeout(() => {

      graphDataContainer = {
        datasets: [{
          data: data, // aqui son los valores de la gráfica
          backgroundColor: colores, // aquí los colores de la gráfica
          borderColor: this.border_color,
          label: 'Dataset 1',
          borderWidth: 2
        }],
        labels: tags
      };

      graphOptionContainer = {
        responsive: true,
        legend: { display: true },
        title: { display: false },
        animation: { animateScale: true, animateRotate: true }
      };
    }, 400);
  }

}
