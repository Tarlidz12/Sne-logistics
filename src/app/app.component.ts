// src/app/app.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

const WHATSAPP_NUMBER = '27818585598';            // +27 72 436 8639 (no plus)
const COMPANY_EMAIL  = 'quotes@snelogistics.co.za';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  year = new Date().getFullYear();
  loading = signal(false);
  sent = signal(false);
  email = "help@sinelogistic.com";

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✅ build the form after fb is initialized
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      product: [''],
      litres: [''],
      location: [''],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const v = this.form.getRawValue();

    const message =
`Fuel Quote Request

Name: ${v.fullName ?? ''}
Company: ${v.company ?? ''}
Email: ${v.email ?? ''}
Phone: ${v.phone ?? ''}
Product: ${v.product ?? ''}
Litres: ${v.litres ?? ''}
Delivery: ${v.location ?? ''}
Notes: ${v.notes ?? ''}`;

    // 1) WhatsApp
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    // 2) Email fallback
    const mailto = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(
      'Fuel Quote Request - ' + (v.fullName ?? '')
    )}&body=${encodeURIComponent(message)}`;

    setTimeout(() => {
      this.loading.set(false);
      this.sent.set(true);
      const a = document.getElementById('email-fallback') as HTMLAnchorElement | null;
      if (a) a.href = mailto;
    }, 600);
  }
}
