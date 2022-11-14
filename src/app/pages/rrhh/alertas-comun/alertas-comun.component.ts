import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertasComunService } from './alertas-comun.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-alertas-comun',
  templateUrl: './alertas-comun.component.html',
  styleUrls: ['./alertas-comun.component.scss'],
})
export class AlertasComunComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  datas: any[] = [];
  loading: boolean = false
  groups: any[] = [];
  dependencies: any[] = [];
  people: any[] = [];
  estadoFiltros = false;
  closeResult = '';
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor(
    private _alert: AlertasComunService, 
    private route: ActivatedRoute, 
    private modalService: NgbModal,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _person: PersonService,
    private fb: FormBuilder,
    private _user: UserService,
    private _swal: SwalService,
    
    ) { }

  ngOnInit(): void {
    this.getAlerts();
    this.getGroups();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      person_id: this._user.user.id,
      type: ['', Validators.required],
      group_id: ['', Validators.required],
      dependency_id: ['', Validators.required],
      user_id: ['', Validators.required],
      people: this.fb.array([]),
      description: ['', Validators.required],
    });
  }

  createAlert() {
    this.form.patchValue({
      person_id: this._user.user.id
    })
    this._alert.sendAlert(this.form.value)
    .subscribe((res:any) => {
      this.modalService.dismissAll();
      this._swal.show({
        title: 'Agregado con éxito',
        icon: 'success',
        text: '',
        timer: 1000,
        showCancel: false
      })
      this.getAlerts();
      this.form.reset()
    })
  }

  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset()
  }
  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data;
      this.groups.unshift({ text: 'Todas', value: 'Todas' });
    });
  }

  getDependencies(group_id) {
    if (group_id == '0') {
      this.dependencies = [];
      this.dependencies.unshift({ text: 'Todas', value: 'Todas' });
      return false;
    }
    this._dependecies.getDependencies({ group_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Todas', value: 'Todas' });
    });
  }

  getPeople(dependencies) {
    this._person
      .getAll({ dependencies: [dependencies] })
      .subscribe((r: any) => {
        this.people = r.data;
        this.people.unshift({ value: 'Todos', text: 'Todos' });
      });
  }
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  openModal() {
    this.modal.show();
  }

  getAlerts(page = 1) {
    this.loading = true
    this.pagination.page = page;
    let person_id = this.route.snapshot.params.pid;
    let param = person_id ? { person_id } : {}
    let params = {
      ...param, ...this.pagination
    }
    this._alert.getAlerts(params).subscribe((r: any) => {
      this.datas = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false
    });
  }
}
