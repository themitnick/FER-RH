import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceService } from '../../services/performance.service';
import { AuthService } from '../../services/auth.service';
import { EvaluationPerformance, Objectif, PlanDeveloppement, FeedbackPerformance } from '../../models/interfaces';

// Types étendus pour l'interface utilisateur
interface ObjectifUI extends Objectif {
  nouveauPourcentage?: number;
}

interface FeedbackUI extends FeedbackPerformance {
  showReplyForm?: boolean;
  nouvelleReponse?: string;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header avec statistiques -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 class="text-2xl font-bold mb-4">Suivi des Performances</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-2xl font-bold">{{statistiques.noteMoyenne | number:'1.1-1'}}/5</div>
            <div class="text-sm opacity-90">Note moyenne</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-2xl font-bold">{{statistiques.tauxReussiteObjectifs | number:'1.0-0'}}%</div>
            <div class="text-sm opacity-90">Objectifs atteints</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-2xl font-bold">{{statistiques.objectifsEnCours}}</div>
            <div class="text-sm opacity-90">Objectifs en cours</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-2xl font-bold">{{statistiques.feedbacksPositifs}}</div>
            <div class="text-sm opacity-90">Feedbacks positifs</div>
          </div>
        </div>
      </div>

      <!-- Navigation par onglets -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button *ngFor="let tab of tabs"
                    (click)="activeTab = tab.id"
                    class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                    [class]="activeTab === tab.id ? 
                      'border-blue-500 text-blue-600' : 
                      'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
              {{tab.name}}
              <span *ngIf="tab.count" class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {{tab.count}}
              </span>
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Onglet Évaluations -->
          <div *ngIf="activeTab === 'evaluations'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Mes Évaluations</h2>
            </div>

            <div *ngIf="evaluations.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune évaluation</h3>
              <p class="mt-1 text-sm text-gray-500">Vos évaluations de performance apparaîtront ici.</p>
            </div>

            <div *ngFor="let evaluation of evaluations" class="bg-gray-50 rounded-lg p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    Évaluation {{evaluation.periode.type.toLowerCase()}} {{evaluation.periode.debut}} - {{evaluation.periode.fin}}
                  </h3>
                  <p class="text-sm text-gray-500">
                    Créée le {{evaluation.dateCreation | date:'dd/MM/yyyy'}}
                    <span *ngIf="evaluation.dateEvaluation"> • Évaluée le {{evaluation.dateEvaluation | date:'dd/MM/yyyy'}}</span>
                  </p>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="getStatutClass(evaluation.statut)">
                  {{getStatutLabel(evaluation.statut)}}
                </span>
              </div>

              <div *ngIf="evaluation.statut === 'TERMINEE' || evaluation.statut === 'VALIDEE'" class="space-y-4">
                <!-- Note globale -->
                <div *ngIf="evaluation.noteGlobale" class="flex items-center space-x-4">
                  <span class="text-2xl font-bold text-blue-600">{{evaluation.noteGlobale | number:'1.1-1'}}/5</span>
                  <span class="text-gray-600">Note globale</span>
                </div>

                <!-- Critères d'évaluation -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div class="bg-white rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2">Compétences techniques</h4>
                    <div class="flex items-center space-x-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="(evaluation.criteres.competencesTechniques.note / 5) * 100"></div>
                      </div>
                      <span class="text-sm font-medium">{{evaluation.criteres.competencesTechniques.note}}/5</span>
                    </div>
                    <p *ngIf="evaluation.criteres.competencesTechniques.commentaire" class="text-xs text-gray-600 mt-2">
                      {{evaluation.criteres.competencesTechniques.commentaire}}
                    </p>
                  </div>

