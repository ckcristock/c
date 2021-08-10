import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosFuncionarioComponent } from './datos-funcionario.component';

describe('DatosFuncionarioComponent', () => {
  let component: DatosFuncionarioComponent;
  let fixture: ComponentFixture<DatosFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
