import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../contact.service';
import { DatePipe } from '@angular/common'; // Import zayed, mahouch mest3mel, najem tna7ih
import { MatProgressSpinner } from '@angular/material/progress-spinner'; // Import du spinner pour affichage de chargement
import { MatIconModule } from '@angular/material/icon'; // Import du module des icônes Angular Material
import { MatDialog } from '@angular/material/dialog'; // Import du service MatDialog pour les popups (modals)
import { ContactDetailsModalComponent } from '../reservation-details-modal/contact-details-modal.component' // Import du composant modal pour afficher les détails du contact
import { Router } from '@angular/router'; // Import du Router pour la navigation
import { AuthService } from '../../auth.service'; // Import du AuthService pour gérer l'authentification

@Component({
  selector: 'app-dashboard', // Identifiant du composant
  templateUrl: './dashboard.component.html', // Chemin vers le fichier HTML
  imports: [MatProgressSpinner, MatIconModule], // Modules importés (Angular Material)
  styleUrls: ['./dashboard.component.css'], // Fichier CSS du composant
})
export class DashboardComponent implements OnInit { // Déclaration de la classe du composant
  contacts: any[] = []; // Liste des contacts
  isLoading = true; // Variable booléenne pour indiquer si les données sont en train de charger

  constructor(
    private contactService: ContactService, // Injection du service ContactService pour récupérer les contacts
    private authService: AuthService, // Injection du service AuthService pour la gestion de l'authentification
    public dialog: MatDialog, // Injection du service MatDialog pour gérer les modals
    private router: Router // Injection du Router pour la navigation
  ) {}

  ngOnInit(): void { // Fonction qui s'exécute automatiquement au chargement du composant
    this.loadContacts(); // Chargement des contacts
  }

  loadContacts(): void { // Fonction pour récupérer les contacts depuis le service
    this.isLoading = true; // Active l'état de chargement
    this.contactService.getContacts().subscribe(
      (data) => { // Si la requête réussit
        this.contacts = data; // Stocke les contacts dans la liste
        this.isLoading = false; // Désactive l'état de chargement
      },
      (error) => { // Si la requête échoue
        console.error('Erreur lors du chargement des contacts:', error); // Affiche l'erreur dans la console
        this.isLoading = false; // Désactive l'état de chargement
      }
    );
  }

  deleteContact(id: number): void { // Fonction pour supprimer un contact
    console.log('id', id); // Affiche l'ID du contact à supprimer dans la console
    if (confirm('Voulez-vous vraiment supprimer ce contact ?')) { // Demande de confirmation avant suppression
      this.contactService.removeContact(id).subscribe(
        () => { // Si la suppression réussit
          this.contacts = this.contacts.filter((c) => c.id !== id); // Supprime le contact de la liste affichée
        },
        (error) => { // Si la suppression échoue
          console.error("Erreur lors de la suppression :", error); // Affiche l'erreur dans la console
        }
      );
    }
  }

  openDetails(contact: any): void { // Fonction pour ouvrir la popup de détails d'un contact
    this.dialog.open(ContactDetailsModalComponent, { // Ouvre un MatDialog avec les détails du contact
      width: '500px', // Définit la largeur de la fenêtre modale
      data: contact, // Envoie les données du contact au composant modal
    });
  }

  logout(): void { // Fonction pour déconnecter l'utilisateur
    this.authService.logout().subscribe(
      () => { // Si la déconnexion réussit
        this.router.navigate(['/']); // Redirige l'utilisateur vers la page d'accueil
        console.log('Déconnexion réussie'); // Affiche un message dans la console
      },
      (error) => { // Si la déconnexion échoue
        console.error('Erreur lors de la déconnexion:', error); // Affiche l'erreur dans la console
      }
    );
  }
}
