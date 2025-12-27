import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'trapotopia-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-surface-900 border-t border-border-surface-900 py-8 mt-20">
      <div class="max-w-7xl mx-auto px-4 text-center text-text-surface-700">
        <!-- Copyright -->
        <div class="text-center mb-4">
          <p>&copy; 2025-{{ today | date:'yyyy' }} Trapotopia. Tous droits réservés.</p>
        </div>
        <!-- Credits ressources -->
        <div
          class="flex flex-col justify-center items-center gap-2 text-xs uppercase italic tracking-wider text-center text-balance mb-6">
          <p>Certaines illustrations sont la propriété d'Ankama Studio et de Dofus</p>
          <p>Certaines données proviennent de l'api Dofusdb</p>
        </div>
        <div class="w-full h-px bg-white/10 mb-6"></div>
        <div class="flex flex-col md:flex-row justify-evenly items-center gap-2">
          <!-- Credits developpeurs -->
          <p>
            Conçu et réalisé avec <span class="text-red-400 inline-block">❤</span> par
            <span
              class="text-text-surface-900">Little One</span>
            et
            <span class="text-text-surface-900">Unesemaine</span>
          </p>
          <!-- Infos dev -->
          <div class="flex items-center gap-3 bg-surface-800 rounded-full px-3 py-1 border border-border-surface-800">
            <span class="uppercase font-mono">{{ environmentMode }}</span>
            <span class="w-px h-3 bg-gray-700"></span>
            <span class="font-mono">v{{ version }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  public readonly today: number = Date.now();
  public readonly version: string = import.meta.env.VITE_APP_VERSION;
  public readonly environmentMode: string = import.meta.env.MODE;
}
