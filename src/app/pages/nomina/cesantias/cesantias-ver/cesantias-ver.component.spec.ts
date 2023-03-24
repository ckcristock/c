/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CesantiasVerComponent } from './cesantias-ver.component';

describe('CesantiasVerComponent', () => {
  let component: CesantiasVerComponent;
  let fixture: ComponentFixture<CesantiasVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CesantiasVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CesantiasVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