                  <div class="bg-white rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2">Compétences relationnelles</h4>
                    <div class="flex items-center space-x-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-green-600 h-2 rounded-full" [style.width.%]="(evaluation.criteres.competencesRelationnelles.note / 5) * 100"></div>
                      </div>
                      <span class="text-sm font-medium">{{evaluation.criteres.competencesRelationnelles.note}}/5</span>
                    </div>
                    <p *ngIf="evaluation.criteres.competencesRelationnelles.commentaire" class="text-xs text-gray-600 mt-2">
                      {{evaluation.criteres.competencesRelationnelles.commentaire}}
                    </p>
                  </div>

                  <div class="bg-white rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2">Leadership</h4>
                    <div class="flex items-center space-x-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-purple-600 h-2 rounded-full" [style.width.%]="(evaluation.criteres.leadership.note / 5) * 100"></div>
                      </div>
                      <span class="text-sm font-medium">{{evaluation.criteres.leadership.note}}/5</span>
                    </div>
                    <p *ngIf="evaluation.criteres.leadership.commentaire" class="text-xs text-gray-600 mt-2">
                      {{evaluation.criteres.leadership.commentaire}}
                    </p>
                  </div>

                  <div class="bg-white rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2">Autonomie</h4>
                    <div class="flex items-center space-x-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-orange-600 h-2 rounded-full" [style.width.%]="(evaluation.criteres.autonomie.note / 5) * 100"></div>
                      </div>
                      <span class="text-sm font-medium">{{evaluation.criteres.autonomie.note}}/5</span>
                    </div>
                    <p *ngIf="evaluation.criteres.autonomie.commentaire" class="text-xs text-gray-600 mt-2">
                      {{evaluation.criteres.autonomie.commentaire}}
                    </p>
                  </div>

                  <div class="bg-white rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2">Résultats</h4>
                    <div class="flex items-center space-x-2">
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-red-600 h-2 rounded-full" [style.width.%]="(evaluation.criteres.resultats.note / 5) * 100"></div>
                      </div>
                      <span class="text-sm font-medium">{{evaluation.criteres.resultats.note}}/5</span>
                    </div>
                    <p *ngIf="evaluation.criteres.resultats.commentaire" class="text-xs text-gray-600 mt-2">
                      {{evaluation.criteres.resultats.commentaire}}
                    </p>
                  </div>
                </div>

                <!-- Points forts et axes d'amélioration -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div *ngIf="evaluation.pointsForts.length > 0">
                    <h4 class="font-medium text-gray-900 mb-3">Points forts</h4>
                    <ul class="space-y-2">
                      <li *ngFor="let point of evaluation.pointsForts" class="flex items-start space-x-2">
                        <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm text-gray-700">{{point}}</span>
                      </li>
                    </ul>
                  </div>

                  <div *ngIf="evaluation.axesAmelioration.length > 0">
                    <h4 class="font-medium text-gray-900 mb-3">Axes d'amélioration</h4>
                    <ul class="space-y-2">
                      <li *ngFor="let axe of evaluation.axesAmelioration" class="flex items-start space-x-2">
                        <svg class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-sm text-gray-700">{{axe}}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Commentaire général -->
                <div *ngIf="evaluation.commentaireGeneral" class="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 class="font-medium text-gray-900 mb-2">Commentaire général</h4>
                  <p class="text-sm text-gray-700">{{evaluation.commentaireGeneral}}</p>
                </div>
              </div>

              <div *ngIf="evaluation.statut === 'EN_COURS'" class="text-center py-8">
                <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-500">Évaluation en cours de réalisation</p>
              </div>
            </div>
          </div>

          <!-- Onglet Objectifs -->
          <div *ngIf="activeTab === 'objectifs'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Mes Objectifs</h2>
              <button (click)="showNouvelObjectif = true" class="btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nouvel objectif
              </button>
            </div>

