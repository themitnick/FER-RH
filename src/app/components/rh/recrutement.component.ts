import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recrutement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Recrutement</h1>
        <p class="text-gray-600">Gérez le processus de recrutement et les candidatures</p>
      </div>
      
      <div class="card text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Module Recrutement</h3>
        <p class="mt-2 text-gray-500">Ce module sera disponible prochainement pour l'équipe RH.</p>
      </div>
    </div>
  `
})
export class RecrutementComponent {}
