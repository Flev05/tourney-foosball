import { Component, OnInit, Input } from '@angular/core';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

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
  grandFinal: Eliminatory | null = null;

  ngOnInit() {
    this.processTennisLayout();
  }

  processTennisLayout() {
    if (!this.eliminatories || this.eliminatories.length === 0) return;

    // 1. Group the already sorted eliminatories by Round ID
    const roundGroupsMap = new Map<number, Eliminatory[]>();
    this.eliminatories.forEach(item => {
      const rId = item.round.id;
      if (!roundGroupsMap.has(rId)) {
        roundGroupsMap.set(rId, []);
      }
      roundGroupsMap.get(rId)!.push(item);
    });

    // Sort round IDs descending (e.g., Round of 16 -> Quarters -> Semis -> Final)
    const sortedRoundIds = Array.from(roundGroupsMap.keys()).sort((a, b) => b - a);

    this.leftColumns = [];
    this.rightColumns = [];
    this.grandFinal = null;

    // 2. Process each round column
    sortedRoundIds.forEach((roundId, index) => {
      const rawRoundMatches = roundGroupsMap.get(roundId) || [];

      // If it's the solitary final match at the end of the chain
      if (rawRoundMatches.length === 1 && index === sortedRoundIds.length - 1) {
        this.grandFinal = rawRoundMatches[0];
        return;
      }

      // Reorder this specific round using your Left/Right alternating seeding algorithm
      const { left, right } = this.distributeSeeding(rawRoundMatches);

      this.leftColumns.push(left);
      this.rightColumns.push(right);
    });

    // For a tennis table, the right wing must have its columns reversed layout-wise 
    // so Semifinals sit close to the Grand Final, pushing larger rounds to the far right edge.
    this.rightColumns.reverse();
  }

  /**
   * Distributes a pre-sorted array into Left and Right arrays using the tournament tree pattern:
   * 1st -> Left Top, 2nd -> Right Top, 3rd -> Left Middle/Bottom, 4th -> Right Middle/Bottom...
   */
  private distributeSeeding(sortedMatches: Eliminatory[]): { left: Eliminatory[], right: Eliminatory[] } {
    const leftSide: Eliminatory[] = [];
    const rightSide: Eliminatory[] = [];

    // Temporary arrays to manage top-to-bottom filling sequences
    const totalCount = sortedMatches.length;
    const halfCount = totalCount / 2;
    
    const orderedLeft = new Array<Eliminatory>(halfCount);
    const orderedRight = new Array<Eliminatory>(halfCount);

    // This sequence generates the exact slot tracking index (0, 4, 2, 6, 1, 5, 3, 7...) 
    // ensuring items insert into the structural "middle" iteratively
    let leftIndexTracker = this.getBracketPositions(halfCount);
    let rightIndexTracker = this.getBracketPositions(halfCount);

    let leftIdx = 0;
    let rightIdx = 0;

    for (let i = 0; i < totalCount; i++) {
      if (i % 2 === 0) {
        // Even indexes (0, 2, 4...) go to the Left Wing
        const targetPos = leftIndexTracker[leftIdx++];
        orderedLeft[targetPos] = sortedMatches[i];
      } else {
        // Odd indexes (1, 3, 5...) go to the Right Wing
        const targetPos = rightIndexTracker[rightIdx++];
        orderedRight[targetPos] = sortedMatches[i];
      }
    }

    return {
      left: orderedLeft.filter(el => el !== undefined),
      right: orderedRight.filter(el => el !== undefined)
    };
  }

  // Helper generator to map standard index loops into balanced spatial tree positions
  private getBracketPositions(n: number): number[] {
    const mapping = new Array<number>(n);
    if (n === 1) return [0];
    
    let order = [0];
    while (order.length < n) {
      const nextOrder: number[] = [];
      for (let i = 0; i < order.length; i++) {
        nextOrder.push(order[i]);
        nextOrder.push(order[i] + order.length * 2); // Split calculation
      }
      order = nextOrder;
    }
    
    // Normalize order values to valid index arrays up to N items
    const sorted = [...order].sort((a,b) => a-b);
    return order.map(x => sorted.indexOf(x));
  }
}