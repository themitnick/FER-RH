import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-frais',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Notes de frais</h1>
        <p class="text-gray-600">Gérez vos remboursements de frais professionnels</p>
      </div>
      
      <div class="card text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Module Notes de frais</h3>
        <p class="mt-2 text-gray-500">Ce module sera disponible prochainement pour les membres de la direction.</p>
      </div>
    </div>
  `
})
export class NotesFraisComponent {}
