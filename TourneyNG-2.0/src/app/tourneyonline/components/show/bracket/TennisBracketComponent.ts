import { Component, OnInit, Input } from '@angular/core';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { LevelService } from '../../admin/eliminatory/level-service';

@Component({
  selector: 'app-tennis-bracket',
  templateUrl: './tennis-bracket-component.html',
  styleUrls: ['./tennis-bracket-component.css'],
  standalone: false
})
export class TennisBracketComponent implements OnInit {
  @Input() eliminatories: Eliminatory[] = [];

  // This will store our columns: Left wing columns go left-to-right, Right wing columns go right-to-left
  leftColumns: Eliminatory[] = [];
  rightColumns: Eliminatory[] = [];

  constructor(protected levelService: LevelService) 
  {
  }

  ngOnInit() {
    this.processTennisLayout();
  }

  processTennisLayout() {
      if (!this.eliminatories || this.eliminatories.length === 0) return;
      this.leftColumns = [];
      this.rightColumns = [];

      const sortedList = this.eliminatories;

      // Split them down the middle for your HTML template loops!
      this.leftColumns = sortedList.slice(0, sortedList.length / 2);
      this.rightColumns = sortedList.slice(sortedList.length / 2);
  }
}