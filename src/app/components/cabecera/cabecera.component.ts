import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit {

  @Input() datosCabecera: any;

  constructor( private http: HttpClient) { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges){
    if (changes.datosCabecera.previousValue != undefined) {
      this.datosCabecera = changes.datosCabecera.currentValue;
    }
  }

}
