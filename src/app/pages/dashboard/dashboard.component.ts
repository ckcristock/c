import { Component, OnInit } from '@angular/core';
/* import { UserService } from 'src/app/core/services/user.service';
import { BoardsService } from '../ajustes/informacion-base/services/boards.service';
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    /* private _board: BoardsService,
    private _user: UserService */
  ) { }

  ngOnInit(): void {
    /* this.getBoardsWorked(); */
  }
  /* personId = this._user.user.person.id;
  board: any;
  getBoardsWorked() {
    this._board
      .getPersonBoards(this.personId)
      .subscribe(
        (d: any) => {
          //console.log(d)
          if (d.data.length == 0){
            this.board = 0
          } else {
            for (let i in d.data){
              this.board = d.data[i].id
            }
          }          
          //console.log(this.board)
        });
  } */
}
