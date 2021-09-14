import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalprestamoylibranzacrearComponent } from './modalprestamoylibranzacrear.component';

describe('ModalprestamoylibranzacrearComponent', () => {
  let component: ModalprestamoylibranzacrearComponent;
  let fixture: ComponentFixture<ModalprestamoylibranzacrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalprestamoylibranzacrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalprestamoylibranzacrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
