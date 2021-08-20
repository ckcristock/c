import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFuncionarioComponent } from './ver-funcionario.component';

describe('VerFuncionarioComponent', () => {
  let component: VerFuncionarioComponent;
  let fixture: ComponentFixture<VerFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
