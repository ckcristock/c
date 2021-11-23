import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteLaserMaterialComponent } from './corte-laser-material.component';

describe('CorteLaserMaterialComponent', () => {
  let component: CorteLaserMaterialComponent;
  let fixture: ComponentFixture<CorteLaserMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteLaserMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteLaserMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
