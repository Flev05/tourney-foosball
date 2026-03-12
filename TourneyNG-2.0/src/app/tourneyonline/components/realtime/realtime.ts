import {Component,OnInit} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { ToastMessageOptions } from 'primeng/api';

@Component({
    templateUrl: './realtime.html',
    standalone: false
})
export class Realtime implements OnInit {
    
    msgs: ToastMessageOptions[] = [];
    
    userform: FormGroup;
    
    submitted: boolean = false;
    logged: boolean = false;
 
    constructor(private fb: FormBuilder) {
        this.userform = this.fb.group({
            'codiceTorneo': new FormControl('', Validators.required),
        });        
    }
    
    ngOnInit() {
        this.logged = true;
    }
    
    onSubmit(value: string) {
        this.submitted = true;
        this.logged = !this.logged;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'OK', detail:'Accesso effettuato'});
    }
    
    get diagnostic() { return JSON.stringify(this.userform.value); }
}