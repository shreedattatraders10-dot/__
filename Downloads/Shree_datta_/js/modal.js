/**
 * Modal Popup Handler
 * Manages the contact form modal with delay trigger and exit intent
 */

class ModalManager {
  constructor(options = {}) {
    this.modal = document.getElementById('contactModal');
    this.openButtons = document.querySelectorAll('[data-modal-open]');
    this.closeButtons = document.querySelectorAll('[data-modal-close]');
    this.form = document.getElementById('modalForm');

    // Configuration
    this.config = {
      delayMs: options.delayMs || 4000, // 4 second delay
      exitIntent: options.exitIntent !== false,
      showOnce: options.showOnce !== false
    };

    this.hasShown = this.checkIfShown();

    this.init();
  }

  init() {
    if (!this.modal) return;

    // Set up event listeners
    this.setupEventListeners();

    // Trigger modal based on configuration
    if (!this.hasShown) {
      this.scheduleDelayedOpen();

      if (this.config.exitIntent) {
        this.setupExitIntent();
      }
    }
  }

  setupEventListeners() {
    // Open buttons
    this.openButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close buttons
    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  scheduleDelayedOpen() {
    setTimeout(() => {
      if (!this.hasShown) {
        this.open();
      }
    }, this.config.delayMs);
  }

  setupExitIntent() {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !this.hasShown) {
        this.open();
      }
    });
  }

  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.markAsShown();
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      mobile: formData.get('mobile')
    };

    // Validate
    if (!this.validateForm(data)) {
      return;
    }

    // WhatsApp Integration
    const OWNER_WHATSAPP = '919890006114';

    const whatsappMessage = `🏗️ *नवीन विचारपूस / New Inquiry*\n\n` +
      `👤 *Name:* ${data.name}\n` +
      `📱 *Mobile:* ${data.mobile}\n\n` +
      `I'm interested in getting a quote for construction materials from Shree Datta Traders.\n\n` +
      `_Sent via website popup form_`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    this.showSuccessMessage();

    // Reset form
    this.form.reset();

    // Close modal after delay
    setTimeout(() => {
      this.close();
    }, 2000);
  }

  validateForm(data) {
    const nameInput = document.getElementById('modalName');
    const mobileInput = document.getElementById('modalMobile');

    let isValid = true;

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      this.showError(nameInput, 'Please enter a valid name');
      isValid = false;
    } else {
      this.clearError(nameInput);
    }

    // Mobile validation (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!data.mobile || !mobileRegex.test(data.mobile)) {
      this.showError(mobileInput, 'Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      this.clearError(mobileInput);
    }

    return isValid;
  }

  showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.form-error');

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.style.borderColor = '#c94a2e';
  }

  clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');

    if (errorElement) {
      errorElement.remove();
    }

    input.style.borderColor = '';
  }

  showSuccessMessage() {
    const modalBody = this.modal.querySelector('.modal-body');
    const successMessage = document.createElement('div');
    successMessage.className = 'modal-success';
    successMessage.innerHTML = `
      <p style="color: #2d2d2d; font-size: 1.1rem; text-align: center; margin: 2rem 0;">
        <strong>धन्यवाद!</strong><br>
        आम्ही लवकरच तुमच्याशी संपर्क साधू.
      </p>
    `;

    modalBody.appendChild(successMessage);

    setTimeout(() => {
      successMessage.remove();
    }, 2000);
  }

  markAsShown() {
    if (this.config.showOnce) {
      sessionStorage.setItem('modalShown', 'true');
      this.hasShown = true;
    }
  }

  checkIfShown() {
    return this.config.showOnce && sessionStorage.getItem('modalShown') === 'true';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ModalManager({
    delayMs: 4000,
    exitIntent: true,
    showOnce: true
  });
});
