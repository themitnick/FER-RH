import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Base de données simulée des utilisateurs
  private mockUsers: User[] = [
    {
      id: '1',
      matricule: 'EMP001',
      nom: 'Kouassi',
      prenom: 'Konan',
      email: 'Konan.Kouassi@fer.ci',
      telephone: '+225 07 123 45 67',
      dateNaissance: '1985-03-15',
      dateEmbauche: '2020-01-15',
      typeContrat: 'CDI',
      poste: 'Ingénieur Développement',
      service: 'IT',
      manager: 'Amicha Jean',
      salaire: 850000,
      coordonneesBancaires: {
        banque: 'UBA Côte d\'Ivoire',
        iban: 'CI08 UB01 2345 6789 0123 4567 89',
        bic: 'UBAFCIDA'
      },
      role: 'OPERATIONNEL',
      photo: 'assets/images/users/Konan.jpg',
      statut: 'ACTIF'
    },
    {
      id: '2',
      matricule: 'DIR001',
      nom: 'kobenan',
      prenom: 'Fatou',
      email: 'fatou.kobenan@fer.ci',
      telephone: '+225 07 234 56 78',
      dateNaissance: '1978-08-22',
      dateEmbauche: '2015-03-01',
      typeContrat: 'CDI',
      poste: 'Directrice Générale',
      service: 'Direction',
      manager: undefined,
      salaire: 2500000,
      coordonneesBancaires: {
        banque: 'SGBCI',
        iban: 'CI08 SG01 2345 6789 0123 4567 89',
        bic: 'SGBCCIDA'
      },
      role: 'DIRECTION',
      photo: 'assets/images/users/fatou.jpg',
      statut: 'ACTIF'
    },
    {
      id: '3',
      matricule: 'RH001',
      nom: 'jean',
      prenom: 'Koné',
      email: 'Koné.jean@fer.ci',
      telephone: '+225 07 345 67 89',
      dateNaissance: '1982-12-10',
      dateEmbauche: '2018-06-15',
      typeContrat: 'CDI',
      poste: 'Responsable RH',
      service: 'Ressources Humaines',
      manager: 'Amicha Kobenan',
      salaire: 1200000,
      coordonneesBancaires: {
        banque: 'BACI',
        iban: 'CI08 BA01 2345 6789 0123 4567 89',
        bic: 'BACICIDA'
      },
      role: 'RH',
      photo: 'assets/images/users/Koné.jpg',
      statut: 'ACTIF'
    }
  ];

  constructor() {
    // Charger l'état d'authentification depuis le localStorage
    this.loadAuthState();
  }

  private loadAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (savedUser && isAuthenticated) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    return new Observable(observer => {
      // Simuler une authentification avec délai
      setTimeout(() => {
        // Rechercher l'utilisateur par email
        const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && password) { // Simplification: tout mot de passe non vide est accepté
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          
          // Sauvegarder l'état d'authentification
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          observer.next(user);
          observer.complete();
        } else {
          observer.error('Email ou mot de passe incorrect');
        }
      }, 1500); // Délai plus réaliste
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Supprimer l'état d'authentification
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Méthode pour obtenir les utilisateurs disponibles (pour la démo)
  getAvailableUsers(): User[] {
    return this.mockUsers.map(user => ({
      ...user,
      // Ne pas exposer les données sensibles
      salaire: 0,
      coordonneesBancaires: {
        banque: '',
        iban: '',
        bic: ''
      }
    }));
  }

  // Changer le type d'utilisateur pour les tests
  switchUserRole(role: 'OPERATIONNEL' | 'DIRECTION' | 'RH'): Observable<User> {
    return new Observable(observer => {
      const targetUser = this.mockUsers.find(u => u.role === role);
      if (targetUser) {
        this.currentUserSubject.next(targetUser);
        this.isAuthenticatedSubject.next(true);
        localStorage.setItem('currentUser', JSON.stringify(targetUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        observer.next(targetUser);
        observer.complete();
      } else {
        observer.error('Utilisateur non trouvé');
      }
    });
  }
}
