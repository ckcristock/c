import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, Subject } from 'rxjs';
import { PersonService } from '../../../ajustes/informacion-base/persons/person.service';
import { NegociosService } from '../negocios.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tareas-negocio',
  templateUrl: './tareas-negocio.component.html',
  styleUrls: ['./tareas-negocio.component.scss']
})
export class TareasNegocioComponent implements OnInit {
  public open: Subject<any> = new Subject;
  @ViewChild("modal") modal: any;
  @Input('tareas') tareas: any[];
  @Input('business_budget_id') business_budget_id: any;

  @Output("addTask") addTask = new EventEmitter();
  @Output("updateListTask") updateListTask = new EventEmitter();

  form: FormGroup
  status = null
  indexSelected: any
  peopleSelects: any[] = [];
  tasks: any[] = [];
  loading: boolean;



  constructor(private _people: PersonService, private _negocios: NegociosService,
    private fb: FormBuilder, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.getPeople()
    this.getTasks()
  }
  openModal() {
    this.open.next()
  }
  closeResult = '';
  public openConfirm(confirm) {
    /*
    this.indexSelected = index;
    this.indexSelected ? this.createForm(data) : this.createForm();
    this.modal.show()*/
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }
  getPeople() {
    this._people.getPeopleIndex().subscribe((r: any) => {
      this.peopleSelects = r.data;
      this.peopleSelects.unshift({ text: 'Seleccione', value: '' });
    });
  }
  getTasks() {
    this.loading = true
    this._negocios.getTasks(this.business_budget_id).subscribe((resp: any) => {
      this.tasks = resp.data.tasks;
      this.loading = false
    });
  }

  createForm() {

    this.form = this.fb.group({
      id: [''],
      business_budget_id: [this.business_budget_id],
      description: ['', Validators.required],
      person_id: ['', Validators.required],
      completed: [false]
    });
  }


  editTask(data, add) {
    this.openConfirm(add)
    this.form.patchValue({
      id: data.id,
      person_id: data.person_id,
      description: data.description,
      completed: data.completed
    });

  }



  saveTask() {
    if (this.form.get('id').value) {
      this._negocios.updateTask(this.form.value).subscribe((r: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Tarea creada con éxito',
          text: '',
        });
        this.updateListTask.emit();
        this.modalService.dismissAll();
      });
    } else {

      this._negocios.saveTask(this.form.value).subscribe((r: any) => {
        /*this.dataClear();*/
        Swal.fire({
          icon: 'success',
          title: 'Tarea creada con éxito',
          text: '',
        });
        this.updateListTask.emit();
        this.modalService.dismissAll();
      });
    }
  }
  /*
    createTask(){
      this.indexSelected? this.editTask.next({
        index: this.indexSelected,
        value:this.form.value
      }): this.addTask.next(this.form.value)
      this.status=null;
    }
  */
  /**
   * create de formulary of task
   * @param data ? on edit mode
   * @param index ? index of value
   */


  closeModal() {
    this.form.reset();
    this.modal.hide();
  }


}
