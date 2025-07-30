import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p class="text-gray-600">Consultez et modifiez vos informations personnelles</p>
      </div>

      @if (user()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Photo et informations principales -->
          <div class="card text-center">
            <div class="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl font-bold text-white">
                {{user()?.prenom?.charAt(0)}}{{user()?.nom?.charAt(0)}}
              </span>
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{user()?.prenom}} {{user()?.nom}}</h2>
            <p class="text-gray-600">{{user()?.poste}}</p>
            <p class="text-sm text-gray-500">{{user()?.service}}</p>
            
            <div class="mt-4 pt-4 border-t">
              <span [class]="getStatutClass(user()?.statut || '')">
                {{user()?.statut}}
              </span>
            </div>
          </div>

          <!-- Informations personnelles -->
          <div class="lg:col-span-2 space-y-6">
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{user()?.matricule}}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{user()?.email}}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" 
                         [(ngModel)]="formData.telephone"
                         class="input-field text-sm" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{formatDate(user()?.dateNaissance || '')}}</p>
                </div>
              </div>
            </div>

            <!-- Informations professionnelles -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{formatDate(user()?.dateEmbauche || '')}}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{user()?.typeContrat}}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{user()?.service}}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{user()?.manager || 'Non défini'}}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ancienneté</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{calculerAnciennete()}} ans</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">{{getRoleLabel(user()?.role || '')}}</p>
                </div>
              </div>
            </div>

            <!-- Informations bancaires -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations bancaires</h3>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Banque</label>
                  <input type="text" 
                         [(ngModel)]="formData.banque"
                         class="input-field text-sm" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                  <input type="text" 
                         [(ngModel)]="formData.iban"
                         class="input-field text-sm" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">BIC</label>
                  <input type="text" 
                         [(ngModel)]="formData.bic"
                         class="input-field text-sm" />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="card">
              <div class="flex space-x-4">
                <button (click)="sauvegarder()" 
                        class="btn-primary">
                  Sauvegarder les modifications
                </button>
                
                <button (click)="resetForm()" 
                        class="btn-secondary">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">18</p>
            <p class="text-sm text-gray-500">Congés restants</p>
          </div>

          <div class="card text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">160h</p>
            <p class="text-sm text-gray-500">Heures ce mois</p>
          </div>

          <div class="card text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">3</p>
            <p class="text-sm text-gray-500">Demandes en cours</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProfilComponent implements OnInit {
  user = signal<User | null>(null);
  
  formData = {
    telephone: '',
    banque: '',
    iban: '',
    bic: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user.set(user);
      if (user) {
        this.formData = {
          telephone: user.telephone,
          banque: user.coordonneesBancaires.banque,
          iban: user.coordonneesBancaires.iban,
          bic: user.coordonneesBancaires.bic
        };
      }
    });
  }

  sauvegarder() {
    // Ici on sauvegarderait les modifications
    console.log('Sauvegarde des modifications:', this.formData);
    // Simulation d'une notification de succès
    alert('Profil mis à jour avec succès !');
  }

  resetForm() {
    const user = this.user();
    if (user) {
      this.formData = {
        telephone: user.telephone,
        banque: user.coordonneesBancaires.banque,
        iban: user.coordonneesBancaires.iban,
        bic: user.coordonneesBancaires.bic
      };
    }
  }

  calculerAnciennete(): number {
    const user = this.user();
    if (user?.dateEmbauche) {
      const embauche = new Date(user.dateEmbauche);
      const maintenant = new Date();
      const diffAnnes = maintenant.getFullYear() - embauche.getFullYear();
      return diffAnnes;
    }
    return 0;
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'ACTIF': return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'INACTIF': return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      case 'SUSPENDU': return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
      default: return 'inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'OPERATIONNEL': return 'Personnel Opérationnel';
      case 'DIRECTION': return 'Direction';
      case 'RH': return 'Équipe RH';
      default: return role;
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
