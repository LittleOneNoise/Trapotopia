import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService, UserRole } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

// ============================================================
// Types
// ============================================================
interface AdminUser {
  id: number;
  discordId: string;
  username: string;
  globalName: string | null;
  nickname: string | null;
  avatar: string | null;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

interface UsersResponse {
  users: AdminUser[];
}

interface UpdateUserResponse {
  user: AdminUser;
}

// ============================================================
// Component
// ============================================================
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="min-h-screen bg-surface-800 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-text-surface-800">Administration</h1>
          <p class="mt-2 text-text-surface-800/60">Gestion des utilisateurs enregistrés</p>
        </div>

        @if (loading()) {
          <!-- Skeleton loader -->
          <div class="bg-surface-700 rounded-xl overflow-hidden">
            <div class="p-4 bg-surface-600">
              <div class="w-48 h-6 bg-surface-500 rounded animate-pulse"></div>
            </div>
            <div class="p-4 space-y-4">
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-surface-600 rounded-full animate-pulse"></div>
                  <div class="flex-1 h-4 bg-surface-600 rounded animate-pulse"></div>
                  <div class="w-32 h-8 bg-surface-600 rounded animate-pulse"></div>
                  <div class="w-16 h-8 bg-surface-600 rounded animate-pulse"></div>
                </div>
              }
            </div>
          </div>
        } @else if (error()) {
          <!-- Erreur -->
          <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-red-400 text-lg mb-2">{{ error() }}</p>
            <button
              (click)="loadUsers()"
              class="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors cursor-pointer">
              Réessayer
            </button>
          </div>
        } @else {
          <!-- Filtres et statistiques -->
          <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <!-- Stats -->
            <div class="flex flex-wrap gap-2 sm:gap-4">
              <div class="bg-surface-700 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <span class="text-text-surface-700/60 text-xs sm:text-sm">Total:</span>
                <span class="ml-1 sm:ml-2 text-text-surface-700 font-semibold text-sm sm:text-base">{{ users().length }}</span>
              </div>
              <div class="bg-surface-700 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <span class="text-text-surface-700/60 text-xs sm:text-sm">Actifs:</span>
                <span class="ml-1 sm:ml-2 text-green-400 font-semibold text-sm sm:text-base">{{ activeUsersCount() }}</span>
              </div>
              <div class="bg-surface-700 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
                <span class="text-text-surface-700/60 text-xs sm:text-sm">Inactifs:</span>
                <span class="ml-1 sm:ml-2 text-red-400 font-semibold text-sm sm:text-base">{{ inactiveUsersCount() }}</span>
              </div>
            </div>

            <!-- Toggle inactifs -->
            <label class="flex items-center gap-3 cursor-pointer select-none">
              <span class="text-text-surface-800/60 text-sm">Afficher les inactifs</span>
              <button
                type="button"
                role="switch"
                [attr.aria-checked]="showInactiveUsers()"
                (click)="showInactiveUsers.set(!showInactiveUsers())"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-og-pink focus:ring-offset-2 focus:ring-offset-surface-800 cursor-pointer"
                [class]="showInactiveUsers() ? 'bg-og-pink' : 'bg-surface-600'">
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                  [class]="showInactiveUsers() ? 'translate-x-6' : 'translate-x-1'">
                </span>
              </button>
            </label>
          </div>

          <!-- Vue Desktop : Tableau -->
          <div class="hidden lg:block bg-surface-700 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-surface-500">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-text-surface-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-text-surface-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-text-surface-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-text-surface-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-text-surface-500 uppercase tracking-wider">
                    Dernière MAJ
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-text-surface-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                </tr>
                </thead>
                <tbody>
                  @for (user of filteredUsers(); track user.id; let idx = $index) {
                    <tr class="transition-colors hover:bg-surface-600/50"
                        [class]="idx % 2 === 0 ? 'bg-surface-700' : 'bg-surface-600/30'"
                        [class.opacity-50]="!user.isActive">
                      <!-- Avatar + Nom -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-3">
                          @if (user.avatar) {
                            <img [src]="getAvatarUrl(user)" alt="Avatar" class="w-10 h-10 rounded-full"/>
                          } @else {
                            <div class="w-10 h-10 rounded-full bg-discord flex items-center justify-center">
                              <span class="text-white text-sm font-bold">
                                {{ getDisplayName(user).charAt(0).toUpperCase() }}
                              </span>
                            </div>
                          }
                          <div>
                            <div class="text-text-surface-700 font-medium">{{ getDisplayName(user) }}</div>
                            <div class="text-text-surface-700/50 text-sm">&#64;{{ user.username }}</div>
                          </div>
                        </div>
                      </td>

                      <!-- Rôle (Select) -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <select
                          [value]="user.role"
                          (change)="updateUserRole(user, $event)"
                          [disabled]="isCurrentUser(user) || updatingUsers().has(user.id)"
                          class="bg-surface-600 border-0 text-text-surface-600 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-og-pink disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          [class]="getRoleSelectClass(user.role)">
                          <option value="MEMBER">Membre</option>
                          <option value="EVENTS_STAFF">Staff Events</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>

                      <!-- Statut (Toggle) -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          role="switch"
                          [attr.aria-checked]="user.isActive"
                          (click)="toggleUserActive(user)"
                          [disabled]="isCurrentUser(user) || updatingUsers().has(user.id)"
                          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-og-pink focus:ring-offset-2 focus:ring-offset-surface-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          [class]="user.isActive ? 'bg-green-500' : 'bg-red-500'">
                          <span
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                            [class]="user.isActive ? 'translate-x-6' : 'translate-x-1'">
                          </span>
                        </button>
                      </td>

                      <!-- Date inscription -->
                      <td class="px-6 py-4 whitespace-nowrap text-text-surface-700/60 text-sm">
                        {{ formatDate(user.createdAt) }}
                      </td>

                      <!-- Dernière MAJ -->
                      <td class="px-6 py-4 whitespace-nowrap text-text-surface-700/60 text-sm">
                        {{ formatDate(user.updatedAt) }}
                      </td>

                      <!-- Dernière connexion -->
                      <td class="px-6 py-4 whitespace-nowrap text-text-surface-700/60 text-sm">
                        {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais' }}
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-6 py-12 text-center text-text-surface-700/50">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Vue Mobile/Tablette : Cards -->
          <div class="lg:hidden space-y-4">
            @for (user of filteredUsers(); track user.id) {
              <div class="bg-surface-700 rounded-xl p-4 space-y-4"
                   [class.opacity-50]="!user.isActive">
                <!-- Header : Avatar + Nom + Statut -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    @if (user.avatar) {
                      <img [src]="getAvatarUrl(user)" alt="Avatar" class="w-12 h-12 rounded-full"/>
                    } @else {
                      <div class="w-12 h-12 rounded-full bg-discord flex items-center justify-center">
                        <span class="text-white font-bold">
                          {{ getDisplayName(user).charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    }
                    <div>
                      <div class="text-text-surface-700 font-medium">{{ getDisplayName(user) }}</div>
                      <div class="text-text-surface-700/50 text-sm">&#64;{{ user.username }}</div>
                    </div>
                  </div>
                  <!-- Toggle statut -->
                  <button
                    type="button"
                    role="switch"
                    [attr.aria-checked]="user.isActive"
                    (click)="toggleUserActive(user)"
                    [disabled]="isCurrentUser(user) || updatingUsers().has(user.id)"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-og-pink disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    [class]="user.isActive ? 'bg-green-500' : 'bg-red-500'">
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                      [class]="user.isActive ? 'translate-x-6' : 'translate-x-1'">
                    </span>
                  </button>
                </div>

                <!-- Rôle -->
                <div class="flex items-center justify-between bg-surface-600/50 rounded-lg px-3 py-2">
                  <span class="text-text-surface-700/60 text-sm">Rôle</span>
                  <select
                    [value]="user.role"
                    (change)="updateUserRole(user, $event)"
                    [disabled]="isCurrentUser(user) || updatingUsers().has(user.id)"
                    class="bg-surface-600 border-0 text-text-surface-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-og-pink disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    [class]="getRoleSelectClass(user.role)">
                    <option value="MEMBER">Membre</option>
                    <option value="EVENTS_STAFF">Staff Events</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div class="bg-surface-600/30 rounded-lg px-3 py-2">
                    <div class="text-text-surface-700/50 text-xs">Inscription</div>
                    <div class="text-text-surface-700/80">{{ formatDateShort(user.createdAt) }}</div>
                  </div>
                  <div class="bg-surface-600/30 rounded-lg px-3 py-2">
                    <div class="text-text-surface-700/50 text-xs">Dernière MAJ</div>
                    <div class="text-text-surface-700/80">{{ formatDateShort(user.updatedAt) }}</div>
                  </div>
                  <div class="bg-surface-600/30 rounded-lg px-3 py-2">
                    <div class="text-text-surface-700/50 text-xs">Dernière connexion</div>
                    <div class="text-text-surface-700/80">{{ user.lastLoginAt ? formatDateShort(user.lastLoginAt) : 'Jamais' }}</div>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="bg-surface-700 rounded-xl p-8 text-center text-text-surface-700/50">
                Aucun utilisateur trouvé
              </div>
            }
          </div>
        }
      </div>
    </main>
  `,
})
export default class AdminPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  // État
  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showInactiveUsers = signal(true);
  readonly updatingUsers = signal<Set<number>>(new Set());

  // Computed
  readonly filteredUsers = computed(() => {
    const allUsers = this.users();
    if (this.showInactiveUsers()) {
      return allUsers;
    }
    return allUsers.filter(user => user.isActive);
  });

  readonly activeUsersCount = computed(() => this.users().filter(u => u.isActive).length);
  readonly inactiveUsersCount = computed(() => this.users().filter(u => !u.isActive).length);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Vérifier l'authentification et le rôle admin
    this.checkAccessAndLoad();
  }

  private async checkAccessAndLoad(): Promise<void> {
    // Attendre que l'auth soit chargée
    while (this.authService.loading()) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Vérifier l'accès
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    // Charger les utilisateurs
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.http.get<UsersResponse>('/api/v1/admin/users')
      );
      this.users.set(response.users);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      const httpError = err as { status?: number };
      if (httpError.status === 403) {
        this.error.set('Accès refusé - Vous n\'avez pas les droits administrateur');
        this.router.navigate(['/']);
      } else {
        this.error.set('Impossible de charger les utilisateurs');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async updateUserRole(user: AdminUser, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value as UserRole;

    if (newRole === user.role) {
      return;
    }

    await this.updateUser(user, { role: newRole });
  }

  async toggleUserActive(user: AdminUser): Promise<void> {
    await this.updateUser(user, { isActive: !user.isActive });
  }

  private async updateUser(user: AdminUser, updates: Partial<{ role: UserRole; isActive: boolean }>): Promise<void> {
    // Marquer comme en cours de mise à jour
    this.updatingUsers.update(set => {
      const newSet = new Set(set);
      newSet.add(user.id);
      return newSet;
    });

    try {
      const response = await firstValueFrom(
        this.http.patch<UpdateUserResponse>(`/api/v1/admin/users/${user.id}`, updates)
      );

      // Mettre à jour l'utilisateur dans la liste
      this.users.update(users =>
        users.map(u => u.id === user.id ? response.user : u)
      );
    } catch (err: unknown) {
      console.error('Erreur lors de la mise à jour:', err);
      const httpError = err as { error?: { statusMessage?: string } };
      alert(httpError.error?.statusMessage ?? 'Erreur lors de la mise à jour');
    } finally {
      // Retirer de la liste des mises à jour en cours
      this.updatingUsers.update(set => {
        const newSet = new Set(set);
        newSet.delete(user.id);
        return newSet;
      });
    }
  }

  isCurrentUser(user: AdminUser): boolean {
    return user.discordId === this.authService.user()?.discordId;
  }

  getDisplayName(user: AdminUser): string {
    return user.nickname ?? user.globalName ?? user.username;
  }

  getAvatarUrl(user: AdminUser): string {
    if (!user.avatar) {
      const defaultIndex = Number(BigInt(user.discordId) % 5n);
      return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=64`;
  }

  getRoleSelectClass(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return 'text-red-400';
      case 'EVENTS_STAFF':
        return 'text-amber-400';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }
}
