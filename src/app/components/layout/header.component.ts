import { Component, effect, ElementRef, inject, PLATFORM_ID, signal, viewChild, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'trapotopia-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive],
  template: `
    <nav
      class="fixed top-0 left-0 w-full z-50 text-text-surface-900 font-heading text-base font-medium bg-surface-900/80 backdrop-blur-md border-b border-b-border-surface-900">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-20">

          <div class="flex items-center gap-3 shrink-0">
            <a routerLink="/" class="block" (click)="onLogoClick()">
              <img class="h-14 w-14 shrink-0" ngSrc="/logo_trapotopia_header.png" alt="logo_trapotopia_header"
                   height="1000"
                   width="1000" priority/>
            </a>
          </div>

          <div class="hidden md:flex flex-1 justify-center">
            <div #navContainer class="relative flex items-center space-x-1" (mouseleave)="resetToActive()">

              <div
                class="absolute bottom-0 h-0.5 bg-og-pink transition-all duration-300 ease-out pointer-events-none"
                [style.left.px]="indicatorLeft"
                [style.width.px]="indicatorWidth"
                [style.opacity]="indicatorWidth ? 1 : 0">
              </div>

              @for (navLink of this.navLinkList; track navLink.label) {
                <a [routerLink]="navLink.path"
                   routerLinkActive="active-link text-og-pink"
                   [routerLinkActiveOptions]="{exact: true}"
                   (mouseenter)="moveIndicator($event.target)"
                   class="hover:text-og-pink px-3 py-6 transition-colors cursor-pointer relative z-10">
                  {{ navLink.label }}
                </a>
              }

              @if (environmentMode === 'development') {
                <a routerLink="/__analog/routes"
                   routerLinkActive="active-link text-og-pink"
                   [routerLinkActiveOptions]="{exact: true}"
                   (mouseenter)="moveIndicator($event.target)"
                   class="text-[oklch(0.69_0.12_70.5)] hover:text-og-pink px-3 py-6 transition-colors cursor-pointer relative z-10">
                  Debug routes
                </a>
                <a routerLink="/sandbox"
                   routerLinkActive="active-link text-og-pink"
                   [routerLinkActiveOptions]="{exact: true}"
                   (mouseenter)="moveIndicator($event.target)"
                   class="text-[oklch(0.69_0.12_70.5)] hover:text-og-pink px-3 py-6 transition-colors cursor-pointer relative z-10">
                  Sandbox
                </a>
              }

            </div>
          </div>

          <!-- Élément invisible pour équilibrer le layout et garder les liens centrés -->
          <div class="hidden md:block w-14 shrink-0"></div>

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

            @for (navLink of this.navLinkList; track navLink.label) {
              <a [routerLink]="navLink.path"
                 routerLinkActive="text-[#C56CF6] bg-gray-900"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-[#C56CF6] hover:bg-gray-900">
                {{ navLink.label }}
              </a>
            }

          </div>
        </div>
      }
    </nav>
  `,
})
export class HeaderComponent {
  public isMobileMenuOpen: WritableSignal<boolean> = signal(false);

  // Variables pour la position et la taille de la barre
  public indicatorLeft = 0;
  public indicatorWidth = 0;

  // Signal pour savoir si l'initialisation a été faite
  private readonly initialized = signal(false);

  // Référence au conteneur des liens pour limiter la recherche du DOM
  public navContainer = viewChild<ElementRef<HTMLElement>>('navContainer');

  public navLinkList: NavLink[] = [
    { path: '/', label: 'Accueil' },
    { path: '/events', label: 'Évènements' },
    // { path: '/tools', label: 'Outils' },
    // { path: '/stuffs', label: 'Stuffs' },
    // { path: '/influencers', label: 'Nos influenceurs' },
  ];

  public readonly environmentMode: string = import.meta.env.MODE;

  public readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // Écoute les changements de route pour mettre à jour la ligne active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Petit timeout pour laisser le temps à routerLinkActive d'appliquer la classe
      setTimeout(() => this.resetToActive(), 50);
    });

    // Effet qui se déclenche quand navContainer devient disponible (côté browser uniquement)
    effect(() => {
      const container = this.navContainer();
      if (container && !this.initialized() && isPlatformBrowser(this.platformId)) {
        // Le conteneur est prêt, on initialise avec retry
        this.initializeIndicatorWithRetry();
      }
    });
  }

  // Initialise l'indicateur avec plusieurs tentatives pour s'assurer que routerLinkActive a appliqué la classe
  private initializeIndicatorWithRetry(attempts = 0, maxAttempts = 10) {
    const container = this.navContainer();
    if (!container) return;

    const activeLink = container.nativeElement.querySelector('.active-link') as HTMLElement;

    if (activeLink) {
      this.setIndicator(activeLink);
      this.initialized.set(true);
    } else if (attempts < maxAttempts) {
      // Réessayer après un court délai si aucun lien actif n'est trouvé
      setTimeout(() => this.initializeIndicatorWithRetry(attempts + 1, maxAttempts), 50);
    }
  }

  toggleMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  // Met à jour la barre de soulignement quand on clique sur le logo
  onLogoClick(): void {
    const container = this.navContainer();
    if (!container) return;

    // Trouver le premier lien de navigation (Accueil)
    const accueilLink = container.nativeElement.querySelector('a') as HTMLElement;
    if (accueilLink) {
      this.setIndicator(accueilLink);
    }
  }

  // Déplace la ligne vers l'élément survolé
  moveIndicator(target: EventTarget | null) {
    const element = target as HTMLElement;
    if (element) {
      this.setIndicator(element);
    }
  }

  // Remet la ligne sur l'élément actif (appelé au mouseleave ou changement de route)
  resetToActive() {
    const container = this.navContainer();
    if (!container) return;

    // On cherche l'élément qui a la classe .active-link à l'intérieur de notre nav
    const activeLink = container.nativeElement.querySelector('.active-link') as HTMLElement;

    if (activeLink) {
      this.setIndicator(activeLink);
    } else {
      // Si aucun lien actif (ex: page 404 ou hors menu), on cache la barre
      this.indicatorWidth = 0;
    }
  }

  // Calcul mathématique de la position
  private setIndicator(element: HTMLElement) {
    // offsetLeft est la position relative au parent le plus proche en 'relative' (notre navContainer)
    this.indicatorLeft = element.offsetLeft;
    this.indicatorWidth = element.offsetWidth;
  }
}
