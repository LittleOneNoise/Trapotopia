import { Component } from '@angular/core';
import { injectResponse } from '@analogjs/router/tokens';
import { RouteMeta } from '@analogjs/router';
import { ButtonComponent } from '../components/elements/button.component';

export const routeMeta: RouteMeta = {
  title: 'Page Non Trouvée - Trapotopia',
  canActivate: [
    () => {
      const response = injectResponse();
      if (import.meta.env.SSR && response) {
        response.statusCode = 404;
      }
      return true;
    },
  ],
};

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-20">
      <div class="max-w-2xl mx-auto text-center">

        <!-- 404 -->
        <div class="relative mb-6">
          <div
            class="text-[10rem] md:text-[14rem] font-luckiest leading-none select-none flex items-center justify-center">
            <span class="bg-clip-text text-og-pink/80">4</span>
            <span class="text-text-surface-900 inline-block mx-2">0</span>
            <span class="bg-clip-text text-og-pink/80">4</span>
          </div>
        </div>

        <!-- Message principal -->
        <h1 class="text-2xl md:text-4xl text-text-surface-800 mb-15">
          Cette page n'existe pas... ou a peut-être été mangée par un Bouftou !
        </h1>

        <!-- Bouton d'action -->
        <div class="flex justify-center">
          <trapotopia-button
            href="/"
            label="Utiliser une potion de rappel"
          />
        </div>

        <!-- Message philosophique -->
        <p class="mt-30 text-text-surface-700 text-sm italic">
          "On ne se perd jamais vraiment... on finit toujours par tomber dans un trap." <br/>
          <span class="text-og-pink">— Un Trappeur philosophe</span>
        </p>

      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export default class PageNotFoundComponent {
}
