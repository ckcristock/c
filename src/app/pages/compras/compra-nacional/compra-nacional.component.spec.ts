import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraNacionalComponent } from './compra-nacional.component';

describe('CompraNacionalComponent', () => {
  let component: CompraNacionalComponent;
  let fixture: ComponentFixture<CompraNacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraNacionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraNacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
