import {Component,OnInit} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Message,SelectItem} from '../../../components/common/api';

@Component({
    templateUrl: './realtime.html'
})
export class Realtime implements OnInit {
    
    msgs: Message[] = [];
    
    userform: FormGroup;
    
    submitted: boolean;
    logged: boolean;
 
    constructor(private fb: FormBuilder) {}
    
    ngOnInit() {
        this.logged = true;
        this.userform = this.fb.group({
            'codiceTorneo': new FormControl('', Validators.required),
        });        
    }
    
    onSubmit(value: string) {
        this.submitted = true;
        this.logged = !this.logged;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'OK', detail:'Accesso effettuato'});

    }
    
    get diagnostic() { return JSON.stringify(this.userform.value); }
}