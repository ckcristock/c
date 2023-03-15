import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reload-button',
  templateUrl: './reload-button.component.html',
  styleUrls: ['./reload-button.component.scss']
})
export class ReloadButtonComponent implements OnInit {
  @Input('reload') reload: boolean;
  @Output('reloadData') reloadDataEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  reloadData() {
    this.reloadDataEvent.emit()
  }

}
