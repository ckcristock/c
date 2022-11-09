import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesConfigComponent } from './novedades-config.component';

describe('NovedadesConfigComponent', () => {
  let component: NovedadesConfigComponent;
  let fixture: ComponentFixture<NovedadesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovedadesConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
