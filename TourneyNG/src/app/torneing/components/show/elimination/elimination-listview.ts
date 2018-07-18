import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {TreeNode} from 'primeng/api';

import { Tourney } from '../../../domain/tourney';
import { Calendar } from '../../../domain/calendar';
import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';


@Component({
    templateUrl: './elimination-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class EliminationListView extends CalendarDetailView {
    data: TreeNode[];

    ngOnInit() {
        super.ngOnInit();

        this.data = [{
            label: 'Finale:',
            expanded: true,
            children: [
                {
                    label: 'Belgio',
                    expanded: true,
                    children: [{expanded: true
                        ,children: [{expanded: true
                                ,label: 'Belgio'
                            }
                            ,{expanded: true
                                ,label: 'Brasile'
                            }
                            ,{expanded: true
                                ,label: 'Francia'
                            }
                            ,{expanded: true
                                ,label: 'Uruguay'
                            }
                        ]
                        }
                        ,{  expanded: true,
                            label: 'VIRTUS BOVISIO GIALLA'
                        }
                    ]
                },
                {
                    label: 'Inghilterra'
                    ,expanded: true
                    ,children: [{expanded: true
                        ,children: [{expanded: true
                                ,label: 'Inghilterra'
                            }
                            ,{expanded: true
                                ,label: 'Svezia'
                            }
                        ]
                        }
                    ]
                }
                ,{
                    label: 'Russia'
                    ,expanded: true
                    ,children: [{expanded: true
                        ,children: [
                            {expanded: true
                                ,label: 'Russia'
                            }
                            ,{expanded: true
                                ,label: 'Portogallo'
                            }
                        ]
                        }
                    ]
                }
            ]
        }];
    }
}
