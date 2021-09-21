import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaticosTotalesComponent } from './viaticos-totales.component';

describe('ViaticosTotalesComponent', () => {
  let component: ViaticosTotalesComponent;
  let fixture: ComponentFixture<ViaticosTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaticosTotalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaticosTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
