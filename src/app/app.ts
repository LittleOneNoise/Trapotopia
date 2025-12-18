import {Component, signal, WritableSignal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage],
  template: `
    <div class="min-h-screen bg-[#121212] text-gray-200 font-sans selection:bg-[#C56CF6] selection:text-white">

      <nav class="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">

            <div class="flex items-center gap-3 min-w-0 flex-1">
              <img class="h-10 w-10 shrink-0" ngSrc="/logo_trapotopia.png" alt="logo_trapotopia" height="913" width="913"
                   priority/>
              <span class="font-bold text-lg sm:text-xl tracking-wider text-gray-200 truncate block">TRAPOTOPIA</span>
            </div>

            <div class="hidden md:block shrink-0">
              <div class="ml-10 flex items-baseline space-x-8">
                <a routerLink="/" routerLinkActive="text-[#C56CF6] border-b-2 border-[#C56CF6]"
                   [routerLinkActiveOptions]="{exact: true}"
                   class="hover:text-[#C56CF6] px-3 py-4 text-sm font-medium transition-all">Accueil</a>
                <a routerLink="/events" class="hover:text-[#C56CF6] px-3 py-2 text-sm font-medium transition-colors">Evénements</a>
                <a routerLink="/outils" class="hover:text-[#C56CF6] px-3 py-2 text-sm font-medium transition-colors">Outils</a>
                <a routerLink="/streamers" class="hover:text-[#C56CF6] px-3 py-2 text-sm font-medium transition-colors">Nos
                  streamers</a>
              </div>
            </div>

            <div class="flex md:hidden shrink-0 ml-4">
              <button (click)="toggleMenu()"
                      class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                <span class="sr-only">Ouvrir menu</span>
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        @if (isMobileMenuOpen()) {
          <div class="md:hidden bg-[#1a1a1a] border-b border-white/10">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a routerLink="/" class="block px-3 py-2 rounded-md text-base font-medium text-[#C56CF6] bg-gray-900">Accueil</a>
              <a routerLink="/events"
                 class="block px-3 py-2 rounded-md text-base font-medium hover:text-[#C56CF6] hover:bg-gray-900">Evénements</a>
              <a routerLink="/outils"
                 class="block px-3 py-2 rounded-md text-base font-medium hover:text-[#C56CF6] hover:bg-gray-900">Outils</a>
            </div>
          </div>
        }
      </nav>

      <main class="pt-20">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-black/95 border-t border-white/10 py-8 mt-20">
        <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 Trapotopia. Tous droits réservés. -- Production -- Version 1.0.0</p>
          <p class="mt-2">Site conçu et réalisé avec le <span class="text-red-500">❤</span> par <span
            class="text-gray-300">Little One</span> et <span class="text-gray-300">Unesemaine</span></p>
        </div>
      </footer>

    </div>
  `
})
export class App {
  isMobileMenuOpen: WritableSignal<boolean> = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
