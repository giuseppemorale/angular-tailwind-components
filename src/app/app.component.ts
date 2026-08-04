import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './core/template/toolbar/toolbar.component';
import { FooterComponent } from './core/template/footer/footer.component';
import { TailwindToast } from 'angular-tailwind-components';

@Component({
  imports: [RouterOutlet, ToolbarComponent, FooterComponent, TailwindToast],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
