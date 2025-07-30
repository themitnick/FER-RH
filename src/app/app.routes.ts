import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { LoginComponent } from './components/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'demandes', loadComponent: () => import('./components/demandes/demandes.component').then(m => m.DemandesComponent), canActivate: [authGuard] },
  { path: 'demandes/nouvelle', loadComponent: () => import('./components/demandes/nouvelle-demande.component').then(m => m.NouvelleDemande), canActivate: [authGuard] },
  { path: 'pointage', loadComponent: () => import('./components/pointage/pointage.component').then(m => m.PointageComponent), canActivate: [authGuard] },
  { path: 'conges', loadComponent: () => import('./components/conges/conges.component').then(m => m.CongesComponent), canActivate: [authGuard] },
  { path: 'conges/nouvelle', loadComponent: () => import('./components/conges/nouvelle-conge.component').then(m => m.NouvelleConge), canActivate: [authGuard] },
  { path: 'profil', loadComponent: () => import('./components/profil/profil.component').then(m => m.ProfilComponent), canActivate: [authGuard] },
  { path: 'parametres', loadComponent: () => import('./components/parametres/parametres.component').then(m => m.ParametresComponent), canActivate: [authGuard] },
  { path: 'performance', loadComponent: () => import('./components/performance/performance.component').then(m => m.PerformanceComponent), canActivate: [authGuard] },
  { path: 'documents', loadComponent: () => import('./components/documents/documents.component').then(m => m.DocumentsComponent), canActivate: [authGuard] },
  { path: 'trombinoscope', loadComponent: () => import('./components/trombinoscope/trombinoscope.component').then(m => m.TrombinoscopeComponent), canActivate: [authGuard] },
  { path: 'notes-frais', loadComponent: () => import('./components/notes-frais/notes-frais.component').then(m => m.NotesFraisComponent), canActivate: [authGuard] },
  { path: 'rh/recrutement', loadComponent: () => import('./components/rh/recrutement.component').then(m => m.RecrutementComponent), canActivate: [authGuard] },
  { path: 'rh/personnel', loadComponent: () => import('./components/rh/personnel.component').then(m => m.PersonnelComponent), canActivate: [authGuard] },
  { path: 'rh/statistiques', loadComponent: () => import('./components/rh/statistiques.component').then(m => m.StatistiquesComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
