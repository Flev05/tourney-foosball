import { Component }    from '@angular/core';
import { Router }       from '@angular/router';
import { AuthService }  from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        
    }
}
