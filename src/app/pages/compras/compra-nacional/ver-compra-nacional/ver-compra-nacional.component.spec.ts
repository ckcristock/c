import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCompraNacionalComponent } from './ver-compra-nacional.component';

describe('VerCompraNacionalComponent', () => {
  let component: VerCompraNacionalComponent;
  let fixture: ComponentFixture<VerCompraNacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerCompraNacionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCompraNacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
