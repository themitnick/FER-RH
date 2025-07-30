import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DemandeService } from '../services/demande.service';
import { PointageService } from '../services/pointage.service';
import { User, Demande, Pointage } from '../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 class="text-2xl font-bold mb-2">
          Bonjour {{user()?.prenom}} {{user()?.nom}} 👋
        </h1>
        <p class="text-primary-100">
          Bienvenue sur votre portail RH. Voici un aperçu de votre espace personnel.
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Demandes en cours</p>
              <p class="text-2xl font-semibold text-gray-900">{{demandesEnCours()}}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Heures ce mois</p>
              <p class="text-2xl font-semibold text-gray-900">{{heuresTravaillees()}}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Congés restants</p>
              <p class="text-2xl font-semibold text-gray-900">{{congesRestants()}} jours</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Statut</p>
              <p class="text-sm font-semibold" [class]="statutColor()">{{pointageAujourdhui()?.statut || 'Non pointé'}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div class="space-y-3">
            @if (!pointageAujourdhui()?.heureArrivee) {
              <button (click)="pointageArrivee()" 
                      class="w-full btn-primary text-left">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Pointer l'arrivée
                </div>
              </button>
            } @else if (!pointageAujourdhui()?.heureDepart) {
              <button (click)="pointageDepart()" 
                      class="w-full btn-secondary text-left">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9"></path>
                  </svg>
                  Pointer le départ ({{pointageAujourdhui()?.heureArrivee}})
                </div>
              </button>
            } @else {
              <div class="p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center text-green-800">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Pointage terminé: {{pointageAujourdhui()?.heureArrivee}} - {{pointageAujourdhui()?.heureDepart}}
                </div>
              </div>
            }

            <div class="flex space-x-3">
              <a routerLink="/demandes/nouvelle" 
                 class="flex items-center justify-center w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors shadow-md group relative"
                 title="Nouvelle demande">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  Nouvelle demande
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </a>

              <a routerLink="/conges/nouvelle" 
                 class="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors shadow-md group relative"
                 title="Demander un congé">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  Demander un congé
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div class="space-y-4">
            @for (demande of recentDemandes(); track demande.id) {
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div [class]="getStatutIcon(demande.statut).class">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getStatutIcon(demande.statut).path"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{demande.titre}}</p>
                  <p class="text-sm text-gray-500">{{demande.type}} • {{formatDate(demande.dateCreation)}}</p>
                  <span [class]="getStatutClass(demande.statut)">{{getStatutLabel(demande.statut)}}</span>
                </div>
              </div>
            } @empty {
              <p class="text-gray-500 text-sm">Aucune activité récente</p>
            }
          </div>
        </div>
      </div>

      <!-- Role-specific sections -->
      @if (user()?.role === 'DIRECTION') {
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Tableau de bord Direction</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h3 class="text-sm font-medium text-blue-900">Budget RH</h3>
              <p class="text-2xl font-bold text-blue-600">2.5M CFA</p>
              <p class="text-xs text-blue-600">+5% vs mois dernier</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <h3 class="text-sm font-medium text-green-900">Effectif total</h3>
              <p class="text-2xl font-bold text-green-600">248</p>
              <p class="text-xs text-green-600">+3 nouvelles embauches</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <h3 class="text-sm font-medium text-purple-900">Taux de présence</h3>
              <p class="text-2xl font-bold text-purple-600">94%</p>
              <p class="text-xs text-purple-600">Objectif: 95%</p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <h3 class="text-sm font-medium text-yellow-900">Notes de frais</h3>
              <p class="text-2xl font-bold text-yellow-600">45</p>
              <p class="text-xs text-yellow-600">En attente validation</p>
            </div>
          </div>
          
          <!-- Graphiques et rapports Direction -->
          <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Évolution des effectifs</h3>
              <div class="h-32 bg-white rounded flex items-center justify-center text-gray-500">
                Graphique des effectifs par service
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Coûts RH par département</h3>
              <div class="h-32 bg-white rounded flex items-center justify-center text-gray-500">
                Répartition budgétaire
              </div>
            </div>
          </div>
        </div>
      }

      @if (user()?.role === 'RH') {
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Tableau de bord RH</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h3 class="text-sm font-medium text-blue-900">Demandes en attente</h3>
              <p class="text-2xl font-bold text-blue-600">{{demandesEnAttenteRH()}}</p>
              <p class="text-xs text-blue-600">À traiter aujourd'hui</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <h3 class="text-sm font-medium text-green-900">Nouveaux candidats</h3>
              <p class="text-2xl font-bold text-green-600">15</p>
              <p class="text-xs text-green-600">Cette semaine</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <h3 class="text-sm font-medium text-purple-900">Entretiens prévus</h3>
              <p class="text-2xl font-bold text-purple-600">8</p>
              <p class="text-xs text-purple-600">Prochains 7 jours</p>
            </div>
            <div class="p-4 bg-orange-50 rounded-lg">
              <h3 class="text-sm font-medium text-orange-900">Congés à valider</h3>
              <p class="text-2xl font-bold text-orange-600">23</p>
              <p class="text-xs text-orange-600">En attente</p>
            </div>
          </div>

          <!-- Actions RH rapides -->
          <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Actions rapides RH</h3>
              <div class="space-y-2">
                <a routerLink="/rh/recrutement" class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                    </svg>
                    <span class="text-sm font-medium text-blue-900">Gérer le recrutement</span>
                  </div>
                </a>
                <a routerLink="/demandes" class="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm font-medium text-green-900">Valider les demandes</span>
                  </div>
                </a>
                <a routerLink="/trombinoscope" class="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span class="text-sm font-medium text-purple-900">Gérer le personnel</span>
                  </div>
                </a>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Statistiques personnels</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-600">Taux d'absentéisme</span>
                  <span class="text-sm font-semibold text-gray-900">3.2%</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-600">Rotation du personnel</span>
                  <span class="text-sm font-semibold text-gray-900">8.5%</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-600">Satisfaction moyenne</span>
                  <span class="text-sm font-semibold text-gray-900">4.2/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (user()?.role === 'OPERATIONNEL') {
        <!-- Section spécifique au personnel opérationnel -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Mes informations personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Solde de congés</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Congés annuels</span>
                  <span class="text-sm font-semibold text-green-600">{{congesRestants()}} jours</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Congés pris</span>
                  <span class="text-sm font-semibold text-gray-900">12 jours</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">RTT disponibles</span>
                  <span class="text-sm font-semibold text-blue-600">5 jours</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Pointage ce mois</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Heures travaillées</span>
                  <span class="text-sm font-semibold text-gray-900">{{heuresTravaillees()}}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Heures supplémentaires</span>
                  <span class="text-sm font-semibold text-orange-600">8h</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Retards</span>
                  <span class="text-sm font-semibold text-red-600">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  user = signal<User | null>(null);
  demandes = signal<Demande[]>([]);
  pointageAujourdhui = signal<Pointage | null>(null);

  demandesEnCours = computed(() => 
    this.demandes().filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'EN_COURS').length
  );

  recentDemandes = computed(() => 
    this.demandes().slice(0, 5)
  );

  heuresTravaillees = computed(() => '160h');
  congesRestants = computed(() => '18');
  demandesEnAttenteRH = computed(() => '12');

  statutColor = computed(() => {
    const statut = this.pointageAujourdhui()?.statut;
    switch (statut) {
      case 'PRESENT': return 'text-green-600';
      case 'RETARD': return 'text-yellow-600';
      case 'ABSENT': return 'text-red-600';
      default: return 'text-gray-500';
    }
  });

  constructor(
    private authService: AuthService,
    private demandeService: DemandeService,
    private pointageService: PointageService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user.set(user);
      if (user) {
        this.loadUserData(user.id);
      }
    });
  }

  private loadUserData(userId: string) {
    this.demandeService.getDemandesByEmploye(userId).subscribe(demandes => {
      this.demandes.set(demandes);
    });

    this.pointageService.getPointagesDuJour(userId).subscribe(pointage => {
      this.pointageAujourdhui.set(pointage);
    });
  }

  pointageArrivee() {
    const userId = this.user()?.id;
    if (userId) {
      this.pointageService.enregistrerArrivee(userId).subscribe({
        next: (pointage) => {
          this.pointageAujourdhui.set(pointage);
        },
        error: (error) => {
          console.error('Erreur pointage:', error);
        }
      });
    }
  }

  pointageDepart() {
    const userId = this.user()?.id;
    if (userId) {
      this.pointageService.enregistrerDepart(userId).subscribe({
        next: (pointage) => {
          this.pointageAujourdhui.set(pointage);
        },
        error: (error) => {
          console.error('Erreur pointage:', error);
        }
      });
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'REJETE': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      case 'EN_COURS': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
      default: return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'Approuvé';
      case 'REJETE': return 'Rejeté';
      case 'EN_COURS': return 'En cours';
      default: return 'En attente';
    }
  }

  getStatutIcon(statut: string) {
    switch (statut) {
      case 'APPROUVE': 
        return {
          class: 'w-6 h-6 bg-green-100 rounded-full flex items-center justify-center',
          path: 'M5 13l4 4L19 7'
        };
      case 'REJETE': 
        return {
          class: 'w-6 h-6 bg-red-100 rounded-full flex items-center justify-center',
          path: 'M6 18L18 6M6 6l12 12'
        };
      case 'EN_COURS': 
        return {
          class: 'w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center',
          path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      default: 
        return {
          class: 'w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center',
          path: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
