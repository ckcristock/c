/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardreportesComponent } from './cardreportes.component';

describe('CardreportesComponent', () => {
  let component: CardreportesComponent;
  let fixture: ComponentFixture<CardreportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardreportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardreportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
