import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, NgForm } from '@angular/forms';
/* import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar'; */
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
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
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
})
export class ActividadesComponent {
  @ViewChild('ModalActividad') ModalActividad: any;
  @ViewChild('ModalTipoActividad') ModalTipoActividad: any;
  @ViewChild('ModalCambioEstado') ModalCambioEstado: any;
  @ViewChild('add') add: any;
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(
      confirm,
      { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  getDismissReason(reason: any) {
    this.LimpiarModelo();
    this.cliente_seleccionado = '';
  }
  daysOfWeek = consts.diasSemana;
  Id_Dependencia = 1;

  Departamentos: any = [];
  Municipios: any = [];
  Actividades: Array<any> = [];

  userLogin: string;
  userLogin1: any;
  userDepen: string;

  Ver: boolean = false;
  ver: number = 0;
  FuncionariosSele: any[] = [];

  DataActivities: Array<any> = [];
  TiposActividad: Array<any> = [];
  ActividadModel = new Actividad();

  cliente_seleccionado: any = '';
  funcionario_seleccionado: any = '';
  Funcionarios: any[] = [];
  id_activity: any;
  alertOption: any = {};
  private eventoActividad: any;
  eventsModel: any;

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
  calendarPlugins = [
    dayGridPlugin,
    bootstrapPlugin,
    timeGrigPlugin,
    interactionPlugin,
    listPlugin,
  ];

  companies: any[] = [];
  groups: any[] = [];
  dependencies: any[] = [];
  editar: boolean = false;
  constructor(
    private http: HttpClient,
    private _actividad: ActividadesService,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _company: CompanyService,
    private _person: PersonService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private _modal: ModalService
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
    // console.log(this.ActividadModel);

  }

  GetActividadesMes() {
    this._actividad.getActivities().subscribe((r: any) => {
      this.calendarEvents = r.data;
      // console.log(this.calendarEvents);

    });
    this.DataActivities = [];
    this.Actividades = [];
    setTimeout(() => {
      this.eventsModel = this.DataActivities;
    }, 1000);
  }

  eventrender(event, element) {
    // event.element[0].querySelectorAll(".fc-content")[0].setAttribute("data-tooltip", event.event.title);
  }
  validarFechas() {
    var fecha_inicio = this.ActividadModel.Fecha_Inicio
    var fecha_fin = this.ActividadModel.Fecha_Fin

    if (fecha_inicio >= fecha_fin && fecha_fin != "") {
      this.ActividadModel.Fecha_Inicio = ''
      this.ActividadModel.Fecha_Fin = ''
      this._swal.show({
        title: 'Fechas invalidas',
        text: 'La fecha de inicio no puede ser mayor a la fecha de fin',
        icon: 'error',
        showCancel: false,
      });

    }
  }
  SetCalendarData() {
    this.DataActivities = [];
    this.userLogin1 = 1;
    this.Actividades.forEach((actividad) => {
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
      this.groups = r.data;
      this.groups.unshift({ text: 'Todas', value: 0 });
    });
  }
  getCompanies() {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data;
      /*  d.data[0]
         ? this.formCompany.patchValue({ company_id: d.data[0].value })
         : ''; */
    });
  }
  getDependencies(group_id) {
    if (group_id == '0') {
      this.dependencies = [];
      this.dependencies.unshift({ text: 'Todas', value: 0 });
      return false;
    }
    this._dependecies.getDependencies({ group_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Todas', value: 0 });
    });
  }

