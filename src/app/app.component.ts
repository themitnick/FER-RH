import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { User } from './models/interfaces';
import { FooterComponent } from './components/footer.component';
import { LoginComponent } from './components/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule, FooterComponent, LoginComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      @if (isAuthenticated()) {
        <!-- Navigation Header -->
        <nav class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <!-- Logo et titre -->
              <div class="flex items-center">
                <div class="flex-shrink-0 flex items-center">
                  <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors" (click)="goToDashboard()">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h1 class="text-xl font-bold text-gray-900">FER</h1>
                    <p class="text-xs text-gray-500">Portail RH</p>
                  </div>
                </div>
                
                <!-- Navigation Links - Desktop -->
                <div class="hidden lg:ml-10 lg:flex lg:space-x-1">
                  <a routerLink="/dashboard" 
                     routerLinkActive="bg-primary-100 text-primary-700"
                     class="nav-link">
                    Tableau de bord
                  </a>
                  @if (canAccessOperational()) {
                    <a routerLink="/demandes" 
                       routerLinkActive="bg-primary-100 text-primary-700"
                       class="nav-link">
                      Mes demandes
                    </a>
                    <a routerLink="/pointage" 
                       routerLinkActive="bg-primary-100 text-primary-700"
                       class="nav-link">
                      Pointage
                    </a>
                    <a routerLink="/conges" 
                       routerLinkActive="bg-primary-100 text-primary-700"
                       class="nav-link">
                      Congés
                    </a>
                    <a routerLink="/performance" 
                       routerLinkActive="bg-primary-100 text-primary-700"
                       class="nav-link">
                      Performance
                    </a>
                  }
                  
                  @if (canAccessDirection() || canAccessRH()) {
                    <a routerLink="/trombinoscope" 
                       routerLinkActive="bg-primary-100 text-primary-700"
                       class="nav-link">
                      Personnel
                    </a>
                  }
                  
                  @if (canAccessRH()) {
                    <a routerLink="/rh/recrutement" 
                       routerLinkActive="bg-primary-100 text-primary-700"
                       class="nav-link">
                      Recrutement
                    </a>
                  }
                </div>
              </div>

              <!-- Bouton menu mobile et profil utilisateur -->
              <div class="flex items-center space-x-4">
                <!-- Bouton hamburger pour mobile -->
                <button class="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                        (click)="toggleMobileMenu()">
                  <svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                <!-- User Profile avec dropdown -->
                <div class="relative" (click)="toggleUserMenu()">
                  <button class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-white">
                        <span class="text-sm font-bold text-white">
                          {{user()?.prenom?.charAt(0) || ''}}{{user()?.nom?.charAt(0) || ''}}
                        </span>
                      </div>
                    </div>
                    <div class="hidden md:block text-left">
                      <div class="text-sm font-semibold text-gray-900">{{user()?.prenom}} {{user()?.nom}}</div>
                      <div class="text-xs text-gray-500">{{getRoleLabel(user()?.role || '')}}</div>
                    </div>
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  @if (showUserMenu()) {
                    <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <!-- User Info Section -->
                      <div class="px-4 py-3 border-b border-gray-100">
                        <div class="flex items-center space-x-3">
                          <div class="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                            <span class="text-lg font-bold text-white">
                              {{user()?.prenom?.charAt(0) || ''}}{{user()?.nom?.charAt(0) || ''}}
                            </span>
                          </div>
                          <div class="flex-1">
                            <div class="font-semibold text-gray-900">{{user()?.prenom}} {{user()?.nom}}</div>
                            <div class="text-sm text-gray-500">{{user()?.email}}</div>
                            <div class="text-xs text-primary-600 font-medium">{{getRoleLabel(user()?.role || '')}}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Quick Info -->
                      <div class="px-4 py-3 border-b border-gray-100">
                        <div class="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span class="text-gray-500">Matricule:</span>
                            <div class="font-medium text-gray-900">{{user()?.matricule}}</div>
                          </div>
                          <div>
                            <span class="text-gray-500">Service:</span>
                            <div class="font-medium text-gray-900">{{user()?.service}}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="py-2">
                        <a routerLink="/profil" 
                           (click)="showUserMenu.set(false)"
                           class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 block">
                          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span>Mon profil</span>
                        </a>
                        <a routerLink="/parametres" 
                           (click)="showUserMenu.set(false)"
                           class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 block">
                          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span>Paramètres</span>
                        </a>
                        <div class="border-t border-gray-100 mt-2 pt-2">
                          <button (click)="logout()" 
                                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors">
                            <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9"></path>
                            </svg>
                            <span>Se déconnecter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </nav>

        <!-- Menu Mobile -->
        @if (showMobileMenu()) {
          <div class="lg:hidden bg-white border-b border-gray-200 shadow-sm">
            <div class="px-4 py-2 space-y-1">
              <a routerLink="/dashboard" 
                 (click)="closeMobileMenu()"
                 routerLinkActive="bg-primary-100 text-primary-700"
                 class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                Tableau de bord
              </a>
              @if (canAccessOperational()) {
                <a routerLink="/demandes" 
                   (click)="closeMobileMenu()"
                   routerLinkActive="bg-primary-100 text-primary-700"
                   class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                  Mes demandes
                </a>
                <a routerLink="/pointage" 
                   (click)="closeMobileMenu()"
                   routerLinkActive="bg-primary-100 text-primary-700"
                   class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                  Pointage
                </a>
                <a routerLink="/conges" 
                   (click)="closeMobileMenu()"
                   routerLinkActive="bg-primary-100 text-primary-700"
                   class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                  Congés
                </a>
                <a routerLink="/performance" 
                   (click)="closeMobileMenu()"
                   routerLinkActive="bg-primary-100 text-primary-700"
                   class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                  Performance
                </a>
              }
              
              @if (canAccessDirection() || canAccessRH()) {
                <a routerLink="/trombinoscope" 
                   (click)="closeMobileMenu()"
                   routerLinkActive="bg-primary-100 text-primary-700"
                   class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                  Personnel
                </a>
              }
              
              @if (canAccessRH()) {
                <a routerLink="/rh/recrutement" 
                   (click)="closeMobileMenu()"
                   routerLinkActive="bg-primary-100 text-primary-700"
                   class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200">
                  Recrutement
                </a>
              }
            </div>
          </div>
        }

        <!-- Main Content -->
        <main class="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <app-footer></app-footer>
      } @else {
        <!-- Login Component - Page complète sans éléments supplémentaires -->
        <app-login></app-login>
      }
    </div>
  `,
  styles: [`
    .nav-link {
      @apply flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200;
    }
  `]
})
export class AppComponent implements OnInit {
  user = signal<User | null>(null);
  showUserMenu = signal<boolean>(false);
  showMobileMenu = signal<boolean>(false);
  
  // Utiliser un signal pour l'état d'authentification qui se met à jour automatiquement
  isAuthenticated = signal<boolean>(false);

  canAccessOperational = computed(() => {
    const currentUser = this.user();
    return currentUser && ['OPERATIONNEL', 'DIRECTION', 'RH'].includes(currentUser.role);
  });

  canAccessDirection = computed(() => {
    const currentUser = this.user();
    return currentUser && ['DIRECTION', 'RH'].includes(currentUser.role);
  });

  canAccessRH = computed(() => {
    const currentUser = this.user();
    return currentUser && currentUser.role === 'RH';
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.user.set(user);
      // Ne plus gérer la redirection automatique ici pour éviter les conflits
      // La redirection sera gérée par le composant de login
    });

    // S'abonner aux changements d'état d'authentification
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated.set(isAuth);
      if (!isAuth) {
        // Réinitialiser les données utilisateur lors de la déconnexion
        this.user.set(null);
        this.showUserMenu.set(false);
        // Rediriger vers la page de login si on n'y est pas déjà
        if (this.router.url !== '/' && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.showUserMenu.set(false);
    this.authService.logout();
    // La navigation sera gérée par l'abonnement isAuthenticated$ dans ngOnInit
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  toggleUserMenu() {
    this.showUserMenu.update(show => !show);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(show => !show);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeUserMenu(event: Event) {
    if (!(event.target as Element).closest('.relative')) {
      this.showUserMenu.set(false);
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'DIRECTION': return 'Direction';
      case 'RH': return 'Ressources Humaines';
      case 'OPERATIONNEL': return 'Personnel Opérationnel';
      default: return 'Utilisateur';
    }
  }
}
