import { Injectable, NgZone } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from "../models/users.model";
import { LoginForm } from '../interfaces/login-form.interface';




const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})

export class UserService {

    public user: User;

    constructor(private http: HttpClient,
        private router: Router,
        private ngZone: NgZone,
        // private getMenu:
    ) {

    }

    get token(): string {
        return localStorage.getItem('token') || '';
    }


    guardarLocalStorage(token: string) {
        localStorage.setItem('token', token);
    }
    validarToken(): Observable<boolean> {
        return this.http.get(`${base_url}/auth/renew`, {
        }).pipe(
            map((resp: any) => {
                
                const { id, usuario, change_password, person, menu } = resp.user;
                this.user = new User(id, usuario, change_password, person, menu);
                this.guardarLocalStorage(resp.token);
                return true;
            }),
            catchError(error => of(false))
        );
    }

    logout() {
        localStorage.removeItem('token');

        this.router.navigateByUrl('/login');
    }

    login(formData: LoginForm) {
        return this.http.post(`${base_url}/auth/login`, formData)
            .pipe(
                tap((resp: any) => {
                    /* const { id, usuario, change_password, funcionario } = resp.user;
                    this.user = new User(id, usuario, change_password, funcionario); */
                    this.guardarLocalStorage(resp.token);
                })
            );

    }

    changePassword(params) {
        return this.http.get(`${base_url}/auth/change-password`, { params })
    }
}