import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LucianoComponent } from './luciano.component';

describe('LucianoComponent', () => {
  let component: LucianoComponent;
  let fixture: ComponentFixture<LucianoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LucianoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LucianoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
