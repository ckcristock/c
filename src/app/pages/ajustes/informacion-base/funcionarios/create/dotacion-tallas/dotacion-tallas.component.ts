import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { consts } from 'src/app/core/utils/consts';
import { PersonDataService } from '../personData.service';

@Component({
  selector: 'app-dotacion-tallas',
  templateUrl: './dotacion-tallas.component.html',
  styleUrls: ['./dotacion-tallas.component.scss']
})
export class DotacionTallasComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();

  shirtSize = consts.shirtSize;
  pantSizes = consts.pantSizes;
  shueSizes = consts.shueSizes;

  formDotation: FormGroup

  person:any
  $person: Subscription;

  constructor(
    private _person: PersonDataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.shirtSize.unshift({text:'Seleccione',value:''})
    this.pantSizes.unshift({text:'Seleccione',value:''})
    this.shueSizes.unshift({text:'Seleccione',value:''})

    this.$person = this._person.person.subscribe(r => {
       this.person=r
    })
  }

  createForm() {
    this.formDotation = this.fb.group({
      shirt_size: ['', Validators.required],
      pants_size: ['', Validators.required],
      shue_size: ['', Validators.required],
    })
  }

  get shirt_size_invalid() {
    return (
      this.formDotation.get('shirt_size').invalid && this.formDotation.get('shirt_size').touched
    );
  }
  get pants_size_invalid() {
    return (
      this.formDotation.get('pants_size').invalid && this.formDotation.get('pants_size').touched
    );
  }
  get shue_size_invalid() {
    return (
      this.formDotation.get('shue_size').invalid && this.formDotation.get('shue_size').touched
    );
  }

  save(){
    this.formDotation.markAllAsTouched();
    this.person =  {...this.person,...this.formDotation.value }
    
    this._person.person.next(this.person);
    this.siguiente.emit({});
    
  }
  previus(){
    this.anterior.emit()
  }
  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }
}
