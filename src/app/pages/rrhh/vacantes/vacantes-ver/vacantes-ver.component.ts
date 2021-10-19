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
  applicants:any[] = []
  public job: any;

  constructor(
    private route: ActivatedRoute,
    private _job: JobService
  ) {
    this.id = this.route.snapshot.params["id"];
  }

  ngOnInit() {
    this.getApplicants();
    this.getJob()
  }

  getJob() {
    this._job.getJob(this.id).subscribe((r: any) => {
      this.job = r.data
    })
  }

  getApplicants(){
    this._job.getApplicants( {job_id:this.id} ).subscribe((r:any)=>{
      this.applicants = r.data
    })
  }
}
