// N'importiw les composants nécessaires mil Angular w mil Material Design 
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Ncréiw un composant Angular bech na3mlou formulaire de connexion
@Component({
  selector: 'app-login', // Ism el composant
  templateUrl: './login.component.html', // Le fichier HTML correspondant
  imports: [
    ReactiveFormsModule, // Bech nesta3mlou les formulaires réactifs
    MatCardModule, // Bech ykoun formulaire fi une carte Material Design
    MatInputModule, // Bech nesta3mlou les inputs Material Design
    MatButtonModule, // Bech nesta3mlou les boutons Material Design
  ],
  styleUrls: ['./login.component.css'], // Le fichier CSS correspondant
})

// Ncréiw la classe du composant
export class LoginComponent {
  // Ncréiw un formulaire de type FormGroup
  loginForm: FormGroup;

  // Variable bech né5dmou bih error message si l'utilisateur ma yod5olch les informations s7i7a
  errorMessage: string | null = null;

  // Constructor bech nesta3mlou FormBuilder, AuthService, w Router
  constructor(
    private fb: FormBuilder, // FormBuilder bech ysahhl la création de forms
    private authService: AuthService = inject(AuthService), // Ninjectiw le service d'authentification
    private router: Router // Router bech nesta3mlou bech nredirectiw l'utilisateur ba3d le login
  ) {
    // Niniitializiw el formulaire b deux champs: username w password, w les deux sont obligatoires (Validators.required)
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Champ username obligatoire
      password: ['', Validators.required], // Champ password obligatoire
    });
  }

  // Méthode bech tista3ml l'authentification mta3 l'utilisateur
  onSubmit(): void {
    // Netcheckiw si formulaire valide
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Né5dhou les valeurs des champs

      // Nedhifou l'authService bech njarbou na3mlou login
      this.authService.login(username, password).subscribe({
        // Ki ykoun login réussi
        next: () => {
          this.router.navigate(['/dashboard']); // Nredirectiw l'utilisateur vers le tableau de bord
        },
        // Ki ykoun login échoué
        error: (err) => {
          this.errorMessage =
            err.error.message || 'Login failed. Please try again.'; // Affichage d’un message d’erreur
        },
      });
    }
  }
}
