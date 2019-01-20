import { Component, OnInit } from '@angular/core';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryMode } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { LevelService } from '../eliminatory/level-service';

@Component({
    templateUrl: './level-listview.html'   
})
export class LevelListView implements OnInit {

    teamsCombobox: Combobox[];
    selectedTeamsNumCombobox: Combobox;
    eliminatoryMode: EliminatoryMode;
    eliminatoryCols: TableCols[];
    eliminatoryRows: any[];
    eliminatorySelectedRow: any;

    constructor(
        protected levelService: LevelService,
    ) {
    }

    ngOnInit() {
        this.levelService.ngOnInit();

        this.teamsCombobox = this.levelService.teamsCombobox;

        this.eliminatoryMode = this.levelService.eliminatoryMode;
        this.eliminatoryCols = this.levelService.cols;
        this.eliminatoryRows = this.levelService.rows;
    }

    onTeamNumChange(event) {
        console.log(event);

        this.levelService.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;
        this.levelService.onTeamNumChange(event);
        this.eliminatoryRows = this.levelService.rows;
    }

    onManualClick()  {
        this.levelService.onManualClick();
    }
    onAutoClick(){
        this.levelService.onAutoClick();
    }

    onEliminatoryRowSelect(event) {
        this.levelService.selectedRow = this.eliminatorySelectedRow;
        this.levelService.onRowSelect(event);
    }
}

