import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './core/template/toolbar/toolbar.component';
import { FooterComponent } from './core/template/footer/footer.component';
import { TailwindToastModule } from 'angular-tailwind-components';

@Component({
  imports: [RouterOutlet, ToolbarComponent, FooterComponent, TailwindToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
