import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Logo et description -->
          <div class="col-span-1">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                  </svg>
                </div>
              </div>
              <span class="ml-2 text-lg font-semibold text-gray-900">FER</span>
            </div>
            <p class="mt-2 text-sm text-gray-600">
              Portail de digitalisation des ressources humaines. 
              Simplifiez la gestion RH avec nos outils modernes et intuitifs.
            </p>
          </div>

          <!-- Liens rapides -->
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Liens rapides
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Tableau de bord
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Mes demandes
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Pointage
                </a>
              </li>
              <li>
                <a href="#" class="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Documents
                </a>
              </li>
            </ul>
          </div>

          <!-- Support et contact -->
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Support
            </h3>
            <ul class="mt-4 space-y-2">
              <li class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                +225 33 123 45 67
              </li>
              <li class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                support&#64;fer.ci
              </li>
              <li class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Abidjan, Côte d'Ivoire
              </li>
            </ul>
          </div>
        </div>

        <!-- Séparateur et copyright -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center space-x-6">
              <p class="text-sm text-gray-500">
                © 2025 FER. Tous droits réservés.
              </p>
              <div class="hidden md:flex space-x-4">
                <a href="#" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  Politique de confidentialité
                </a>
                <a href="#" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  Conditions d'utilisation
                </a>
              </div>
            </div>
            
            <div class="mt-4 md:mt-0 flex items-center space-x-1 text-sm text-gray-500">
              <span>Développé avec</span>
              <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
              <span>par l'équipe IT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
