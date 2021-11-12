import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometriasComponent } from './geometrias.component';

describe('GeometriasComponent', () => {
  let component: GeometriasComponent;
  let fixture: ComponentFixture<GeometriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeometriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
