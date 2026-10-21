import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerChooserComponent } from './player-chooser.component';

describe('PlayerChooserComponent', () => {
  let component: PlayerChooserComponent;
  let fixture: ComponentFixture<PlayerChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
