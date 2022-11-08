import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-task',
  templateUrl: './card-task.component.html',
  styleUrls: ['./card-task.component.scss']
})
export class CardTaskComponent implements OnInit {
  @Input('list') list;
  @Input('view_state') view_state = false;
  constructor() { }

  ngOnInit(): void {
  }

}
