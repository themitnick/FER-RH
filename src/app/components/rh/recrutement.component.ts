import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecrutementService } from '../../services/recrutement.service';
import { Candidat } from '../../models/interfaces';
import { NouveauCandidatComponent } from './nouveau-candidat.component';

@Component({
  selector: 'app-recrutement',
  standalone: true,
  imports: [CommonModule, FormsModule, NouveauCandidatComponent],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Recrutement</h1>
          <p class="text-gray-600">Gérez le processus de recrutement et les candidatures</p>
        </div>
        <div class="flex space-x-3">
          <button 
            (click)="activeTab = 'candidats'" 
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            [ngClass]="{
              'bg-blue-600 text-white shadow-md': activeTab === 'candidats',
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeTab !== 'candidats'
            }">
            Candidatures
          </button>
          <button 
            (click)="activeTab = 'postes'" 
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            [ngClass]="{
              'bg-blue-600 text-white shadow-md': activeTab === 'postes',
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeTab !== 'postes'
            }">
            Postes ouverts
          </button>
          <button 
            (click)="activeTab = 'statistiques'" 
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            [ngClass]="{
              'bg-blue-600 text-white shadow-md': activeTab === 'statistiques',
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeTab !== 'statistiques'
            }">
            Statistiques
          </button>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <div class="text-2xl font-bold text-blue-600">{{statistiques.totalCandidatures}}</div>
          <div class="text-sm text-gray-600">Candidatures totales</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-green-600">{{statistiques.candidaturesParStatut.ENTRETIEN}}</div>
          <div class="text-sm text-gray-600">En entretien</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-orange-600">{{statistiques.candidaturesParStatut.PRESELECTIONNE}}</div>
          <div class="text-sm text-gray-600">Présélectionnés</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-purple-600">{{statistiques.postesOuverts}}</div>
          <div class="text-sm text-gray-600">Postes ouverts</div>
        </div>
      </div>

      <!-- Onglet Candidatures -->
      <div *ngIf="activeTab === 'candidats'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Candidatures</h2>
          <div class="flex space-x-2">
            <button (click)="afficherFormulaireCandidat = !afficherFormulaireCandidat" class="btn-primary">
              Nouveau candidat
            </button>
            <select [(ngModel)]="filtreStatut" (ngModelChange)="filtrerCandidats()" class="form-select">
              <option value="">Tous les statuts</option>
              <option value="POSTULE">Postulé</option>
              <option value="PRESELECTIONNE">Présélectionné</option>
              <option value="ENTRETIEN">Entretien</option>
              <option value="TEST_TECHNIQUE">Test technique</option>
              <option value="ACCEPTE">Accepté</option>
              <option value="REFUSE">Refusé</option>
            </select>
            <select [(ngModel)]="filtrePoste" (ngModelChange)="filtrerCandidats()" class="form-select">
              <option value="">Tous les postes</option>
              <option *ngFor="let poste of postesUniques" [value]="poste">{{poste}}</option>
            </select>
          </div>
        </div>

        <!-- Formulaire nouveau candidat -->
        <div *ngIf="afficherFormulaireCandidat">
          <app-nouveau-candidat 
            (candidatAjoute)="onCandidatAjoute()" 
            (fermeture)="afficherFormulaireCandidat = false">
          </app-nouveau-candidat>
        </div>

        <div class="card overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidat</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste visé</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let candidat of candidatsFiltres">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{candidat.prenom}} {{candidat.nom}}</div>
                    <div class="text-sm text-gray-500">{{candidat.email}}</div>
                    <div class="text-sm text-gray-500">{{candidat.telephone}}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{candidat.posteVise}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{candidat.datePostulation | date:'dd/MM/yyyy'}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        [ngClass]="getStatutClass(candidat.statut)">
                    {{getStatutLabel(candidat.statut)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button (click)="voirDetailCandidat(candidat)" class="text-blue-600 hover:text-blue-900">
                    Détails
                  </button>
                  <button (click)="changerStatutCandidat(candidat)" class="text-green-600 hover:text-green-900">
                    Statut
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Onglet Postes ouverts -->
      <div *ngIf="activeTab === 'postes'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Postes ouverts</h2>
          <button (click)="afficherFormulairePoste = !afficherFormulairePoste" class="btn-primary">
            Nouveau poste
          </button>
        </div>

        <!-- Formulaire nouveau poste -->
        <div *ngIf="afficherFormulairePoste" class="card">
          <h3 class="text-lg font-medium mb-4">Créer un nouveau poste</h3>
          <form (ngSubmit)="ajouterPoste()" #posteForm="ngForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Titre du poste</label>
              <input type="text" [(ngModel)]="nouveauPoste.titre" name="titre" required class="form-input">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Service</label>
              <input type="text" [(ngModel)]="nouveauPoste.service" name="service" required class="form-input">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type de contrat</label>
              <select [(ngModel)]="nouveauPoste.typeContrat" name="typeContrat" required class="form-select">
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Salaire (FCFA)</label>
              <input type="number" [(ngModel)]="nouveauPoste.salaire" name="salaire" class="form-input">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea [(ngModel)]="nouveauPoste.description" name="description" rows="3" class="form-textarea"></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Compétences requises (séparées par des virgules)</label>
              <input type="text" [(ngModel)]="competencesTexte" name="competences" class="form-input" 
                     placeholder="Angular, TypeScript, HTML/CSS">
            </div>
            <div class="md:col-span-2 flex space-x-2">
              <button type="submit" [disabled]="!posteForm.form.valid" class="btn-primary">Créer le poste</button>
              <button type="button" (click)="annulerNouveauPoste()" class="btn-outline">Annuler</button>
            </div>
          </form>
        </div>

        <!-- Liste des postes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let poste of postesOuverts" class="card">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-medium">{{poste.titre}}</h3>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {{poste.statut}}
              </span>
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <div><strong>Service:</strong> {{poste.service}}</div>
              <div><strong>Contrat:</strong> {{poste.typeContrat}}</div>
              <div><strong>Salaire:</strong> {{formatSalaire(poste.salaire)}} FCFA</div>
              <div><strong>Candidatures:</strong> {{poste.nombreCandidatures}}</div>
              <div><strong>Publié le:</strong> {{poste.datePublication | date:'dd/MM/yyyy'}}</div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-700">{{poste.description}}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-1">
              <span *ngFor="let competence of poste.competencesRequises" 
                    class="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                {{competence}}
              </span>
            </div>
            <div class="mt-4 flex space-x-2">
              <button class="text-blue-600 hover:text-blue-900 text-sm">Modifier</button>
              <button (click)="supprimerPoste(poste.id)" class="text-red-600 hover:text-red-900 text-sm">Supprimer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Statistiques -->
      <div *ngIf="activeTab === 'statistiques'" class="space-y-6">
        <h2 class="text-xl font-semibold">Statistiques de recrutement</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Répartition par statut -->
          <div class="card">
            <h3 class="text-lg font-medium mb-4">Répartition des candidatures par statut</h3>
            <div class="space-y-3">
              <div *ngFor="let statut of Object.keys(statistiques.candidaturesParStatut)" class="flex justify-between items-center">
                <span class="text-sm">{{getStatutLabel(statut)}}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" 
                         [style.width.%]="(statistiques.candidaturesParStatut[statut] / statistiques.totalCandidatures) * 100"></div>
                  </div>
                  <span class="text-sm font-medium">{{statistiques.candidaturesParStatut[statut]}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Candidatures par poste -->
          <div class="card">
            <h3 class="text-lg font-medium mb-4">Candidatures par poste</h3>
            <div class="space-y-3">
              <div *ngFor="let poste of Object.keys(statistiques.candidaturesParPoste)" class="flex justify-between items-center">
                <span class="text-sm">{{poste}}</span>
                <span class="text-sm font-medium">{{statistiques.candidaturesParPoste[poste]}} candidature(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal détail candidat -->
      <div *ngIf="candidatSelectionne" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="fermerDetailCandidat()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Détails du candidat</h3>
              <button (click)="fermerDetailCandidat()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <p class="text-sm text-gray-900">{{candidatSelectionne.nom}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prénom</label>
                  <p class="text-sm text-gray-900">{{candidatSelectionne.prenom}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="text-sm text-gray-900">{{candidatSelectionne.email}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p class="text-sm text-gray-900">{{candidatSelectionne.telephone}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Poste visé</label>
                  <p class="text-sm text-gray-900">{{candidatSelectionne.posteVise}}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Date de postulation</label>
                  <p class="text-sm text-gray-900">{{candidatSelectionne.datePostulation | date:'dd/MM/yyyy'}}</p>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Statut actuel</label>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      [ngClass]="getStatutClass(candidatSelectionne.statut)">
                  {{getStatutLabel(candidatSelectionne.statut)}}
                </span>
              </div>

              <div *ngIf="candidatSelectionne.notes">
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <p class="text-sm text-gray-900">{{candidatSelectionne.notes}}</p>
              </div>

              <div class="space-y-2">
                <div *ngIf="candidatSelectionne.cv">
                  <button class="text-blue-600 hover:text-blue-900 text-sm">📄 Télécharger CV</button>
                </div>
                <div *ngIf="candidatSelectionne.lettreMotivation">
                  <button class="text-blue-600 hover:text-blue-900 text-sm">📄 Télécharger lettre de motivation</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal changement de statut -->
      <div *ngIf="afficherModalStatut" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="fermerModalStatut()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">Changer le statut</h3>
              <button (click)="fermerModalStatut()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form (ngSubmit)="confirmerChangementStatut()">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nouveau statut</label>
                  <select [(ngModel)]="nouveauStatut" name="statut" required class="form-select">
                    <option value="POSTULE">Postulé</option>
                    <option value="PRESELECTIONNE">Présélectionné</option>
                    <option value="ENTRETIEN">Entretien</option>
                    <option value="TEST_TECHNIQUE">Test technique</option>
                    <option value="ACCEPTE">Accepté</option>
                    <option value="REFUSE">Refusé</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Notes (optionnel)</label>
                  <textarea [(ngModel)]="notesStatut" name="notes" rows="3" class="form-textarea" 
                            placeholder="Ajoutez des notes sur ce changement de statut..."></textarea>
                </div>
                
                <div class="flex space-x-2">
                  <button type="submit" class="btn-primary">Confirmer</button>
                  <button type="button" (click)="fermerModalStatut()" class="btn-outline">Annuler</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecrutementComponent implements OnInit {
  activeTab = 'candidats';
  candidats: Candidat[] = [];
  candidatsFiltres: Candidat[] = [];
  postesOuverts: any[] = [];
  statistiques: any = {};
  
  // Filtres
  filtreStatut = '';
  filtrePoste = '';
  postesUniques: string[] = [];
  
  // Modals
  candidatSelectionne: Candidat | null = null;
  afficherModalStatut = false;
  candidatPourStatut: Candidat | null = null;
  nouveauStatut: Candidat['statut'] = 'POSTULE';
  notesStatut = '';
  
  // Formulaire nouveau poste
  afficherFormulairePoste = false;
  afficherFormulaireCandidat = false;
  nouveauPoste: any = {
    titre: '',
    service: '',
    typeContrat: 'CDI',
    salaire: '',
    description: '',
    statut: 'OUVERT',
    datePublication: new Date().toISOString().split('T')[0]
  };
  competencesTexte = '';

  Object = Object; // Pour utiliser Object.keys dans le template

  constructor(private recrutementService: RecrutementService) {}

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    this.recrutementService.getCandidats().subscribe(candidats => {
      this.candidats = candidats;
      this.candidatsFiltres = candidats;
      this.postesUniques = [...new Set(candidats.map(c => c.posteVise))];
    });

    this.recrutementService.getPostesOuverts().subscribe(postes => {
      this.postesOuverts = postes;
    });

    this.statistiques = this.recrutementService.getStatistiquesRecrutement();
  }

  filtrerCandidats() {
    this.candidatsFiltres = this.candidats.filter(candidat => {
      const correspondStatut = !this.filtreStatut || candidat.statut === this.filtreStatut;
      const correspondPoste = !this.filtrePoste || candidat.posteVise === this.filtrePoste;
      return correspondStatut && correspondPoste;
    });
  }

  voirDetailCandidat(candidat: Candidat) {
    this.candidatSelectionne = candidat;
  }

  fermerDetailCandidat() {
    this.candidatSelectionne = null;
  }

  changerStatutCandidat(candidat: Candidat) {
    this.candidatPourStatut = candidat;
    this.nouveauStatut = candidat.statut;
    this.notesStatut = candidat.notes || '';
    this.afficherModalStatut = true;
  }

  fermerModalStatut() {
    this.afficherModalStatut = false;
    this.candidatPourStatut = null;
    this.notesStatut = '';
  }

  confirmerChangementStatut() {
    if (this.candidatPourStatut) {
      this.recrutementService.updateStatutCandidat(
        this.candidatPourStatut.id, 
        this.nouveauStatut, 
        this.notesStatut
      ).subscribe(() => {
        this.chargerDonnees();
        this.fermerModalStatut();
      });
    }
  }

  ajouterPoste() {
    const poste = {
      ...this.nouveauPoste,
      competencesRequises: this.competencesTexte.split(',').map(c => c.trim()).filter(c => c)
    };

    this.recrutementService.ajouterPoste(poste).subscribe(() => {
      this.chargerDonnees();
      this.annulerNouveauPoste();
    });
  }

  annulerNouveauPoste() {
    this.afficherFormulairePoste = false;
    this.nouveauPoste = {
      titre: '',
      service: '',
      typeContrat: 'CDI',
      salaire: '',
      description: '',
      statut: 'OUVERT',
      datePublication: new Date().toISOString().split('T')[0]
    };
    this.competencesTexte = '';
  }

  supprimerPoste(posteId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce poste ?')) {
      this.recrutementService.supprimerPoste(posteId).subscribe(() => {
        this.chargerDonnees();
      });
    }
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'POSTULE': 'bg-blue-100 text-blue-800',
      'PRESELECTIONNE': 'bg-yellow-100 text-yellow-800',
      'ENTRETIEN': 'bg-purple-100 text-purple-800',
      'TEST_TECHNIQUE': 'bg-orange-100 text-orange-800',
      'ACCEPTE': 'bg-green-100 text-green-800',
      'REFUSE': 'bg-red-100 text-red-800'
    };
    return classes[statut] || 'bg-gray-100 text-gray-800';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'POSTULE': 'Postulé',
      'PRESELECTIONNE': 'Présélectionné',
      'ENTRETIEN': 'Entretien',
      'TEST_TECHNIQUE': 'Test technique',
      'ACCEPTE': 'Accepté',
      'REFUSE': 'Refusé'
    };
    return labels[statut] || statut;
  }

  onCandidatAjoute() {
    this.chargerDonnees();
    this.afficherFormulaireCandidat = false;
  }

  formatSalaire(salaire: string | number): string {
    const num = typeof salaire === 'string' ? parseInt(salaire) : salaire;
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}
