import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSocialFuncionarioConfigComponent } from './s-social-funcionario-config.component';

describe('SSocialFuncionarioConfigComponent', () => {
  let component: SSocialFuncionarioConfigComponent;
  let fixture: ComponentFixture<SSocialFuncionarioConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SSocialFuncionarioConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SSocialFuncionarioConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
