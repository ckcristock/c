import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcomodarActaComponent } from './acomodar-acta.component';

describe('AcomodarActaComponent', () => {
  let component: AcomodarActaComponent;
  let fixture: ComponentFixture<AcomodarActaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcomodarActaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcomodarActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
