export interface User {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  dateEmbauche: string;
  typeContrat: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  dureeContrat?: string;
  poste: string;
  service: string;
  manager?: string;
  salaire: number;
  coordonneesBancaires: {
    banque: string;
    iban: string;
    bic: string;
  };
  role: 'OPERATIONNEL' | 'DIRECTION' | 'RH';
  photo?: string;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

export interface Demande {
  id: string;
  employeId: string;
  type: 'CONGE' | 'ABSENCE' | 'AFFECTATION' | 'DOCUMENT' | 'NOTE_FRAIS';
  titre: string;
  description: string;
  dateDebut?: string;
  dateFin?: string;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' | 'EN_COURS';
  dateCreation: string;
  dateTraitement?: string;
  commentaireRH?: string;
  documents?: string[];
  montant?: number; // Pour les notes de frais
}

export interface Conge {
  id: string;
  employeId: string;
  type: 'CONGE_PAYE' | 'CONGE_MALADIE' | 'CONGE_MATERNITE' | 'CONGE_SANS_SOLDE';
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
  motif?: string;
}

export interface Pointage {
  id: string;
  employeId: string;
  date: string;
  heureArrivee?: string;
  heureDepart?: string;
  heuresTravaillees?: number;
  statut: 'PRESENT' | 'ABSENT' | 'RETARD' | 'PARTIEL';
}

export interface Performance {
  id: string;
  employeId: string;
  periode: string;
  note: number;
  objectifs: string[];
  realisations: string[];
  planAction: string[];
  commentaires: string;
  evaluateur: string;
  dateEvaluation: string;
}

export interface Document {
  id: string;
  nom: string;
  type: 'BULLETIN_PAIE' | 'DECISION_CONGE' | 'ATTESTATION' | 'REGLEMENT' | 'NOTE_SERVICE';
  url: string;
  dateCreation: string;
  employe?: string; // Pour les documents personnels
}

export interface Notification {
  id: string;
  employeId: string;
  titre: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  lu: boolean;
  dateCreation: string;
}

export interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  posteVise: string;
  cv: string;
  lettreMotivation?: string;
  statut: 'POSTULE' | 'PRESELECTIONNE' | 'ENTRETIEN' | 'TEST_TECHNIQUE' | 'ACCEPTE' | 'REFUSE';
  datePostulation: string;
  notes?: string;
}

export interface PosteOuvert {
  id: string;
  titre: string;
  service: string;
  typeContrat: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  salaire: string;
  description: string;
  competencesRequises: string[];
  statut: 'OUVERT' | 'FERME' | 'SUSPENDU';
  datePublication: string;
  dateLimite?: string;
  nombreCandidatures: number;
  managerId?: string;
}

export interface EntretienRH {
  id: string;
  candidatId: string;
  posteId: string;
  dateEntretien: string;
  heureEntretien: string;
  type: 'TELEPHONIQUE' | 'VISIO' | 'PRESENTIEL';
  intervieweurs: string[];
  statut: 'PLANIFIE' | 'REALISE' | 'ANNULE' | 'REPORTE';
  notes?: string;
  evaluation?: {
    competencesTechniques: number;
    competencesRelationnelles: number;
    motivation: number;
    adequationPoste: number;
    commentaires: string;
  };
}

export interface StatistiquesRH {
  effectifTotal: number;
  effectifParService: { [service: string]: number };
  masseSalariale: number;
  turnover: number;
  tauxAbsenteisme: number;
  demandesEnAttente: number;
  nouvellesRecrutements: number;
}

export interface EvaluationPerformance {
  id: string;
  employeId: string;
  evaluateurId: string;
  periode: {
    debut: string;
    fin: string;
    type: 'ANNUELLE' | 'SEMESTRIELLE' | 'TRIMESTRIELLE';
  };
  statut: 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'VALIDEE';
  dateCreation: string;
  dateEvaluation?: string;
  dateValidation?: string;
  
  // Critères d'évaluation
  criteres: {
    competencesTechniques: {
      note: number;
      commentaire: string;
      objectifs: string[];
    };
    competencesRelationnelles: {
      note: number;
      commentaire: string;
      objectifs: string[];
    };
    leadership: {
      note: number;
      commentaire: string;
      objectifs: string[];
    };
    autonomie: {
      note: number;
      commentaire: string;
      objectifs: string[];
    };
    resultats: {
      note: number;
      commentaire: string;
      objectifs: string[];
    };
  };
  
  noteGlobale?: number;
  commentaireGeneral?: string;
  pointsForts: string[];
  axesAmelioration: string[];
  planDeveloppement: string[];
  objectifsPeriodeSuivante: Objectif[];
}

export interface Objectif {
  id: string;
  employeId: string;
  evaluationId?: string;
  titre: string;
  description: string;
  type: 'INDIVIDUEL' | 'EQUIPE' | 'ENTREPRISE';
  priorite: 'FAIBLE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'REPORTE' | 'ANNULE';
  
  dateCreation: string;
  dateDebut: string;
  dateFinPrevue: string;
  dateFinReelle?: string;
  
  indicateurs: {
    nom: string;
    valeurCible: number;
    valeurActuelle: number;
    unite: string;
  }[];
  
  pourcentageAvancement: number;
  commentaires: string[];
  
  // Plan d'action
  planAction: {
    id: string;
    tache: string;
    responsable: string;
    dateEcheance: string;
    statut: 'NON_COMMENCE' | 'EN_COURS' | 'TERMINE';
    commentaire?: string;
  }[];
}

export interface PlanDeveloppement {
  id: string;
  employeId: string;
  evaluationId: string;
  titre: string;
  description: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'SUSPENDU';
  
  dateCreation: string;
  dateDebut: string;
  dateFinPrevue: string;
  
  // Actions de développement
  actions: {
    id: string;
    type: 'FORMATION' | 'MENTORING' | 'MISSION' | 'CERTIFICATION' | 'LECTURE' | 'AUTRE';
    titre: string;
    description: string;
    dureeEstimee: number; // en heures
    cout?: number;
    priorite: 'FAIBLE' | 'MOYENNE' | 'HAUTE';
    statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
    dateEcheance: string;
    responsable: string;
    resultatsAtendus: string[];
    progressionPourcentage: number;
  }[];
  
  competencesVisees: string[];
  budgetAlloue?: number;
  budgetUtilise?: number;
}

export interface FeedbackPerformance {
  id: string;
  employeId: string;
  emetteurId: string;
  type: 'POSITIF' | 'CONSTRUCTIF' | 'NEUTRE';
  periode: string;
  titre: string;
  message: string;
  dateCreation: string;
  statut: 'NOUVEAU' | 'LU' | 'ARCHIVE';
  reponse?: string;
  dateReponse?: string;
}
