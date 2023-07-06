import { Component, OnInit } from '@angular/core';


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
                    }
                  }
                }else{
                  if (val.urlAfterRedirects == _user.user.menu[i].child[j].child[k].link){
                  }
                }
              }
            } else {
              if(val.urlAfterRedirects == _user.user.menu[i].child[j].link){
              }

            }

          }
        }
      }
    })
  } */

  title = 'core';
}
