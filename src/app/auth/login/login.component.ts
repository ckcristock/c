import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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

  // set the currenr year
  year: number = new Date().getFullYear();
  constructor(private formBuilder: FormBuilder,
    private _user: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.loginForm = this.formBuilder.group({
      user: [localStorage.getItem('user') || '', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [ localStorage.getItem('user') ? true : false]
    });

  }


  onSubmit() {
    this.submitted = true;

    this._user.login(this.loginForm.value)
       .subscribe(resp => { 

        if (this.loginForm.get('remember').value) {
          localStorage.setItem('user', this.loginForm.get('user').value);
        } else {
          localStorage.removeItem('user');
        }

        // Navegar al Dashboard
        this.router.navigateByUrl('/');

       }, (err) => { 
        // Si sucede un error
        console.log(err);
        
         Swal.fire('Error', 'Credenciales incorrectas', 'error'); 
       }); 


  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

}
