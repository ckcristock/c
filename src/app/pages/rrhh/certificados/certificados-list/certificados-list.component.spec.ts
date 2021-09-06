import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosListComponent } from './certificados-list.component';

describe('CertificadosListComponent', () => {
  let component: CertificadosListComponent;
  let fixture: ComponentFixture<CertificadosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
