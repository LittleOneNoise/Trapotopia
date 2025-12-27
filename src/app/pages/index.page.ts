import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CardComponent } from '../components/elements/card-presentation-double-image.component';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { CardReviewComponent } from '../components/elements/card-review.component';

@Component({
  selector: 'trapotopia-home',
  standalone: true,
  template: `
    <!-- Landing page -->
    <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          ngSrc="/landing-page-trapotopia-vs-comte.png"
          alt="landing-page-trapotopia-vs-comte"
          fill
          class="object-cover opacity-25"
          priority/>
        <div class="absolute inset-0 bg-linear-to-t from-surface-800 via-transparent to-black/40"></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-24 text-text-landing-image">
        <h1 class="text-lg md:text-2xl lg:text-3xl drop-shadow-lg">
          Libérez votre potentiel en rejoignant <br/>
          <span
            class="block mt-4 text-4xl font-luckiest font-thin md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-linear-to-r from-text-landing-image from-30% to-og-pink">
        Trapotopia
      </span>
        </h1>
      </div>

      <div class="absolute bottom-40 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg class="w-20 h-20 text-og-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 10l5 5 5-5"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 6l5 5 5-5"></path>
        </svg>
      </div>
    </section>

    <!-- Pourquoi nous ? -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto text-text-surface-800">

        <h2 class="text-3xl md:text-4xl text-center mb-20">
          Pourquoi nous ?
        </h2>

        <div class="space-y-24">

          <!-- row/column -->
          <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12" appScrollReveal="fade-left">

            <trapotopia-card-presentation-double-image
              image1Url="/tete-de-mort-etat-dofus.png"
              [image1Height]=192
              [image1Width]=192
              image1Alt="tete-de-mort-etat-dofus"
              image2Url="/dm-unesemaine-trap.png"
              [image2Height]=151
              [image2Width]=275
              image2Alt="dm-unesemaine-trap"/>

            <div class="w-full md:w-1/2 text-center md:text-left">
              <h3 class="text-xl mb-4">Trapper ou être Trappé : Telle est la question</h3>
              <p class="leading-relaxed">
                L'ennui ? On ne connaît pas. Chez nous, chaque connexion est une prise de risque.
                Notre spécialité est de vous embarquer de force (mais avec <span class="text-og-pink">amour</span>)
                dans des aventures que personne ne veut faire. C'est ça, <span
                class="text-og-pink">l'esprit du Trap</span> :
                vous faire vivre le pire du jeu, mais avec la <span
                class="text-og-pink">meilleure des ambiances</span>.
              </p>
            </div>
          </div>

          <!-- row/column -->
          <div class="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12" appScrollReveal="fade-right">

            <trapotopia-card-presentation-double-image
              image1Url="/logo-discord.png"
              [image1Height]=178
              [image1Width]=159
              image1Alt="logo-discord"
              image2Url="/view-group-discord-bot.png"
              [image2Height]=151
              [image2Width]=275
              image2Alt="view-group-discord-bot"/>

            <div class="w-full md:w-1/2 text-center md:text-left">
              <h3 class="text-xl mb-4">Un Discord qui ne dort jamais et un Bot complice</h3>
              <p class="leading-relaxed">
                Notre Discord est le cœur battant de nos embuscades. Il nous permet de <span class="text-og-pink">prolonger l'expérience</span>
                même hors-jeu.
                Notre fierté, c'est notre Bot maison. Il facilite le <span class="text-og-pink">recrutement</span> et
                la <span class="text-og-pink">gestion de groupe</span>.
                Grâce à lui, accompagner nos membres vers <span class="text-og-pink">l'excellence</span> n'a jamais
                été aussi fluide.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Ils nous détestent (et c'est bon signe) -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto text-text-surface-800">

        <h2 class="text-3xl md:text-4xl text-center mb-20">
          Ils nous détestent (et c'est bon signe)
        </h2>

        <div class="flex flex-col md:flex-row gap-8 items-stretch justify-center">

          <trapotopia-card-review
            reviewerProfilPicture="https://renderer.dofusdb.fr/look/7b323036397c7c7c3135307d/full/1/300_300.png"
            reviewerName="Comte Harebourg"
            reviewerProfilPictureAlt="Comte Harebourg"
            appScrollReveal="fade-up" [delay]=200>
            Tic... Tac... C'EST IMPOSSIBLE ! Mon système de π est conçu pour liquéfier les cerveaux normaux sous la
            panique du calcul, mais cette guilde lit mes vecteurs comme on lit un menu à la taverne d'Astrub !
            J'ai passé des siècles sur cette équation, et eux... ils l'ont résolue entre deux blagues sur mon chapeau.
            Je vais vous démonter pour voir si vous cachez une calculette à la place du cœur. REVENEZ, IL ME FAUT PLUS
            DE TEMPS !
          </trapotopia-card-review>

          <trapotopia-card-review
            reviewerProfilPicture="https://renderer.dofusdb.fr/look/7b363339367c7c7c38307d/full/1/300_300.png"
            reviewerName="Oto Mustan"
            reviewerProfilPictureAlt="Oto Mustan"
            appScrollReveal="fade-down" [delay]=200>
            Ils ont éviscéré mes gardes avec une cruauté si pure que j'en ai presque eu la larme à l'œil.
            C'est un massacre déshonorant, gratuit et d'une violence révoltante...
            Exactement ce que j'aime.
            Je les déteste pour cette défaite, mais leur sadisme est une œuvre d'art. Venez me voir, qu'on s'entre-tue à
            nouveau.
          </trapotopia-card-review>

        </div>

      </div>
    </section>

    <!-- Nous rejoindre -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto text-text-surface-800">

        <h2 class="text-3xl md:text-4xl text-center mb-20">
          Nous rejoindre
        </h2>

        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <p class="m-auto">A FAIRE....</p>
        </div>

      </div>
    </section>
  `,
  imports: [
    NgOptimizedImage,
    CardComponent,
    ScrollRevealDirective,
    CardReviewComponent
  ]
})
export default class HomePage {
}
