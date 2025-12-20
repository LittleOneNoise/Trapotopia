import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'trapotopia-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-black/95 border-t border-white/10 py-8 mt-20">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        <!-- Credits developpeurs -->
        <div class="text-center mb-4">
          <p class="text-gray-500">
            Conçu et réalisé avec <span class="text-red-400 inline-block">❤</span> par
            <span
              class="text-gray-300 hover:text-primary transition-colors cursor-default">Little One</span>
            et
            <span class="text-gray-300 hover:text-primary transition-colors cursor-default">Unesemaine</span>
          </p>
        </div>
        <!-- Credits ressources -->
        <div
          class="flex flex-col justify-center items-center gap-2 text-[0.6rem] text-gray-500 uppercase tracking-wider text-center text-wrap-balance mb-4">
          <p>Certaines illustrations sont la propriété d'Ankama Studio et de Dofus</p>
          <p>La plupart des données proviennent de l'api Dofusdb, merci à eux 🤝</p>
        </div>
        <!-- Copyright + Infos dev -->
        <div class="w-full h-px bg-white/10 mb-4"></div>
        <div class="flex flex-col md:flex-row justify-evenly items-center text-gray-500 gap-2">
          <p>&copy; 2025-{{ today | date:'yyyy' }} Trapotopia. Tous droits réservés.</p>
          <div class="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1 border border-white/5">
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
