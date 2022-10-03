/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoardNominaComponent } from './board-nomina.component';

describe('BoardNominaComponent', () => {
  let component: BoardNominaComponent;
  let fixture: ComponentFixture<BoardNominaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardNominaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
