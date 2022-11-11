import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit, OnChanges {

  @Input() datosCabecera: any;
  Empresa : {
    logo:'',
    tin:'',
    name:'',
    dv:''
  };

  constructor( private http: HttpClient, private _user: UserService) {
    this.Empresa = this._user.user.person.company_worked;
   }

  ngOnInit() {
    
  }

  ngOnChanges(changes:SimpleChanges){
    if (changes.datosCabecera.previousValue != undefined) {
      this.datosCabecera = changes.datosCabecera.currentValue;
    }
  }

}