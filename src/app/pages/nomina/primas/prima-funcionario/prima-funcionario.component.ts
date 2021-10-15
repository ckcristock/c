import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prima-funcionario',
  templateUrl: './prima-funcionario.component.html',
  styleUrls: ['./prima-funcionario.component.scss']
})
export class PrimaFuncionarioComponent implements OnInit {
  loading:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
