import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Candidat } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RecrutementService {
  private candidatsSubject = new BehaviorSubject<Candidat[]>([]);
  public candidats$ = this.candidatsSubject.asObservable();

  private postesOuvertsSubject = new BehaviorSubject<any[]>([]);
  public postesOuverts$ = this.postesOuvertsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockCandidats: Candidat[] = [
      {
        id: '1',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.com',
        telephone: '0123456789',
        posteVise: 'Développeur Angular',
        cv: 'cv_jean_dupont.pdf',
        lettreMotivation: 'lettre_motivation_jean.pdf',
        statut: 'PRESELECTIONNE',
        datePostulation: '2025-07-25',
        notes: 'Candidat intéressant avec 3 ans d\'expérience'
      },
      {
        id: '2',
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@email.com',
        telephone: '0123456790',
        posteVise: 'Chef de projet',
        cv: 'cv_sophie_martin.pdf',
        statut: 'ENTRETIEN',
        datePostulation: '2025-07-20',
        notes: 'Excellente expérience en gestion de projet'
      },
      {
        id: '3',
        nom: 'Leroy',
        prenom: 'Pierre',
        email: 'pierre.leroy@email.com',
        telephone: '0123456791',
        posteVise: 'Développeur Angular',
        cv: 'cv_pierre_leroy.pdf',
        statut: 'POSTULE',
        datePostulation: '2025-07-28'
      },
      {
        id: '4',
        nom: 'Moreau',
        prenom: 'Julie',
        email: 'julie.moreau@email.com',
        telephone: '0123456792',
        posteVise: 'UX Designer',
        cv: 'cv_julie_moreau.pdf',
        lettreMotivation: 'lettre_motivation_julie.pdf',
        statut: 'TEST_TECHNIQUE',
        datePostulation: '2025-07-22',
        notes: 'Portfolio très créatif'
      }
    ];

    const mockPostes = [
      {
        id: '1',
        titre: 'Développeur Angular',
        service: 'IT',
        typeContrat: 'CDI',
        salaire: '2700000',
        description: 'Développement d\'applications web avec Angular',
        competencesRequises: ['Angular', 'TypeScript', 'HTML/CSS'],
        statut: 'OUVERT',
        datePublication: '2025-07-15',
        nombreCandidatures: 2
      },
      {
        id: '2',
        titre: 'Chef de projet',
        service: 'IT',
        typeContrat: 'CDI',
        salaire: '3300000',
        description: 'Gestion de projets informatiques',
        competencesRequises: ['Gestion de projet', 'Agile', 'Communication'],
        statut: 'OUVERT',
        datePublication: '2025-07-10',
        nombreCandidatures: 1
      },
      {
        id: '3',
        titre: 'UX Designer',
        service: 'Marketing',
        typeContrat: 'CDD',
        salaire: '2400000',
        description: 'Conception d\'interfaces utilisateur',
        competencesRequises: ['UI/UX', 'Figma', 'Adobe Creative Suite'],
        statut: 'OUVERT',
        datePublication: '2025-07-18',
        nombreCandidatures: 1
      }
    ];

    this.candidatsSubject.next(mockCandidats);
    this.postesOuvertsSubject.next(mockPostes);
  }

  getCandidats(): Observable<Candidat[]> {
    return this.candidats$;
  }

  getCandidatById(id: string): Candidat | undefined {
    return this.candidatsSubject.value.find(candidat => candidat.id === id);
  }

  getCandidatsParPoste(poste: string): Candidat[] {
    return this.candidatsSubject.value.filter(candidat => candidat.posteVise === poste);
  }

  updateStatutCandidat(candidatId: string, nouveauStatut: Candidat['statut'], notes?: string): Observable<boolean> {
    return new Observable(observer => {
      const candidats = this.candidatsSubject.value;
      const candidatIndex = candidats.findIndex(c => c.id === candidatId);
      
      if (candidatIndex !== -1) {
        candidats[candidatIndex] = {
          ...candidats[candidatIndex],
          statut: nouveauStatut,
          notes: notes || candidats[candidatIndex].notes
        };
        
        this.candidatsSubject.next([...candidats]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  ajouterCandidat(candidat: Omit<Candidat, 'id'>): Observable<boolean> {
    return new Observable(observer => {
      const nouveauCandidat: Candidat = {
        ...candidat,
        id: Date.now().toString()
      };
      
      const candidats = this.candidatsSubject.value;
      candidats.push(nouveauCandidat);
      this.candidatsSubject.next([...candidats]);
      
      observer.next(true);
      observer.complete();
    });
  }

  getPostesOuverts(): Observable<any[]> {
    return this.postesOuverts$;
  }

  ajouterPoste(poste: any): Observable<boolean> {
    return new Observable(observer => {
      const nouveauPoste = {
        ...poste,
        id: Date.now().toString(),
        nombreCandidatures: 0
      };
      
      const postes = this.postesOuvertsSubject.value;
      postes.push(nouveauPoste);
      this.postesOuvertsSubject.next([...postes]);
      
      observer.next(true);
      observer.complete();
    });
  }

  supprimerPoste(posteId: string): Observable<boolean> {
    return new Observable(observer => {
      const postes = this.postesOuvertsSubject.value.filter(p => p.id !== posteId);
      this.postesOuvertsSubject.next(postes);
      observer.next(true);
      observer.complete();
    });
  }

  getStatistiquesRecrutement() {
    const candidats = this.candidatsSubject.value;
    const postes = this.postesOuvertsSubject.value;

    return {
      totalCandidatures: candidats.length,
      candidaturesParStatut: {
        POSTULE: candidats.filter(c => c.statut === 'POSTULE').length,
        PRESELECTIONNE: candidats.filter(c => c.statut === 'PRESELECTIONNE').length,
        ENTRETIEN: candidats.filter(c => c.statut === 'ENTRETIEN').length,
        TEST_TECHNIQUE: candidats.filter(c => c.statut === 'TEST_TECHNIQUE').length,
        ACCEPTE: candidats.filter(c => c.statut === 'ACCEPTE').length,
        REFUSE: candidats.filter(c => c.statut === 'REFUSE').length
      },
      postesOuverts: postes.length,
      candidaturesParPoste: postes.reduce((acc, poste) => {
        acc[poste.titre] = candidats.filter(c => c.posteVise === poste.titre).length;
        return acc;
      }, {} as { [key: string]: number })
    };
  }
}
