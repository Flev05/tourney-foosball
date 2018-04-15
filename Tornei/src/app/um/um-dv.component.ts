import { Component } from '@angular/core';
import { User }      from '../login/user';

@Component({
  templateUrl: './um-dv.component.html',
  styleUrls: ['./um-dv.component.css']
})
export class UserDetailViewComponent {
  roles = ['Developer', 'Owner','Admin', 'Operator'];

  model =  new User( 5,  "smartino",   'Stella', "Martino" );

  submitted = false;

  onSubmit() { 
    this.submitted = true; 
  }

  newUser() {
    this.model = new User(-1, '', '','');
  }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
