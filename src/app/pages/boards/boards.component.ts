import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BoardsService } from '../ajustes/informacion-base/services/boards.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  loading: boolean
  constructor(
    private _board: BoardsService,
    private _user: UserService
  ) { }

  ngOnInit() {
    this.getBoardsWorked();
  }
  personId = this._user.user.person.id;
  board: any;
  getBoardsWorked() {
    this.loading = true
    this._board
      .getPersonBoards(this.personId)
      .subscribe(
        (d: any) => {
          this.loading = false
          this.board = d.data[0].board_id                   
          //console.log(this.board)
        });
  }
}
