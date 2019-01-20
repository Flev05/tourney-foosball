import { Component, OnInit } from '@angular/core';
import { LevelService } from './level-service';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryMode } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';

@Component({
    templateUrl: './level-listview.html'   
})
export class LevelListView implements OnInit {

    selectedTourney: Tourney;
    teamsCombobox: Combobox[];
    selectedTeamsNumCombobox: Combobox;
    eliminatoryMode: EliminatoryMode;
    cols: TableCols[];
    rows: any[];
    selectedRow: any;

    constructor(
        protected levelService: LevelService,
    ) {
    }

    ngOnInit() {
        this.levelService.ngOnInit();

        this.selectedTourney = this.levelService.selectedTourney;
        this.teamsCombobox = this.levelService.teamsCombobox;

        this.eliminatoryMode = this.levelService.eliminatoryMode;
        this.cols = this.levelService.cols;
        this.rows = this.levelService.rows;
    }

    goBack() {
        this.levelService.goBack();
    }

    onTeamNumChange(event) {
        console.log(event);

        this.levelService.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;
        this.levelService.onTeamNumChange(event);
        this.rows = this.levelService.rows;
    }

    onManualClick()  {
        this.levelService.onManualClick();
    }
    onAutoClick(){
        this.levelService.onAutoClick();
    }

    onRowSelect(event) {
        this.levelService.selectedRow = this.selectedRow;
        this.levelService.onRowSelect(event);
    }
}

