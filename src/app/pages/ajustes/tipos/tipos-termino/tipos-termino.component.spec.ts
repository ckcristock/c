import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposTerminoComponent } from './tipos-termino.component';

describe('TiposTerminoComponent', () => {
  let component: TiposTerminoComponent;
  let fixture: ComponentFixture<TiposTerminoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposTerminoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposTerminoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
