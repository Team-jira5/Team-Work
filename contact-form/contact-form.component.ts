import { Component } from '@angular/core'; // Houni nimportiw Component bach n7addu l'app li fiha
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // Houni nimportiw l'outils li nasta3mlouhom bach n3amlu formulaire réactif
import { ContactService } from '../../contact.service'; // Nimportiw service ta3 les contacts bach n7aajmou l7ajat ta3 les contacts
import { CommonModule } from '@angular/common'; // Nimportiw module général min Angular

@Component({
  selector: 'app-contact-form', // Houni l'élément li bech n7otouh fi l'HTML
  templateUrl: './contact-form.component.html', // Chnowa el fichier HTML li bech yit7att fiha el formulaire
  imports: [ReactiveFormsModule, CommonModule], // Nimportiw les modules li m7taja bihom
  styleUrls: ['./contact-form.component.css'], // Chnowa el fichier CSS li bech ykoun li7ab el style
})
export class ContactFormComponent {
  contactForm: FormGroup; // Formulaire li bech n7ottou fih les données ta3 el contact

  // Options li bech n7otouhom fi les champs de sélection
  typeAccesOptions = ['FORMATION', 'CONFERENCE']; // Typologies mta3 l'accès
  dispositionOptions = ['EN_REUNION', 'STYLE_CINEMA']; // Styles mta3 la disposition
  directionOptions = ['DNS', 'TPR']; // Chkoun el direction li mkhtara

  constructor(
    private fb: FormBuilder, // Ninjectiw FormBuilder bach n9addmou formulaire
    private contactService: ContactService // Ninjectiw ContactService li houwa li bech yhandle l'méthodes li 3andhom 3la les contacts
  ) {
    // Houni n7adhdhoulna formulaire m3a validation
    this.contactForm = this.fb.group({
      nom: ['', Validators.required], // Houni chnakhdmou validation pour "Nom"
      prenom: ['', Validators.required], // Houni chnakhdmou validation pour "Prénom"
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]], // Houni n7otou validation bach ykoun "Téléphone" les chiffres seulement
      email: ['', [Validators.required, Validators.email]], // Houni validation bach ykoun email valid
      adresse: ['', Validators.required], // Houni validation pour "Adresse"
    });
  }

  // Houni n5al9ou fonction li tsir fi wa9t el submit mta3 formulaire
  onSubmit(): void {
    if (this.contactForm.valid) { // Si formulaire fiha des champs correctes
      const formData = this.contactForm.value; // Yjib les données mta3 formulaire

      // N7otou les données fi service ContactService
      this.contactService.createContact(formData).subscribe(
        (response) => {
          alert('Nous vous contacterons dans les plus brefs délais!'); // Message de succès li yban
          this.contactForm.reset(); // Reb3ad ma yetsajil formulaire ytzawwel
        },
        (error) => {
          console.error('Erreur lors de la création du contact:', error); // Ibandi erreur fi console
        }
      );
    } else {
      console.error('Formulaire invalide.'); // Si formulaire mouch valide, yban fi console
    }
  }
}
