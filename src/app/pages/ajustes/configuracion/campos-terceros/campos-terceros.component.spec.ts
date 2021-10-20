import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamposTercerosComponent } from './campos-terceros.component';

describe('CamposTercerosComponent', () => {
  let component: CamposTercerosComponent;
  let fixture: ComponentFixture<CamposTercerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamposTercerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamposTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
