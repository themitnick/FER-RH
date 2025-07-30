import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvaluationPerformance, Objectif, PlanDeveloppement, FeedbackPerformance } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private evaluationsSubject = new BehaviorSubject<EvaluationPerformance[]>([]);
  public evaluations$ = this.evaluationsSubject.asObservable();

  private objectifsSubject = new BehaviorSubject<Objectif[]>([]);
  public objectifs$ = this.objectifsSubject.asObservable();

  private plansDevSubject = new BehaviorSubject<PlanDeveloppement[]>([]);
  public plansDev$ = this.plansDevSubject.asObservable();

  private feedbacksSubject = new BehaviorSubject<FeedbackPerformance[]>([]);
  public feedbacks$ = this.feedbacksSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockEvaluations: EvaluationPerformance[] = [
      {
        id: '1',
        employeId: '1',
        evaluateurId: 'manager1',
        periode: {
          debut: '2024-01-01',
          fin: '2024-12-31',
          type: 'ANNUELLE'
        },
        statut: 'TERMINEE',
        dateCreation: '2025-01-15',
        dateEvaluation: '2025-01-20',
        dateValidation: '2025-01-25',
        criteres: {
          competencesTechniques: {
            note: 4.2,
            commentaire: 'Excellente maîtrise des technologies Angular et TypeScript',
            objectifs: ['Approfondir les connaissances en tests unitaires', 'Apprendre les microservices']
          },
          competencesRelationnelles: {
            note: 4.0,
            commentaire: 'Bonne communication avec l\'équipe',
            objectifs: ['Améliorer la présentation en public', 'Développer le leadership']
          },
          leadership: {
            note: 3.5,
            commentaire: 'Potentiel de leadership à développer',
            objectifs: ['Prendre en charge des projets plus importants', 'Mentorer les juniors']
          },
          autonomie: {
            note: 4.5,
            commentaire: 'Très autonome dans ses tâches',
            objectifs: ['Maintenir ce niveau d\'autonomie']
          },
          resultats: {
            note: 4.3,
            commentaire: 'Objectifs atteints avec succès',
            objectifs: ['Augmenter la productivité de 10%']
          }
        },
        noteGlobale: 4.1,
        commentaireGeneral: 'Excellente performance globale. Employé fiable et compétent.',
        pointsForts: [
          'Maîtrise technique excellente',
          'Autonomie remarquable',
          'Respect des délais',
          'Qualité du code'
        ],
        axesAmelioration: [
          'Communication interpersonnelle',
          'Leadership',
          'Gestion du stress'
        ],
        planDeveloppement: [
          'Formation en management',
          'Certification Angular avancée',
          'Cours de présentation en public'
        ],
        objectifsPeriodeSuivante: []
      },
      {
        id: '2',
        employeId: '1',
        evaluateurId: 'manager1',
        periode: {
          debut: '2025-01-01',
          fin: '2025-06-30',
          type: 'SEMESTRIELLE'
        },
        statut: 'EN_COURS',
        dateCreation: '2025-07-01',
        criteres: {
          competencesTechniques: {
            note: 0,
            commentaire: '',
            objectifs: []
          },
          competencesRelationnelles: {
            note: 0,
            commentaire: '',
            objectifs: []
          },
          leadership: {
            note: 0,
            commentaire: '',
            objectifs: []
          },
          autonomie: {
            note: 0,
            commentaire: '',
            objectifs: []
          },
          resultats: {
            note: 0,
            commentaire: '',
            objectifs: []
          }
        },
        pointsForts: [],
        axesAmelioration: [],
        planDeveloppement: [],
        objectifsPeriodeSuivante: []
      }
    ];

    const mockObjectifs: Objectif[] = [
      {
        id: '1',
        employeId: '1',
        evaluationId: '1',
        titre: 'Améliorer la performance du système',
        description: 'Optimiser les performances de l\'application pour réduire le temps de chargement de 30%',
        type: 'INDIVIDUEL',
        priorite: 'HAUTE',
        statut: 'EN_COURS',
        dateCreation: '2025-01-25',
        dateDebut: '2025-02-01',
        dateFinPrevue: '2025-04-30',
        indicateurs: [
          {
            nom: 'Temps de chargement',
            valeurCible: 2,
            valeurActuelle: 2.8,
            unite: 'secondes'
          },
          {
            nom: 'Score Lighthouse',
            valeurCible: 90,
            valeurActuelle: 75,
            unite: 'points'
          }
        ],
        pourcentageAvancement: 65,
        commentaires: [
          'Optimisation des images terminée',
          'Mise en place du lazy loading en cours'
        ],
        planAction: [
          {
            id: '1',
            tache: 'Optimiser les images',
            responsable: 'Jean Dupont',
            dateEcheance: '2025-02-15',
            statut: 'TERMINE',
            commentaire: 'Toutes les images ont été optimisées'
          },
          {
            id: '2',
            tache: 'Implémenter le lazy loading',
            responsable: 'Jean Dupont',
            dateEcheance: '2025-03-15',
            statut: 'EN_COURS',
            commentaire: 'Lazy loading des composants en cours'
          },
          {
            id: '3',
            tache: 'Optimiser les requêtes API',
            responsable: 'Jean Dupont',
            dateEcheance: '2025-04-15',
            statut: 'NON_COMMENCE'
          }
        ]
      },
      {
        id: '2',
        employeId: '1',
        titre: 'Formation Angular avancée',
        description: 'Obtenir la certification Angular avancée pour renforcer les compétences techniques',
        type: 'INDIVIDUEL',
        priorite: 'MOYENNE',
        statut: 'PLANIFIE',
        dateCreation: '2025-01-25',
        dateDebut: '2025-03-01',
        dateFinPrevue: '2025-06-30',
        indicateurs: [
          {
            nom: 'Modules complétés',
            valeurCible: 10,
            valeurActuelle: 3,
            unite: 'modules'
          },
          {
            nom: 'Score certification',
            valeurCible: 85,
            valeurActuelle: 0,
            unite: 'pourcentage'
          }
        ],
        pourcentageAvancement: 30,
        commentaires: [
          'Inscription à la formation effectuée',
          '3 modules sur 10 terminés'
        ],
        planAction: [
          {
            id: '1',
            tache: 'S\'inscrire à la formation',
            responsable: 'Jean Dupont',
            dateEcheance: '2025-02-15',
            statut: 'TERMINE'
          },
          {
            id: '2',
            tache: 'Compléter les modules de base',
            responsable: 'Jean Dupont',
            dateEcheance: '2025-04-30',
            statut: 'EN_COURS'
          },
          {
            id: '3',
            tache: 'Passer l\'examen de certification',
            responsable: 'Jean Dupont',
            dateEcheance: '2025-06-30',
            statut: 'NON_COMMENCE'
          }
        ]
      }
    ];

    const mockPlansDevs: PlanDeveloppement[] = [
      {
        id: '1',
        employeId: '1',
        evaluationId: '1',
        titre: 'Plan de développement professionnel 2025',
        description: 'Plan de développement centré sur le leadership et les compétences techniques avancées',
        statut: 'EN_COURS',
        dateCreation: '2025-01-25',
        dateDebut: '2025-02-01',
        dateFinPrevue: '2025-12-31',
        actions: [
          {
            id: '1',
            type: 'FORMATION',
            titre: 'Formation en management',
            description: 'Formation de 3 jours sur les techniques de management',
            dureeEstimee: 24,
            cout: 150000,
            priorite: 'HAUTE',
            statut: 'PLANIFIE',
            dateEcheance: '2025-05-30',
            responsable: 'RH',
            resultatsAtendus: [
              'Maîtrise des techniques de management',
              'Amélioration du leadership'
            ],
            progressionPourcentage: 0
          },
          {
            id: '2',
            type: 'CERTIFICATION',
            titre: 'Certification Angular avancée',
            description: 'Obtenir la certification officielle Angular',
            dureeEstimee: 40,
            cout: 75000,
            priorite: 'MOYENNE',
            statut: 'EN_COURS',
            dateEcheance: '2025-06-30',
            responsable: 'Jean Dupont',
            resultatsAtendus: [
              'Certification officielle obtenue',
              'Amélioration des compétences techniques'
            ],
            progressionPourcentage: 30
          },
          {
            id: '3',
            type: 'MENTORING',
            titre: 'Mentoring d\'un développeur junior',
            description: 'Encadrer un développeur junior pendant 6 mois',
            dureeEstimee: 20,
            priorite: 'MOYENNE',
            statut: 'PLANIFIE',
            dateEcheance: '2025-08-31',
            responsable: 'Jean Dupont',
            resultatsAtendus: [
              'Développement des compétences de leadership',
              'Amélioration de la communication'
            ],
            progressionPourcentage: 0
          }
        ],
        competencesVisees: [
          'Leadership',
          'Management d\'équipe',
          'Angular avancé',
          'Mentoring'
        ],
        budgetAlloue: 225000,
        budgetUtilise: 45000
      }
    ];

    const mockFeedbacks: FeedbackPerformance[] = [
      {
        id: '1',
        employeId: '1',
        emetteurId: 'manager1',
        type: 'POSITIF',
        periode: '2025-07',
        titre: 'Excellente résolution du bug critique',
        message: 'Félicitations pour la résolution rapide et efficace du bug critique qui affectait la production. Votre réactivité et votre expertise technique ont permis de minimiser l\'impact sur nos utilisateurs.',
        dateCreation: '2025-07-15',
        statut: 'LU',
        reponse: 'Merci pour ce retour positif. J\'ai pu m\'appuyer sur mon expérience et la collaboration de l\'équipe pour résoudre rapidement ce problème.',
        dateReponse: '2025-07-16'
      },
      {
        id: '2',
        employeId: '1',
        emetteurId: 'collegue1',
        type: 'POSITIF',
        periode: '2025-07',
        titre: 'Collaboration exceptionnelle',
        message: 'Jean a été d\'une grande aide sur le projet de refactoring. Sa disponibilité et ses conseils techniques ont grandement contribué au succès du projet.',
        dateCreation: '2025-07-20',
        statut: 'NOUVEAU'
      },
      {
        id: '3',
        employeId: '1',
        emetteurId: 'manager1',
        type: 'CONSTRUCTIF',
        periode: '2025-07',
        titre: 'Amélioration des présentations',
        message: 'Lors de la dernière présentation client, j\'ai remarqué que tu pourrais améliorer la structuration de tes présentations. Je suggère de préparer un plan plus détaillé et d\'utiliser plus de supports visuels.',
        dateCreation: '2025-07-25',
        statut: 'LU',
        reponse: 'Merci pour ce retour constructif. Je vais travailler sur la préparation de mes présentations et suivre une formation en communication.',
        dateReponse: '2025-07-26'
      }
    ];

    this.evaluationsSubject.next(mockEvaluations);
    this.objectifsSubject.next(mockObjectifs);
    this.plansDevSubject.next(mockPlansDevs);
    this.feedbacksSubject.next(mockFeedbacks);
  }

  // Méthodes pour les évaluations
  getEvaluations(): Observable<EvaluationPerformance[]> {
    return this.evaluations$;
  }

  getEvaluationsByEmploye(employeId: string): Observable<EvaluationPerformance[]> {
    return new Observable(observer => {
      const evaluations = this.evaluationsSubject.value.filter(e => e.employeId === employeId);
      observer.next(evaluations);
      observer.complete();
    });
  }

  getEvaluationById(id: string): EvaluationPerformance | undefined {
    return this.evaluationsSubject.value.find(e => e.id === id);
  }

  // Méthodes pour les objectifs
  getObjectifs(): Observable<Objectif[]> {
    return this.objectifs$;
  }

  getObjectifsByEmploye(employeId: string): Observable<Objectif[]> {
    return new Observable(observer => {
      const objectifs = this.objectifsSubject.value.filter(o => o.employeId === employeId);
      observer.next(objectifs);
      observer.complete();
    });
  }

  updateObjectifProgress(objectifId: string, pourcentage: number, commentaire?: string): Observable<boolean> {
    return new Observable(observer => {
      const objectifs = this.objectifsSubject.value;
      const index = objectifs.findIndex(o => o.id === objectifId);
      
      if (index !== -1) {
        objectifs[index] = {
          ...objectifs[index],
          pourcentageAvancement: pourcentage
        };
        
        if (commentaire) {
          objectifs[index].commentaires.push(commentaire);
        }
        
        if (pourcentage >= 100) {
          objectifs[index].statut = 'TERMINE';
          objectifs[index].dateFinReelle = new Date().toISOString().split('T')[0];
        }
        
        this.objectifsSubject.next([...objectifs]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  ajouterObjectif(objectif: Omit<Objectif, 'id'>): Observable<boolean> {
    return new Observable(observer => {
      const nouvelObjectif: Objectif = {
        ...objectif,
        id: Date.now().toString()
      };
      
      const objectifs = this.objectifsSubject.value;
      objectifs.push(nouvelObjectif);
      this.objectifsSubject.next([...objectifs]);
      
      observer.next(true);
      observer.complete();
    });
  }

  // Méthodes pour les plans de développement
  getPlansDeveloppement(): Observable<PlanDeveloppement[]> {
    return this.plansDev$;
  }

  getPlansByEmploye(employeId: string): Observable<PlanDeveloppement[]> {
    return new Observable(observer => {
      const plans = this.plansDevSubject.value.filter(p => p.employeId === employeId);
      observer.next(plans);
      observer.complete();
    });
  }

  updateActionProgress(planId: string, actionId: string, pourcentage: number): Observable<boolean> {
    return new Observable(observer => {
      const plans = this.plansDevSubject.value;
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex !== -1) {
        const actionIndex = plans[planIndex].actions.findIndex(a => a.id === actionId);
        if (actionIndex !== -1) {
          plans[planIndex].actions[actionIndex].progressionPourcentage = pourcentage;
          
          if (pourcentage >= 100) {
            plans[planIndex].actions[actionIndex].statut = 'TERMINE';
          } else if (pourcentage > 0) {
            plans[planIndex].actions[actionIndex].statut = 'EN_COURS';
          }
          
          this.plansDevSubject.next([...plans]);
          observer.next(true);
        } else {
          observer.next(false);
        }
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  // Méthodes pour les feedbacks
  getFeedbacks(): Observable<FeedbackPerformance[]> {
    return this.feedbacks$;
  }

  getFeedbacksByEmploye(employeId: string): Observable<FeedbackPerformance[]> {
    return new Observable(observer => {
      const feedbacks = this.feedbacksSubject.value.filter(f => f.employeId === employeId);
      observer.next(feedbacks);
      observer.complete();
    });
  }

  marquerFeedbackLu(feedbackId: string): Observable<boolean> {
    return new Observable(observer => {
      const feedbacks = this.feedbacksSubject.value;
      const index = feedbacks.findIndex(f => f.id === feedbackId);
      
      if (index !== -1) {
        feedbacks[index].statut = 'LU';
        this.feedbacksSubject.next([...feedbacks]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  repondreFeedback(feedbackId: string, reponse: string): Observable<boolean> {
    return new Observable(observer => {
      const feedbacks = this.feedbacksSubject.value;
      const index = feedbacks.findIndex(f => f.id === feedbackId);
      
      if (index !== -1) {
        feedbacks[index].reponse = reponse;
        feedbacks[index].dateReponse = new Date().toISOString().split('T')[0];
        feedbacks[index].statut = 'LU';
        this.feedbacksSubject.next([...feedbacks]);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  // Statistiques de performance
  getStatistiquesPerformance(employeId: string) {
    const evaluations = this.evaluationsSubject.value.filter(e => e.employeId === employeId);
    const objectifs = this.objectifsSubject.value.filter(o => o.employeId === employeId);
    const feedbacks = this.feedbacksSubject.value.filter(f => f.employeId === employeId);

    const evaluationsTerminees = evaluations.filter(e => e.statut === 'TERMINEE' || e.statut === 'VALIDEE');
    const notesMoyennes = evaluationsTerminees.reduce((acc, evaluation) => {
      if (evaluation.noteGlobale) {
        acc.total += evaluation.noteGlobale;
        acc.count++;
      }
      return acc;
    }, { total: 0, count: 0 });

    const objectifsTermines = objectifs.filter(o => o.statut === 'TERMINE').length;
    const objectifsTotal = objectifs.length;

    return {
      noteMoyenne: notesMoyennes.count > 0 ? notesMoyennes.total / notesMoyennes.count : 0,
      nombreEvaluations: evaluations.length,
      tauxReussiteObjectifs: objectifsTotal > 0 ? (objectifsTermines / objectifsTotal) * 100 : 0,
      objectifsEnCours: objectifs.filter(o => o.statut === 'EN_COURS').length,
      feedbacksRecus: feedbacks.length,
      feedbacksPositifs: feedbacks.filter(f => f.type === 'POSITIF').length,
      derniereFeedback: feedbacks.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())[0]?.dateCreation
    };
  }
}
