import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertasComunService } from './alertas-comun.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    
    ) { }

  ngOnInit(): void {
    this.getAlerts();
    this.getGroups();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      group_id: ['', Validators.required],
      dependency_id: ['', Validators.required],
      people_id: ['', Validators.required],
      people: this.fb.array([]),
      description: ['', Validators.required]
    });
  }

  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    
  }
  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data;
      this.groups.unshift({ text: 'Todas', value: 0 });
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

  getPeople(dependencies) {
    this._person
      .getAll({ dependencies: [dependencies] })
      .subscribe((r: any) => {
        this.people = r.data;
        this.people.unshift({ value: '0', text: 'Todos' });
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
