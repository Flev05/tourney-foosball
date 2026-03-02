import {Component} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Message, MessageService} from 'primeng/api';

@Component({
    templateUrl: './lease.component.html'
})
export class LeaseComponent {
    msgs: Message[] = [];
    
    userform: FormGroup;
    
    submitted: boolean = false;
 
    constructor(private fb: FormBuilder
        ,private messageService: MessageService
    ) {
         this.userform = this.fb.group({
            username: [''],
            password: ['']
        });
    }
    
    ngOnInit() {
        this.userform = this.fb.group({
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
        });        
    }
    
    onSubmit(value: string) {
        this.submitted = true;
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login effettuato'
        });
    }
    
    get diagnostic() { return JSON.stringify(this.userform.value); }
}