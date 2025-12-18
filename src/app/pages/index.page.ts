import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {CardComponent} from "../components/card-presentation-double-image.component";
import {ScrollRevealDirective} from "../directives/scroll-reveal.directive";

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <!-- Landing page -->
    <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          ngSrc="/landing-page-trapotopia-vs-comte.png"
          alt="landing-page-trapotopia-vs-comte"
          fill
          class="object-cover opacity-30"
          priority/>
        <div class="absolute inset-0 bg-linear-to-t from-[#121212] via-transparent to-black/40"></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-24">
        <h1 class="text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg font-orbitron">
          Libérez votre potentiel en rejoignant <br/>
          <span
            class="block mt-4 text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
        Trapotopia
      </span>
        </h1>
      </div>

      <div class="absolute bottom-40 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg class="w-20 h-20 text-[#C56CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10l5 5 5-5"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 6l5 5 5-5"></path>
        </svg>
      </div>
    </section>

    <!-- Pourquoi nous ? -->
    <section class="py-20 px-4 bg-[#121212]">
      <div class="max-w-6xl mx-auto">

        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-200 mb-20 font-orbitron">
          Pourquoi nous ?
        </h2>

        <div class="space-y-24">

          <!-- row/column -->
          <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12" appScrollReveal="fade-left">

            <app-card-presentation-double-image
              image1Url="/tete-de-mort-etat-dofus.png"
              [image1Height]=192
              [image1Width]=192
              image1Alt="tete-de-mort-etat-dofus"
              image2Url="/dm-unesemaine-trap.png"
              [image2Height]=151
              [image2Width]=275
              image2Alt="dm-unesemaine-trap"/>

            <div class="w-full md:w-1/2 text-center md:text-left">
              <h3 class="text-xl font-bold text-gray-100 mb-4">Trapper ou être Trappé : Telle est la question</h3>
              <p class="text-gray-400 leading-relaxed">
                L'ennui ? On ne connaît pas. Chez nous, chaque connexion est une prise de risque.
                Notre spécialité est de vous embarquer de force (mais avec <span class="text-[#C56CF6]">amour</span>)
                dans des aventures que personne ne veut faire. C'est ça, <span
                class="text-[#C56CF6]">l'esprit du Trap</span> :
                vous faire vivre le pire du jeu, mais avec la <span
                class="text-[#C56CF6]">meilleure des ambiances</span>.
              </p>
            </div>
          </div>

          <!-- row/column -->
          <div class="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12" appScrollReveal="fade-right">

            <app-card-presentation-double-image
              image1Url="/logo-discord.png"
              [image1Height]=178
              [image1Width]=159
              image1Alt="logo-discord"
              image2Url="/view-group-discord-bot.png"
              [image2Height]=151
              [image2Width]=275
              image2Alt="view-group-discord-bot"/>

            <div class="w-full md:w-1/2 text-center md:text-left">
              <h3 class="text-xl font-bold text-gray-100 mb-4">Un Discord qui ne dort jamais et un Bot complice</h3>
              <p class="text-gray-400 leading-relaxed">
                Notre Discord est le cœur battant de nos embuscades. Il nous permet de <span class="text-[#C56CF6]">prolonger l'expérience</span>
                même hors-jeu.
                Notre fierté, c'est notre Bot maison. Il facilite le <span class="text-[#C56CF6]">recrutement</span> et
                la <span class="text-[#C56CF6]">gestion de groupe</span>.
                Grâce à lui, accompagner nos membres vers <span class="text-[#C56CF6]">l'excellence</span> n'a jamais
                été aussi fluide.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Ils nous font confiance -->
    <section class="py-20 px-4 bg-[#121212]">
      <div class="max-w-6xl mx-auto">

        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-200 mb-20 font-orbitron">
          Ils nous font confiance
        </h2>

      </div>
    </section>

    <!-- Nous rejoindre -->
    <section class="py-20 px-4 bg-[#121212]">
      <div class="max-w-6xl mx-auto">

        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-200 mb-20 font-orbitron">
          Nous rejoindre
        </h2>

      </div>
    </section>
  `,
  imports: [
    NgOptimizedImage,
    CardComponent,
    ScrollRevealDirective
  ],
  styles: [`
    /* Police stylée utilisé pour la landing page */
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

    .font-orbitron {
      font-family: 'Orbitron', sans-serif;
    }

    h3 {
      text-wrap: balance;
    }
  `]
})
export default class Home {
}
