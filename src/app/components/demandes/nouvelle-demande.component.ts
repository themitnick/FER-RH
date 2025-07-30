import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../../services/demande.service';
import { AuthService } from '../../services/auth.service';
import { Demande } from '../../models/interfaces';

@Component({
  selector: 'app-nouvelle-demande',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <a routerLink="/demandes" class="text-primary-600 hover:text-primary-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Nouvelle demande</h1>
          <p class="text-gray-600">Créez une nouvelle demande</p>
        </div>
      </div>

      <!-- Form -->
      <div class="card max-w-2xl">
        <form (ngSubmit)="soumettreDeamnde()" #demandeForm="ngForm">
          <div class="space-y-6">
            <!-- Type de demande -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de demande *
              </label>
              <select [(ngModel)]="formData.type" 
                      name="type"
                      required
                      (ngModelChange)="onTypeChange()"
                      class="input-field">
                <option value="">Sélectionnez un type</option>
                <option value="CONGE">Demande de congé</option>
                <option value="ABSENCE">Demande d'absence</option>
                <option value="DOCUMENT">Demande de document</option>
                <option value="AFFECTATION">Demande d'affectation</option>
                <option value="NOTE_FRAIS">Note de frais</option>
              </select>
            </div>

            <!-- Titre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input type="text" 
                     [(ngModel)]="formData.titre"
                     name="titre"
                     required
                     placeholder="Titre de votre demande"
                     class="input-field" />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea [(ngModel)]="formData.description"
                        name="description"
                        required
                        rows="4"
                        placeholder="Décrivez votre demande en détail"
                        class="input-field"></textarea>
            </div>

            <!-- Dates (pour congés et absences) -->
            @if (formData.type === 'CONGE' || formData.type === 'ABSENCE') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input type="date" 
                         [(ngModel)]="formData.dateDebut"
                         name="dateDebut"
                         required
                         class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin *
                  </label>
                  <input type="date" 
                         [(ngModel)]="formData.dateFin"
                         name="dateFin"
                         required
                         class="input-field" />
                </div>
              </div>

              @if (formData.dateDebut && formData.dateFin) {
                <div class="p-3 bg-blue-50 rounded-lg">
                  <p class="text-sm text-blue-800">
                    Durée: {{calculerDuree()}} jour(s)
                  </p>
                </div>
              }
            }

            <!-- Montant (pour notes de frais) -->
            @if (formData.type === 'NOTE_FRAIS') {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Montant (FCFA) *
                </label>
                <input type="number" 
                       [(ngModel)]="formData.montant"
                       name="montant"
                       required
                       min="0"
                       placeholder="0"
                       class="input-field" />
              </div>
            }

            <!-- Type de document (pour demandes de documents) -->
            @if (formData.type === 'DOCUMENT') {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type de document *
                </label>
                <select [(ngModel)]="formData.typeDocument"
                        name="typeDocument"
                        required
                        class="input-field">
                  <option value="">Sélectionnez un document</option>
                  <option value="ATTESTATION_TRAVAIL">Attestation de travail</option>
                  <option value="BULLETIN_SALAIRE">Bulletin de salaire</option>
                  <option value="CERTIFICAT_MEDICAL">Certificat médical</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
            }

            <!-- Upload de fichiers -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Documents joints
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <div class="mt-4">
                  <label for="file-upload" class="cursor-pointer">
                    <span class="btn-secondary">
                      Choisir des fichiers
                    </span>
                    <input id="file-upload" 
                           name="file-upload" 
                           type="file" 
                           multiple
                           (change)="onFileSelect($event)"
                           class="sr-only" />
                  </label>
                  <p class="mt-2 text-sm text-gray-500">
                    PDF, DOC, DOCX jusqu'à 10MB
                  </p>
                </div>
              </div>

              @if (fichiersSelectionnes().length > 0) {
                <div class="mt-4 space-y-2">
                  @for (fichier of fichiersSelectionnes(); track fichier.name) {
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span class="text-sm text-gray-700">{{fichier.name}}</span>
                      <button type="button" 
                              (click)="retirerFichier(fichier)"
                              class="text-red-600 hover:text-red-800">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Urgence -->
            <div>
              <label class="flex items-center">
                <input type="checkbox" 
                       [(ngModel)]="formData.urgent"
                       name="urgent"
                       class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span class="ml-2 text-sm text-gray-700">
                  Demande urgente
                </span>
              </label>
              <p class="mt-1 text-xs text-gray-500">
                Les demandes urgentes seront traitées en priorité
              </p>
            </div>

            <!-- Actions -->
            <div class="flex space-x-4 pt-6 border-t">
              <button type="submit" 
                      [disabled]="!demandeForm.form.valid || enCoursEnvoi()"
                      class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                @if (enCoursEnvoi()) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                } @else {
                  Soumettre la demande
                }
              </button>
              
              <a routerLink="/demandes" class="btn-secondary">
                Annuler
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class NouvelleDemande {
  formData = {
    type: '',
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    montant: 0,
    typeDocument: '',
    urgent: false
  };

  fichiersSelectionnes = signal<File[]>([]);
  enCoursEnvoi = signal(false);

  constructor(
    private demandeService: DemandeService,
    private authService: AuthService,
    private router: Router
  ) {}

  onTypeChange() {
    // Réinitialiser les champs spécifiques
    this.formData.dateDebut = '';
    this.formData.dateFin = '';
    this.formData.montant = 0;
    this.formData.typeDocument = '';

    // Pré-remplir le titre selon le type
    switch (this.formData.type) {
      case 'CONGE':
        this.formData.titre = 'Demande de congé';
        break;
      case 'ABSENCE':
        this.formData.titre = 'Demande d\'absence';
        break;
      case 'DOCUMENT':
        this.formData.titre = 'Demande de document';
        break;
      case 'AFFECTATION':
        this.formData.titre = 'Demande d\'affectation';
        break;
      case 'NOTE_FRAIS':
        this.formData.titre = 'Note de frais';
        break;
    }
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    const currentFiles = this.fichiersSelectionnes();
    this.fichiersSelectionnes.set([...currentFiles, ...files]);
  }

  retirerFichier(fichier: File) {
    const files = this.fichiersSelectionnes().filter(f => f !== fichier);
    this.fichiersSelectionnes.set(files);
  }

  calculerDuree(): number {
    if (this.formData.dateDebut && this.formData.dateFin) {
      const debut = new Date(this.formData.dateDebut);
      const fin = new Date(this.formData.dateFin);
      const diffTime = Math.abs(fin.getTime() - debut.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  }

  soumettreDeamnde() {
    if (!this.formData.type || !this.formData.titre || !this.formData.description) {
      return;
    }

    this.enCoursEnvoi.set(true);

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.enCoursEnvoi.set(false);
      return;
    }

    const nouvelleDemande: Omit<Demande, 'id' | 'dateCreation' | 'statut'> = {
      employeId: user.id,
      type: this.formData.type as any,
      titre: this.formData.titre,
      description: this.formData.description,
      dateDebut: this.formData.dateDebut || undefined,
      dateFin: this.formData.dateFin || undefined,
      montant: this.formData.montant || undefined,
      documents: this.fichiersSelectionnes().map(f => f.name)
    };

    this.demandeService.createDemande(nouvelleDemande).subscribe({
      next: (demande) => {
        this.enCoursEnvoi.set(false);
        this.router.navigate(['/demandes']);
        // Ici on pourrait ajouter une notification de succès
      },
      error: (error) => {
        this.enCoursEnvoi.set(false);
        console.error('Erreur lors de la création de la demande:', error);
        // Ici on pourrait ajouter une notification d'erreur
      }
    });
  }
}
