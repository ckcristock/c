import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-base-calculos',
  templateUrl: './base-calculos.component.html',
  styleUrls: ['./base-calculos.component.scss']
})

export class BaseCalculosComponent implements OnInit {
  data = {
    administracion: undefined, 
    imprevistos: undefined,
    utilidad: undefined, 
    trm: undefined,
    valor_minuto_corte_laser: undefined,
    valor_minuto_corte_agua: undefined
  }

  constructor() { }

  ngOnInit(): void {
  }

  guardar(form: NgForm){
    console.log({form, data:this.data})
  }

}
