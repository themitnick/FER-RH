import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pointage } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PointageService {
  private mockPointages: Pointage[] = [
    {
      id: '1',
      employeId: '1',
      date: '2025-07-30',
      heureArrivee: '08:15',
      heureDepart: '17:30',
      heuresTravaillees: 8.25,
      statut: 'PRESENT'
    },
    {
      id: '2',
      employeId: '1',
      date: '2025-07-29',
      heureArrivee: '08:00',
      heureDepart: '17:00',
      heuresTravaillees: 8,
      statut: 'PRESENT'
    },
    {
      id: '3',
      employeId: '1',
      date: '2025-07-28',
      heureArrivee: '08:45',
      heureDepart: '17:15',
      heuresTravaillees: 7.5,
      statut: 'RETARD'
    }
  ];

  getPointagesDuJour(employeId: string): Observable<Pointage | null> {
    const aujourd_hui = new Date().toISOString().split('T')[0];
    const pointage = this.mockPointages.find(p => p.employeId === employeId && p.date === aujourd_hui);
    return of(pointage || null);
  }

  getPointagesPeriode(employeId: string, dateDebut: string, dateFin: string): Observable<Pointage[]> {
    const pointages = this.mockPointages.filter(p => 
      p.employeId === employeId && 
      p.date >= dateDebut && 
      p.date <= dateFin
    );
    return of(pointages);
  }

  enregistrerArrivee(employeId: string): Observable<Pointage> {
    const aujourd_hui = new Date().toISOString().split('T')[0];
    const heureActuelle = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const pointageExistant = this.mockPointages.find(p => p.employeId === employeId && p.date === aujourd_hui);
    
    if (pointageExistant) {
      throw new Error('Pointage d\'arrivée déjà enregistré pour aujourd\'hui');
    }

    const nouveauPointage: Pointage = {
      id: Math.random().toString(36).substr(2, 9),
      employeId,
      date: aujourd_hui,
      heureArrivee: heureActuelle,
      statut: heureActuelle > '08:30' ? 'RETARD' : 'PRESENT'
    };

    this.mockPointages.push(nouveauPointage);
    return of(nouveauPointage);
  }

  enregistrerDepart(employeId: string): Observable<Pointage> {
    const aujourd_hui = new Date().toISOString().split('T')[0];
    const heureActuelle = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const pointageIndex = this.mockPointages.findIndex(p => p.employeId === employeId && p.date === aujourd_hui);
    
    if (pointageIndex === -1) {
      throw new Error('Aucun pointage d\'arrivée trouvé pour aujourd\'hui');
    }

    const pointage = this.mockPointages[pointageIndex];
    if (pointage.heureDepart) {
      throw new Error('Pointage de départ déjà enregistré pour aujourd\'hui');
    }

    // Calculer les heures travaillées
    const [heureArrH, heureArrM] = pointage.heureArrivee!.split(':').map(Number);
    const [heureDepH, heureDepM] = heureActuelle.split(':').map(Number);
    const heuresTravaillees = (heureDepH + heureDepM/60) - (heureArrH + heureArrM/60);

    this.mockPointages[pointageIndex] = {
      ...pointage,
      heureDepart: heureActuelle,
      heuresTravaillees: Math.round(heuresTravaillees * 100) / 100
    };

    return of(this.mockPointages[pointageIndex]);
  }

  getStatistiquesPointage(employeId: string, mois: string): Observable<any> {
    const pointages = this.mockPointages.filter(p => 
      p.employeId === employeId && 
      p.date.startsWith(mois)
    );

    const stats = {
      totalJours: pointages.length,
      joursPresents: pointages.filter(p => p.statut === 'PRESENT').length,
      joursRetard: pointages.filter(p => p.statut === 'RETARD').length,
      joursAbsents: pointages.filter(p => p.statut === 'ABSENT').length,
      totalHeures: pointages.reduce((sum, p) => sum + (p.heuresTravaillees || 0), 0)
    };

    return of(stats);
  }
}
