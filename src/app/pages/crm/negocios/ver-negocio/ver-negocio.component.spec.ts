import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerNegocioComponent } from './ver-negocio.component';

describe('VerNegocioComponent', () => {
  let component: VerNegocioComponent;
  let fixture: ComponentFixture<VerNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerNegocioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
