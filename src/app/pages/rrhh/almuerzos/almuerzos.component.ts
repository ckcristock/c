import { Component, OnInit, ViewChild } from '@angular/core';
import { AlmuerzosService } from './almuerzos.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ValorAlmuerzosService } from '../../ajustes/parametros/valor-almuerzos/valor-almuerzos.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-almuerzos',
  templateUrl: './almuerzos.component.html',
  styleUrls: ['./almuerzos.component.scss']
})
export class AlmuerzosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  masks = consts;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  @ViewChild('modal') modal: any;
  @ViewChild('modalVer') modalVer: any;
  @ViewChild('modalEdit') modalEdit: any;
  loading: boolean = false;
  form: FormGroup;
  peopleFill: any[] = [];
  people: any[] = [];
  lunches: any[] = [];
  lunch: any = {};
  lunch_id: any;
  pagination = {
    page: 1,
    pageSize: 15,
    collectionSize: 0
  }
  filtro = {
    date_start: '',
    date_end: '',
    person: '',

  }

  values: any = '';
  lunchValue: any;
  myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };
  donwloading = false;
  lunchvalues: any[] = [];
  groups: any[] = [];
  dependencies: any[] = [];
  value: any;
  person: any;
  id: any;

  constructor(
    private _almuerzo: AlmuerzosService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private _validator: ValidatorsService,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _person: PersonService,
    private modalService: NgbModal,
    private _modal: ModalService

  ) { }

  ngOnInit(): void {

    let fecha = new Date();
    let hoy = fecha.toISOString().split('T')[0];
    this.filtro.date_end = hoy;
    this.filtro.date_start = new Date(fecha.setDate(fecha.getDate() - 2))
      .toISOString()
      .split('T')[0];
    this.createForm();
    this.getPeople();
    this.getGroups();
    this.getLunchValues();
    this.getLunches();
  }

  closeResult = '';
  public openConfirm(confirm, size) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: size, scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset(); this.personList.clear()

  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  openValues(content) {
    this._modal.open(content, 'md')
  }

  getPeople() {
    this._almuerzo.getPeople().subscribe((data: any) => {
      this.peopleFill = data.data;
      this.peopleFill.unshift({ text: 'Todos', value: '' });
    })
  }

  openModal() {
    this.modal.show();
  }

  openModalVer() {
    this.modalVer.show();
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

  Dependencia_Cargo(dependencies) {
    this._person
      .getAll({ dependencies: [dependencies] })
      .subscribe((r: any) => {
        this.people = r.data;
        this.people.unshift({ value: '0', text: 'Todos' });
      });
  }

  getLunchValues() {
    this._almuerzo.getValues().subscribe((data: any) => {
      this.lunchvalues = data.data;
    })
  }

  inputFormatBandListValue(value: any) {
    if (value.text)
      return value.text
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.text;
  }

  /* formatter = (x: { code }) => x.code; */
  search: OperatorFunction<string, readonly { text }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.people
          .filter((state) => new RegExp(term, 'mi').test(state.text))
          .slice(0, 10)
      )
    );

  createForm() {
    this.form = this.fb.group({
      people_id: ['', Validators.required],
      people: this.fb.array([]),
      value: [0, Validators.required],
      group_id: [''],
      dependency_id: ['']
    });
  }

  /*   personControl(){
      let group = this.fb.group({
        name: [''],
        person_id: ['']
      });
      let value = this.form.get('fill_person').value;
      let name = value.text;
      let id = value.value;
      group.patchValue({
        name: name,
        person_id: id
      })
      return group;
    } */

  personControl(person_id, value) {
    let group = this.fb.group({
      person_id: person_id,
      value: value
    })
    return group;
  }

  get personList() {
    return this.form.get('people') as FormArray;
  }

  /*   createPerson(){
      let person = this.personList;
      person.push(this.personControl());
    } */

  /*   deletePerson(i){
      let person = this.personList;
      person.removeAt(i);
    } */

  /*   getPeople(){
      this._almuerzo.getPeople().subscribe((r:any) =>{
        this.people = r.data;
      })
    }
   */
  getLunches(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._almuerzo.getLunches(params).subscribe((r: any) => {
      this.lunches = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }


  createLunch() {
    this.form.value.people_id.forEach(el => {
      this.personList.push(this.personControl(el, this.form.value.value));
    });
    this._almuerzo.createLunch(this.form.value)
      .subscribe((r) => {
        //this.modal.hide();
        this.modalService.dismissAll();
        this.form.reset();
        this.personList.clear();
        this.getLunches();
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          timer: 1000,
          text: 'Almuerzo creado con éxito',
          showCancel: false
        });
      });
  }

  getLunchValu(value) {
    this.person = `${value.first_name} ${value.first_surname}`
    this.value = value.value;
    this.id = value.id;
  }

  editLunchValue() {
    this._almuerzo.edit(this.id, { value: this.value })
      .subscribe((r: any) => {
        this.getLunches();
        this.modalService.dismissAll();
        //this.modalEdit.hide();
        this._swal.show({
          icon: 'success',
          title: 'Operación exitosa',
          timer: 1000,
          text: 'Valor del almuerzo editado con éxito',
          showCancel: false
        });
      })
  }

  activateOrInactivate(id, state) {
    let data = {
      id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? 'El funcionario será anulado del almuerzo' : 'El almuerzo será activado al funcionario')
    }).then((r) => {
      if (r.isConfirmed) {
        this._almuerzo.activateOrInactivate(data).subscribe((r: any) => {
          this.getLunches();
          this._swal.show({
            icon: 'success',
            title: 'Proceso satisfactorio',
            text: (data.state == 'Inactivo' ? 'Funcionario anulado del almuerzo correctamente' : 'Se ha activado el almuerzo al funcionario correctamente'),
            showCancel: false,
            timer: 1000
          })
        });
      }
    })
  }

  Download() {
    // let params = this.getParams();
    let params = '';
    this.donwloading = true;
    let fechaInicio = this.filtro.date_start;
    let fechafin = this.filtro.date_end;
    this._almuerzo.Download(fechaInicio, fechafin, params).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte_almuerzos';
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

  get person_valid() {
    return this.form.get('people_id').invalid && this.form.get('people_id').touched;
  }

  get value_valid() {
    return this.form.get('value').invalid && this.form.get('value').touched;
  }

}
