import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Demande, User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private demandesSubject = new BehaviorSubject<Demande[]>([]);
  public demandes$ = this.demandesSubject.asObservable();

  private mockDemandes: Demande[] = [
    {
      id: '1',
      employeId: '1',
      type: 'CONGE',
      titre: 'Congé annuel',
      description: 'Demande de congé annuel pour les vacances d\'été',
      dateDebut: '2025-08-15',
      dateFin: '2025-08-30',
      statut: 'EN_ATTENTE',
      dateCreation: '2025-07-25',
    },
    {
      id: '2',
      employeId: '1',
      type: 'DOCUMENT',
      titre: 'Attestation de travail',
      description: 'Demande d\'attestation de travail pour dossier bancaire',
      statut: 'APPROUVE',
      dateCreation: '2025-07-20',
      dateTraitement: '2025-07-22',
      commentaireRH: 'Document généré et envoyé par email'
    },
    {
      id: '3',
      employeId: '1',
      type: 'NOTE_FRAIS',
      titre: 'Frais de mission à Tambacounda',
      description: 'Remboursement des frais de transport et hébergement',
      statut: 'EN_COURS',
      dateCreation: '2025-07-18',
      montant: 125000,
      documents: ['facture_hotel.pdf', 'ticket_transport.pdf']
    }
  ];

  constructor() {
    this.demandesSubject.next(this.mockDemandes);
  }

  getDemandes(): Observable<Demande[]> {
    return this.demandes$;
  }

  getDemandesByEmploye(employeId: string): Observable<Demande[]> {
    const demandes = this.mockDemandes.filter(d => d.employeId === employeId);
    return of(demandes);
  }

  createDemande(demande: Omit<Demande, 'id' | 'dateCreation' | 'statut'>): Observable<Demande> {
    const newDemande: Demande = {
      ...demande,
      id: Math.random().toString(36).substr(2, 9),
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'EN_ATTENTE'
    };

    this.mockDemandes.push(newDemande);
    this.demandesSubject.next(this.mockDemandes);
    
    return of(newDemande);
  }

  updateStatutDemande(id: string, statut: Demande['statut'], commentaire?: string): Observable<Demande> {
    const index = this.mockDemandes.findIndex(d => d.id === id);
    if (index !== -1) {
      this.mockDemandes[index] = {
        ...this.mockDemandes[index],
        statut,
        dateTraitement: new Date().toISOString().split('T')[0],
        commentaireRH: commentaire
      };
      this.demandesSubject.next(this.mockDemandes);
      return of(this.mockDemandes[index]);
    }
    throw new Error('Demande non trouvée');
  }

  getDemandesEnAttente(): Observable<Demande[]> {
    const enAttente = this.mockDemandes.filter(d => d.statut === 'EN_ATTENTE');
    return of(enAttente);
  }
}
