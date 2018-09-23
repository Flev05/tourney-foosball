import { Component, OnInit } from '@angular/core';
 
import {TreeNode} from 'primeng/api';
 
import { CalendarDetailView } from '../calendar/calendar-detailview';


@Component({
    templateUrl: './elimination-listview.html',
    styles: [`

        .custom .ui-scrollpanel .ui-widget .ui-widget-content .ui-corner-all{
            visibility: hidden;
        }
        .custom .ui-scrollpanel-wrapper {
            border-right: 9px solid #f4f4f4; 
        }
        
        .custom .ui-scrollpanel-bar {
            background-color: #1976d2; 
            opacity: 1; 
            transition: background-color .3s; 
        }
        
        .custom .ui-scrollpanel-bar:hover {
            background-color: #135ba1;
        }
    
        .custombar1 .ui-scrollpanel-wrapper {
            border-right: 9px solid #f4f4f4;
        }
            
        .custombar1 .ui-scrollpanel-bar {
            background-color: #1976d2;
            opacity: 1;
            transition: background-color .3s;
        }
            
        .custombar1 .ui-scrollpanel-bar:hover {
            background-color: #135ba1;
        }
            
        .custombar2 .ui-scrollpanel-wrapper {
            border-right: 9px solid #757575;
            border-bottom: 9px solid #757575;
        }
            
        .custombar2 .ui-scrollpanel-bar {
            background-color: #68C77D;
            border-radius: 0;
            opacity: 1;
            transition: background-color .3s;
        }
            
        .custombar2:hover .ui-scrollpanel-bar {
            background-color: #46A55A;
        }
    `],
})
export class EliminationListView extends CalendarDetailView {
    data1: TreeNode[];

    ngOnInit() {
        super.ngOnInit();
        this.data1 = this.selectedTourney.eliminatories;      
    }
}
