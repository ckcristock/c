import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetFuncionarioComponent } from './set-funcionario.component';

describe('SetFuncionarioComponent', () => {
  let component: SetFuncionarioComponent;
  let fixture: ComponentFixture<SetFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
