/**
 * Main Site JavaScript
 * Handles navigation, scroll effects, and general interactions
 */

// Navigation Toggle for Mobile
class NavigationManager {
  constructor() {
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.init();
  }

  init() {
    if (!this.navToggle || !this.navMenu) return;

    // Toggle menu
    this.navToggle.addEventListener('click', () => this.toggleMenu());

    // Close menu when link is clicked
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav') && this.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Set active link based on current page
    this.setActiveLink();
  }

  toggleMenu() {
    this.navToggle.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }

  closeMenu() {
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    this.navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage ||
        (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// Smooth scroll for anchor links
class SmoothScroller {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Form validation helper
class FormValidator {
  static validateName(name) {
    return name && name.trim().length >= 2;
  }

  static validateMobile(mobile) {
    // Indian mobile number format: starts with 6-9, 10 digits
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Contact form handler
class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      mobile: formData.get('mobile')
    };

    // Validate
    if (!this.validate(data)) {
      return;
    }

    // WhatsApp Integration
    const OWNER_WHATSAPP = '919890006114';

    // Construct the message
    // Note: The form in contact.html only has name and mobile inputs based on my previous read. 
    // I should check if there are other fields.
    // Looking at contact.html again (lines 62-74), it only has Name and Mobile.

    const whatsappMessage = ` संपर्क / Contact Request\n\n` +
      ` Name: ${data.name}\n` +
      ` Mobile: ${data.mobile}\n\n` +
      `I would like to inquire about construction materials.\n\n` +
      `_Sent via Shree Datta Traders contact form_`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    this.showSuccess();

    // Reset form
    this.form.reset();
  }

  validate(data) {
    let isValid = true;

    if (!FormValidator.validateName(data.name)) {
      this.showFieldError('name', 'Please enter a valid name');
      isValid = false;
    }

    if (!FormValidator.validateMobile(data.mobile)) {
      this.showFieldError('mobile', 'Please enter a valid 10-digit mobile number');
      isValid = false;
    }

    return isValid;
  }

  showFieldError(fieldName, message) {
    const input = this.form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.form-error');

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.style.cssText = 'color: #c94a2e; font-size: 0.85rem; margin-top: 0.25rem;';
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.style.borderColor = '#c94a2e';

    // Clear error on input
    input.addEventListener('input', () => {
      errorElement.remove();
      input.style.borderColor = '';
    }, { once: true });
  }

  showSuccess() {
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background-color: #1a1a1a;
      color: white;
      padding: 1.5rem;
      border: 2px solid #c94a2e;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    successMessage.innerHTML = `
      <p style="margin: 0; font-size: 1rem;">
        <strong>Message sent successfully!</strong><br>
        We'll get back to you soon.
      </p>
    `;

    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => successMessage.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NavigationManager();
  new SmoothScroller();
  new ContactFormHandler();
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
