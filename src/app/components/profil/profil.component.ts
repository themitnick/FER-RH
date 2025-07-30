import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserSettingsService, UserPreferences } from '../../services/user-settings.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p class="text-gray-600">Consultez et modifiez vos informations personnelles</p>
        </div>
        <div class="flex space-x-3">
          <button 
            (click)="activeTab = 'profil'" 
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            [ngClass]="{
              'bg-blue-600 text-white shadow-md': activeTab === 'profil',
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeTab !== 'profil'
            }">
            Profil
          </button>
          <button 
            (click)="activeTab = 'securite'" 
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            [ngClass]="{
              'bg-blue-600 text-white shadow-md': activeTab === 'securite',
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeTab !== 'securite'
            }">
            Sécurité
          </button>
          <button 
            (click)="activeTab = 'preferences'" 
            class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            [ngClass]="{
              'bg-blue-600 text-white shadow-md': activeTab === 'preferences',
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeTab !== 'preferences'
            }">
            Préférences
          </button>
        </div>
      </div>

      @if (user()) {
        <!-- Onglet Profil -->
        @if (activeTab === 'profil') {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Photo et informations principales -->
            <div class="card text-center">
              <div class="relative w-32 h-32 mx-auto mb-4">
                <div class="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-3xl font-bold text-white">
                    {{user()?.prenom?.charAt(0)}}{{user()?.nom?.charAt(0)}}
                  </span>
                </div>
                <button class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
              <h2 class="text-xl font-bold text-gray-900">{{user()?.prenom}} {{user()?.nom}}</h2>
              <p class="text-gray-600">{{user()?.poste}}</p>
              <p class="text-sm text-gray-500">{{user()?.service}}</p>
              
              <div class="mt-4 pt-4 border-t">
                <span [class]="getStatutClass(user()?.statut || '')">
                  {{user()?.statut}}
                </span>
              </div>

              <!-- QR Code pour badge -->
              <div class="mt-4 pt-4 border-t">
                <div class="w-24 h-24 bg-gray-100 mx-auto rounded-lg flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </div>
                <p class="text-xs text-gray-500 mt-2">Badge numérique</p>
              </div>
            </div>

            <!-- Informations personnelles -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Informations de base -->
              <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{user()?.matricule}}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{user()?.email}}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input type="tel" 
                           [(ngModel)]="formData.telephone"
                           class="form-input text-sm" 
                           placeholder="Numéro de téléphone" />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{formatDate(user()?.dateNaissance || '')}}</p>
                  </div>
                </div>
              </div>

              <!-- Informations professionnelles -->
              <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{formatDate(user()?.dateEmbauche || '')}}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{user()?.typeContrat}}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{user()?.service}}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{user()?.manager || 'Non défini'}}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ancienneté</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{calculerAnciennete()}} ans</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <p class="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg border">{{getRoleLabel(user()?.role || '')}}</p>
                  </div>
                </div>
              </div>

              <!-- Informations bancaires -->
              <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations bancaires</h3>
                <p class="text-sm text-gray-600 mb-4">Ces informations sont utilisées pour le virement de votre salaire</p>
                
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Banque *</label>
                    <input type="text" 
                           [(ngModel)]="formData.banque"
                           class="form-input text-sm" 
                           placeholder="Nom de votre banque" />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">IBAN *</label>
                    <input type="text" 
                           [(ngModel)]="formData.iban"
                           class="form-input text-sm" 
                           placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">BIC *</label>
                    <input type="text" 
                           [(ngModel)]="formData.bic"
                           class="form-input text-sm" 
                           placeholder="Code BIC/SWIFT de votre banque" />
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="card">
                <div class="flex flex-col sm:flex-row gap-3">
                  <button (click)="sauvegarder()" 
                          [disabled]="enCoursSauvegarde"
                          class="btn-primary flex items-center justify-center">
                    <svg *ngIf="enCoursSauvegarde" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sauvegarder les modifications
                  </button>
                  
                  <button (click)="resetForm()" 
                          class="btn-secondary">
                    Annuler les modifications
                  </button>
                  
                  <button (click)="telechargerBadge()" 
                          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Télécharger badge
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Onglet Sécurité -->
        @if (activeTab === 'securite') {
          <div class="max-w-4xl mx-auto space-y-6">
            <!-- Changement de mot de passe -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
              
              <form (ngSubmit)="changerMotDePasse()" #passwordForm="ngForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                  <input type="password" 
                         [(ngModel)]="passwordData.current"
                         name="current"
                         required
                         class="form-input" 
                         placeholder="Votre mot de passe actuel" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input type="password" 
                         [(ngModel)]="passwordData.new"
                         name="new"
                         required
                         minlength="8"
                         class="form-input" 
                         placeholder="Nouveau mot de passe (min 8 caractères)" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <input type="password" 
                         [(ngModel)]="passwordData.confirm"
                         name="confirm"
                         required
                         class="form-input" 
                         placeholder="Confirmer le nouveau mot de passe" />
                </div>
                
                <div class="flex items-center space-x-3">
                  <button type="submit" 
                          [disabled]="!passwordForm.form.valid || passwordData.new !== passwordData.confirm"
                          class="btn-primary">
                    Changer le mot de passe
                  </button>
                  
                  <button type="button" 
                          (click)="resetPasswordForm()"
                          class="btn-outline">
                    Annuler
                  </button>
                </div>
              </form>
            </div>

            <!-- Sessions actives -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sessions actives</h3>
              
              <div class="space-y-3">
                <div *ngFor="let session of sessionsActives" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{session.device}}</p>
                      <p class="text-xs text-gray-500">{{session.location}} • {{session.lastActive}}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <span *ngIf="session.current" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Session actuelle
                    </span>
                    <button *ngIf="!session.current" 
                            (click)="terminerSession(session.id)"
                            class="text-red-600 hover:text-red-800 text-sm">
                      Terminer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Authentification à deux facteurs -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Authentification à deux facteurs</h3>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-900">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                  <p class="text-xs text-gray-500">Vous recevrez un code par SMS lors de la connexion</p>
                </div>
                
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" 
                         [(ngModel)]="preferences.twoFactorAuth" 
                         class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        }

        <!-- Onglet Préférences -->
        @if (activeTab === 'preferences') {
          <div class="max-w-4xl mx-auto space-y-6">
            <!-- Notifications -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Notifications par email</p>
                    <p class="text-xs text-gray-500">Recevoir les notifications importantes par email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.emailNotifications" 
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Notifications push</p>
                    <p class="text-xs text-gray-500">Recevoir des notifications dans le navigateur</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.pushNotifications" 
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Notifications SMS</p>
                    <p class="text-xs text-gray-500">Recevoir des notifications urgentes par SMS</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.smsNotifications" 
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Interface -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Interface</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                  <select [(ngModel)]="preferences.theme" class="form-select">
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                  <select [(ngModel)]="preferences.language" class="form-select">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
                  <select [(ngModel)]="preferences.dateFormat" class="form-select">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Données et confidentialité -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Données et confidentialité</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Partage des données analytiques</p>
                    <p class="text-xs text-gray-500">Aider à améliorer l'application en partageant des données anonymes</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.analyticsShare" 
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div class="pt-4 border-t">
                  <button (click)="exporterDonnees()" 
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Exporter mes données
                  </button>
                </div>
                
                <div class="pt-2">
                  <button (click)="supprimerCompte()" 
                          class="text-red-600 hover:text-red-800 text-sm font-medium">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions préférences -->
            <div class="card">
              <div class="flex flex-col sm:flex-row gap-3">
                <button (click)="sauvegarderPreferences()" 
                        [disabled]="enCoursSauvegardePrefs"
                        class="btn-primary flex items-center justify-center">
                  <svg *ngIf="enCoursSauvegardePrefs" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sauvegarder les préférences
                </button>
                
                <button (click)="resetPreferences()" 
                        class="btn-secondary">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Statistiques personnelles -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{statistiques.congesRestants}}</p>
            <p class="text-sm text-gray-500">Congés restants</p>
          </div>

          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{statistiques.heuresMois}}h</p>
            <p class="text-sm text-gray-500">Heures ce mois</p>
          </div>

          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{statistiques.demandesEnCours}}</p>
            <p class="text-sm text-gray-500">Demandes en cours</p>
          </div>

          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{statistiques.tauxPresence}}%</p>
            <p class="text-sm text-gray-500">Taux de présence</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProfilComponent implements OnInit {
  user = signal<User | null>(null);
  activeTab = 'profil';
  enCoursSauvegarde = false;
  enCoursSauvegardePrefs = false;
  
  formData = {
    telephone: '',
    banque: '',
    iban: '',
    bic: ''
  };

  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  preferences = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    theme: 'light',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    analyticsShare: true
  };

  sessionsActives = [
    {
      id: '1',
      device: 'Chrome sur Windows',
      location: 'Paris, France',
      lastActive: 'Maintenant',
      current: true
    },
    {
      id: '2',
      device: 'Safari sur iPhone',
      location: 'Paris, France',
      lastActive: 'Il y a 2 heures',
      current: false
    }
  ];

  statistiques = {
    congesRestants: 18,
    heuresMois: 160,
    demandesEnCours: 3,
    tauxPresence: 95
  };

  constructor(
    private authService: AuthService,
    private userSettingsService: UserSettingsService
  ) {}

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
    this.enCoursSauvegarde = true;
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      console.log('Sauvegarde des modifications:', this.formData);
      this.enCoursSauvegarde = false;
      alert('Profil mis à jour avec succès !');
    }, 1500);
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

  telechargerBadge() {
    // Simulation du téléchargement du badge
    alert('Téléchargement du badge numérique en cours...');
  }

  changerMotDePasse() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.passwordData.new.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Simulation du changement de mot de passe
    console.log('Changement de mot de passe');
    alert('Mot de passe modifié avec succès !');
    this.resetPasswordForm();
  }

  resetPasswordForm() {
    this.passwordData = {
      current: '',
      new: '',
      confirm: ''
    };
  }

  terminerSession(sessionId: string) {
    this.sessionsActives = this.sessionsActives.filter(s => s.id !== sessionId);
    alert('Session terminée avec succès');
  }

  sauvegarderPreferences() {
    this.enCoursSauvegardePrefs = true;
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      console.log('Sauvegarde des préférences:', this.preferences);
      this.enCoursSauvegardePrefs = false;
      alert('Préférences sauvegardées avec succès !');
    }, 1000);
  }

  resetPreferences() {
    this.preferences = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      twoFactorAuth: false,
      theme: 'light',
      language: 'fr',
      dateFormat: 'DD/MM/YYYY',
      analyticsShare: true
    };
  }

  exporterDonnees() {
    // Simulation de l'export des données
    const donnees = {
      profil: this.user(),
      preferences: this.preferences,
      dateExport: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes-donnees-fer-rh.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  supprimerCompte() {
    const confirmation = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );
    
    if (confirmation) {
      const doubleConfirmation = confirm(
        'Cette action va supprimer définitivement toutes vos données. Confirmez-vous ?'
      );
      
      if (doubleConfirmation) {
        alert('Demande de suppression de compte enregistrée. Un email de confirmation vous sera envoyé.');
      }
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
