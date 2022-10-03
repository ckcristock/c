/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TiposRegimenComponent } from './tipos-regimen.component';

describe('TiposRegimenComponent', () => {
  let component: TiposRegimenComponent;
  let fixture: ComponentFixture<TiposRegimenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposRegimenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposRegimenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
