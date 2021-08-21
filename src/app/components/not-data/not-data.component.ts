import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-data',
  templateUrl: './not-data.component.html',
  styleUrls: ['./not-data.component.scss']
})
export class NotDataComponent implements OnInit {
  @Input('loading') loading;
  constructor() { }

  ngOnInit(): void {
  }

}
