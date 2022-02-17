import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tablafacturascargadas',
  templateUrl: './tablafacturascargadas.component.html',
  styleUrls: ['./tablafacturascargadas.component.scss']
})
export class TablafacturascargadasComponent implements OnInit {
  @Input() Facturas;
  constructor() { }

  ngOnInit(): void {
  }

}
