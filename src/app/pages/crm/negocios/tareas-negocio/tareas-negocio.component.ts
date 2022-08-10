import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
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
  @ViewChild("modal") modal: any;
  @Input('tareas') tareas: any[];
  @Input('business_budget_id') business_budget_id: any;

  @Output("addTask") addTask = new EventEmitter();
  @Output("updateListTask") updateListTask = new EventEmitter();

  form: FormGroup
  status = null
  indexSelected: any
  peopleSelects: any[] = [];
  tasks: any[];



  constructor(private _people: PersonService, private _negocios: NegociosService,
    private fb: FormBuilder, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.getPeople()
    this.getTasks()
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
  private getDismissReason(reason: any): string {
    this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  getPeople() {
    this._people.getPeopleIndex().subscribe((r: any) => {
      this.peopleSelects = r.data;
      this.peopleSelects.unshift({ text: 'Seleccione', value: '' });
    });
  }
  getTasks() {
    this._negocios.getTasks(this.business_budget_id).subscribe((resp: any) => {
      this.tasks = resp.data.data;
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
