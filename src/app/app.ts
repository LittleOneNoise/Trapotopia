import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from "./components/footer.component";
import {HeaderComponent} from "./components/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-[#121212] text-gray-200 font-sans selection:bg-[#C56CF6] selection:text-white">

      <trapotopia-header/>

      <main class="pt-20">
        <router-outlet></router-outlet>
      </main>

      <trapotopia-footer/>

    </div>
  `
})
export class App {
}
