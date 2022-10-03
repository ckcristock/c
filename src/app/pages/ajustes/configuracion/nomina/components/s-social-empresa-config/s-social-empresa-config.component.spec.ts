import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSocialEmpresaConfigComponent } from './s-social-empresa-config.component';

describe('SSocialEmpresaConfigComponent', () => {
  let component: SSocialEmpresaConfigComponent;
  let fixture: ComponentFixture<SSocialEmpresaConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SSocialEmpresaConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SSocialEmpresaConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
