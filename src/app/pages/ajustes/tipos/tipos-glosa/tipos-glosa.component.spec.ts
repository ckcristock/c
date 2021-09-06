import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposGlosaComponent } from './tipos-glosa.component';

describe('TiposGlosaComponent', () => {
  let component: TiposGlosaComponent;
  let fixture: ComponentFixture<TiposGlosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposGlosaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposGlosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
