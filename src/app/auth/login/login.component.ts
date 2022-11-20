import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  log_in: boolean = false
  show: boolean = false;
  // set the currenr year
  year: number = new Date().getFullYear();
  constructor(private formBuilder: FormBuilder,
    private _user: UserService,
    private router: Router,
    private _swal: SwalService
  ) { }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.loginForm = this.formBuilder.group({
      user: [localStorage.getItem('user') || '', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [localStorage.getItem('user') ? true : false]
    });

  }

  password() {
    this.show = !this.show;
  }

  onSubmit() {
    this.submitted = true;

    this._user.login(this.loginForm.value)
      .subscribe(resp => {
        this.log_in = false
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('user', this.loginForm.get('user').value);
        } else {
          localStorage.removeItem('user');
        }

        // Navegar al Dashboard
        this.router.navigateByUrl('/');
        this.log_in = true
      }, (err) => {
        // Si sucede un error
        this.log_in = false
        this._swal.show({
          icon: 'error',
          title: 'Error iniciando sesión',
          text: 'Revisa tus credenciales e inténtalo de nuevo',
          showCancel: false
        })
      });


  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

}
