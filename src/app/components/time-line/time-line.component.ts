import { Component, OnInit, Input } from '@angular/core';
import { History } from 'src/app/core/interfaces/history.interface';
import { TimeLine } from 'src/app/core/interfaces/time-line.interface';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {
  @Input('data') data:Array<History>;
  constructor() { }

  ngOnInit(): void {
  }

}
