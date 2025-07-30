import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Conge } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CongeService {
  private mockConges: Conge[] = [
    {
      id: '1',
      employeId: '1',
      type: 'CONGE_PAYE',
      dateDebut: '2025-08-15',
      dateFin: '2025-08-30',
      nbJours: 16,
      statut: 'EN_ATTENTE',
      motif: 'Vacances d\'été'
    },
    {
      id: '2',
      employeId: '1',
      type: 'CONGE_PAYE',
      dateDebut: '2025-06-01',
      dateFin: '2025-06-05',
      nbJours: 5,
      statut: 'APPROUVE',
      motif: 'Congé familial'
    },
    {
      id: '3',
      employeId: '1',
      type: 'CONGE_MALADIE',
      dateDebut: '2025-05-15',
      dateFin: '2025-05-17',
      nbJours: 3,
      statut: 'APPROUVE',
      motif: 'Maladie'
    }
  ];

  getCongesByEmploye(employeId: string): Observable<Conge[]> {
    const conges = this.mockConges.filter(c => c.employeId === employeId);
    return of(conges);
  }

  createConge(conge: Omit<Conge, 'id'>): Observable<Conge> {
    const nouveauConge: Conge = {
      ...conge,
      id: Math.random().toString(36).substr(2, 9)
    };

    this.mockConges.push(nouveauConge);
    return of(nouveauConge);
  }

  getStatistiquesConges(employeId: string, annee: number): Observable<any> {
    const congesAnnee = this.mockConges.filter(c => 
      c.employeId === employeId && 
      new Date(c.dateDebut).getFullYear() === annee &&
      c.statut === 'APPROUVE'
    );

    const totalPris = congesAnnee
      .filter(c => c.type === 'CONGE_PAYE')
      .reduce((sum, c) => sum + c.nbJours, 0);

    const stats = {
      totalAutorise: 30, // 30 jours par an
      totalPris,
      totalRestant: 30 - totalPris,
      congesMaladie: congesAnnee
        .filter(c => c.type === 'CONGE_MALADIE')
        .reduce((sum, c) => sum + c.nbJours, 0),
      congesEnAttente: this.mockConges
        .filter(c => c.employeId === employeId && c.statut === 'EN_ATTENTE')
        .reduce((sum, c) => sum + c.nbJours, 0)
    };

    return of(stats);
  }

  calculerJoursOuvrables(dateDebut: string, dateFin: string): number {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    let jours = 0;
    
    const currentDate = new Date(debut);
    while (currentDate <= fin) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclure dimanche (0) et samedi (6)
        jours++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return jours;
  }
}
