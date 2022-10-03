/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResponsabilidadesFiscalesComponent } from './responsabilidades-fiscales.component';

describe('ResponsabilidadesFiscalesComponent', () => {
  let component: ResponsabilidadesFiscalesComponent;
  let fixture: ComponentFixture<ResponsabilidadesFiscalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsabilidadesFiscalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsabilidadesFiscalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
