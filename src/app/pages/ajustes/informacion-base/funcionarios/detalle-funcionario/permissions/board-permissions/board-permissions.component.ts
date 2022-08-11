import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BoardsService } from '../../../../services/boards.service';
import { SwalService } from '../../../../services/swal.service';

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
    private _swal: SwalService,
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
        console.log(this.boards)
      });
  }

  getBoardsWorked() {
    this._board
      .getPersonBoards(this.personId)
      .subscribe(
        (d: any) => {
          this.boardsSelected = d.data[0].board_id
        });
  }

  save() {
    this.saving = true;
    this._board
      .setBoards(this.personId, this.boardsSelected)
      .subscribe(r => {
        this.saving = false;
        this._swal.show({
          icon: 'success',
          title: 'Correcto',
          text: ('Tablero asignado con éxito'),
          showCancel: false
        });
        //this._user.user.person.id == this.personId ? location.reload() : null
      })
  }
}
