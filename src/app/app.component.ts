import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /* constructor(private router: Router,private _user: UserService,){
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd){
        for(let i in _user.user.menu){
          for(let j in _user.user.menu[i].child){
            if(!_user.user.menu[i].child[j].link){
              for (let k in _user.user.menu[i].child[j].child){
                if(!_user.user.menu[i].child[j].child[k].link){
                  for (let m in _user.user.menu[i].child[j].child[k].child){
                    if(val.urlAfterRedirects == _user.user.menu[i].child[j].child[k].child[m].link){
                      console.warn('Igualito')
                    }
                  }
                }else{
                  if (val.urlAfterRedirects == _user.user.menu[i].child[j].child[k].link){
                    console.warn('Igualito 2')
                  }                  
                }                
              }
            } else {
              if(val.urlAfterRedirects == _user.user.menu[i].child[j].link){
                console.warn('Igualito 3')
              }
              
            }
            
          }
        }
      }      
    })
  } */

  title = 'core';
}