  GetTiposActividad() {
    this._actividad.getActivityTypesActives().subscribe((r: any) => {
      if (r.data) {
        this.TiposActividad = r.data;
      }
    });
  }
  GuardarTipoActividad(form: NgForm) {
    this._actividad.saveActivityType(form.value).subscribe((r: any) => {
      if (r.code == 200) {
        form.reset();
        this.GetTiposActividad();
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Se ha guardado correctamente',
          icon: 'success',
        });
        this.modalService.dismissAll();
      }
    });
  }
  CambiarEstadoTipo(id, state) {
    this._actividad.setActivityType({ id, state }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Se ha cambiado el estado',
          icon: 'success',
        });
        this.GetTiposActividad();
      }
    });
  }
  ////////////////FIN FUNCIONES TIPO////////////////////////

  GuardarActividad(form: NgForm) {
    this.editar ? form.value.days = [] : null;
    this._actividad.saveActivity(form.value).subscribe((data: any) => {
      this.CerrarModal();
      this.GetActividadesMes();
      this._swal.show({
        text: '¡Proceso exitoso!',
        title: (this.editar == true ? 'Actualizado con éxito' : 'Guardado con éxito'),
        icon: 'success',
        showCancel: false,
        timer: 1000
      });
    });
  }

  CerrarModal() {
    this.LimpiarModelo();
    this.modalService.dismissAll();
    this.cliente_seleccionado = '';
  }
  search_funcionario: any = [];
  AsignarFuncionario() {
    if (typeof this.funcionario_seleccionado == 'object') {
      this.ActividadModel.Identificacion_Funcionario =
        this.funcionario_seleccionado.Identificacion_Funcionario;
    } else {
      this.ActividadModel.Identificacion_Funcionario = '';
    }
  }

  LimpiarModelo() {
    this.FuncionariosSele = [];
    this.ActividadModel = new Actividad();
  }
  editarEvento() {
    let data = this.actividadObj;
    this.ActividadModel.id = this.id_activity;
    this.ActividadModel.Id_Actividad_Recursos_Humanos = data.id;
    this.ActividadModel.Fecha_Inicio = moment
      .utc(data.date_start)
      .format('YYYY-MM-DD');
    //.format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.ActividadModel.Fecha_Fin = moment
      .utc(data.date_end)
      .format('YYYY-MM-DD');
    this.ActividadModel.Id_Tipo_Actividad_Recursos_Humanos =
      data.rrhh_activity_type_id;
    this.ActividadModel.Detalles = data.description;
    this.ActividadModel.Actividad_Recursos_Humanos = data.name;
    /*  this.ActividadModel.Funcionario_Asignado        =*/
    this.ActividadModel.Id_Grupo = data.group_id;
    this.ActividadModel.Id_Dependencia = data.dependency_id;

    this.ActividadModel.Hora_Inicio = data.hour_start;
    this.ActividadModel.Hora_Fin = data.hour_end;

    /*  this.FuncionariosSelec(data.Id_Actividad_Recursos_Humanos); */
    this.getDependencies(data.group_id);
    this.Dependencia_Cargo(data.dependency_id);
    this.verificarUser();
    this.openConfirm(this.add)
    //this.ModalActividad.show();
    //this.ModalActividad.show();
    this.verificarUser();
    this.FuncionariosSelec(this.ActividadModel.Id_Actividad_Recursos_Humanos);
    this.Grupo_Dependencia(this.ActividadModel.Id_Grupo);
    this.Dependencia_Cargo(this.ActividadModel.Id_Dependencia);
  }
  verificarUser() {
    /*     let id = this.eventoActividad.detail.event.id;
        this.userLogin = (JSON.parse(localStorage.getItem("User"))).Id_Dependencia */
    /*  this._actividad.getActividadById(id).subscribe((data:any) => {
       if(this.userLogin != data.Id_Dependencia){
         this.Ver = false;
       }else{
         this.Ver = false;
      }
     }) */
  }
  FuncionariosSelec(id) {
    this._actividad.getPeopleActivity(id).subscribe((r: any) => {
      this.FuncionariosSele = r.data;
      console.log(this.FuncionariosSele);
      if (r.data) {
        this.ActividadModel.Funcionario_Asignado =
          this.FuncionariosSele.reduce((acc, el) => {
            return [...acc, el.person.id]
          }, [])
      } else {
        this.ActividadModel.Funcionario_Asignado = ['0'];
      }
    });
  }
  anularDia() {
    let id = this.actividadObj.id;
    this._actividad.cancelActivity(id).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          text: 'Día anulado correctamente',
          title: 'Operación exitosa',
          icon: 'success',
          showCancel: false,
          timer: 1000
        });
      }
      this.GetActividadesMes();
    });
  }

  cancelCycle() {
    let code = this.actividadObj.code;
    this._actividad.cancelCycleActivity(code, { state: 'Anulada' }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          text: 'Ciclo anulado correctamente',
          title: 'Operación exitosa',
          icon: 'success',
          showCancel: false,
          timer: 1000
        });
      }
      this.GetActividadesMes();
    })
  }

  // funcion que no desabilita los input
  agregarEvento() {
    this.ver = 0;
    this.editar = false;
    /* this.userLogin = (JSON.parse(localStorage.getItem("User"))).Id_Grupo
    this.userDepen = (JSON.parse(localStorage.getItem("User"))).Id_Dependencia */
    this.Grupo_Dependencia(this.userLogin);
    this.ActividadModel.Id_Grupo = this.userLogin;
    this.ActividadModel.Id_Dependencia = this.userDepen;
    this.Dependencia_Cargo(this.userDepen);
    /* this.ver = 1; */
    // this.cambiarReadonli();
  }
  accionEvento(accion) {
    /* this.confirmacionAccion.nativeSwal.close(); */
    switch (accion) {
      case 'Ver':
        this.editarEvento();
        this.editar = true;
        this.ver = 1;
        break;
      case 'Editar':
        this.editarEvento();
        this.editar = true;
        this.ver = 0;
        break;
      case 'Anular':
        this.cancelOptions();
        // this.anularEvento();
        break;
    }
  }

  cancelOptions() {
    Swal.fire({
      title: 'Anular la actividad',
      icon: 'question',
      showCancelButton: true,
      input: 'select',
      confirmButtonColor: '#A3BD30',
      confirmButtonText: 'Continuar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      inputOptions: {
        cancelAll: 'Anular ciclo',
        cancelDay: 'Anular día',
      },
      inputPlaceholder: 'Seleccionar...',
    }).then((result) => {
      if (result.value) {
        console.log(result.value);
        result.value == 'cancelDay' ? this.anularDia() : this.cancelCycle()
      }
    });
  }


  actividadObj: any = {};
  accionarEvento(event) {
    if (event.event) {
      let id = event.event._def.publicId;
      this.actividadObj = this.calendarEvents.find((x) => x.id == id);
      this.id_activity = id;
      if (this.actividadObj.state != 'Anulada') {
        this.eventoActividad = event;
        Swal.fire({
          title: 'Elige una acción',
          text: '',
          icon: 'question',
          showCancelButton: true,
          input: 'select',
          confirmButtonColor: '#A3BD30',
          confirmButtonText: 'Continuar',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          inputOptions: {
            Ver: 'Ver',
            Editar: 'Editar',
            Anular: 'Anular',
          },
          inputPlaceholder: 'Seleccionar...',
        }).then((result) => {
          console.log(result)
          if (result.value) {
            this.accionEvento(result.value);
          }
        });

        /*  accionEvento */
      }
    }


  }
  Grupo_Dependencia(Grupo) {
    /* if (Grupo == "Todas") {
      this.ActividadModel.Id_Dependencia = "Todas";
      this.ActividadModel.Funcionario_Asignado = "Todas";
    } else {
       this.http.get(this.globales.ruta + 'php/alertas/alerta_grupo_dependencia.php', { params: { id: Grupo } }).subscribe((data: any) => {
       this.Dependencias = data;
       });
    } */
  }
  Dependencia_Cargo(dependencies) {
    this._person
      .getAll({ dependencies: [dependencies] })
      .subscribe((r: any) => {
        this.Funcionarios = r.data;
        this.Funcionarios.unshift({ value: '0', text: 'Todos' });
      });
  }
}
