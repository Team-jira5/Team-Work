import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../contact.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ContactService', ['createContact']);

    await TestBed.configureTestingModule({
      declarations: [ContactFormComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: ContactService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    contactServiceSpy = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture.detectChanges();
  });

  it('should submit form and call createContact()', () => {
    // Remplir le formulaire avec des données valides
    component.contactForm.setValue({
      nom: 'Yassin',
      prenom: 'Hichri',
      tel: '12345678',
      email: 'yassin@example.com',
      adresse: 'Ariana, Tunisie'
    });

    // Simuler que createContact() renvoie un Observable
    contactServiceSpy.createContact.and.returnValue(of({ message: 'ok' }));

    // Appeler la méthode onSubmit()
    component.onSubmit();

    // Vérifier que createContact() a été appelée avec les bonnes données
    expect(contactServiceSpy.createContact).toHaveBeenCalledWith({
      nom: 'Yassin',
      prenom: 'Hichri',
      tel: '12345678',
      email: 'yassin@example.com',
      adresse: 'Ariana, Tunisie'
    });
  });
});
