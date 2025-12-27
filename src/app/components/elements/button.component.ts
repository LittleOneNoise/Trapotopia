import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'trapotopia-button',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (href()) {
      <a
        [routerLink]="href()"
        class="group inline-flex items-center gap-3 px-6 py-3 border-2 border-og-pink text-text-surface-800 rounded-lg transition-all duration-300 hover:bg-og-pink/10 hover:text-og-pink  hover:scale-105 cursor-pointer">
        <ng-container *ngTemplateOutlet="content" />
      </a>
    } @else {
      <button
        [type]="type()"
        class="group inline-flex items-center gap-3 px-6 py-3 border-2 border-og-pink text-text-surface-800 rounded-lg transition-all duration-300 hover:bg-og-pink/10 hover:text-og-pink  hover:scale-105 cursor-pointer">
        <ng-container *ngTemplateOutlet="content" />
      </button>
    }

    <ng-template #content>
      @if (icon()) {
        <span class="w-5 h-5" [innerHTML]="icon()"></span>
      }
      <span class="font-medium">{{ label() }}</span>
    </ng-template>
  `
})
export class ButtonComponent {
  /** Le texte affiché dans le bouton (obligatoire) */
  label = input.required<string>();

  /** Icône SVG à afficher à gauche du label (optionnel) */
  icon = input<string>();

  /** Si défini, le bouton devient un lien vers cette route */
  href = input<string>();

  /** Type du bouton HTML (utilisé uniquement si href n'est pas défini) */
  type = input<'button' | 'submit' | 'reset'>('button');
}

