/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoardJefeBodegaComponent } from './board-jefe-bodega.component';

describe('BoardJefeBodegaComponent', () => {
  let component: BoardJefeBodegaComponent;
  let fixture: ComponentFixture<BoardJefeBodegaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardJefeBodegaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardJefeBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
