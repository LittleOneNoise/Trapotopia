import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// ============================================================
// Types
// ============================================================
export type UserRole = 'MEMBER' | 'EVENTS_STAFF' | 'ADMIN';

export interface AuthUser {
  id: number;
  discordId: string;
  username: string;
  avatar: string | null;
  role: UserRole;
}

interface MeResponse {
  user: AuthUser | null;
}

// ============================================================
// Service
// ============================================================
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  // État
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _loading = signal<boolean>(true);
  private readonly _initialized = signal<boolean>(false);

  // Getters publics
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');
  readonly isStaff = computed(() => {
    const role = this._user()?.role;
    return role === 'ADMIN' || role === 'EVENTS_STAFF';
  });

  constructor() {
    // Charger l'utilisateur au démarrage (uniquement côté browser)
    if (isPlatformBrowser(this.platformId)) {
      this.loadCurrentUser();
    } else {
      this._loading.set(false);
    }
  }

  /**
   * Charge les informations de l'utilisateur connecté
   */
  async loadCurrentUser(): Promise<void> {
    if (this._initialized()) {
      return;
    }

    this._loading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.get<MeResponse>('/api/v1/auth/me')
      );
      this._user.set(response.user);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      this._user.set(null);
    } finally {
      this._loading.set(false);
      this._initialized.set(true);
    }
  }

  /**
   * Redirige vers la page de connexion Discord
   */
  login(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/api/v1/auth/login';
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/api/v1/auth/logout';
    }
  }

  /**
   * Retourne l'URL de l'avatar Discord
   */
  getAvatarUrl(size: number = 64): string | null {
    const user = this._user();
    if (!user) {
      return null;
    }

    if (!user.avatar) {
      // Avatar par défaut Discord basé sur l'ID
      const defaultIndex = Number(BigInt(user.discordId) % 5n);
      return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }

    // Avatar personnalisé
    return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=${size}`;
  }
}
