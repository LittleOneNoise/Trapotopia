import { AfterViewInit, Component, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
    <nav class="fixed top-0 left-0 w-full z-50 text-text-surface-900 font-heading text-lg font-normal bg-surface-900/80 backdrop-blur-md border-b border-b-border-surface-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">

          <div class="flex items-center gap-3 min-w-0 flex-1">
            <img class="h-14 w-14 shrink-0" ngSrc="/logo_trapotopia_header.png" alt="logo_trapotopia_header"
                 height="1000"
                 width="1000" priority/>
          </div>

          <div class="hidden md:block shrink-0">
            <div #navContainer class="relative ml-10 flex items-center space-x-1" (mouseleave)="resetToActive()">

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
export class HeaderComponent implements AfterViewInit {
  public isMobileMenuOpen: WritableSignal<boolean> = signal(false);

  // Variables pour la position et la taille de la barre
  public indicatorLeft = 0;
  public indicatorWidth = 0;

  // Référence au conteneur des liens pour limiter la recherche du DOM
  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  public navLinkList: NavLink[] = [
    { path: '/', label: 'Accueil' },
    { path: '/events', label: 'Évènements' },
    { path: '/tools', label: 'Outils' },
    { path: '/stuffs', label: 'Stuffs' },
    { path: '/influencers', label: 'Nos influenceurs' },
  ];

  public readonly environmentMode: string = import.meta.env.MODE;

  constructor(private router: Router) {
    // Écoute les changements de route pour mettre à jour la ligne active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Petit timeout pour laisser le temps à routerLinkActive d'appliquer la classe
      setTimeout(() => this.resetToActive(), 50);
    });
  }

  ngAfterViewInit() {
    // Initialisation au chargement de la page
    // Timeout nécessaire pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.resetToActive(), 0);
  }

  toggleMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
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
    if (!this.navContainer) return;

    // On cherche l'élément qui a la classe .active-link à l'intérieur de notre nav
    const activeLink = this.navContainer.nativeElement.querySelector('.active-link') as HTMLElement;

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
