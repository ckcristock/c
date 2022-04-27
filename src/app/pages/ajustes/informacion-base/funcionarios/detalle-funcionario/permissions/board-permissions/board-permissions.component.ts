import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BoardsService } from '../../../../services/boards.service';

@Component({
  selector: 'app-board-permissions',
  templateUrl: './board-permissions.component.html',
  styleUrls: ['./board-permissions.component.scss']
})
export class BoardPermissionsComponent implements OnInit {
  @Input('personId') personId: string = ''

  boards: any;
  boardsSelected: any;
  
  saving: boolean

  constructor(
    private _board: BoardsService,
    private _user: UserService) { }

  ngOnInit() {
    this.getBoardsWorked()
    this.getBoards()
  }
  getBoards() {
    this._board
      .getBoards({ owner: 1 })
      .toPromise()
      .then((b: any) => {
        this.boards = b.data;
      });
  }

  getBoardsWorked() {
    this._board
      .getPersonBoards(this.personId)
      .subscribe(
        (d: any) => {
          if (d.data.length != 0) {
            this.boardsSelected =
              d.data.reduce((acc, el) => [...acc, el.name_board]);
          } else if (d.data.length == 0) {
            this.boardsSelected = 'USUARIO SIN TABLETO ASIGNADO'
          }
        });
  }

  save() {
    this.saving = true;
    this._board
      .setBoards(this.personId, this.boardsSelected.id)
      .subscribe(r => {
        this.saving = false;
        this._user.user.person.id == this.personId ? location.reload() : null
      })
  }
}
