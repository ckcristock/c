import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dias-trabajados',
  templateUrl: './dias-trabajados.component.html',
  styleUrls: ['./dias-trabajados.component.scss']
})
export class DiasTrabajadosComponent implements OnInit {

  @Input( 'novedadesDatos' ) novedadesDatos : any;
  @Input( 'salarioDatos' ) salarioDatos : any;
  diasNovedades : any[] = []
  constructor() { }

  ngOnInit(): void {
    this.organizarDias();
    
  }


  organizarDias() {
    
    for (let prop in this.novedadesDatos.novedades) {
      this.diasNovedades.push({
        concepto: prop,
        dias: this.novedadesDatos.novedades[prop],
      })
    }
  }
}
