import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLinkWithHref],
  templateUrl: './pages.html',
  styleUrl: './pages.scss',
})
export class Pages {

}
