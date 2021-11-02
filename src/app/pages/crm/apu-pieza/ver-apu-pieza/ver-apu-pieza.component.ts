import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-apu-pieza',
  templateUrl: './ver-apu-pieza.component.html',
  styleUrls: ['./ver-apu-pieza.component.scss']
})
export class VerApuPiezaComponent implements OnInit {
  date: Date = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
