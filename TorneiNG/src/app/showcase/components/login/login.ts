import {Component,OnInit} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Message,SelectItem} from '../../../components/common/api';

@Component({
    templateUrl: './login.html'
})
export class Login implements OnInit {
    
    msgs: Message[] = [];
    
    userform: FormGroup;
    
    submitted: boolean;
 
    constructor(private fb: FormBuilder) {}
    
    ngOnInit() {
        this.userform = this.fb.group({
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
        });        
    }
    
    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'OK', detail:'Login effettuato'});
    }
    
    get diagnostic() { return JSON.stringify(this.userform.value); }
}