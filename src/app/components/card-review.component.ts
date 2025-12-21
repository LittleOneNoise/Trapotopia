import {Component, input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'trapotopia-card-review',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="relative bg-[#232323] p-8 rounded-2xl border border-white/5 shadow-2xl max-w-md w-full font-sans text-white">

      <!-- Lumière directionnelle (haut-gauche) -->
      <div
        class="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(75%_60%_at_18%_12%,rgba(255,255,255,0.12),transparent_60%)] opacity-80"></div>

      <!-- Relief interne -->
      <div
        class="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-22px_45px_rgba(0,0,0,0.7)]"></div>

      <!-- Contour subtil -->
      <div
        class="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_40%,rgba(255,255,255,0.08))] opacity-70"></div>

      <div class="flex justify-between items-center mb-6">

        <div class="flex flex-col gap-1.5">
          <h3 class="font-bold text-lg tracking-tight text-white/90 leading-tight">
            {{ reviewerName() }}
          </h3>

          <div class="flex gap-0.5">
            <span class="text-yellow-500 text-xl leading-none">★</span>
            <span class="text-gray-500 text-xl leading-none">★</span>
            <span class="text-gray-500 text-xl leading-none">★</span>
            <span class="text-gray-500 text-xl leading-none">★</span>
            <span class="text-gray-500 text-xl leading-none">★</span>
          </div>
        </div>

        <div class="w-16 h-16 shrink-0 rounded-full border border-white/10 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.6)] relative">
          <img
            [ngSrc]="reviewerProfilPicture()"
            [alt]="reviewerProfilPictureAlt()"
            fill
            class="object-cover scale-200"
            style="object-position: center 15%; transform-origin: center top;"
          />
        </div>

      </div>

      <div class="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-5"></div>

      <div class="space-y-4">
        <div class="text-white/80 leading-relaxed text-[15px]">
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Ombre portée fixe (flottement) -->
      <div
        class="pointer-events-none absolute left-10 right-10 -bottom-6 h-12 rounded-full blur-2xl bg-black/75 opacity-45"></div>

    </div>
  `,
})
export class CardReviewComponent {
  public readonly reviewerProfilPicture = input.required<string>();
  public readonly reviewerProfilPictureAlt = input.required<string>();
  public readonly reviewerName = input.required<string>();
}
