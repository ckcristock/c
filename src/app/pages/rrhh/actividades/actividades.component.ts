import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, NgForm } from '@angular/forms';
/* import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar'; */
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
/* import swal,{ SweetAlertOptions } from 'sweetalert2'; */
/* import { SwalComponent } from '@toverux/ngx-sweetalert2'; */
import { HttpClient } from '@angular/common/http';

import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { EventInput } from '@fullcalendar/core';


// import { FormGroup, FormControl} from '@angular/forms';

declare var $: any;

///SERVICIOS
/* import { FuncionarioDataServiceRH } from '../../shared/services/funcionarios/funcionarioRH.service'; */


///MODELOS

import { ActividadesService } from './actividades.service';
import { Actividad } from 'src/app/core/models/actividad.model';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { CompanyService } from '../../ajustes/informacion-base/services/company.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss']
})
export class ActividadesComponent {
  // implements OnInit
  public Id_Dependencia = 1
  /*   calendarOptions: Options; */
  public Departamentos: any = [];
  public Municipios: any = [];
  public Actividades: Array<any> = [];

  public userLogin: string;
  public userLogin1: any;
  public userDepen: string;

  public Ver: boolean = false;
  public ver: number;
  public FuncionariosSele: any[] = [];

  public DataActivities: Array<any> = [];
  public TiposActividad: Array<any> = [];
  public ActividadModel: Actividad = new Actividad();
  public Funcionario: any = JSON.parse(localStorage.getItem('User'));
  public cliente_seleccionado: any = '';
  public funcionario_seleccionado: any = '';
  public Archivos: any[] = [];
  public Grupos: any[] = [];
  public Dependencias: any[] = [];
  public Funcionarios: any[] = [];

  public alertOption: any = {};
  private eventoActividad: any;
  public eventsModel: any;

  /*   @ViewChild(CalendarComponent) ucCalendar: CalendarComponent; */
  @ViewChild('ModalActividad') ModalActividad: any;
  @ViewChild('ModalTipoActividad') ModalTipoActividad: any;
  @ViewChild('ModalCambioEstado') ModalCambioEstado: any;
  @ViewChild('alertSwal') alertSwal: any;
  /*   @ViewChild('confirmacionAccion') confirmacionAccion: SwalComponent; */
  @ViewChild('deleteSwal') deleteSwal: any;


  breadCrumbItems: Array<{}>;

  // event form
  formData: FormGroup;
  formEditData: FormGroup;

  // Form submition value
  submitted: boolean;

  // Form category data
  category: Event[];

  // Date added in event
  newEventDate: Date;

  // Edit event
  editEvent: EventInput;

  // Delete event
  deleteEvent: EventInput;

  calendarWeekends: any;
  // show events
  calendarEvents: EventInput[];

  // calendar plugin
  calendarPlugins = [dayGridPlugin, bootstrapPlugin, timeGrigPlugin, interactionPlugin, listPlugin];

  companies: any[] = []
  groups: any[] = []
  dependencies: any[] = []

  constructor(private http: HttpClient,
    private _actividad: ActividadesService,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _company: CompanyService,
    private _person: PersonService
  ) {
    this.GetTiposActividad();


  }
  ngOnInit(): void {
    this.getGroups();
    /*  this.http.get(this.globales.ruta + 'php/lista_generales.php', { params: { modulo: 'Grupo' } }).subscribe((data: any) => {
       this.Grupos = data;
     }); */
    this.GetActividadesMes();
    //alert(`i'm here`);
  }
  GetActividadesMes() {
    /*  this._actividad.getActividadesAnual().subscribe((data:any) => {
       if (data.codigo == 'success') {
         this.Actividades = [];
         this.Actividades = data.query_result;
         this.SetCalendarData();
       }else{
       } */
    this.DataActivities = [];
    this.Actividades = [];
    /*    this.calendarOptions = {
         editable: true,
         eventLimit: false,
         header: {
           left: 'prev, next, today',
           center: 'title',
           right: 'month,agendaWeek,agendaDay,listMonth'
         },
         buttonText:{
           today:    'Hoy',
           month:    'Mes',
           week:     'Semana',
           day:      'Día',
           list:     'Lista'
         },
         locale: 'es',
         events:  this.DataActivities
       }; */

    setTimeout(() => {
      this.eventsModel = this.DataActivities;
    }, 1000);
    /*  }); */
  }

