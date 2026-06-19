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
  @Input() eliminatories: Array<Eliminatory> = [];

  // This will store our columns: Left wing columns go left-to-right, Right wing columns go right-to-left
  leftColumns: Array<Eliminatory[]> = [];
  rightColumns: Array<Eliminatory[]> = [];

  constructor(protected levelService: LevelService) 
  {
  }

  ngOnInit() {
    this.processTennisLayout();
  }

  processTennisLayout() {
    if (!this.eliminatories || this.eliminatories.length === 0) return;
    const sortedRoundIds : number[] = [];
    for( let i=0; i<this.eliminatories.length; i++ ) {
      sortedRoundIds.push(i+1);
    }
    this.leftColumns = [];
    this.rightColumns = [];

    const { left, right } = this.levelService.distributeSeeding(this.eliminatories);
    this.leftColumns.push(left);
    this.rightColumns.push(right);

    // For a tennis table, the right wing must have its columns reversed layout-wise 
    // so Semifinals sit close to the Grand Final, pushing larger rounds to the far right edge.
    this.rightColumns.reverse();
  }
}