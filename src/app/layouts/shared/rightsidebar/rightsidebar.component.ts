import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { TaskService } from 'src/app/pages/tasks/task.service';


@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})


export class RightsidebarComponent implements OnInit {
  public open: Subject<any> = new Subject;
  
  pendientes: any[] = [];
  loading: boolean;
  changes: any;
  constructor(
    public _task: TaskService,
    private _user: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getPersonTaskPendiente();
  }

  openModal() {
    this.open.next()
  }

  getPersonTaskPendiente() {
    this.loading = true;
    let params = {
      person_id: this._user.user.person.id,
      estado: 'Pendiente'
    }
    this._task
      .personTasks(params)
      .subscribe(
        (d: any) => {
          this.loading = false
          this.pendientes = d.data;
          for (let i in d.data) {
            this.pendientes[i].descripcion = this.sanitizer.bypassSecurityTrustHtml(atob(this.pendientes[i].descripcion))
          }
        });
  }

  route(id) {
    this.router.navigate(["task", id]);
  }

  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

}
