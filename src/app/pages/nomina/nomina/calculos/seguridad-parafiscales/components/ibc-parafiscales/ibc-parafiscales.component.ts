import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ibc-parafiscales',
  templateUrl: './ibc-parafiscales.component.html',
  styleUrls: ['./ibc-parafiscales.component.scss']
})
export class IbcParafiscalesComponent implements OnInit {
  @Input('ibcParafiscales') ibcParafiscales
  parafiscales: any [] = []
  ibc:any [] = []
  bold = 'bold'
  
  constructor() { }
  ngOnInit(): void {
    this.parafiscales = this.ibcParafiscales
    this.organizarParafiscales()
  }

  organizarParafiscales() {
    for (let propiedad in this.parafiscales) {
      if (this.parafiscales[propiedad] > 0) {
        this.ibc.push({
          concepto: propiedad,
          valor: this.parafiscales[propiedad],
        })
      }
    }
  }
}
