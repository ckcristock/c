import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserService } from 'src/app/core/services/user.service';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { EventInput } from '@fullcalendar/core';
import { TaskService } from './task.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../ajustes/informacion-base/services/swal.service';
import esLocale from '@fullcalendar/core/locales/es';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  @ViewChild('list') list: ElementRef;
  public open: Subject<any> = new Subject;
  active = 1;
  locales = [esLocale];
  pendientes: any[] = [];
  ejecucion: any[] = [];
  espera: any[] = [];
  finalizado: any[] = [];
  archivadas: any[] = [];
  tasks: any[] = [];
  asignadas: any[] = [];
  taskTypes: any[] = [];
  loadingPendientes: boolean;
  loadingEjecucion: boolean;
  loadingEspera: boolean;
  loadingFinalizado: boolean;
  loadingAsignadas: boolean;
  loadingArchivadas: boolean;
  loadingTypes: boolean;
  formTypes: FormGroup
  color: string;
  user: any;
  params: any;
  public events: Array<EventInput> = [];
  calendarPlugins = [
    dayGridPlugin,
    bootstrapPlugin,
    timeGrigPlugin,
    interactionPlugin,
    listPlugin,
  ];
  paginationAsiggned: any = {
    page: 1,
    pageSize: 16,
    collectionSize: 0
  }
  paginationArch: any = {
    page: 1,
    pageSize: 16,
    collectionSize: 0
  }
  paginationTypes: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  calendarEvents: EventInput[];
  values = [5, 10, 50, 100, 500];
  constructor(
    public _task: TaskService,
    private _user: UserService,
    private router: Router,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.user = this._user.user.person.id;
    this.params = {
      person_id: this.user,
      max: 100,
    }
    this.getTasks();

  }

  openModal() {
    this.open.next()
  }

  saveType() {
    this._task.saveType(this.formTypes.value).subscribe((res:any) => {
      this._swal.show({
        title: 'Agregado con éxito',
        icon: 'success',
        text: '',
        showCancel: false,
        timer: 1000
      })
      this.paginateTypes();
      this.formTypes.reset()
    })
  }

  openModalTypes(content) {
    this.formTypes = this.fb.group({
      name: ['', Validators.required]
    })
    this._modal.open(content, 'sm')
    this.paginateTypes();
  }

  paginateTypes(page = 1) {
    this.loadingTypes = true;
    this.paginationTypes.page = page;
    this._task.paginateTypes(this.paginationTypes).subscribe((res: any) => {
      this.taskTypes = res.data.data;
      this.paginationTypes.collectionSize = res.data.total;
      this.loadingTypes = false
    })
  }

  getTasks() {
    this.pendientes = []
    this.ejecucion = []
    this.espera = []
    this.finalizado = []
    this.loadingPendientes = true;
    this.loadingEjecucion = true;
    this.loadingEspera = true;
    this.loadingFinalizado = true;
    this._task.personTasks(this.params)
      .subscribe(
        (d: any) => {
          this.loadingPendientes = false;
          this.loadingEjecucion = false;
          this.loadingEspera = false;
          this.loadingFinalizado = false;
          this.tasks = d.data
          for (let i in d.data) {
            if (d.data[i].estado == 'Pendiente') {
              this.pendientes.push(d.data[i]);
            } else if (d.data[i].estado == 'En ejecucion') {
              this.ejecucion.push(d.data[i]);
            } else if (d.data[i].estado == 'En espera') {
              this.espera.push(d.data[i]);
            } else if (d.data[i].estado == 'Finalizado') {
              this.finalizado.push(d.data[i]);
            }
          }
          this.pushEvents()
        });
  }

  pushEvents() {
    this.events = []
    for (let i in this.tasks) {
      let status = this.tasks[i].estado
      if (status != 'Archivada') {
        status == 'Pendiente' ? this.color = '#ef476f' :
          status == 'En ejecucion' ? this.color = '#ffd166' :
            status == 'En espera' ? this.color = '#118ab2' :
              status == 'Finalizado' ? this.color = '#06d6a0' : ''
        var object = {
          title: this.tasks[i].titulo,
          start: this.tasks[i].fecha,
          description: this.tasks[i].estado,
          backgroundColor: this.color,
          publicId: this.tasks[i].id,
        }
        this.events.push(object);
      }
    }
  }

  onEventClick(event) {
    let taskview = event.event._def.extendedProps.publicId
    this.router.navigate(['/task', taskview]);
  }

  getArchivadas(page = 1) {
    this.loadingArchivadas = true;
    this.paginationArch.page = page;
    let params = {
      person_id: this.user,
      estado: 'Archivada',
      ...this.paginationArch
    }
    this._task.getArchivadas(params).subscribe((d: any) => {
      this.archivadas = d.data.data;
      this.loadingArchivadas = false;
      this.paginationArch.collectionSize = d.data.total;
    });
  }

  getAsignadas(page = 1) {
    this.loadingAsignadas = true
    this.paginationAsiggned.page = page;
    this._task.getAsignadas(this.user, this.paginationAsiggned).subscribe((d: any) => {
      this.asignadas = d.data.data;
      this.paginationAsiggned.collectionSize = d.data.total;
      this.loadingAsignadas = false
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    if (event.container.id == 'list-pendientes') {
      this.statusUpdate(event.container.data, 'Pendiente')
    } else if (event.container.id == 'list-finalizado') {
      this.statusUpdate(event.container.data, 'Finalizado')
    } else if (event.container.id == 'list-ejecucion') {
      this.statusUpdate(event.container.data, 'En ejecucion')
    } else if (event.container.id == 'list-espera') {
      this.statusUpdate(event.container.data, 'En espera')
    }
  }

  statusUpdate(data, status) {
    let params = {
      id: '',
      status: ''
    }
    for (let i in data) {
      let r: any = data[i]
      if (r.estado != status) {
        params.id = r.id
        params.status = status
        this._task.statusUpdate(params).subscribe()
        r.estado = status
      }
    }
  }
}
