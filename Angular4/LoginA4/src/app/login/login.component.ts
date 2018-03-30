import { Component, OnInit } from '@angular/core';
import { HeroService }       from '../hero.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailid;
  isLoginOk = false;
  constructor(private service: HeroService) {

  }

  ngOnInit() {}

  onClickSubmit(data) {
    this.emailid = data.emailid;
    this.isLoginOk=true;
    
  }
}
