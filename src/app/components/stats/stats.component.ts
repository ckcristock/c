import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
   @Input('icon') icon
   @Input('value') value
   @Input('title') title

  constructor() { }

  ngOnInit(): void {
    console.log('asdasd');
    
  }

}
