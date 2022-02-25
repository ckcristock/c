import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacionCrearComponent } from './dotacion-crear.component';

describe('DotacionCrearComponent', () => {
  let component: DotacionCrearComponent;
  let fixture: ComponentFixture<DotacionCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotacionCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotacionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
