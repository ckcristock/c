import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadParafiscalesComponent } from './seguridad-parafiscales.component';

describe('SeguridadParafiscalesComponent', () => {
  let component: SeguridadParafiscalesComponent;
  let fixture: ComponentFixture<SeguridadParafiscalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguridadParafiscalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguridadParafiscalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
