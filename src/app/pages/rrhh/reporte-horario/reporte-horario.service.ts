import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteHorarioService {

  constructor( private http:HttpClient) { }
  getFixedTurnsDiaries( date1, date2, params ){
    return this.http.get(`${environment.base_url}/reporte/horarios/${date1}/${date2}/turno_fijo`,{params})
        .pipe(map((d:any)=>{
          d.data.forEach(company => {
            company.groups.forEach(group => {
              group.dependencies.forEach(dependency => {
                dependency.people.forEach(person => {
                  person.totalHours = 0;
                  person.diaries.forEach(diary => {
                    person.totalHours += parseFloat(diary.working_hours) ;
                  })
                })
              })
            })
          });
          
          return d
        }))
  }
}
