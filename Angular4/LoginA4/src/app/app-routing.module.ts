import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { LoginComponent }         from './login/login.component';
import { HeroesComponent }        from './heroes/heroes.component';
import { HeroDetailComponent }    from './hero-detail/hero-detail.component';
import { PageNotFoundComponent }  from './page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent }
];

const appRoutes: Routes = [
  { path: 'hero/:id',
    component: HeroDetailComponent 
  },
  {
    path: 'heroes',
    component: HeroesComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login',
    component: LoginComponent,
  },
  { path: '**', 
    component: PageNotFoundComponent 
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
