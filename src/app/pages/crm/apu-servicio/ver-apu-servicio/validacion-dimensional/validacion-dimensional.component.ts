import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validacion-dimensional',
  templateUrl: './validacion-dimensional.component.html',
  styleUrls: ['./validacion-dimensional.component.scss']
})
export class ValidacionDimensionalComponent implements OnInit {
  @Input('data') dimensional_validation;
  collapsed:boolean[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
