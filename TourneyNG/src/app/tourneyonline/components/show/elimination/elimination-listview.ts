import { Component, OnInit } from '@angular/core';
 
import {TreeNode} from 'primeng/api';
 
import { CalendarDetailView } from '../calendar/calendar-detailview';


@Component({
    templateUrl: './elimination-listview.html'
})
export class EliminationListView extends CalendarDetailView {
    data1: TreeNode[];

    ngOnInit() {
        super.ngOnInit();
    }
}
