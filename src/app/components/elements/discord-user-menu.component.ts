import { Component, ElementRef, HostListener, inject, input, signal, viewChild, WritableSignal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'trapotopia-discord-user-menu',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    @if (authService.loading()) {
      <!-- Skeleton loader -->
      @if (mobile()) {
        <div class="px-3 py-2">
          <div class="w-full h-10 bg-surface-700 rounded-lg animate-pulse"></div>
        </div>
      } @else {
        <div class="w-32 h-10 bg-surface-700 rounded-lg animate-pulse"></div>
      }
    } @else if (authService.isAuthenticated()) {
      <!-- Menu utilisateur connecté -->
      @if (mobile()) {
        <!-- Version Mobile -->
        <div class="px-3 py-2">
          <div class="flex items-center gap-3 mb-2">
            @if (authService.user()?.avatar) {
              <img
                [ngSrc]="getDiscordAvatarUrl()"
                alt="Avatar"
                class="w-10 h-10 rounded-full"
                width="40"
                height="40"
              />
            } @else {
              <div class="w-10 h-10 rounded-full bg-discord flex items-center justify-center">
                <span class="text-white text-base font-bold">
                  {{ authService.getDisplayName()?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
            }
            <div>
              <p class="text-sm text-text-surface-900 font-medium">{{ authService.getDisplayName() }}</p>
              <p class="text-xs text-gray-400">&#64;{{ authService.user()?.username }}</p>
              <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full" [class]="getRoleBadgeClass()">
                {{ getRoleLabel() }}
              </span>
            </div>
          </div>
          <button
            (click)="authService.logout()"
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-900 cursor-pointer">
            Se déconnecter
          </button>
        </div>
      } @else {
        <!-- Version Desktop -->
        <div class="relative" #userMenuContainer>
          <button
            (click)="toggleUserMenu()"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors cursor-pointer">
            @if (authService.user()?.avatar) {
              <img
                [ngSrc]="getDiscordAvatarUrl()"
                alt="Avatar"
                class="w-8 h-8 rounded-full"
                width="32"
                height="32"
              />
            } @else {
              <div class="w-8 h-8 rounded-full bg-discord flex items-center justify-center">
                <span class="text-white text-sm font-bold">
                  {{ authService.getDisplayName()?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
            }
            <span class="text-text-surface-900 text-sm">{{ authService.getDisplayName() }}</span>
            <svg class="w-4 h-4 text-text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          @if (isUserMenuOpen()) {
            <div class="absolute right-0 mt-2 w-56 bg-surface-700 rounded-lg shadow-lg border border-border-surface-700 py-1 z-50">
              <div class="px-4 py-2 border-b border-border-surface-600">
                <div class="flex items-center gap-2">
                  <p class="text-sm text-text-surface-900 font-medium truncate">{{ authService.getDisplayName() }}</p>
                  <span class="text-xs text-gray-400">&#64;{{ authService.user()?.username }}</span>
                </div>
                <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded-full"
                      [class]="getRoleBadgeClass()">
                  {{ getRoleLabel() }}
                </span>
              </div>
              <button
                (click)="authService.logout()"
                class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-600 transition-colors cursor-pointer">
                Se déconnecter
              </button>
            </div>
          }
        </div>
      }
    } @else {
      <!-- Bouton Connexion Discord -->
      @if (mobile()) {
        <button
          (click)="authService.login()"
          class="flex items-center justify-center gap-2 w-full mx-3 px-4 py-2 bg-discord hover:bg-discord-hover rounded-lg transition-colors font-medium text-white cursor-pointer">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Se connecter avec Discord
        </button>
      } @else {
        <button
          (click)="authService.login()"
          class="flex items-center gap-2 px-4 py-2 bg-discord hover:bg-discord-hover rounded-lg transition-colors font-medium text-white cursor-pointer">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Se connecter
        </button>
      }
    }
  `,
})
export class DiscordUserMenuComponent {
  public mobile = input<boolean>(false);
  public isUserMenuOpen: WritableSignal<boolean> = signal(false);
  public userMenuContainer = viewChild<ElementRef<HTMLElement>>('userMenuContainer');

  public readonly authService = inject(AuthService);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenuEl = this.userMenuContainer()?.nativeElement;
    if (this.isUserMenuOpen() && userMenuEl && !userMenuEl.contains(target)) {
      this.isUserMenuOpen.set(false);
    }
  }

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
