import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements AfterViewInit {
  @ViewChild('welcomeContent', { static: false }) welcomeContent!: ElementRef;
  @ViewChild('pokeballLoader', { static: false }) pokeballLoader!: ElementRef;

  constructor(private router: Router) {}

  public ngAfterViewInit() {
    if (!this.welcomeContent) {
      console.error('Elemento welcomeContent no encontrado');
    }

    if (!this.pokeballLoader) {
      console.error('Elemento pokeballLoader no encontrado');
    }
  }

  public onGetStarted() {
    this.hideWelcomeContent();
    this.showLoader();
    this.simulateLoading();
  }

  private hideWelcomeContent() {
    if (this.welcomeContent) {
      this.welcomeContent.nativeElement.style.display = 'none';
    }
  }

  private showLoader() {
    if (this.pokeballLoader) {
      this.pokeballLoader.nativeElement.style.display = 'block';
    }
  }

  private simulateLoading() {
    setTimeout(() => {
      this.router.navigate(['/lista']);
    }, 2000);
  }
}
