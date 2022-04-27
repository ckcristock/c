/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FiltrosgeneralesauditorComponent } from './filtrosgeneralesauditor.component';

describe('FiltrosgeneralesauditorComponent', () => {
  let component: FiltrosgeneralesauditorComponent;
  let fixture: ComponentFixture<FiltrosgeneralesauditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosgeneralesauditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosgeneralesauditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
