import { Component, OnInit } from '@angular/core';
import { debounceTime, map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import {PersonService} from '../../ajustes/informacion-base/persons/person.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-fondo-empleado',
  templateUrl: './fondo-empleado.component.html',
  styleUrls: ['./fondo-empleado.component.scss'],
})
export class FondoEmpleadoComponent implements OnInit {

  petty_cash : any [] = [{text:'Caja uno', value:1}]
  people : any[] = []
  origins : any[] = []
  forma: FormGroup;

  constructor(private fb: FormBuilder,
	      private _people : PersonService) {}


  ngOnInit(): void {
    this.createForm();
    this.getPeople();
  }
  
  getPeople(){
    this._people.getAll({}).subscribe( (r:any) =>{
      this.people = r.data
    })
  }
  createForm() {
    this.forma = this.fb.group({
      type: [''],
      type_origin: [''],
      origin: [0],
      movement: [''],
      value: [''],
    });
    this.forma.get('type_origin').valueChanges.subscribe(r=>{
      this.origins = r == 'Caja' ? this.petty_cash : this.people;
      this.origins.unshift({text:'Seleccione',value:0})
      this.forma.patchValue({origin:0})
    })
  }
 formatter = (x: { text: string }) => x.text;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term:String) =>
        term.length < 3
          ? []
          : this.origins.filter(
              (v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 100)
      )
    );

}
