import { Component, effect, ElementRef, inject, PLATFORM_ID, signal, viewChild, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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

          <!-- Bouton Connexion Discord / Menu utilisateur -->
          <div class="hidden md:flex items-center shrink-0">
            @if (authService.loading()) {
              <!-- Skeleton loader -->
              <div class="w-32 h-10 bg-surface-800 rounded-lg animate-pulse"></div>
            } @else if (authService.isAuthenticated()) {
              <!-- Menu utilisateur connecté -->
              <div class="relative" #userMenuContainer>
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors">
                  @if (authService.user()?.avatar) {
                    <img
                      [src]="getDiscordAvatarUrl()"
                      alt="Avatar"
                      class="w-8 h-8 rounded-full"
                    />
                  } @else {
                    <div class="w-8 h-8 rounded-full bg-discord flex items-center justify-center">
                      <span class="text-white text-sm font-bold">
                        {{ authService.user()?.username?.charAt(0)?.toUpperCase() }}
                      </span>
                    </div>
                  }
                  <span class="text-text-surface-900 text-sm">{{ authService.user()?.username }}</span>
                  <svg class="w-4 h-4 text-text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                @if (isUserMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-48 bg-surface-800 rounded-lg shadow-lg border border-border-surface-900 py-1 z-50">
                    <div class="px-4 py-2 border-b border-border-surface-900">
                      <p class="text-xs text-gray-400">Connecté en tant que</p>
                      <p class="text-sm text-text-surface-900 font-medium truncate">{{ authService.user()?.username }}</p>
                      <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full"
                            [class]="getRoleBadgeClass()">
                        {{ getRoleLabel() }}
                      </span>
                    </div>
                    @if (authService.isAdmin()) {
                      <a routerLink="/admin"
                         class="block px-4 py-2 text-sm text-text-surface-900 hover:bg-surface-700 transition-colors">
                        Administration
                      </a>
                    }
                    <button
                      (click)="authService.logout()"
                      class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-700 transition-colors">
                      Se déconnecter
                    </button>
                  </div>
                }
              </div>
            } @else {
              <!-- Bouton Connexion Discord -->
              <button
                (click)="authService.login()"
                class="flex items-center gap-2 px-4 py-2 bg-discord hover:bg-discord-hover rounded-lg transition-colors font-medium text-white">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Se connecter
              </button>
            }
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

            <!-- Séparateur et bouton Discord mobile -->
            <div class="border-t border-white/10 my-2 pt-2">
              @if (authService.loading()) {
                <div class="px-3 py-2">
                  <div class="w-full h-10 bg-surface-800 rounded-lg animate-pulse"></div>
                </div>
              } @else if (authService.isAuthenticated()) {
                <div class="px-3 py-2">
                  <div class="flex items-center gap-3 mb-2">
                    <img [src]="getDiscordAvatarUrl()" alt="Avatar" class="w-10 h-10 rounded-full"/>
                    <div>
                      <p class="text-sm text-text-surface-900 font-medium">{{ authService.user()?.username }}</p>
                      <span class="inline-block px-2 py-0.5 text-xs rounded-full" [class]="getRoleBadgeClass()">
                        {{ getRoleLabel() }}
                      </span>
                    </div>
                  </div>
                  @if (authService.isAdmin()) {
                    <a routerLink="/admin"
                       class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-og-pink hover:bg-gray-900">
                      Administration
                    </a>
                  }
                  <button
                    (click)="authService.logout()"
                    class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-900">
                    Se déconnecter
                  </button>
                </div>
              } @else {
                <button
                  (click)="authService.login()"
                  class="flex items-center justify-center gap-2 w-full mx-3 px-4 py-2 bg-discord hover:bg-discord-hover rounded-lg transition-colors font-medium text-white">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Se connecter avec Discord
                </button>
              }
            </div>

          </div>
        </div>
      }
    </nav>
  `,
})
export class HeaderComponent {
  public isMobileMenuOpen: WritableSignal<boolean> = signal(false);
  public isUserMenuOpen: WritableSignal<boolean> = signal(false);

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
  public readonly authService = inject(AuthService);
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

  // ============================================================
  // Menu Utilisateur Discord
  // ============================================================
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  getDiscordAvatarUrl(): string {
    return this.authService.getAvatarUrl(64) ?? '';
  }

  getRoleBadgeClass(): string {
    const role = this.authService.user()?.role;
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/20 text-red-400';
      case 'EVENTS_STAFF':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-discord/20 text-discord';
    }
  }

  getRoleLabel(): string {
    const role = this.authService.user()?.role;
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'EVENTS_STAFF':
        return 'Staff Events';
      default:
        return 'Membre';
    }
  }
}
