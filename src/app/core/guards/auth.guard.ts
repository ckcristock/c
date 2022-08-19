import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { UserService } from '../services/user.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private _user: UserService,
        private router: Router) { }

    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this._user.validarToken()
            .pipe(
                tap(estaAutenticado => {
                    if (!estaAutenticado) {
                        this.router.navigateByUrl('/login');
                    }
                })
            );
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {

        return this._user.validarToken()
            .pipe(
                tap(estaAutenticado => {
                    if (!estaAutenticado) {
                        this.router.navigateByUrl('/login');
                    }
                })
            );

    }

    /* canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        console.log(state.url)
        if(state.url != 'login' && state.url != '' && state.url !='/' && state.url != 'notauthorized'){
            let permiso = this.sacarMenu(this._user.user.menu, state)
            if (!permiso){
                this.router.navigateByUrl('/notauthorized');
            }
            return permiso
        } else {
            return true
        }
        
        
    }
    estado: any
    public sacarMenu(menu, state) {
        for (let i in menu) {
            //console.log(menu)
            if (menu[i]['child'].length > 0) {
                this.sacarMenu(menu[i]['child'], state)
            } else {
                if (menu[i]['link']) {
                    if (state.url.split('?')[0].match(menu[i]['link'])) {
                        this.estado =  true
                        break
                    } 
                } 

            }
        }
        //console.log(this.estado)
        return this.estado
    } */

}