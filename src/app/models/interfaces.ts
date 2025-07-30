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

export interface StatistiquesRH {
  effectifTotal: number;
  effectifParService: { [service: string]: number };
  masseSalariale: number;
  turnover: number;
  tauxAbsenteisme: number;
  demandesEnAttente: number;
  nouvellesRecrutements: number;
}
