import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <section class="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-20">
      <div class="max-w-2xl mx-auto text-center">

        <!-- 404 -->
        <div class="relative mb-6">
          <div class="text-[10rem] md:text-[14rem] font-luckiest leading-none select-none flex items-center justify-center">
            <span class="bg-clip-text text-og-pink/80">4</span>
            <span class="text-text-surface-900 inline-block mx-2">0</span>
            <span class="bg-clip-text text-og-pink/80">4</span>
          </div>
        </div>

        <!-- Message principal -->
        <h1 class="text-2xl md:text-4xl text-text-surface-800 mb-6">
          Cette page n'existe pas... ou a peut-être été mangée par un Bouftou !
        </h1>

        <!-- Bouton d'action -->
        <div class="flex justify-center">
          <a
            routerLink="/"
            class="group relative inline-flex items-center gap-3 px-8 py-4 bg-og-pink text-white text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-og-pink/30">
            <svg class="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            <span class="relative z-10">Utiliser une potion de rappel</span>
            <div class="absolute inset-0 bg-linear-to-r from-og-pink to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>

        <!-- Message philosophique -->
        <p class="mt-12 text-text-surface-700 text-sm italic">
          "On ne se perd jamais vraiment... on finit toujours par tomber dans un trap." <br/>
          <span class="text-og-pink">— Un Trappeur philosophe</span>
        </p>

      </div>
    </section>
  `
})
export default class SandboxPage {
}
