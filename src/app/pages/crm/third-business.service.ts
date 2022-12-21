import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThirdBusinessService {
  private subject = new Subject<any>();

  constructor() { }
  sendMessage(message: any) {
    this.subject.next(message);
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
