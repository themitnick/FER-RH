import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-trombinoscope',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Trombinoscope</h1>
        <p class="text-gray-600">Annuaire du personnel et organigramme de l'entreprise</p>
      </div>

      <!-- Filtres de recherche -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input type="text" 
                   [(ngModel)]="rechercheTexte"
                   (ngModelChange)="appliquerFiltres()"
                   placeholder="Rechercher une personne..." 
                   class="input-field" />
          </div>
          <div>
            <select [(ngModel)]="filtreService" 
                    (ngModelChange)="appliquerFiltres()"
                    class="input-field">
              <option value="">Tous les services</option>
              <option value="Direction">Direction</option>
              <option value="RH">Ressources Humaines</option>
              <option value="IT">Informatique</option>
              <option value="Finance">Finance</option>
              <option value="Commercial">Commercial</option>
              <option value="Operations">Opérations</option>
            </select>
          </div>
          <div>
            <select [(ngModel)]="filtreRole" 
                    (ngModelChange)="appliquerFiltres()"
                    class="input-field">
              <option value="">Tous les rôles</option>
              <option value="DIRECTION">Direction</option>
              <option value="RH">Équipe RH</option>
              <option value="OPERATIONNEL">Personnel Opérationnel</option>
            </select>
          </div>
          <div>
            <select [(ngModel)]="triPar" 
                    (ngModelChange)="appliquerFiltres()"
                    class="input-field">
              <option value="nom">Nom A-Z</option>
              <option value="service">Service</option>
              <option value="poste">Poste</option>
              <option value="anciennete">Ancienneté</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Vue en grille -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (employe of employesFiltres(); track employe.id) {
          <div class="card hover:shadow-lg transition-shadow cursor-pointer" 
               (click)="voirDetails(employe)">
            <!-- Photo et statut -->
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">
                  {{employe.prenom.charAt(0)}}{{employe.nom.charAt(0)}}
                </span>
              </div>
              <div class="absolute top-0 right-0">
                <div [class]="getStatutIndicator(employe.statut)"></div>
              </div>
            </div>

            <!-- Informations -->
            <div class="text-center">
              <h3 class="font-semibold text-gray-900">{{employe.prenom}} {{employe.nom}}</h3>
              <p class="text-sm text-primary-600 font-medium">{{employe.poste}}</p>
              <p class="text-xs text-gray-500">{{employe.service}}</p>
              
              <!-- Contact -->
              <div class="mt-3 pt-3 border-t space-y-1">
                <div class="flex items-center justify-center text-xs text-gray-600">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {{employe.email}}
                </div>
                <div class="flex items-center justify-center text-xs text-gray-600">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {{employe.telephone}}
                </div>
              </div>

              <!-- Ancienneté -->
              <div class="mt-2">
                <span class="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {{calculerAnciennete(employe.dateEmbauche)}} an(s)
                </span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun employé trouvé</h3>
            <p class="mt-2 text-gray-500">Aucun employé ne correspond à vos critères de recherche.</p>
          </div>
        }
      </div>

      <!-- Statistiques -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistiques du personnel</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600">{{getTotalEmployes()}}</div>
            <div class="text-sm text-gray-500">Total employés</div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{getEmployesActifs()}}</div>
            <div class="text-sm text-gray-500">Employés actifs</div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{getNombreServices()}}</div>
            <div class="text-sm text-gray-500">Services</div>
          </div>
        </div>

        <!-- Répartition par service -->
        <div class="mt-6">
          <h3 class="text-md font-medium text-gray-900 mb-3">Répartition par service</h3>
          <div class="space-y-2">
            @for (stat of getStatistiquesServices(); track stat.service) {
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700">{{stat.service}}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div class="bg-primary-600 h-2 rounded-full" 
                         [style.width.%]="(stat.count / getTotalEmployes()) * 100"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-8">{{stat.count}}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails (simplifié) -->
    @if (employeSelectionne()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
           (click)="fermerDetails()">
        <div class="bg-white rounded-xl max-w-md w-full p-6" (click)="$event.stopPropagation()">
          <div class="text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl font-bold text-white">
                {{employeSelectionne()?.prenom?.charAt(0) || ''}}{{employeSelectionne()?.nom?.charAt(0) || ''}}
              </span>
            </div>
            
            <h2 class="text-xl font-bold text-gray-900">{{employeSelectionne()?.prenom}} {{employeSelectionne()?.nom}}</h2>
            <p class="text-primary-600 font-medium">{{employeSelectionne()?.poste}}</p>
            <p class="text-gray-500">{{employeSelectionne()?.service}}</p>
            
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Matricule:</span>
                <span class="font-medium">{{employeSelectionne()?.matricule}}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Email:</span>
                <span class="font-medium">{{employeSelectionne()?.email}}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Téléphone:</span>
                <span class="font-medium">{{employeSelectionne()?.telephone}}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Ancienneté:</span>
                <span class="font-medium">{{calculerAnciennete(employeSelectionne()?.dateEmbauche || '')}} an(s)</span>
              </div>
            </div>
            
            <div class="mt-6 flex space-x-3">
              <button (click)="contacterEmail(employeSelectionne()?.email || '')" 
                      class="btn-primary flex-1">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Email
              </button>
              <button (click)="contacterTelephone(employeSelectionne()?.telephone || '')" 
                      class="btn-secondary flex-1">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Appeler
              </button>
            </div>
            
            <button (click)="fermerDetails()" 
                    class="mt-4 text-gray-500 hover:text-gray-700">
              Fermer
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class TrombinoscopeComponent implements OnInit {
  employes = signal<User[]>([]);
  employesFiltres = signal<User[]>([]);
  employeSelectionne = signal<User | null>(null);
  
  rechercheTexte = '';
  filtreService = '';
  filtreRole = '';
  triPar = 'nom';

  private mockEmployes: User[] = [
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
      manager: 'AmichaSall',
      salaire: 850000,
      coordonneesBancaires: { banque: 'UBA Côte d\'Ivoire', iban: 'CI08...', bic: 'UBAFCIDA' },
      role: 'OPERATIONNEL',
      statut: 'ACTIF'
    },
    {
      id: '2',
      matricule: 'DIR001',
      nom: 'Sall',
      prenom: 'Fatou',
      email: 'fatou.sall@fer.ci',
      telephone: '+225 07 234 56 78',
      dateNaissance: '1978-08-22',
      dateEmbauche: '2015-03-01',
      typeContrat: 'CDI',
      poste: 'Directrice IT',
      service: 'Direction',
      salaire: 1200000,
      coordonneesBancaires: { banque: 'SGBCI', iban: 'CI08...', bic: 'SGBCCIDA' },
      role: 'DIRECTION',
      statut: 'ACTIF'
    },
    {
      id: '3',
      matricule: 'RH001',
      nom: 'kobenan',
      prenom: 'Aminata',
      email: 'aminata.kobenan@fer.ci',
      telephone: '+225 07 345 67 89',
      dateNaissance: '1982-11-10',
      dateEmbauche: '2018-09-15',
      typeContrat: 'CDI',
      poste: 'Responsable RH',
      service: 'RH',
      salaire: 950000,
      coordonneesBancaires: { banque: 'BACI', iban: 'CI08...', bic: 'BACICIDA' },
      role: 'RH',
      statut: 'ACTIF'
    },
    {
      id: '4',
      matricule: 'FIN001',
      nom: 'Ba',
      prenom: 'Koné',
      email: 'Koné.ba@fer.ci',
      telephone: '+225 07 456 78 90',
      dateNaissance: '1980-05-18',
      dateEmbauche: '2017-01-10',
      typeContrat: 'CDI',
      poste: 'Chef Comptable',
      service: 'Finance',
      salaire: 900000,
      coordonneesBancaires: { banque: 'Ecobank Côte d\'Ivoire', iban: 'CI08...', bic: 'ECOCCIDA' },
      role: 'OPERATIONNEL',
      statut: 'ACTIF'
    },
    {
      id: '5',
      matricule: 'COM001',
      nom: 'Fall',
      prenom: 'Aissatou',
      email: 'aissatou.fall@fer.ci',
      telephone: '+225 07 567 89 01',
      dateNaissance: '1987-02-25',
      dateEmbauche: '2021-06-01',
      typeContrat: 'CDI',
      poste: 'Chargée Marketing',
      service: 'Commercial',
      salaire: 750000,
      coordonneesBancaires: { banque: 'UBA Côte d\'Ivoire', iban: 'CI08...', bic: 'UBAFCIDA' },
      role: 'OPERATIONNEL',
      statut: 'ACTIF'
    }
  ];

  ngOnInit() {
    this.employes.set(this.mockEmployes);
    this.appliquerFiltres();
  }

  appliquerFiltres() {
    let filtered = this.employes();

    // Filtrer par recherche
    if (this.rechercheTexte) {
      const recherche = this.rechercheTexte.toLowerCase();
      filtered = filtered.filter(e => 
        e.nom.toLowerCase().includes(recherche) ||
        e.prenom.toLowerCase().includes(recherche) ||
        e.poste.toLowerCase().includes(recherche) ||
        e.email.toLowerCase().includes(recherche)
      );
    }

    // Filtrer par service
    if (this.filtreService) {
      filtered = filtered.filter(e => e.service === this.filtreService);
    }

    // Filtrer par rôle
    if (this.filtreRole) {
      filtered = filtered.filter(e => e.role === this.filtreRole);
    }

    // Trier
    filtered.sort((a, b) => {
      switch (this.triPar) {
        case 'nom':
          return a.nom.localeCompare(b.nom);
        case 'service':
          return a.service.localeCompare(b.service);
        case 'poste':
          return a.poste.localeCompare(b.poste);
        case 'anciennete':
          return new Date(a.dateEmbauche).getTime() - new Date(b.dateEmbauche).getTime();
        default:
          return 0;
      }
    });

    this.employesFiltres.set(filtered);
  }

  voirDetails(employe: User) {
    this.employeSelectionne.set(employe);
  }

  fermerDetails() {
    this.employeSelectionne.set(null);
  }

  contacterEmail(email: string) {
    window.open(`mailto:${email}`, '_blank');
  }

  contacterTelephone(telephone: string) {
    window.open(`tel:${telephone}`, '_blank');
  }

  calculerAnciennete(dateEmbauche: string): number {
    const embauche = new Date(dateEmbauche);
    const maintenant = new Date();
    return maintenant.getFullYear() - embauche.getFullYear();
  }

  getStatutIndicator(statut: string): string {
    switch (statut) {
      case 'ACTIF': return 'w-3 h-3 bg-green-400 rounded-full';
      case 'INACTIF': return 'w-3 h-3 bg-red-400 rounded-full';
      case 'SUSPENDU': return 'w-3 h-3 bg-yellow-400 rounded-full';
      default: return 'w-3 h-3 bg-gray-400 rounded-full';
    }
  }

  getTotalEmployes(): number {
    return this.employes().length;
  }

  getEmployesActifs(): number {
    return this.employes().filter(e => e.statut === 'ACTIF').length;
  }

  getNombreServices(): number {
    const services = new Set(this.employes().map(e => e.service));
    return services.size;
  }

  getStatistiquesServices() {
    const stats = this.employes().reduce((acc, employe) => {
      acc[employe.service] = (acc[employe.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([service, count]) => ({
      service,
      count
    })).sort((a, b) => b.count - a.count);
  }
}
