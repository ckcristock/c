import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalProfileService {

  constructor(private http: HttpClient) { }

  getPersonalProfile() {
    return this.http.get(`${environment.base_url}/my-profile`)
  }
}
