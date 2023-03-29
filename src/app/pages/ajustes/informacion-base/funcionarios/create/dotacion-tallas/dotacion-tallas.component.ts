import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { consts } from 'src/app/core/utils/consts';
import { PersonService } from '../../../services/person.service';
import { PersonDataService } from '../personData.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../../services/swal.service';

@Component({
  selector: 'app-dotacion-tallas',
  templateUrl: './dotacion-tallas.component.html',
  styleUrls: ['./dotacion-tallas.component.scss']
})
export class DotacionTallasComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();
  saving = false;

  shirtSize = consts.shirtSize;
  pantSizes = consts.pantSizes;
  shueSizes = consts.shueSizes;
  formDotation: FormGroup

  person:any
  $person: Subscription;

  constructor(
    private _personData: PersonDataService,
    private _person:PersonService,
    private fb: FormBuilder,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.shirtSize.unshift({text:'Seleccione',value:''})
    this.pantSizes.unshift({text:'Seleccione',value:''})
    this.shueSizes.unshift({text:'Seleccione',value:''})

    this.$person = this._personData.person.subscribe(r => {
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
    //this.formDotation.markAllAsTouched();
    if(this.formDotation.invalid){return false}
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Vamos a crear un nuevo funcionario',
    }).then(result => {
      if (result.value) {
        this.sendData()
      }
    });
  }

  sendData(){

    this.saving = true;
    this.person =  {...this.person,...this.formDotation.value }
    this._person.savePerson({person:this.person}).subscribe( (r:any )=>{
      this.person.id = r.data.id
      this._personData.person.next(this.person);
      this.siguiente.emit({});
      this.saving = false;
    },err=>{

    })
  }
  previus(){
    this.anterior.emit()
  }
  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }
}
