import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacionEntradasComponent } from './dotacion-entradas.component';

describe('DotacionEntradasComponent', () => {
  let component: DotacionEntradasComponent;
  let fixture: ComponentFixture<DotacionEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotacionEntradasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotacionEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
