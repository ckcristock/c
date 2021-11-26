import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesApuComponent } from './perfiles-apu.component';

describe('PerfilesApuComponent', () => {
  let component: PerfilesApuComponent;
  let fixture: ComponentFixture<PerfilesApuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilesApuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilesApuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
