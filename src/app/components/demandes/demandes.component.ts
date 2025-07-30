import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../../services/demande.service';
import { AuthService } from '../../services/auth.service';
import { Demande } from '../../models/interfaces';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes demandes</h1>
          <p class="text-gray-600">Gérez vos demandes de congés, documents et autres</p>
        </div>
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
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="flex flex-wrap gap-4">
          <div>
            <select [(ngModel)]="filtreStatut" (ngModelChange)="appliquerFiltres()" 
                    class="input-field">
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="APPROUVE">Approuvé</option>
              <option value="REJETE">Rejeté</option>
              <option value="EN_COURS">En cours</option>
            </select>
          </div>
          <div>
            <select [(ngModel)]="filtreType" (ngModelChange)="appliquerFiltres()" 
                    class="input-field">
              <option value="">Tous les types</option>
              <option value="CONGE">Congé</option>
              <option value="ABSENCE">Absence</option>
              <option value="DOCUMENT">Document</option>
              <option value="AFFECTATION">Affectation</option>
              <option value="NOTE_FRAIS">Note de frais</option>
            </select>
          </div>
          <div>
            <input type="text" 
                   [(ngModel)]="rechercheTexte" 
                   (ngModelChange)="appliquerFiltres()"
                   placeholder="Rechercher..." 
                   class="input-field" />
          </div>
        </div>
      </div>

      <!-- Demandes List -->
      <div class="space-y-4">
        @for (demande of demandesFiltrees(); track demande.id) {
          <div class="card hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-start space-x-4">
                  <div [class]="getTypeIcon(demande.type).class">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getTypeIcon(demande.type).path"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{demande.titre}}</h3>
                    <p class="text-gray-600 mt-1">{{demande.description}}</p>
                    
                    <div class="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Type: {{getTypeLabel(demande.type)}}</span>
                      <span>Créé le: {{formatDate(demande.dateCreation)}}</span>
                      @if (demande.dateDebut && demande.dateFin) {
                        <span>Période: {{formatDate(demande.dateDebut)}} - {{formatDate(demande.dateFin)}}</span>
                      }
                      @if (demande.montant) {
                        <span>Montant: {{demande.montant | number:'1.0-0'}} FCFA</span>
                      }
                    </div>

                    @if (demande.commentaireRH) {
                      <div class="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p class="text-sm text-blue-900 font-medium">Commentaire RH:</p>
                        <p class="text-sm text-blue-800">{{demande.commentaireRH}}</p>
                      </div>
                    }

                    @if (demande.documents && demande.documents.length > 0) {
                      <div class="mt-3">
                        <p class="text-sm font-medium text-gray-700 mb-2">Documents joints:</p>
                        <div class="flex flex-wrap gap-2">
                          @for (doc of demande.documents; track doc) {
                            <span class="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              {{doc}}
                            </span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <span [class]="getStatutClass(demande.statut)">
                  {{getStatutLabel(demande.statut)}}
                </span>
                
                @if (demande.statut === 'EN_ATTENTE') {
                  <button (click)="annulerDemande(demande)" 
                          class="text-red-600 hover:text-red-800 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="card text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune demande trouvée</h3>
            <p class="mt-2 text-gray-500">Commencez par créer votre première demande.</p>
            <div class="mt-6">
              <a routerLink="/demandes/nouvelle" class="btn-primary">
                Créer une demande
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class DemandesComponent implements OnInit {
  demandes = signal<Demande[]>([]);
  demandesFiltrees = signal<Demande[]>([]);
  
  filtreStatut = '';
  filtreType = '';
  rechercheTexte = '';

  constructor(
    private demandeService: DemandeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.chargerDemandes();
  }

  chargerDemandes() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.demandeService.getDemandesByEmploye(user.id).subscribe(demandes => {
        this.demandes.set(demandes);
        this.appliquerFiltres();
      });
    }
  }

  appliquerFiltres() {
    let filtered = this.demandes();

    if (this.filtreStatut) {
      filtered = filtered.filter(d => d.statut === this.filtreStatut);
    }

    if (this.filtreType) {
      filtered = filtered.filter(d => d.type === this.filtreType);
    }

    if (this.rechercheTexte) {
      const recherche = this.rechercheTexte.toLowerCase();
      filtered = filtered.filter(d => 
        d.titre.toLowerCase().includes(recherche) ||
        d.description.toLowerCase().includes(recherche)
      );
    }

    this.demandesFiltrees.set(filtered);
  }

  annulerDemande(demande: Demande) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      // Logique d'annulation
      console.log('Annulation de la demande:', demande.id);
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'APPROUVE': return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'REJETE': return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      case 'EN_COURS': return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
      default: return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
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

  getTypeLabel(type: string): string {
    switch (type) {
      case 'CONGE': return 'Congé';
      case 'ABSENCE': return 'Absence';
      case 'DOCUMENT': return 'Document';
      case 'AFFECTATION': return 'Affectation';
      case 'NOTE_FRAIS': return 'Note de frais';
      default: return type;
    }
  }

  getTypeIcon(type: string) {
    switch (type) {
      case 'CONGE':
        return {
          class: 'w-10 h-10 bg-green-100 rounded-full flex items-center justify-center',
          path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        };
      case 'DOCUMENT':
        return {
          class: 'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center',
          path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        };
      case 'NOTE_FRAIS':
        return {
          class: 'w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center',
          path: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
        };
      default:
        return {
          class: 'w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center',
          path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        };
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
