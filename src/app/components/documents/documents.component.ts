import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document } from '../../models/interfaces';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Documents</h1>
        <p class="text-gray-600">Consultez et téléchargez vos documents RH</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button (click)="telechargerDocument('BULLETIN_PAIE')" 
                class="card hover:shadow-md transition-shadow text-left">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">Bulletin de paie</h3>
              <p class="text-sm text-gray-500">Dernier bulletin</p>
            </div>
          </div>
        </button>

        <button (click)="telechargerDocument('ATTESTATION')" 
                class="card hover:shadow-md transition-shadow text-left">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">Attestation de travail</h3>
              <p class="text-sm text-gray-500">Générer une attestation</p>
            </div>
          </div>
        </button>

        <button (click)="telechargerDocument('DECISION_CONGE')" 
                class="card hover:shadow-md transition-shadow text-left">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">Décision de congé</h3>
              <p class="text-sm text-gray-500">Derniers congés</p>
            </div>
          </div>
        </button>
      </div>

      <!-- Filtres -->
      <div class="card">
        <div class="flex flex-wrap gap-4">
          <div>
            <select [(ngModel)]="filtreType" 
                    (ngModelChange)="appliquerFiltres()"
                    class="input-field">
              <option value="">Tous les types</option>
              <option value="BULLETIN_PAIE">Bulletins de paie</option>
              <option value="DECISION_CONGE">Décisions de congé</option>
              <option value="ATTESTATION">Attestations</option>
              <option value="REGLEMENT">Règlement intérieur</option>
              <option value="NOTE_SERVICE">Notes de service</option>
            </select>
          </div>
          <div>
            <input type="text" 
                   [(ngModel)]="rechercheTexte"
                   (ngModelChange)="appliquerFiltres()"
                   placeholder="Rechercher un document..." 
                   class="input-field" />
          </div>
          <div>
            <select [(ngModel)]="triPar" 
                    (ngModelChange)="appliquerFiltres()"
                    class="input-field">
              <option value="date_desc">Plus récent</option>
              <option value="date_asc">Plus ancien</option>
              <option value="nom_asc">Nom A-Z</option>
              <option value="nom_desc">Nom Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Liste des documents -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Mes documents</h2>
        
        <div class="space-y-3">
          @for (document of documentsFiltres(); track document.id) {
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-4">
                <div [class]="getTypeIcon(document.type).class">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getTypeIcon(document.type).path"></path>
                  </svg>
                </div>
                
                <div>
                  <h3 class="font-medium text-gray-900">{{document.nom}}</h3>
                  <p class="text-sm text-gray-500">
                    {{getTypeLabel(document.type)}} • {{formatDate(document.dateCreation)}}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button (click)="previsualiser(document)" 
                        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Prévisualiser">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                
                <button (click)="telecharger(document)" 
                        class="p-2 text-primary-600 hover:text-primary-800 transition-colors"
                        title="Télécharger">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          } @empty {
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun document trouvé</h3>
              <p class="mt-2 text-gray-500">Aucun document ne correspond à vos critères de recherche.</p>
            </div>
          }
        </div>
      </div>

      <!-- Documents d'information -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Documents d'information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Règlement intérieur</h3>
                  <p class="text-sm text-gray-500">Version 2025</p>
                </div>
              </div>
              <button (click)="telechargerDocument('REGLEMENT')" 
                      class="btn-secondary text-sm">
                Télécharger
              </button>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5-5 5h5zM15 17v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Note de service</h3>
                  <p class="text-sm text-gray-500">Nouvelle procédure pointage</p>
                </div>
              </div>
              <button (click)="telechargerDocument('NOTE_SERVICE')" 
                      class="btn-secondary text-sm">
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentsComponent implements OnInit {
  documents = signal<Document[]>([]);
  documentsFiltres = signal<Document[]>([]);
  
  filtreType = '';
  rechercheTexte = '';
  triPar = 'date_desc';

  private mockDocuments: Document[] = [
    {
      id: '1',
      nom: 'Bulletin de paie - Juillet 2025',
      type: 'BULLETIN_PAIE',
      url: '/documents/bulletin_paie_07_2025.pdf',
      dateCreation: '2025-07-31',
      employe: 'Konan Kouassi'
    },
    {
      id: '2',
      nom: 'Bulletin de paie - Juin 2025',
      type: 'BULLETIN_PAIE',
      url: '/documents/bulletin_paie_06_2025.pdf',
      dateCreation: '2025-06-30',
      employe: 'Konan Kouassi'
    },
    {
      id: '3',
      nom: 'Décision de congé - Été 2025',
      type: 'DECISION_CONGE',
      url: '/documents/decision_conge_ete_2025.pdf',
      dateCreation: '2025-07-15',
      employe: 'Konan Kouassi'
    },
    {
      id: '4',
      nom: 'Attestation de travail',
      type: 'ATTESTATION',
      url: '/documents/attestation_travail_2025.pdf',
      dateCreation: '2025-07-22',
      employe: 'Konan Kouassi'
    },
    {
      id: '5',
      nom: 'Règlement intérieur FER',
      type: 'REGLEMENT',
      url: '/documents/reglement_interieur_2025.pdf',
      dateCreation: '2025-01-01'
    }
  ];

  ngOnInit() {
    this.documents.set(this.mockDocuments);
    this.appliquerFiltres();
  }

  appliquerFiltres() {
    let filtered = this.documents();

    // Filtrer par type
    if (this.filtreType) {
      filtered = filtered.filter(d => d.type === this.filtreType);
    }

    // Filtrer par recherche
    if (this.rechercheTexte) {
      const recherche = this.rechercheTexte.toLowerCase();
      filtered = filtered.filter(d => 
        d.nom.toLowerCase().includes(recherche)
      );
    }

    // Trier
    filtered.sort((a, b) => {
      switch (this.triPar) {
        case 'date_desc':
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
        case 'date_asc':
          return new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
        case 'nom_asc':
          return a.nom.localeCompare(b.nom);
        case 'nom_desc':
          return b.nom.localeCompare(a.nom);
        default:
          return 0;
      }
    });

    this.documentsFiltres.set(filtered);
  }

  telechargerDocument(type: string) {
    // Simulation du téléchargement
    console.log('Téléchargement du document de type:', type);
    alert(`Téléchargement du document: ${this.getTypeLabel(type)}`);
  }

  telecharger(document: Document) {
    // Simulation du téléchargement
    console.log('Téléchargement du document:', document.nom);
    alert(`Téléchargement du document: ${document.nom}`);
  }

  previsualiser(document: Document) {
    // Simulation de la prévisualisation
    console.log('Prévisualisation du document:', document.nom);
    alert(`Prévisualisation du document: ${document.nom}`);
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'BULLETIN_PAIE': return 'Bulletin de paie';
      case 'DECISION_CONGE': return 'Décision de congé';
      case 'ATTESTATION': return 'Attestation';
      case 'REGLEMENT': return 'Règlement intérieur';
      case 'NOTE_SERVICE': return 'Note de service';
      default: return type;
    }
  }

  getTypeIcon(type: string) {
    switch (type) {
      case 'BULLETIN_PAIE':
        return {
          class: 'w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center',
          path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
        };
      case 'DECISION_CONGE':
        return {
          class: 'w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center',
          path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        };
      case 'ATTESTATION':
        return {
          class: 'w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center',
          path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'REGLEMENT':
        return {
          class: 'w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center',
          path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        };
      default:
        return {
          class: 'w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center',
          path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        };
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
