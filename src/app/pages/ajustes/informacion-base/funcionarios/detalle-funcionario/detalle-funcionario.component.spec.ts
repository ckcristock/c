import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFuncionarioComponent } from './detalle-funcionario.component';

describe('DetalleFuncionarioComponent', () => {
  let component: DetalleFuncionarioComponent;
  let fixture: ComponentFixture<DetalleFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
