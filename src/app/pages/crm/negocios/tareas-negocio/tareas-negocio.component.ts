import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-tareas-negocio',
  templateUrl: './tareas-negocio.component.html',
  styleUrls: ['./tareas-negocio.component.scss']
})
export class TareasNegocioComponent implements OnInit {
  @ViewChild("modal") modal:any;
  @Input('tareas') tareas:any[];

  @Output("addTask") addTask = new EventEmitter();
  @Output("editTask") editTask = new EventEmitter();

  form:FormGroup
  status=null
  indexSelected:any

  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm(data?) {
    this.status = data? 'edit':null
    this.form = this.fb.group({
      id:[data?.id||''],
      description: [data?.description || '', Validators.required],
      responsable: [data?.responsable || '', Validators.required],
      completed:[data?.completed|| false]
    });
  }

  createTask(){
    this.indexSelected? this.editTask.next({
      index: this.indexSelected,
      value:this.form.value
    }): this.addTask.next(this.form.value)
    this.status=null;
  }

  /**
   * create de formulary of task
   * @param data ? on edit mode
   * @param index ? index of value
   */
  open(data?, index=null){
    this.indexSelected= index;
    this.indexSelected?this.createForm(data):this.createForm();
    this.modal.show()
  }
 
}