  eventrender(event, element) {

    // event.element[0].querySelectorAll(".fc-content")[0].setAttribute("data-tooltip", event.event.title);
  }


  SetCalendarData() {
    this.DataActivities = [];
    this.userLogin1 = 1
    this.Actividades.forEach(actividad => {
      if (this.userLogin1 == 9) {
        let calendarObj = {
          id: parseInt(actividad.Id_Actividad_Recursos_Humanos),
          // title: actividad.Actividad_Recursos_Humanos,
          description: actividad.NombreDependencia,
          start: actividad.Fecha_Inicio,
          end: actividad.Fecha_Fin,
          color: actividad.Color,
        };
        this.DataActivities.push(calendarObj);
      }
      if (this.userLogin1 == actividad.Id_Dependencia) {
        let calendarObj = {
          id: parseInt(actividad.Id_Actividad_Recursos_Humanos),
          title: actividad.Actividad_Recursos_Humanos,
          description: actividad.NombreDependencia,
          start: actividad.Fecha_Inicio,
          end: actividad.Fecha_Fin,
          color: actividad.Color,
        };
        this.DataActivities.push(calendarObj);
      }
    });
  }

  /////////////////FUNCIONES TIPOS ACTIVIDAD/////////////////º
  CerrarModalTipo() {
    this.LimpiarModelo();
    this.ModalTipoActividad.hide();

  }

  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data
      this.groups.unshift({ text: 'Seleccione uno', value: '' });
    })
  }
  getCompanies() {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data;
      /*  d.data[0]
         ? this.formCompany.patchValue({ company_id: d.data[0].value })
         : ''; */
    });
  }
  getDependencies(company_id) {
    this._dependecies.getDependencies({ company_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Seleccione una', value: '' });
    });
  }

  GetTiposActividad() {
    this._actividad.getActivityTypes().subscribe((r: any) => {
      if (r.data) {
        this.TiposActividad = r.data;
      }
    });
  }
  GuardarTipoActividad(form: NgForm) {

    this._actividad.saveActivityType(form.value).subscribe(r => {
      form.reset();
      this.GetTiposActividad();
    })
  }
  CambiarEstadoTipo(Data) {
    let Estado = Data.Estado;
    let Id_Tip = Data.Id_Tipo_Actividad_Recursos_Humanos;
    /*   this.http.get(this.globales.ruta + 'php/recursos_humanos/actividades/guardar_tipo_actividad_rh.php',
          {params: { Id_Tipo : Id_Tip,
                    Estado    : Estado }}).subscribe((data: any) =>{
      this.GetTiposActividad();
      this.limpiarCampos();
      this.deleteSwal.type  = data['type']; //data.type
      this.deleteSwal.title = data['title']; //data.title;
      this.deleteSwal.text  = data['mensaje']; //data.mensaje;
    });
    */
  }
  ////////////////FIN FUNCIONES TIPO////////////////////////

  GuardarActividad() {
    this.ActividadModel.Identificacion_Funcionario = this.Funcionario.Identificacion_Funcionario;
    let data = new FormData();
    let modelo = JSON.stringify(this.ActividadModel);
    data.append("modelo", modelo);
    /* this._actividad.saveActividad(data).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        this.CerrarModal();
        this.GetActividadesMes();
      }else{
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
    }); */
  }
  CerrarModal() {
    this.LimpiarModelo();
    this.ModalActividad.hide();
    this.cliente_seleccionado = '';
  }
  search_funcionario: any = []
  AsignarFuncionario() {

    if (typeof (this.funcionario_seleccionado) == 'object') {

      this.ActividadModel.Identificacion_Funcionario = this.funcionario_seleccionado.Identificacion_Funcionario;
    } else {
      this.ActividadModel.Identificacion_Funcionario = '';
    }
  }
  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }
  LimpiarModelo() {
    this.ActividadModel = new Actividad();
  }
  editarEvento() {
    let id = this.eventoActividad.detail.event.id;
    /*  this._actividad.getActividadById(id).subscribe((data:any) => {
     this.ActividadModel.Id_Actividad_Recursos_Humanos      = data.Id_Actividad_Recursos_Humanos;
     this.ActividadModel.Fecha_Inicio                       = data.Fecha_Inicio;
     this.ActividadModel.Fecha_Fin                          = data.Fecha_Fin;
     this.ActividadModel.Id_Tipo_Actividad_Recursos_Humanos = data.Id_Tipo_Actividad_Recursos_Humanos;
     this.ActividadModel.Detalles                           = data.Detalles;
     this.ActividadModel.Actividad_Recursos_Humanos         = data.Actividad_Recursos_Humanos;
     this.ActividadModel.Funcionario_Asignado               = data.Funcionario_Asignado;
     this.Grupo_Dependencia(data.Id_Grupo);
     this.ActividadModel.Id_Grupo                           = data.Id_Grupo;
     this.Dependencia_Cargo(data.Id_Dependencia);
     this.ActividadModel.Id_Dependencia                     = data.Id_Dependencia;
     this.verificarUser();
     this.FuncionariosSelec(data.Id_Actividad_Recursos_Humanos);
     this.ModalActividad.show();
   }) */
  }
  verificarUser() {
    let id = this.eventoActividad.detail.event.id;
    this.userLogin = (JSON.parse(localStorage.getItem("User"))).Id_Dependencia
    /*  this._actividad.getActividadById(id).subscribe((data:any) => {
       if(this.userLogin != data.Id_Dependencia){
         this.Ver = false;
       }else{
         this.Ver = false;
      }
     }) */
  }
  FuncionariosSelec(fun) {
    /*  this.http.get(this.globales.ruta + 'php/recursos_humanos/actividades/get_funcionarios_seleccionados.php', { params: { id: fun } }).subscribe((data: any) => {
     this.FuncionariosSele = data;
   });
   */
  }
  anularEvento() {
    let id = this.eventoActividad.detail.event.id;
    /*  this._actividad.anularActividad(id).subscribe((data:any) => {
       this.ShowSwal(data.codigo, data.titulo, data.mensaje);
       this.GetActividadesMes();
     }) */
  }

  // funcion que no desabilita los input
  agregarEvento() {
    this.userLogin = (JSON.parse(localStorage.getItem("User"))).Id_Grupo
    this.userDepen = (JSON.parse(localStorage.getItem("User"))).Id_Dependencia
    this.Grupo_Dependencia(this.userLogin);
    this.ActividadModel.Id_Grupo = this.userLogin;
    this.ActividadModel.Id_Dependencia = this.userDepen;
    this.Dependencia_Cargo(this.userDepen);
    this.ver = 1;
    // this.cambiarReadonli();
  }
  accionEvento(accion) {
    /* this.confirmacionAccion.nativeSwal.close(); */
    switch (accion) {
      case 'Ver':
        this.editarEvento();
        this.ver = 0;
        break;
      case 'Editar':
        this.editarEvento();
        this.ver = 1;
        break;
      case 'Anular':
        this.anularEvento();
        break;
    }
  }
  accionarEvento(event) {
    let id = event.detail.event.id;
    let actividadObj = this.Actividades.find(x => x.Id_Actividad_Recursos_Humanos == id);
    if (actividadObj.Estado != 'Anulada') {
      this.eventoActividad = event;
      /*  this.confirmacionAccion.show(); */
    }
  }
  Grupo_Dependencia(Grupo) {
    if (Grupo == "Todas") {
      this.ActividadModel.Id_Dependencia = "Todas";
      this.ActividadModel.Funcionario_Asignado = "Todas";
    } else {
      /*  this.http.get(this.globales.ruta + 'php/alertas/alerta_grupo_dependencia.php', { params: { id: Grupo } }).subscribe((data: any) => {
       this.Dependencias = data;
       }); */
    }
  }
  Dependencia_Cargo(dependencies) {

    this._person.getAll({ dependencies: [dependencies] }).subscribe((r: any) => {
      this.Funcionarios = r.data;
      // console.log(this.Funcionarios);
      this.Funcionarios.unshift({ value: 'Todos', label: 'Todos' });
    });
  }

}

