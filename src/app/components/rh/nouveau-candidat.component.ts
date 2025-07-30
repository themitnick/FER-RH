import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecrutementService } from '../../services/recrutement.service';
import { Candidat } from '../../models/interfaces';

@Component({
  selector: 'app-nouveau-candidat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Ajouter un nouveau candidat</h3>
        <button (click)="fermer()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form (ngSubmit)="ajouterCandidat()" #candidatForm="ngForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input 
              type="text" 
              [(ngModel)]="nouveauCandidat.nom" 
              name="nom" 
              required 
              class="form-input"
              placeholder="Nom du candidat">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input 
              type="text" 
              [(ngModel)]="nouveauCandidat.prenom" 
              name="prenom" 
              required 
              class="form-input"
              placeholder="Prénom du candidat">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              type="email" 
              [(ngModel)]="nouveauCandidat.email" 
              name="email" 
              required 
              class="form-input"
              placeholder="email@exemple.com">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
            <input 
              type="tel" 
              [(ngModel)]="nouveauCandidat.telephone" 
              name="telephone" 
              required 
              class="form-input"
              placeholder="0123456789">
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Poste visé *</label>
            <select 
              [(ngModel)]="nouveauCandidat.posteVise" 
              name="posteVise" 
              required 
              class="form-select">
              <option value="">Sélectionnez un poste</option>
              <option *ngFor="let poste of postesDisponibles" [value]="poste.titre">
                {{poste.titre}} - {{poste.service}} ({{formatSalaire(poste.salaire)}} FCFA)
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CV</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              (change)="onFileSelected($event, 'cv')"
              class="form-input">
            <p class="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lettre de motivation</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              (change)="onFileSelected($event, 'lettreMotivation')"
              class="form-input">
            <p class="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (optionnel)</p>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes initiales</label>
            <textarea 
              [(ngModel)]="nouveauCandidat.notes" 
              name="notes" 
              rows="3" 
              class="form-textarea"
              placeholder="Notes sur le candidat, première impression, etc."></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            (click)="fermer()" 
            class="btn-outline">
            Annuler
          </button>
          <button 
            type="submit" 
            [disabled]="!candidatForm.form.valid || enCoursAjout" 
            class="btn-primary">
            <span *ngIf="enCoursAjout" class="spinner mr-2"></span>
            Ajouter le candidat
          </button>
        </div>
      </form>
    </div>
  `
})
export class NouveauCandidatComponent {
  @Output() candidatAjoute = new EventEmitter<void>();
  @Output() fermeture = new EventEmitter<void>();

  nouveauCandidat: Omit<Candidat, 'id'> = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    posteVise: '',
    cv: '',
    lettreMotivation: '',
    statut: 'POSTULE',
    datePostulation: new Date().toISOString().split('T')[0],
    notes: ''
  };

  postesDisponibles: any[] = [];
  enCoursAjout = false;

  constructor(private recrutementService: RecrutementService) {
    this.chargerPostesDisponibles();
  }

  chargerPostesDisponibles() {
    this.recrutementService.getPostesOuverts().subscribe(postes => {
      this.postesDisponibles = postes.filter(p => p.statut === 'OUVERT');
    });
  }

  onFileSelected(event: any, type: 'cv' | 'lettreMotivation') {
    const file = event.target.files[0];
    if (file) {
      // Dans un vrai projet, ici on uploadrait le fichier vers un serveur
      // Pour la démo, on stocke juste le nom du fichier
      if (type === 'cv') {
        this.nouveauCandidat.cv = file.name;
      } else {
        this.nouveauCandidat.lettreMotivation = file.name;
      }
    }
  }

  ajouterCandidat() {
    if (this.nouveauCandidat.nom && this.nouveauCandidat.prenom && 
        this.nouveauCandidat.email && this.nouveauCandidat.telephone && 
        this.nouveauCandidat.posteVise) {
      
      this.enCoursAjout = true;
      
      this.recrutementService.ajouterCandidat(this.nouveauCandidat).subscribe({
        next: (success) => {
          if (success) {
            this.candidatAjoute.emit();
            this.reinitialiserFormulaire();
          }
          this.enCoursAjout = false;
        },
        error: () => {
          this.enCoursAjout = false;
        }
      });
    }
  }

  fermer() {
    this.fermeture.emit();
  }

  private reinitialiserFormulaire() {
    this.nouveauCandidat = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      posteVise: '',
      cv: '',
      lettreMotivation: '',
      statut: 'POSTULE',
      datePostulation: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }

  formatSalaire(salaire: string | number): string {
    const num = typeof salaire === 'string' ? parseInt(salaire) : salaire;
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}
