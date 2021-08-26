import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  
  active=1;
  constructor() { }

  ngOnInit(): void {
  }

}
