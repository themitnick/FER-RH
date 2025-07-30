import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PointageService } from '../../services/pointage.service';
import { AuthService } from '../../services/auth.service';
import { Pointage } from '../../models/interfaces';

@Component({
  selector: 'app-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Système de pointage</h1>
        <p class="text-gray-600">Gérez vos heures de travail et consultez votre historique</p>
      </div>

      <!-- Pointage du jour -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Pointage d'aujourd'hui</h2>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900 mb-2">
            {{heureActuelle()}}
          </div>
          <div class="text-sm text-gray-500 mb-6">
            {{dateActuelle()}}
          </div>

          @if (!pointageJour()?.heureArrivee) {
            <!-- Pas encore pointé -->
            <div class="space-y-4">
              <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p class="text-yellow-800 text-sm">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Vous n'avez pas encore pointé aujourd'hui
                </p>
              </div>
              <button (click)="pointageArrivee()" 
                      class="btn-primary text-lg px-8 py-3">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Pointer l'arrivée
              </button>
            </div>
          } @else if (!pointageJour()?.heureDepart) {
            <!-- Arrivée pointée, en attente du départ -->
            <div class="space-y-4">
              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <p class="text-green-800 text-sm font-medium">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Arrivée pointée à {{pointageJour()?.heureArrivee}}
                </p>
                <p class="text-green-700 text-xs mt-1">
                  Temps de travail actuel: {{calculerTempsTravailActuel()}}
                </p>
              </div>
              <button (click)="pointageDepart()" 
                      class="btn-secondary text-lg px-8 py-3">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9"></path>
                </svg>
                Pointer le départ
              </button>
            </div>
          } @else {
            <!-- Pointage terminé -->
            <div class="space-y-4">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-blue-800 text-sm font-medium">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Pointage terminé pour aujourd'hui
                </p>
                <div class="mt-2 space-y-1 text-blue-700 text-xs">
                  <p>Arrivée: {{pointageJour()?.heureArrivee}}</p>
                  <p>Départ: {{pointageJour()?.heureDepart}}</p>
                  <p>Temps travaillé: {{pointageJour()?.heuresTravaillees}}h</p>
                </div>
              </div>
              
              <div [class]="getStatutColor(pointageJour()?.statut || '')">
                {{getStatutLabel(pointageJour()?.statut || '')}}
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Historique -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Statistiques du mois -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Ce mois-ci</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Jours travaillés</span>
              <span class="font-semibold">{{statistiques()?.totalJours || 0}}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Heures totales</span>
              <span class="font-semibold">{{statistiques()?.totalHeures || 0}}h</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Retards</span>
              <span class="font-semibold text-yellow-600">{{statistiques()?.joursRetard || 0}}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Absences</span>
              <span class="font-semibold text-red-600">{{statistiques()?.joursAbsents || 0}}</span>
            </div>
          </div>
        </div>

        <!-- Filtre période -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Consulter l'historique</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select [(ngModel)]="periodeSelectionnee" 
                      (ngModelChange)="chargerHistorique()"
                      class="input-field">
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="trimestre">Ce trimestre</option>
                <option value="personnalisee">Période personnalisée</option>
              </select>
            </div>

            @if (periodeSelectionnee === 'personnalisee') {
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <input type="date" 
                         [(ngModel)]="dateDebut"
                         class="input-field" />
                </div>
                <div>
                  <input type="date" 
                         [(ngModel)]="dateFin"
                         class="input-field" />
                </div>
              </div>
              <button (click)="chargerHistorique()" 
                      class="btn-primary w-full">
                Charger
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Historique des pointages -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Historique des pointages</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (pointage of historiquePointages(); track pointage.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{formatDate(pointage.date)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{pointage.heureArrivee || '-'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{pointage.heureDepart || '-'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{pointage.heuresTravaillees || 0}}h
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatutClass(pointage.statut)">
                      {{getStatutLabel(pointage.statut)}}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    Aucun pointage trouvé pour cette période
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PointageComponent implements OnInit {
  pointageJour = signal<Pointage | null>(null);
  historiquePointages = signal<Pointage[]>([]);
  statistiques = signal<any>(null);
  
  heureActuelle = signal('');
  dateActuelle = signal('');
  
  periodeSelectionnee = 'mois';
  dateDebut = '';
  dateFin = '';

  constructor(
    private pointageService: PointageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.mettreAJourHeure();
    this.chargerDonnees();
    
    // Mettre à jour l'heure chaque seconde
    setInterval(() => this.mettreAJourHeure(), 1000);
  }

  private mettreAJourHeure() {
    const maintenant = new Date();
    this.heureActuelle.set(maintenant.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }));
    this.dateActuelle.set(maintenant.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }

  private chargerDonnees() {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Charger le pointage du jour
      this.pointageService.getPointagesDuJour(user.id).subscribe(pointage => {
        this.pointageJour.set(pointage);
      });

      // Charger les statistiques du mois
      const moisActuel = new Date().toISOString().slice(0, 7);
      this.pointageService.getStatistiquesPointage(user.id, moisActuel).subscribe(stats => {
        this.statistiques.set(stats);
      });

      this.chargerHistorique();
    }
  }

  chargerHistorique() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    let dateDebut: string;
    let dateFin: string;

    const aujourd_hui = new Date();
    
    switch (this.periodeSelectionnee) {
      case 'semaine':
        const debutSemaine = new Date(aujourd_hui);
        debutSemaine.setDate(aujourd_hui.getDate() - aujourd_hui.getDay());
        dateDebut = debutSemaine.toISOString().split('T')[0];
        dateFin = aujourd_hui.toISOString().split('T')[0];
        break;
      case 'mois':
        dateDebut = new Date(aujourd_hui.getFullYear(), aujourd_hui.getMonth(), 1).toISOString().split('T')[0];
        dateFin = aujourd_hui.toISOString().split('T')[0];
        break;
      case 'trimestre':
        const trimestre = Math.floor(aujourd_hui.getMonth() / 3);
        dateDebut = new Date(aujourd_hui.getFullYear(), trimestre * 3, 1).toISOString().split('T')[0];
        dateFin = aujourd_hui.toISOString().split('T')[0];
        break;
      case 'personnalisee':
        dateDebut = this.dateDebut;
        dateFin = this.dateFin;
        break;
      default:
        return;
    }

    if (dateDebut && dateFin) {
      this.pointageService.getPointagesPeriode(user.id, dateDebut, dateFin).subscribe(pointages => {
        this.historiquePointages.set(pointages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
    }
  }

  pointageArrivee() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.pointageService.enregistrerArrivee(user.id).subscribe({
        next: (pointage) => {
          this.pointageJour.set(pointage);
          this.chargerDonnees();
        },
        error: (error) => {
          console.error('Erreur pointage arrivée:', error);
        }
      });
    }
  }

  pointageDepart() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.pointageService.enregistrerDepart(user.id).subscribe({
        next: (pointage) => {
          this.pointageJour.set(pointage);
          this.chargerDonnees();
        },
        error: (error) => {
          console.error('Erreur pointage départ:', error);
        }
      });
    }
  }

  calculerTempsTravailActuel(): string {
    const pointage = this.pointageJour();
    if (pointage?.heureArrivee) {
      const [heureArr, minuteArr] = pointage.heureArrivee.split(':').map(Number);
      const maintenant = new Date();
      const heureActuelle = maintenant.getHours() + maintenant.getMinutes() / 60;
      const heureArrivee = heureArr + minuteArr / 60;
      const tempsTravaille = heureActuelle - heureArrivee;
      
      const heures = Math.floor(tempsTravaille);
      const minutes = Math.round((tempsTravaille - heures) * 60);
      
      return `${heures}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return '0h';
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'PRESENT': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'RETARD': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
      case 'ABSENT': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      default: return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'PRESENT': return 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800';
      case 'RETARD': return 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800';
      case 'ABSENT': return 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800';
      default: return 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'PRESENT': return 'Présent';
      case 'RETARD': return 'Retard';
      case 'ABSENT': return 'Absent';
      case 'PARTIEL': return 'Partiel';
      default: return 'Non défini';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}
