import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaFuncionarioComponent } from './prima-funcionario.component';

describe('PrimaFuncionarioComponent', () => {
  let component: PrimaFuncionarioComponent;
  let fixture: ComponentFixture<PrimaFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
