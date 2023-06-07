import { Component, OnInit } from '@angular/core';
import { PersonalProfileService } from './personal-profile.service';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit {
  loading: boolean = false;
  person: any;

  constructor(
    private _personalProfile: PersonalProfileService
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.loading = true;
    this._personalProfile.getPersonalProfile().subscribe((res: any) => {
      this.person = res.data;
      this.loading = false;
    })
  }


}
