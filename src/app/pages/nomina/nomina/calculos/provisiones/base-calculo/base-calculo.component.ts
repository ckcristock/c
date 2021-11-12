import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-calculo',
  templateUrl: './base-calculo.component.html',
  styleUrls: ['./base-calculo.component.scss']
})
export class BaseCalculoComponent implements OnInit {
  
  @Input('title') title
  @Input('icon') icon
  @Input('funcionario') funcionario 
  @Input('base') base

  conceptos:any [] = []
  cssBold: 'cssBold'
  constructor() { }

  ngOnInit(): void {
    this.organizarConceptos()

  }
  organizarConceptos() {
    for (let prop in this.base) {
      if (typeof this.base[prop] == 'object') {
        for (let novedad in this.base[prop]) {
          if (this.base[prop][novedad] > 0) {
            this.conceptos.push({
              concepto: novedad,
              valor: this.base[prop][novedad],
            })
          }
        }
        continue
      }
      if (this.base[prop] > 0) {
        this.conceptos.push({ concepto: prop, valor: this.base[prop] })
      }
    }
  }
}
