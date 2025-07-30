import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSettingsService, UserPreferences, UserSession } from '../../services/user-settings.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p class="text-gray-600">Gérez vos préférences et paramètres de sécurité</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Menu latéral -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button 
              *ngFor="let section of sections"
              (click)="activeSection = section.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              [class]="activeSection === section.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'">
              <div class="flex items-center space-x-3">
                <div [innerHTML]="section.icon"></div>
                <span>{{section.name}}</span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Section Notifications -->
          <div *ngIf="activeSection === 'notifications'" class="space-y-6">
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Notifications par email</p>
                    <p class="text-xs text-gray-500">Recevoir les notifications importantes par email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.emailNotifications" 
                           (change)="updatePreference('emailNotifications', $event)"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Notifications push</p>
                    <p class="text-xs text-gray-500">Recevoir des notifications dans le navigateur</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.pushNotifications" 
                           (change)="updatePreference('pushNotifications', $event)"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Notifications SMS</p>
                    <p class="text-xs text-gray-500">Recevoir des notifications urgentes par SMS</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.smsNotifications" 
                           (change)="updatePreference('smsNotifications', $event)"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Sécurité -->
          <div *ngIf="activeSection === 'securite'" class="space-y-6">
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
                          [disabled]="!passwordForm.form.valid || passwordData.new !== passwordData.confirm || changingPassword"
                          class="btn-primary">
                    <span *ngIf="changingPassword" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changement...
                    </span>
                    <span *ngIf="!changingPassword">Changer le mot de passe</span>
                  </button>
                  
                  <button type="button" 
                          (click)="resetPasswordForm()"
                          class="btn-outline">
                    Annuler
                  </button>
                </div>
              </form>
            </div>

            <!-- Authentification à deux facteurs -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Authentification à deux facteurs</h3>
              
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-sm text-gray-900">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                  <p class="text-xs text-gray-500">Vous recevrez un code par SMS lors de la connexion</p>
                </div>
                
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" 
                         [(ngModel)]="preferences.twoFactorAuth" 
                         (change)="toggleTwoFactor($event)"
                         class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div *ngIf="showTwoFactorSetup" class="p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-900 mb-2">Configuration de l'authentification à deux facteurs</h4>
                <p class="text-sm text-blue-700 mb-4">Scannez ce code QR avec votre application d'authentification</p>
                
                <div class="flex items-center space-x-4">
                  <div class="w-32 h-32 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center">
                    <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                    </svg>
                  </div>
                  
                  <div class="flex-1">
                    <p class="text-sm text-blue-700 mb-2">Codes de récupération :</p>
                    <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                      <span *ngFor="let code of backupCodes" class="bg-white px-2 py-1 rounded border">{{code}}</span>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 flex space-x-2">
                  <button (click)="confirmTwoFactor()" class="btn-primary">Confirmer</button>
                  <button (click)="cancelTwoFactor()" class="btn-outline">Annuler</button>
                </div>
              </div>
            </div>

            <!-- Sessions actives -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sessions actives</h3>
              
              <div class="space-y-3">
                <div *ngFor="let session of sessions" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
          </div>

          <!-- Section Interface -->
          <div *ngIf="activeSection === 'interface'" class="space-y-6">
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Personnalisation de l'interface</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                  <select [(ngModel)]="preferences.theme" 
                          (change)="updateTheme()"
                          class="form-select">
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">Le thème automatique s'adapte aux préférences de votre système</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                  <select [(ngModel)]="preferences.language" 
                          (change)="updatePreference('language', {target: {checked: preferences.language}})"
                          class="form-select">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
                  <select [(ngModel)]="preferences.dateFormat" 
                          (change)="updatePreference('dateFormat', {target: {checked: preferences.dateFormat}})"
                          class="form-select">
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Confidentialité -->
          <div *ngIf="activeSection === 'confidentialite'" class="space-y-6">
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Données et confidentialité</h3>
              
              <div class="space-y-6">
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Partage des données analytiques</p>
                    <p class="text-xs text-gray-500">Aider à améliorer l'application en partageant des données anonymes</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           [(ngModel)]="preferences.analyticsShare" 
                           (change)="updatePreference('analyticsShare', $event)"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div class="space-y-3">
                  <button (click)="exporterDonnees()" 
                          class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Exporter mes données</span>
                  </button>
                  
                  <button (click)="supprimerCompte()" 
                          class="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Supprimer mon compte</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions générales -->
          <div class="card">
            <div class="flex flex-col sm:flex-row gap-3">
              <button (click)="sauvegarderToutesPreferences()" 
                      [disabled]="savingPreferences"
                      class="btn-primary flex items-center justify-center">
                <svg *ngIf="savingPreferences" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sauvegarder les préférences
              </button>
              
              <button (click)="resetToutesPreferences()" 
                      class="btn-secondary">
                Réinitialiser par défaut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ParametresComponent implements OnInit {
  activeSection = 'notifications';
  preferences: UserPreferences = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    theme: 'light',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    analyticsShare: true
  };

  sessions: UserSession[] = [];
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  changingPassword = false;
  savingPreferences = false;
  showTwoFactorSetup = false;
  backupCodes: string[] = [];

  sections = [
    {
      id: 'notifications',
      name: 'Notifications',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zm4.5-13.5L17 6l-4 4v11l4-4 2.5-2.5z"></path></svg>'
    },
    {
      id: 'securite',
      name: 'Sécurité',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>'
    },
    {
      id: 'interface',
      name: 'Interface',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path></svg>'
    },
    {
      id: 'confidentialite',
      name: 'Confidentialité',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }
  ];

  constructor(
    private userSettingsService: UserSettingsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSettingsService.getPreferences().subscribe(prefs => {
      this.preferences = prefs;
    });

    this.userSettingsService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
  }

  updatePreference(key: keyof UserPreferences, event: any) {
    const value = event.target.checked !== undefined ? event.target.checked : event.target.value;
    this.userSettingsService.updatePreferences({ [key]: value });
  }

  updateTheme() {
    this.userSettingsService.updatePreferences({ theme: this.preferences.theme });
    this.userSettingsService.applyTheme(this.preferences.theme);
  }

  changerMotDePasse() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.changingPassword = true;
    
    this.userSettingsService.changePassword(this.passwordData.current, this.passwordData.new)
      .subscribe(result => {
        this.changingPassword = false;
        if (result.success) {
          alert('Mot de passe modifié avec succès !');
          this.resetPasswordForm();
        } else {
          alert(result.error || 'Erreur lors du changement de mot de passe');
        }
      });
  }

  resetPasswordForm() {
    this.passwordData = {
      current: '',
      new: '',
      confirm: ''
    };
  }

  toggleTwoFactor(event: any) {
    if (event.target.checked) {
      this.userSettingsService.enableTwoFactorAuth().subscribe(result => {
        if (result.success) {
          this.showTwoFactorSetup = true;
          this.backupCodes = result.backupCodes || [];
        }
      });
    } else {
      this.showTwoFactorSetup = false;
      this.userSettingsService.updatePreferences({ twoFactorAuth: false });
    }
  }

  confirmTwoFactor() {
    this.showTwoFactorSetup = false;
    this.userSettingsService.updatePreferences({ twoFactorAuth: true });
    alert('Authentification à deux facteurs activée avec succès !');
  }

  cancelTwoFactor() {
    this.showTwoFactorSetup = false;
    this.preferences.twoFactorAuth = false;
  }

  terminerSession(sessionId: string) {
    this.userSettingsService.terminateSession(sessionId).subscribe(() => {
      alert('Session terminée avec succès');
    });
  }

  exporterDonnees() {
    this.userSettingsService.exportUserData().subscribe(data => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mes-donnees-fer-rh.json';
      a.click();
      window.URL.revokeObjectURL(url);
    });
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
        this.userSettingsService.requestAccountDeletion().subscribe(() => {
          alert('Demande de suppression de compte enregistrée. Un email de confirmation vous sera envoyé.');
        });
      }
    }
  }

  sauvegarderToutesPreferences() {
    this.savingPreferences = true;
    
    this.userSettingsService.updatePreferences(this.preferences).subscribe(() => {
      this.savingPreferences = false;
      alert('Préférences sauvegardées avec succès !');
    });
  }

  resetToutesPreferences() {
    const confirmation = confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos préférences ?');
    
    if (confirmation) {
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
      
      this.userSettingsService.updatePreferences(this.preferences);
      alert('Préférences réinitialisées !');
    }
  }
}
