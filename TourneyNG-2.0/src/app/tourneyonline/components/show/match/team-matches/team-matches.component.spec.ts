import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMatchesComponent } from './team-matches.component';

describe('TeamMatchesComponent', () => {
  let component: TeamMatchesComponent;
  let fixture: ComponentFixture<TeamMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
