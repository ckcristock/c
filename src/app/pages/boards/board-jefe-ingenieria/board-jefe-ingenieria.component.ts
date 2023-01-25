import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { OrdenesProduccionService } from '../../manufactura/services/ordenes-produccion.service';

@Component({
  selector: 'app-board-jefe-ingenieria',
  templateUrl: './board-jefe-ingenieria.component.html',
  styleUrls: ['./board-jefe-ingenieria.component.scss']
})
export class BoardJefeIngenieriaComponent implements OnInit {
  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  orderBy = 'asc';
  loading_stage: boolean;
  work_orders: any[] = []
  people: any[] = []
  dependencies: any[] = []
  form_assign: FormGroup;

  constructor(
    private _work_orders: OrdenesProduccionService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _dependencies: DependenciesService,
    private _people: PersonService
  ) { }

  ngOnInit(): void {
    this.getInicial();
  }

  openModal(content, item) {
    this.createFormAssign(item);
    this.getDependencies();
    this._modal.open(content, 'lg')
  }

  createFormAssign(item) {
    this.form_assign = this.fb.group({
      dependency_id: ['', Validators.required],
      work_order_id: [item.id],
      person_id: [null, Validators.required],
      observations: ['', [Validators.required, Validators.maxLength(500)]],
      hours: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(0)]],
      minutes: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(0)]],
    })
    this.form_assign.get('dependency_id').valueChanges.subscribe(r => {
      this.getPeople(r)
    })
  }

  getPeople(dependency_id) {
    let params = {
      dependency_id: dependency_id
    }
    this._people.getPeopleIndex(params).subscribe((res: any) => {
      this.people = res.data
    })
  }

  getDependencies() {
    this._dependencies.getDependencies().subscribe((res: any) => {
      this.dependencies = res.data
    })
  }

  getInicial() {
    this.loading_stage = true;
    let params = {
      orderBy: this.orderBy,
      status: 'inicial'
    }
    this._work_orders.getForStage(params).subscribe((r: any) => {
      this.work_orders = r.data;
      this.loading_stage = false;
    })
  }

  search_person: OperatorFunction<string, readonly { text; value }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.people.filter((v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  formatter_person = (x: { text: string }) => x.text;

  assign() {
    console.log(this.form_assign.value);
    if (!this.form_assign.valid) {

    } else {
      this._work_orders.assignEngineering(this.form_assign.value).subscribe((r:any) => {

      })
    }

  }
}
