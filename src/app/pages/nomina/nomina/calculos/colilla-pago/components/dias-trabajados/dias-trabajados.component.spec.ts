import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasTrabajadosComponent } from './dias-trabajados.component';

describe('DiasTrabajadosComponent', () => {
  let component: DiasTrabajadosComponent;
  let fixture: ComponentFixture<DiasTrabajadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiasTrabajadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiasTrabajadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
