import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  analyticsShare: boolean;
}

export interface UserSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private preferencesSubject = new BehaviorSubject<UserPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    theme: 'light',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    analyticsShare: true
  });

  private sessionsSubject = new BehaviorSubject<UserSession[]>([
    {
      id: '1',
      device: 'Chrome sur Windows',
      location: 'Paris, France',
      lastActive: 'Maintenant',
      current: true,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '2',
      device: 'Safari sur iPhone',
      location: 'Paris, France',
      lastActive: 'Il y a 2 heures',
      current: false,
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
    }
  ]);

  public preferences$ = this.preferencesSubject.asObservable();
  public sessions$ = this.sessionsSubject.asObservable();

  constructor() {
    this.loadPreferencesFromStorage();
  }

  getPreferences(): Observable<UserPreferences> {
    return this.preferences$;
  }

  updatePreferences(preferences: Partial<UserPreferences>): Observable<boolean> {
    return new Observable(observer => {
      const currentPrefs = this.preferencesSubject.value;
      const newPrefs = { ...currentPrefs, ...preferences };
      
      this.preferencesSubject.next(newPrefs);
      this.savePreferencesToStorage(newPrefs);
      
      observer.next(true);
      observer.complete();
    });
  }

  getSessions(): Observable<UserSession[]> {
    return this.sessions$;
  }

  terminateSession(sessionId: string): Observable<boolean> {
    return new Observable(observer => {
      const sessions = this.sessionsSubject.value.filter(s => s.id !== sessionId);
      this.sessionsSubject.next(sessions);
      observer.next(true);
      observer.complete();
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; error?: string }> {
    return new Observable(observer => {
      // Simulation de la validation du mot de passe actuel
      if (currentPassword !== 'password123') {
        observer.next({ success: false, error: 'Mot de passe actuel incorrect' });
        observer.complete();
        return;
      }

      if (newPassword.length < 8) {
        observer.next({ success: false, error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
        observer.complete();
        return;
      }

      // Simulation du changement de mot de passe
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  enableTwoFactorAuth(): Observable<{ success: boolean; qrCode?: string; backupCodes?: string[] }> {
    return new Observable(observer => {
      // Simulation de l'activation du 2FA
      setTimeout(() => {
        const backupCodes = [
          '1234-5678', '2345-6789', '3456-7890', '4567-8901', '5678-9012',
          '6789-0123', '7890-1234', '8901-2345', '9012-3456', '0123-4567'
        ];
        
        observer.next({
          success: true,
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
          backupCodes
        });
        observer.complete();
      }, 1000);
    });
  }

  disableTwoFactorAuth(code: string): Observable<{ success: boolean; error?: string }> {
    return new Observable(observer => {
      // Simulation de la désactivation du 2FA
      if (code !== '123456') {
        observer.next({ success: false, error: 'Code de vérification incorrect' });
      } else {
        observer.next({ success: true });
      }
      observer.complete();
    });
  }

  exportUserData(): Observable<any> {
    return new Observable(observer => {
      const userData = {
        preferences: this.preferencesSubject.value,
        sessions: this.sessionsSubject.value,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      observer.next(userData);
      observer.complete();
    });
  }

  requestAccountDeletion(reason?: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulation de la demande de suppression
      console.log('Demande de suppression de compte:', { reason, date: new Date() });
      
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  private loadPreferencesFromStorage(): void {
    const stored = localStorage.getItem('user-preferences');
    if (stored) {
      try {
        const preferences = JSON.parse(stored);
        this.preferencesSubject.next(preferences);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      }
    }
  }

  private savePreferencesToStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  }

  // Méthodes utilitaires pour les thèmes
  applyTheme(theme: UserPreferences['theme']): void {
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else if (theme === 'light') {
      htmlElement.classList.remove('dark');
    } else {
      // Auto: basé sur les préférences du système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }
  }

  // Méthode pour formater les dates selon les préférences
  formatDate(date: Date, format?: UserPreferences['dateFormat']): string {
    const prefs = this.preferencesSubject.value;
    const dateFormat = format || prefs.dateFormat;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
      default:
        return `${day}/${month}/${year}`;
    }
  }
}
