import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../job.service';

@Component({
  selector: 'app-vacantes-ver',
  templateUrl: './vacantes-ver.component.html',
  styleUrls: ['./vacantes-ver.component.scss']
})
export class VacantesVerComponent implements OnInit {
  id = ''
  loading = false
  postulados:any = []
  public job: any = [];

  constructor(
    private route: ActivatedRoute,
    private _job: JobService
  ) {
    this.id = this.route.snapshot.params["id"];
  }

  ngOnInit() {
    this.getJob()
  }

  getJob() {
    this._job.getJob(this.id).subscribe((r: any) => {
      this.job = r.data
    })
  }
}
