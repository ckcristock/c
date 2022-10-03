/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResolucionesxvencerComponent } from './resolucionesxvencer.component';

describe('ResolucionesxvencerComponent', () => {
  let component: ResolucionesxvencerComponent;
  let fixture: ComponentFixture<ResolucionesxvencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolucionesxvencerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolucionesxvencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
