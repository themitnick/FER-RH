import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-screen w-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center px-4 sm:px-6 lg:px-8 fixed inset-0 overflow-hidden">
      <div class="max-w-md w-full space-y-4">
        <!-- Logo et titre -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg class="h-10 w-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
            </svg>
          </div>
          <h2 class="mt-4 text-center text-2xl font-extrabold text-white">
            FER - Portail RH
          </h2>
          <p class="mt-1 text-center text-sm text-primary-100">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        <!-- Formulaire de connexion -->
        <form class="mt-4 space-y-4" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="bg-white rounded-lg shadow-xl p-8 space-y-6">
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div class="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    [(ngModel)]="loginData.email"
                    [disabled]="isLoading()"
                    class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors"
                    placeholder="votre.email&#64;fer.ci">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div class="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    [(ngModel)]="loginData.password"
                    [disabled]="isLoading()"
                    class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm pr-10 transition-colors"
                    placeholder="••••••••">
                  <button
                    type="button"
                    (click)="togglePassword()"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg *ngIf="!showPassword()" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg *ngIf="showPassword()" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div *ngIf="errorMessage()" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ errorMessage() }}</p>
                </div>
              </div>
            </div>

            <!-- Bouton de connexion -->
            <div>
              <button
                type="submit"
                [disabled]="isLoading() || !loginForm.form.valid"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                <span *ngIf="isLoading()" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading() ? 'Connexion en cours...' : 'Se connecter' }}
              </button>
            </div>

            <!-- Comptes de démonstration -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Comptes de démonstration :</h3>
              <div class="grid grid-cols-1 gap-1">
                <button
                  type="button"
                  (click)="loginAsDemo('OPERATIONNEL')"
                  [disabled]="isLoading()"
                  class="text-left p-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50">
                  <div class="font-medium text-sm text-gray-900">Personnel Opérationnel</div>
                  <div class="text-xs text-gray-500">Konan.Kouassi&#64;fer.ci</div>
                </button>
                <button
                  type="button"
                  (click)="loginAsDemo('RH')"
                  [disabled]="isLoading()"
                  class="text-left p-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50">
                  <div class="font-medium text-sm text-gray-900">Équipe RH</div>
                  <div class="text-xs text-gray-500">Koné.jean&#64;fer.ci</div>
                </button>
                <button
                  type="button"
                  (click)="loginAsDemo('DIRECTION')"
                  [disabled]="isLoading()"
                  class="text-left p-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50">
                  <div class="font-medium text-sm text-gray-900">Direction</div>
                  <div class="text-xs text-gray-500">fatou.kobenan&#64;fer.ci</div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error);
      }
    });
  }

  loginAsDemo(role: 'OPERATIONNEL' | 'DIRECTION' | 'RH') {
    this.errorMessage.set('');

    // Définir les identifiants de démo selon le rôle
    const demoCredentials = {
      OPERATIONNEL: { email: 'Konan.Kouassi@fer.ci', password: 'demo123' },
      RH: { email: 'Koné.jean@fer.ci', password: 'demo123' },
      DIRECTION: { email: 'fatou.kobenan@fer.ci', password: 'demo123' }
    };

    // Pré-remplir les champs
    this.loginData.email = demoCredentials[role].email;
    this.loginData.password = demoCredentials[role].password;

    // Connecter automatiquement
    this.isLoading.set(true);
    
    // Simuler un délai de connexion
    setTimeout(() => {
      this.authService.switchUserRole(role);
      this.isLoading.set(false);
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }
}
