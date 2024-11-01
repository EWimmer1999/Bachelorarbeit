import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/authentication.guard';
import { OverviewSurveysPage } from './pages/overview-surveys/overview-surveys.page';
import { CompletedSurveysPage } from './pages/surveys/completed-surveys/completed-surveys.page';
import { NewSurveysPage } from './pages/surveys/new-surveys/new-surveys.page';
import { SurveyDetailPage } from './pages/surveys/survey-detail/survey-detail.page';
import { TippDetailPage } from './pages/tipp-detail/tipp-detail.page';
import { CompletedSurveyDetailPage } from './pages/surveys/completed-survey-detail/completed-survey-detail.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
    loadChildren: () => import('./pages/surveys/new-surveys/new-surveys.module').then( m => m.NewSurveysPageModule),
    canActivate:[AuthGuard]
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
  { path: 'completesurvey/:id', component: CompletedSurveyDetailPage,
    canActivate:[AuthGuard]
  },
  { path: 'tipp/:id', component: TippDetailPage,
    canActivate:[AuthGuard]
  },
  {
    path: 'noisemeter',
    loadChildren: () => import('./pages/data/noisemeter/noisemeter.module').then( m => m.NoisemeterPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'tipp-detail',
    loadChildren: () => import('./pages/tipp-detail/tipp-detail.module').then( m => m.TippDetailPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'completed-survey-detail',
    loadChildren: () => import('./pages/surveys/completed-survey-detail/completed-survey-detail.module').then( m => m.CompletedSurveyDetailPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'diary',
    loadChildren: () => import('./pages/diary/diary/diary.module').then( m => m.DiaryPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'new-diary',
    loadChildren: () => import('./pages/diary/new-diary/new-diary.module').then( m => m.NewDiaryPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('./pages/diary/diary-entry-detail/diary-entry-detail.module').then( m => m.DiaryEntryDetailPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'edit-entry/:id',
    loadChildren: () => import('./pages/diary/edit-entry/edit-entry.module').then( m => m.EditEntryPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'change-pw',
    loadChildren: () => import('./pages/change-pw/change-pw.module').then( m => m.ChangePWPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'demographic',
    loadChildren: () => import('./pages/surveys/demographic/demographic.module').then( m => m.DemographicPageModule)
  },  {
    path: 'edit',
    loadChildren: () => import('./pages/surveys/edit/edit.module').then( m => m.EditPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
