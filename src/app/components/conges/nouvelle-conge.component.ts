import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CongeService } from '../../services/conge.service';
import { AuthService } from '../../services/auth.service';
import { Conge } from '../../models/interfaces';

@Component({
  selector: 'app-nouvelle-conge',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <a routerLink="/conges" class="text-primary-600 hover:text-primary-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Demande de congé</h1>
          <p class="text-gray-600">Créez une nouvelle demande de congé</p>
        </div>
      </div>

      <!-- Solde disponible -->
      <div class="card bg-blue-50 border-blue-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-blue-900">Solde de congés disponible</h3>
            <p class="text-blue-700">Vous avez <span class="font-bold">18 jours</span> de congés restants pour cette année</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="card max-w-2xl">
        <form (ngSubmit)="soumettreConge()" #congeForm="ngForm">
          <div class="space-y-6">
            <!-- Type de congé -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de congé *
              </label>
              <select [(ngModel)]="formData.type" 
                      name="type"
                      required
                      class="input-field">
                <option value="">Sélectionnez un type</option>
                <option value="CONGE_PAYE">Congé payé</option>
                <option value="CONGE_MALADIE">Congé maladie</option>
                <option value="CONGE_MATERNITE">Congé maternité</option>
                <option value="CONGE_SANS_SOLDE">Congé sans solde</option>
              </select>
              
              @if (formData.type) {
                <div class="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  {{getTypeDescription(formData.type)}}
                </div>
              }
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date de début *
                </label>
                <input type="date" 
                       [(ngModel)]="formData.dateDebut"
                       name="dateDebut"
                       required
                       [min]="dateMinimum()"
                       (ngModelChange)="calculerDuree()"
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
                       [min]="formData.dateDebut"
                       (ngModelChange)="calculerDuree()"
                       class="input-field" />
              </div>
            </div>

            <!-- Durée calculée -->
            @if (formData.dateDebut && formData.dateFin) {
              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-green-800">
                      Durée: {{dureeCalculee()}} jour(s) ouvrables
                    </p>
                    <p class="text-xs text-green-700">
                      Du {{formatDate(formData.dateDebut)}} au {{formatDate(formData.dateFin)}}
                    </p>
                  </div>
                </div>
              </div>

              @if (dureeCalculee() > 18) {
                <div class="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800">
                    ⚠️ Attention: Cette demande dépasse votre solde disponible (18 jours)
                  </p>
                </div>
              }
            }

            <!-- Motif -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Motif *
              </label>
              <textarea [(ngModel)]="formData.motif"
                        name="motif"
                        required
                        rows="3"
                        placeholder="Précisez le motif de votre demande de congé"
                        class="input-field"></textarea>
            </div>

            <!-- Remplacement -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Personne de remplacement
              </label>
              <input type="text" 
                     [(ngModel)]="formData.remplacant"
                     name="remplacant"
                     placeholder="Nom de la personne qui vous remplacera (optionnel)"
                     class="input-field" />
              <p class="mt-1 text-xs text-gray-500">
                Indiquez qui peut vous remplacer pendant votre absence
              </p>
            </div>

            <!-- Contact d'urgence -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact d'urgence
              </label>
              <input type="tel" 
                     [(ngModel)]="formData.contactUrgence"
                     name="contactUrgence"
                     placeholder="+225 77 123 45 67"
                     class="input-field" />
              <p class="mt-1 text-xs text-gray-500">
                Numéro où vous joindre en cas d'urgence
              </p>
            </div>

            <!-- Upload justificatif -->
            @if (formData.type === 'CONGE_MALADIE') {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Certificat médical *
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <div class="mt-2">
                    <label for="certificat-upload" class="cursor-pointer">
                      <span class="btn-secondary">
                        Choisir le certificat
                      </span>
                      <input id="certificat-upload" 
                             name="certificat-upload" 
                             type="file" 
                             accept=".pdf,.jpg,.jpeg,.png"
                             (change)="onFileSelect($event)"
                             class="sr-only" />
                    </label>
                    <p class="mt-1 text-xs text-gray-500">
                      PDF ou image jusqu'à 5MB
                    </p>
                  </div>
                </div>

                @if (fichierSelectionne()) {
                  <div class="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span class="text-sm text-gray-700">{{fichierSelectionne()?.name}}</span>
                    <button type="button" 
                            (click)="retirerFichier()"
                            class="text-red-600 hover:text-red-800">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                }
              </div>
            }

            <!-- Préavis -->
            @if (formData.dateDebut) {
              <div class="p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Préavis: {{calculerPreavis()}} jours
                  @if (calculerPreavis() < getPreavisMinimum()) {
                    <span class="text-red-600 font-medium">(Insuffisant - minimum {{getPreavisMinimum()}} jours)</span>
                  }
                </p>
              </div>
            }

            <!-- Actions -->
            <div class="flex space-x-4 pt-6 border-t">
              <button type="submit" 
                      [disabled]="!congeForm.form.valid || enCoursEnvoi() || !peutSoumettre()"
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
              
              <a routerLink="/conges" class="btn-secondary">
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
export class NouvelleConge {
  formData = {
    type: '',
    dateDebut: '',
    dateFin: '',
    motif: '',
    remplacant: '',
    contactUrgence: ''
  };

  fichierSelectionne = signal<File | null>(null);
  enCoursEnvoi = signal(false);
  dureeCalculee = signal(0);

  constructor(
    private congeService: CongeService,
    private authService: AuthService,
    private router: Router
  ) {}

  dateMinimum(): string {
    // Minimum 2 jours à partir d'aujourd'hui pour les congés payés
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  }

  calculerDuree() {
    if (this.formData.dateDebut && this.formData.dateFin) {
      const duree = this.congeService.calculerJoursOuvrables(this.formData.dateDebut, this.formData.dateFin);
      this.dureeCalculee.set(duree);
    } else {
      this.dureeCalculee.set(0);
    }
  }

  calculerPreavis(): number {
    if (this.formData.dateDebut) {
      const aujourd_hui = new Date();
      const dateDebut = new Date(this.formData.dateDebut);
      const diffTime = dateDebut.getTime() - aujourd_hui.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  getPreavisMinimum(): number {
    switch (this.formData.type) {
      case 'CONGE_PAYE': return 15; // 15 jours minimum
      case 'CONGE_SANS_SOLDE': return 30; // 30 jours minimum
      default: return 2; // 2 jours pour urgences
    }
  }

  peutSoumettre(): boolean {
    if (!this.formData.type || !this.formData.dateDebut || !this.formData.dateFin || !this.formData.motif) {
      return false;
    }

    // Vérifier le préavis
    if (this.calculerPreavis() < this.getPreavisMinimum() && this.formData.type !== 'CONGE_MALADIE') {
      return false;
    }

    // Vérifier le certificat médical pour congé maladie
    if (this.formData.type === 'CONGE_MALADIE' && !this.fichierSelectionne()) {
      return false;
    }

    return true;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0] as File;
    if (file) {
      this.fichierSelectionne.set(file);
    }
  }

  retirerFichier() {
    this.fichierSelectionne.set(null);
  }

  getTypeDescription(type: string): string {
    switch (type) {
      case 'CONGE_PAYE': 
        return 'Congé payé annuel. Nécessite un préavis de 15 jours minimum.';
      case 'CONGE_MALADIE': 
        return 'Congé pour raison médicale. Certificat médical obligatoire.';
      case 'CONGE_MATERNITE': 
        return 'Congé maternité/paternité. Documents justificatifs requis.';
      case 'CONGE_SANS_SOLDE': 
        return 'Congé non rémunéré. Nécessite un préavis de 30 jours minimum.';
      default: 
        return '';
    }
  }

  soumettreConge() {
    if (!this.peutSoumettre()) {
      return;
    }

    this.enCoursEnvoi.set(true);

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.enCoursEnvoi.set(false);
      return;
    }

    const nouveauConge: Omit<Conge, 'id'> = {
      employeId: user.id,
      type: this.formData.type as any,
      dateDebut: this.formData.dateDebut,
      dateFin: this.formData.dateFin,
      nbJours: this.dureeCalculee(),
      statut: 'EN_ATTENTE',
      motif: this.formData.motif
    };

    this.congeService.createConge(nouveauConge).subscribe({
      next: (conge) => {
        this.enCoursEnvoi.set(false);
        this.router.navigate(['/conges']);
        // Ici on pourrait ajouter une notification de succès
      },
      error: (error) => {
        this.enCoursEnvoi.set(false);
        console.error('Erreur lors de la création du congé:', error);
        // Ici on pourrait ajouter une notification d'erreur
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
