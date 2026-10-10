/**
 * SODIC PREMIER DEVELOPMENTS — BY PROPERTIES-Z.COM
 * Main JavaScript Engine: Form Handling, Lead Routing, Analytics & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initLeadCaptureForm();
  initSmoothScroll();
  initAnalyticsTracking();
});

/**
 * Mobile Navigation Menu
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen 
      ? '<i class="fa-solid fa-xmark"></i>' 
      : '<i class="fa-solid fa-bars"></i>';
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/**
 * Lead Capture Form Processing & Multi-Channel Routing
 * Lead Routing:
 * - Rahma@irtkaz.com
 * - Mostafa.a.ashmawy@gmail.com
 * - Mostafa.ashmawy@irtkaz.com
 * Webhook: Zapier catch hook
 * Local Storage persistence
 * WhatsApp conversion fast-track (+201033373331)
 */
function initLeadCaptureForm() {
  const leadForm = document.getElementById('heroLeadForm');
  const successState = document.getElementById('leadSuccessState');
  if (!leadForm) return;

  leadForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullNameInput = document.getElementById('leadFullName');
    const phoneInput = document.getElementById('leadPhone');
    const countryCodeSelect = document.getElementById('countryCode');

    if (!fullNameInput || !phoneInput) return;

    const fullName = fullNameInput.value.trim();
    const phoneRaw = phoneInput.value.trim().replace(/^0+/, '');
    const countryCode = countryCodeSelect ? countryCodeSelect.value : '+20';
    const fullPhone = `${countryCode} ${phoneRaw}`;
    const defaultProject = 'The Lakes at SODIC East & Portfolio';

    if (!fullName || !phoneRaw) {
      alert('Please enter your full name and phone number.');
      return;
    }

    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(e.target);

    // Grabbing form data PLUS background data
    const data = {
      fullName: formData.get("fullName") || fullName,
      phoneNumber: fullPhone,
      landingPageUrl: window.location.href,       // Captures the full page URL
      submissionDate: new Date().toISOString(),   // Captures the exact date and time
      countryCode: countryCode,
      rawPhone: phoneRaw,
      projectFocus: defaultProject,
      source: 'SODIC Landing Page - The Lakes Launch - properties-z.com',
      routedEmails: [
        'Rahma@irtkaz.com',
        'Mostafa.a.ashmawy@gmail.com',
        'Mostafa.ashmawy@irtkaz.com'
      ]
    };

    try {
      await fetch("https://hooks.zapier.com/hooks/catch/25429357/uclzmpn/", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Show Thank You success state matching requested design
      if (successState) {
        successState.style.display = 'block';
        leadForm.style.display = 'none';
      }

      showToast(
        'Thank You!',
        'Your details have been received. We will be in touch shortly.'
      );

      e.target.reset();

      // Local Storage backup persistence
      try {
        const storedLeads = JSON.parse(localStorage.getItem('properties_z_sodic_leads') || '[]');
        storedLeads.push(data);
        localStorage.setItem('properties_z_sodic_leads', JSON.stringify(storedLeads));
      } catch (storageErr) {
        console.warn("Local storage write notice:", storageErr);
      }

      // Google Analytics 4 Lead Event
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'Lead Capture',
          event_label: defaultProject
        });
      }

      // Google Ads conversion event
      if (typeof gtag_report_conversion === 'function') {
        gtag_report_conversion();
      } else if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-18462270869/DjcxCIfusYIdEJXLv-NE'
        });
      }

      const waText = encodeURIComponent(
        `Hello properties-z.com, I just registered my interest in The Lakes at SODIC East.\n` +
        `Name: ${fullName}\n` +
        `Phone: ${fullPhone}`
      );
      const whatsappUrl = `https://wa.me/201033373331?text=${waText}`;

      setTimeout(() => {
        if (confirm(`Thank you ${fullName}! Would you like to connect directly via WhatsApp (+201033373331) for instant brochures, floorplans, and pricing details for The Lakes at SODIC East?`)) {
          if (typeof gtag_report_conversion === 'function') {
            gtag_report_conversion(whatsappUrl);
          } else {
            window.open(whatsappUrl, '_blank');
          }
        }
      }, 700);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

/**
 * Toast Notification Helper
 */
function showToast(title, message) {
  const toast = document.getElementById('leadToast');
  if (!toast) return;

  const titleEl = toast.querySelector('h4');
  const msgEl = toast.querySelector('p');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

/**
 * Smooth scrolling with dynamic header offset
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = window.innerWidth <= 768 ? 74 : 88;
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

/**
 * WhatsApp & CTA Analytics Tracking
 */
function initAnalyticsTracking() {
  document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp, .floating-whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        gtag('event', 'contact', {
          event_category: 'Engagement',
          method: 'WhatsApp',
          event_label: this.getAttribute('href') || 'Direct WhatsApp Chat'
        });
      }

      if (typeof gtag_report_conversion === 'function') {
        gtag_report_conversion();
      } else if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-18462270869/DjcxCIfusYIdEJXLv-NE'
        });
      }
    });
  });
}