            <!-- Formulaire nouvel objectif -->
            <div *ngIf="showNouvelObjectif" class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Ajouter un nouvel objectif</h3>
              <form (ngSubmit)="ajouterObjectif()" #objectifForm="ngForm" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input type="text" [(ngModel)]="nouvelObjectif.titre" name="titre" required class="form-input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                    <select [(ngModel)]="nouvelObjectif.priorite" name="priorite" required class="form-select">
                      <option value="FAIBLE">Faible</option>
                      <option value="MOYENNE">Moyenne</option>
                      <option value="HAUTE">Haute</option>
                      <option value="CRITIQUE">Critique</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea [(ngModel)]="nouvelObjectif.description" name="description" required rows="3" class="form-input"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input type="date" [(ngModel)]="nouvelObjectif.dateDebut" name="dateDebut" required class="form-input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date de fin prévue</label>
                    <input type="date" [(ngModel)]="nouvelObjectif.dateFinPrevue" name="dateFinPrevue" required class="form-input">
                  </div>
                </div>
                <div class="flex space-x-3">
                  <button type="submit" [disabled]="!objectifForm.form.valid" class="btn-primary">Ajouter l'objectif</button>
                  <button type="button" (click)="annulerNouvelObjectif()" class="btn-outline">Annuler</button>
                </div>
              </form>
            </div>

            <div *ngIf="objectifs.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun objectif</h3>
              <p class="mt-1 text-sm text-gray-500">Commencez par ajouter votre premier objectif.</p>
            </div>

