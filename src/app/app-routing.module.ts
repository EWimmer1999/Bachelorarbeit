import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/authentication.guard';
import { OverviewSurveysPage } from './pages/overview-surveys/overview-surveys.page';
import { CompletedSurveysPage } from './pages/surveys/completed-surveys/completed-surveys.page';
import { NewSurveysPage } from './pages/surveys/new-surveys/new-surveys.page';
import { SurveyDetailPage } from './pages/surveys/survey-detail/survey-detail.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'tipps',
    loadChildren: () => import('./pages/tipps/tipps.module').then( m => m.TippsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'reset-pw',
    loadChildren: () => import('./pages/reset-pw/reset-pw.module').then( m => m.ResetPwPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'new-surveys',
    loadChildren: () => import('./pages/surveys/new-surveys/new-surveys.module').then( m => m.NewSurveysPageModule)
  },
  { path: 'overview-surveys', component: OverviewSurveysPage, children: [
    { path: '', pathMatch: 'full', redirectTo: 'new'},
    { path: 'completed', component: CompletedSurveysPage },
    { path: 'new', component: NewSurveysPage }
  ],
    canActivate:[AuthGuard]
  },
  { path: 'survey/:id', component: SurveyDetailPage,
    canActivate:[AuthGuard]
   },
  {
    path: 'noisemeter',
    loadChildren: () => import('./pages/data/noisemeter/noisemeter.module').then( m => m.NoisemeterPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
