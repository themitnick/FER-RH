import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CongeService } from '../../services/conge.service';
import { AuthService } from '../../services/auth.service';
import { Conge } from '../../models/interfaces';

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des congés</h1>
          <p class="text-gray-600">Consultez vos congés et solde disponible</p>
        </div>
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

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{statistiques()?.totalAutorise || 30}}</p>
          <p class="text-sm text-gray-500">Jours autorisés</p>
        </div>

        <div class="card text-center">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-green-600">{{statistiques()?.totalRestant || 0}}</p>
          <p class="text-sm text-gray-500">Jours restants</p>
        </div>

        <div class="card text-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-orange-600">{{statistiques()?.totalPris || 0}}</p>
          <p class="text-sm text-gray-500">Jours pris</p>
        </div>

        <div class="card text-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-yellow-600">{{statistiques()?.congesEnAttente || 0}}</p>
          <p class="text-sm text-gray-500">En attente</p>
        </div>
      </div>

      <!-- Calendrier des congés -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Calendrier des congés {{anneeSelectionnee}}</h2>
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex space-x-2">
            <button (click)="changerAnnee(-1)" class="btn-secondary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span class="px-4 py-2 text-lg font-medium">{{anneeSelectionnee}}</span>
            <button (click)="changerAnnee(1)" class="btn-secondary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div class="flex space-x-4 text-sm">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Approuvé</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>En attente</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Rejeté</span>
            </div>
          </div>
        </div>

        <!-- Calendrier simplifié - vue mensuelle -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (mois of moisAnnee; track mois.numero) {
            <div class="border rounded-lg p-3">
              <h3 class="font-medium text-gray-900 mb-2">{{mois.nom}}</h3>
              <div class="space-y-1">
                @for (conge of getCongesPourMois(mois.numero); track conge.id) {
                  <div [class]="getCongeColorClass(conge.statut)" class="p-2 rounded text-xs">
                    <div class="font-medium">{{getTypeCongeLabel(conge.type)}}</div>
                    <div>{{formatDateCourte(conge.dateDebut)}} - {{formatDateCourte(conge.dateFin)}}</div>
                    <div>{{conge.nbJours}} jour(s)</div>
                  </div>
                } @empty {
                  <div class="text-gray-400 text-xs">Aucun congé</div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Liste des congés -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Historique des congés</h2>
          <select [(ngModel)]="filtreStatut" 
                  (ngModelChange)="appliquerFiltre()"
                  class="input-field w-48">
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="APPROUVE">Approuvé</option>
            <option value="REJETE">Rejeté</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (conge of congesFiltres(); track conge.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div [class]="getTypeIcon(conge.type).class">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getTypeIcon(conge.type).path"></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{getTypeCongeLabel(conge.type)}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{formatDate(conge.dateDebut)}} - {{formatDate(conge.dateFin)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{conge.nbJours}} jour(s)
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {{conge.motif || '-'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatutClass(conge.statut)">
                      {{getStatutLabel(conge.statut)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    @if (conge.statut === 'EN_ATTENTE') {
                      <button (click)="annulerConge(conge)" 
                              class="text-red-600 hover:text-red-900">
                        Annuler
                      </button>
                    } @else {
                      <button class="text-primary-600 hover:text-primary-900">
                        Détails
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    Aucun congé trouvé
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CongesComponent implements OnInit {
  conges = signal<Conge[]>([]);
  congesFiltres = signal<Conge[]>([]);
  statistiques = signal<any>(null);
  
  anneeSelectionnee = new Date().getFullYear();
  filtreStatut = '';

  moisAnnee = [
    { numero: 1, nom: 'Janvier' },
    { numero: 2, nom: 'Février' },
    { numero: 3, nom: 'Mars' },
    { numero: 4, nom: 'Avril' },
    { numero: 5, nom: 'Mai' },
    { numero: 6, nom: 'Juin' },
    { numero: 7, nom: 'Juillet' },
    { numero: 8, nom: 'Août' },
    { numero: 9, nom: 'Septembre' },
    { numero: 10, nom: 'Octobre' },
    { numero: 11, nom: 'Novembre' },
    { numero: 12, nom: 'Décembre' }
  ];

  constructor(
    private congeService: CongeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.chargerDonnees();
  }

  private chargerDonnees() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.congeService.getCongesByEmploye(user.id).subscribe(conges => {
        this.conges.set(conges);
        this.appliquerFiltre();
      });

      this.congeService.getStatistiquesConges(user.id, this.anneeSelectionnee).subscribe(stats => {
        this.statistiques.set(stats);
      });
    }
  }

  appliquerFiltre() {
    let filtered = this.conges();

    if (this.filtreStatut) {
      filtered = filtered.filter(c => c.statut === this.filtreStatut);
    }

    // Trier par date de début (plus récent en premier)
    filtered.sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());

    this.congesFiltres.set(filtered);
  }

  changerAnnee(delta: number) {
    this.anneeSelectionnee += delta;
    this.chargerDonnees();
  }

  getCongesPourMois(mois: number): Conge[] {
    return this.conges().filter(conge => {
      const dateDebut = new Date(conge.dateDebut);
      const dateFin = new Date(conge.dateFin);
      return (dateDebut.getFullYear() === this.anneeSelectionnee && dateDebut.getMonth() + 1 === mois) ||
             (dateFin.getFullYear() === this.anneeSelectionnee && dateFin.getMonth() + 1 === mois) ||
             (dateDebut.getFullYear() <= this.anneeSelectionnee && dateFin.getFullYear() >= this.anneeSelectionnee &&
              dateDebut.getMonth() + 1 <= mois && dateFin.getMonth() + 1 >= mois);
    });
  }

  annulerConge(conge: Conge) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande de congé ?')) {
      // Logique d'annulation
      console.log('Annulation du congé:', conge.id);
    }
  }

  getCongeColorClass(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'bg-green-100 text-green-800';
      case 'REJETE': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'REJETE': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      default: return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'Approuvé';
      case 'REJETE': return 'Rejeté';
      default: return 'En attente';
    }
  }

  getTypeCongeLabel(type: string): string {
    switch (type) {
      case 'CONGE_PAYE': return 'Congé payé';
      case 'CONGE_MALADIE': return 'Congé maladie';
      case 'CONGE_MATERNITE': return 'Congé maternité';
      case 'CONGE_SANS_SOLDE': return 'Congé sans solde';
      default: return type;
    }
  }

  getTypeIcon(type: string) {
    switch (type) {
      case 'CONGE_PAYE':
        return {
          class: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center',
          path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        };
      case 'CONGE_MALADIE':
        return {
          class: 'w-8 h-8 bg-red-100 rounded-full flex items-center justify-center',
          path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
        };
      default:
        return {
          class: 'w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center',
          path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        };
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }

  formatDateCourte(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  }
}