            <div *ngFor="let objectif of objectifs" class="bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-900">{{objectif.titre}}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{objectif.description}}</p>
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Du {{objectif.dateDebut | date:'dd/MM/yyyy'}} au {{objectif.dateFinPrevue | date:'dd/MM/yyyy'}}</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          [class]="getPrioriteClass(objectif.priorite)">
                      {{objectif.priorite}}
                    </span>
                  </div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="getStatutObjectifClass(objectif.statut)">
                  {{getStatutObjectifLabel(objectif.statut)}}
                </span>
              </div>

              <!-- Barre de progression -->
              <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{{objectif.pourcentageAvancement}}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                       [style.width.%]="objectif.pourcentageAvancement"></div>
                </div>
              </div>

              <!-- Mise à jour de la progression -->
              <div *ngIf="objectif.statut !== 'TERMINE'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mettre à jour la progression</label>
                <div class="flex space-x-2">
                  <input type="number" 
                         min="0" 
                         max="100" 
                         [(ngModel)]="objectif.nouveauPourcentage" 
                         class="form-input flex-1" 
                         placeholder="Pourcentage">
                  <button (click)="updateObjectifProgress(objectif)" 
                          [disabled]="!objectif.nouveauPourcentage && objectif.nouveauPourcentage !== 0"
                          class="btn-primary">
                    Mettre à jour
                  </button>
                </div>
              </div>

              <!-- Indicateurs -->
              <div *ngIf="objectif.indicateurs.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Indicateurs</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div *ngFor="let indicateur of objectif.indicateurs" class="bg-gray-50 rounded-lg p-3">
                    <div class="text-sm font-medium text-gray-900">{{indicateur.nom}}</div>
                    <div class="text-xs text-gray-600">
                      {{indicateur.valeurActuelle}} / {{indicateur.valeurCible}} {{indicateur.unite}}
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div class="bg-green-600 h-1 rounded-full" 
                           [style.width.%]="(indicateur.valeurActuelle / indicateur.valeurCible) * 100"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Plan d'action -->
              <div *ngIf="objectif.planAction.length > 0">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Plan d'action</h4>
                <div class="space-y-2">
                  <div *ngFor="let action of objectif.planAction" class="flex items-center space-x-3 text-sm">
                    <div class="w-4 h-4 rounded-full flex-shrink-0"
                         [class]="getActionStatusClass(action.statut)"></div>
                    <span class="flex-1">{{action.tache}}</span>
                    <span class="text-xs text-gray-500">{{action.dateEcheance | date:'dd/MM'}}</span>
                  </div>
                </div>
              </div>

              <!-- Commentaires -->
              <div *ngIf="objectif.commentaires.length > 0" class="mt-4 pt-4 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Commentaires</h4>
                <div class="space-y-2">
                  <div *ngFor="let commentaire of objectif.commentaires" class="text-sm text-gray-600 bg-gray-50 rounded p-2">
                    {{commentaire}}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Plans de développement -->
          <div *ngIf="activeTab === 'developpement'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Plans de Développement</h2>
            </div>

            <div *ngIf="plansDeveloppement.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun plan de développement</h3>
              <p class="mt-1 text-sm text-gray-500">Vos plans de développement apparaîtront ici.</p>
            </div>

            <div *ngFor="let plan of plansDeveloppement" class="bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{plan.titre}}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{plan.description}}</p>
                  <p class="text-xs text-gray-500 mt-2">
                    Du {{plan.dateDebut | date:'dd/MM/yyyy'}} au {{plan.dateFinPrevue | date:'dd/MM/yyyy'}}
                  </p>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="getStatutPlanClass(plan.statut)">
                  {{getStatutPlanLabel(plan.statut)}}
                </span>
              </div>

              <!-- Budget -->
              <div *ngIf="plan.budgetAlloue" class="mb-4 bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Budget</h4>
                <div class="flex justify-between text-sm">
                  <span>Alloué: {{plan.budgetAlloue | number}} FCFA</span>
                  <span>Utilisé: {{plan.budgetUtilise | number}} FCFA</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div class="bg-blue-600 h-2 rounded-full" 
                       [style.width.%]="plan.budgetAlloue ? (plan.budgetUtilise! / plan.budgetAlloue) * 100 : 0"></div>
                </div>
              </div>

              <!-- Actions de développement -->
              <div class="space-y-4">
                <h4 class="text-sm font-medium text-gray-900">Actions de développement</h4>
                <div *ngFor="let action of plan.actions" class="bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h5 class="font-medium text-gray-900">{{action.titre}}</h5>
                      <p class="text-sm text-gray-600">{{action.description}}</p>
                      <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{{action.type}}</span>
                        <span>{{action.dureeEstimee}}h</span>
                        <span *ngIf="action.cout">{{action.cout | number}} FCFA</span>
                        <span>Échéance: {{action.dateEcheance | date:'dd/MM/yyyy'}}</span>
                      </div>
                    </div>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          [class]="getActionStatusClass(action.statut)">
                      {{action.statut.replace('_', ' ')}}
                    </span>
                  </div>
                  
                  <div class="mb-2">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progression</span>
                      <span>{{action.progressionPourcentage}}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1">
                      <div class="bg-green-600 h-1 rounded-full" 
                           [style.width.%]="action.progressionPourcentage"></div>
                    </div>
                  </div>

                  <div *ngIf="action.resultatsAtendus.length > 0">
                    <h6 class="text-xs font-medium text-gray-700 mb-1">Résultats attendus:</h6>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li *ngFor="let resultat of action.resultatsAtendus" class="flex items-start space-x-1">
                        <span class="text-gray-400">•</span>
                        <span>{{resultat}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Compétences visées -->
              <div *ngIf="plan.competencesVisees.length > 0" class="mt-4 pt-4 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Compétences visées</h4>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let competence of plan.competencesVisees" 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{competence}}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Feedbacks -->
          <div *ngIf="activeTab === 'feedbacks'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Feedbacks Reçus</h2>
            </div>

            <div *ngIf="feedbacks.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun feedback</h3>
              <p class="mt-1 text-sm text-gray-500">Vos feedbacks apparaîtront ici.</p>
            </div>

            <div *ngFor="let feedback of feedbacks" class="bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                       [class]="getFeedbackTypeClass(feedback.type)">
                    <svg *ngIf="feedback.type === 'POSITIF'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <svg *ngIf="feedback.type === 'CONSTRUCTIF'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <svg *ngIf="feedback.type === 'NEUTRE'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{feedback.titre}}</h3>
                    <p class="text-sm text-gray-500">{{feedback.periode}} • {{feedback.dateCreation | date:'dd/MM/yyyy'}}</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      [class]="getFeedbackStatusClass(feedback.statut)">
                  {{feedback.statut.replace('_', ' ')}}
                </span>
              </div>

              <div class="mb-4">
                <p class="text-gray-700">{{feedback.message}}</p>
              </div>

              <div *ngIf="feedback.reponse" class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Ma réponse</h4>
                <p class="text-sm text-gray-700">{{feedback.reponse}}</p>
                <p class="text-xs text-gray-500 mt-2">Répondu le {{feedback.dateReponse | date:'dd/MM/yyyy'}}</p>
              </div>

              <div *ngIf="!feedback.reponse && feedback.statut !== 'ARCHIVE'" class="mt-4">
                <div *ngIf="!feedback.showReplyForm">
                  <button (click)="feedback.showReplyForm = true" class="btn-outline text-sm">
                    Répondre au feedback
                  </button>
                </div>
                
                <div *ngIf="feedback.showReplyForm" class="space-y-3">
                  <textarea [(ngModel)]="feedback.nouvelleReponse" 
                            rows="3" 
                            placeholder="Votre réponse..."
                            class="form-input"></textarea>
                  <div class="flex space-x-2">
                    <button (click)="repondreFeedback(feedback)" 
                            [disabled]="!feedback.nouvelleReponse"
                            class="btn-primary text-sm">
                      Envoyer la réponse
                    </button>
                    <button (click)="feedback.showReplyForm = false; feedback.nouvelleReponse = ''" 
                            class="btn-outline text-sm">
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerformanceComponent implements OnInit {
  activeTab = 'evaluations';
  evaluations: EvaluationPerformance[] = [];
  objectifs: ObjectifUI[] = [];
  plansDeveloppement: PlanDeveloppement[] = [];
  feedbacks: FeedbackUI[] = [];
  statistiques: any = {};

  showNouvelObjectif = false;
  nouvelObjectif: any = {
    titre: '',
    description: '',
    priorite: 'MOYENNE',
    dateDebut: '',
    dateFinPrevue: ''
  };

  tabs = [
    { id: 'evaluations', name: 'Évaluations', count: 0 },
    { id: 'objectifs', name: 'Objectifs', count: 0 },
    { id: 'developpement', name: 'Développement', count: 0 },
    { id: 'feedbacks', name: 'Feedbacks', count: 0 }
  ];

  constructor(
    private performanceService: PerformanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadData(user.id);
    }
  }

  loadData(employeId: string) {
    // Charger les évaluations
    this.performanceService.getEvaluationsByEmploye(employeId).subscribe(evaluations => {
      this.evaluations = evaluations;
      this.tabs[0].count = evaluations.length;
    });

    // Charger les objectifs
    this.performanceService.getObjectifsByEmploye(employeId).subscribe(objectifs => {
      this.objectifs = objectifs.map(obj => ({ ...obj, nouveauPourcentage: obj.pourcentageAvancement }));
      this.tabs[1].count = objectifs.length;
    });

    // Charger les plans de développement
    this.performanceService.getPlansByEmploye(employeId).subscribe(plans => {
      this.plansDeveloppement = plans;
      this.tabs[2].count = plans.length;
    });

    // Charger les feedbacks
    this.performanceService.getFeedbacksByEmploye(employeId).subscribe(feedbacks => {
      this.feedbacks = feedbacks.map(f => ({ ...f, showReplyForm: false, nouvelleReponse: '' }));
      this.tabs[3].count = feedbacks.length;
    });

    // Charger les statistiques
    this.statistiques = this.performanceService.getStatistiquesPerformance(employeId);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'TERMINEE':
      case 'VALIDEE':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'PLANIFIEE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'TERMINEE':
        return 'Terminée';
      case 'VALIDEE':
        return 'Validée';
      case 'EN_COURS':
        return 'En cours';
      case 'PLANIFIEE':
        return 'Planifiée';
      default:
        return statut;
    }
  }

  getPrioriteClass(priorite: string): string {
    switch (priorite) {
      case 'CRITIQUE':
        return 'bg-red-100 text-red-800';
      case 'HAUTE':
        return 'bg-orange-100 text-orange-800';
      case 'MOYENNE':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAIBLE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutObjectifClass(statut: string): string {
    switch (statut) {
      case 'TERMINE':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'PLANIFIE':
        return 'bg-gray-100 text-gray-800';
      case 'REPORTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANNULE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutObjectifLabel(statut: string): string {
    switch (statut) {
      case 'TERMINE':
        return 'Terminé';
      case 'EN_COURS':
        return 'En cours';
      case 'PLANIFIE':
        return 'Planifié';
      case 'REPORTE':
        return 'Reporté';
      case 'ANNULE':
        return 'Annulé';
      default:
        return statut;
    }
  }

  getActionStatusClass(statut: string): string {
    switch (statut) {
      case 'TERMINE':
        return 'bg-green-500';
      case 'EN_COURS':
        return 'bg-blue-500';
      case 'NON_COMMENCE':
        return 'bg-gray-300';
      case 'ANNULE':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  }

  getStatutPlanClass(statut: string): string {
    switch (statut) {
      case 'TERMINE':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'PLANIFIE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDU':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutPlanLabel(statut: string): string {
    switch (statut) {
      case 'TERMINE':
        return 'Terminé';
      case 'EN_COURS':
        return 'En cours';
      case 'PLANIFIE':
        return 'Planifié';
      case 'SUSPENDU':
        return 'Suspendu';
      default:
        return statut;
    }
  }

  getFeedbackTypeClass(type: string): string {
    switch (type) {
      case 'POSITIF':
        return 'bg-green-100 text-green-600';
      case 'CONSTRUCTIF':
        return 'bg-orange-100 text-orange-600';
      case 'NEUTRE':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getFeedbackStatusClass(statut: string): string {
    switch (statut) {
      case 'NOUVEAU':
        return 'bg-blue-100 text-blue-800';
      case 'LU':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  updateObjectifProgress(objectif: any) {
    this.performanceService.updateObjectifProgress(
      objectif.id, 
      objectif.nouveauPourcentage,
      `Progression mise à jour à ${objectif.nouveauPourcentage}%`
    ).subscribe(success => {
      if (success) {
        objectif.pourcentageAvancement = objectif.nouveauPourcentage;
        if (objectif.nouveauPourcentage >= 100) {
          objectif.statut = 'TERMINE';
        }
        alert('Progression mise à jour avec succès !');
      }
    });
  }

  ajouterObjectif() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const objectif = {
      ...this.nouvelObjectif,
      employeId: user.id,
      type: 'INDIVIDUEL' as const,
      statut: 'PLANIFIE' as const,
      dateCreation: new Date().toISOString().split('T')[0],
      indicateurs: [],
      pourcentageAvancement: 0,
      commentaires: [],
      planAction: []
    };

    this.performanceService.ajouterObjectif(objectif).subscribe(success => {
      if (success) {
        this.loadData(user.id);
        this.annulerNouvelObjectif();
        alert('Objectif ajouté avec succès !');
      }
    });
  }

  annulerNouvelObjectif() {
    this.showNouvelObjectif = false;
    this.nouvelObjectif = {
      titre: '',
      description: '',
      priorite: 'MOYENNE',
      dateDebut: '',
      dateFinPrevue: ''
    };
  }

  repondreFeedback(feedback: any) {
    this.performanceService.repondreFeedback(feedback.id, feedback.nouvelleReponse).subscribe(success => {
      if (success) {
        feedback.reponse = feedback.nouvelleReponse;
        feedback.dateReponse = new Date().toISOString().split('T')[0];
        feedback.showReplyForm = false;
        feedback.nouvelleReponse = '';
        alert('Réponse envoyée avec succès !');
      }
    });
  }
}
