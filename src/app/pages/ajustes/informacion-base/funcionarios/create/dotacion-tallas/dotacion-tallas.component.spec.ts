import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacionTallasComponent } from './dotacion-tallas.component';

describe('DotacionTallasComponent', () => {
  let component: DotacionTallasComponent;
  let fixture: ComponentFixture<DotacionTallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotacionTallasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotacionTallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
