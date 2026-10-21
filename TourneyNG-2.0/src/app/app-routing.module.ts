import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './tourneyonline/components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'demo',
    loadChildren: () =>
      import('./tourneyonline/components/demo/demo.module')
        .then(m => m.DemoModule)
  },

  { path: 'realtime',
    loadChildren: () =>
      import('./tourneyonline/components/realtime/realtime.module')
        .then(m => m.RealtimeModule)
  },

  // Admin Section
  { path: 'admintourney',
    loadChildren: () =>
      import('./tourneyonline/components/admin/tourney/tourney.module')
        .then(m => m.TourneyModule)
  },

  { path: 'clients',
    loadChildren: () =>
      import('./tourneyonline/components/admin/client/client.module')
        .then(m => m.ClientModule)
  },

  { path: 'users',
    loadChildren: () =>
      import('./tourneyonline/components/admin/userng/user.module')
        .then(m => m.UserModule)
  },

  { path: 'lease',
    loadChildren: () =>
      import('./tourneyonline/components/admin/lease/lease.module')
        .then(m => m.LeaseModule)
  },

  { path: 'adminplayer',
    loadChildren: () =>
      import('./tourneyonline/components/admin/player/core/player.module')
        .then(m => m.PlayerModule)
  },

  { path: 'adminteam',
    loadChildren: () =>
      import('./tourneyonline/components/admin/team/team.module')
        .then(m => m.TeamModule)
  },

  { path: 'adminoperator',
    loadChildren: () =>
      import('./tourneyonline/components/admin/operator/operator.module')
        .then(m => m.OperatorModule)
  },

  { path: 'adminround',
    loadChildren: () =>
      import('./tourneyonline/components/admin/round/round.module')
        .then(m => m.RoundModule)
  },

  { path: 'adminplayoff',
    loadChildren: () =>
      import('./tourneyonline/components/admin/playoff/playoff.module')
        .then(m => m.PlayoffModule)
  },

  { path: 'admineliminatory',
    loadChildren: () =>
      import('./tourneyonline/components/admin/eliminatory/eliminatory.module')
        .then(m => m.EliminatoryModule)
  },

  { path: 'adminobjective',
    loadChildren: () =>
      import('./tourneyonline/components/admin/objective/objective.module')
        .then(m => m.ObjectiveModule)
  },

  // Presentation Section
  { path: 'showtourney',
    loadChildren: () =>
      import('./tourneyonline/components/show/tourney/tourney.module')
        .then(m => m.TourneyModule)
  },

  { path: 'result',
    loadChildren: () =>
      import('./tourneyonline/components/show/result/result.module')
        .then(m => m.ResultModule)
  },

  { path: 'matrix',
    loadChildren: () =>
      import('./tourneyonline/components/show/matrix/matrix.module')
        .then(m => m.MatrixModule)
  },

  { path: 'classification',
    loadChildren: () =>
      import('./tourneyonline/components/show/classification/classification.module')
        .then(m => m.ClassificationModule)
  },

  { path: 'match',
    loadChildren: () =>
      import('./tourneyonline/components/show/match/match.module')
        .then(m => m.MatchModule)
  },

  // Login Section
  { path: 'login',
    loadChildren: () =>
      import('./tourneyonline/components/login/login.module')
        .then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}