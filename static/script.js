/**
 * FinNIE Lost & Found - Mature & Cool Collegiate Tech UI Controller
 * Features smooth cursor tracking, live preview engine, view switcher, and claim modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initEyeTracking();
  initMascotInteractions();
  initLiveReportPreview();
  initSearchAndFilters();
  initViewSwitcher();
  initItemDetailModal();
  initScoutCompanionWidget();
  initCounterAnimations();
});

/* -------------------------------------------------------------------------- */
/* 1. Dynamic Eye Tracking & Character Parallax                               */
/* -------------------------------------------------------------------------- */
function initEyeTracking() {
  const boyPupils = document.querySelectorAll('.mascot-boy-svg .pupil-left, .mascot-boy-svg .pupil-right');
  const girlPupils = document.querySelectorAll('.mascot-girl-svg .pupil-left, .mascot-girl-svg .pupil-right');
  const boyHead = document.querySelector('.mascot-boy-svg .boy-head');
  const girlHead = document.querySelector('.mascot-girl-svg .girl-head');
  const qMark = document.querySelector('.animated-question-mark');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animatePupils() {
    const targetX = (mouseX / window.innerWidth - 0.5) * 8;
    const targetY = (mouseY / window.innerHeight - 0.5) * 6;
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    boyPupils.forEach((pupil) => {
      pupil.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    girlPupils.forEach((pupil) => {
      pupil.style.transform = `translate(${currentX * 0.9}px, ${currentY * 0.9}px)`;
    });

    if (boyHead) {
      boyHead.style.transform = `rotate(${currentX * 0.3}deg)`;
    }
    if (girlHead) {
      girlHead.style.transform = `rotate(${-currentX * 0.25}deg)`;
    }
    if (qMark) {
      qMark.style.transform = `translate(195px, 42px) rotate(${currentX * 0.6}deg)`;
    }

    requestAnimationFrame(animatePupils);
  }

  animatePupils();
}

/* -------------------------------------------------------------------------- */
/* 2. Character Interaction Handlers                                          */
/* -------------------------------------------------------------------------- */
function initMascotInteractions() {
  const boyMascots = document.querySelectorAll('.mascot-boy-container, .mascot-boy-svg');
  const girlMascots = document.querySelectorAll('.mascot-girl-container, .mascot-girl-svg');

  boyMascots.forEach((mascot) => {
    mascot.addEventListener('click', () => {
      triggerTechPulse(mascot);
      const qMark = mascot.querySelector('.animated-question-mark') || document.querySelector('.animated-question-mark');
      if (qMark) {
        qMark.classList.add('q-excited');
        setTimeout(() => qMark.classList.remove('q-excited'), 800);
      }
      showScoutMessage("Campus beacon pinged. Monitoring active recovery logs.");
    });
  });

  girlMascots.forEach((mascot) => {
    mascot.addEventListener('click', () => {
      triggerTechPulse(mascot);
      const magnifier = mascot.querySelector('.magnifying-glass-tool') || document.querySelector('.magnifying-glass-tool');
      if (magnifier) {
        magnifier.classList.add('magnifier-scan-boost');
        setTimeout(() => magnifier.classList.remove('magnifier-scan-boost'), 1000);
      }
      showScoutMessage("Optical scanner active. Filtering high-probability matches.");
    });
  });
}

function triggerTechPulse(container) {
  const rect = container.getBoundingClientRect();
  const colors = ['#38bdf8', '#2563eb', '#60a5fa', '#0ea5e9'];

  for (let i = 0; i < 6; i++) {
    const pulseDot = document.createElement('div');
    pulseDot.className = 'particle-sparkle';
    pulseDot.innerHTML = '•';
    pulseDot.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px`;
    pulseDot.style.top = `${rect.top + rect.height / 3 + (Math.random() - 0.5) * 40}px`;
    pulseDot.style.color = colors[Math.floor(Math.random() * colors.length)];
    pulseDot.style.fontSize = `${12 + Math.random() * 8}px`;
    pulseDot.style.animation = `floatUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
    document.body.appendChild(pulseDot);

    setTimeout(() => pulseDot.remove(), 800);
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Real-time Report Live Card Preview & Progress Meter                     */
/* -------------------------------------------------------------------------- */
function initLiveReportPreview() {
  const form = document.querySelector('.report-form-container form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const categorySelect = document.getElementById('category');
  const descInput = document.getElementById('description');
  const dateInput = document.getElementById('reportedDate');
  const statusSelect = document.getElementById('status');
  const imageInput = document.getElementById('image');
  const locationInput = document.getElementById('location');

  // Preview elements
  const prevTitle = document.getElementById('prev-title');
  const prevCategory = document.getElementById('prev-category');
  const prevDesc = document.getElementById('prev-desc');
  const prevDate = document.getElementById('prev-date');
  const prevContact = document.getElementById('prev-contact');
  const prevStatus = document.getElementById('prev-status');
  const prevLocation = document.getElementById('prev-location');
  const prevImage = document.getElementById('prev-image');
  const prevImagePlaceholder = document.getElementById('prev-image-placeholder');
  const progressFill = document.getElementById('form-progress-fill');
  const progressPercent = document.getElementById('form-progress-percent');
  const mascotTip = document.getElementById('preview-mascot-tip');

  function updatePreview() {
    let filledFields = 0;
    const totalFields = 6;

    if (nameInput && prevTitle) {
      if (nameInput.value.trim()) {
        prevTitle.textContent = nameInput.value;
        filledFields++;
      } else {
        prevTitle.textContent = "Item Title Here";
      }
    }

    if (categorySelect && prevCategory) {
      if (categorySelect.value) {
        prevCategory.textContent = categorySelect.options[categorySelect.selectedIndex].text;
        prevCategory.className = `category-tag tag-${categorySelect.value.toLowerCase()}`;
        filledFields++;
      } else {
        prevCategory.textContent = "Classification";
        prevCategory.className = "category-tag";
      }
    }

    if (descInput && prevDesc) {
      if (descInput.value.trim()) {
        prevDesc.textContent = descInput.value;
        filledFields++;
      } else {
        prevDesc.textContent = "Description and specific location markers will appear here in real-time...";
      }
    }

    if (dateInput && prevDate) {
      if (dateInput.value) {
        prevDate.textContent = dateInput.value;
        filledFields++;
      } else {
        prevDate.textContent = new Date().toISOString().split('T')[0];
      }
    }

    if (statusSelect && prevStatus) {
      if (statusSelect.value) {
        const val = statusSelect.value.toLowerCase();
        prevStatus.textContent = val.toUpperCase();
        prevStatus.className = `card-status-badge status-${val}`;
        filledFields++;
      } else {
        prevStatus.textContent = "FOUND";
        prevStatus.className = "card-status-badge status-found";
      }
    }

    if (emailInput && phoneInput && prevContact) {
      const emailVal = emailInput.value.trim();
      const phoneVal = phoneInput.value.trim();
      if (emailVal || phoneVal) {
        prevContact.textContent = `${emailVal || 'Email'} ${phoneVal ? '• ' + phoneVal : ''}`;
        if (emailVal && phoneVal) filledFields++;
      } else {
        prevContact.textContent = "reporter@nie.ac.in";
      }
    }

    if (locationInput && prevLocation) {
      if (locationInput.value.trim()) {
        prevLocation.textContent = "📍 " + locationInput.value;
      } else {
        prevLocation.textContent = "📍 Campus Location";
      }
    }

    // Update Progress Bar
    const percent = Math.min(100, Math.round((filledFields / totalFields) * 100));
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}% Complete`;

    // Mature helper tip
    if (mascotTip) {
      if (percent < 30) {
        mascotTip.textContent = "Enter primary item title and institutional contact.";
      } else if (percent < 70) {
        mascotTip.textContent = "Adding high-resolution photo evidence significantly speeds up verification.";
      } else if (percent < 100) {
        mascotTip.textContent = "Verify dates and specific campus buildings for precision indexing.";
      } else {
        mascotTip.textContent = "Documentation ready for institutional registry broadcast.";
      }
    }
  }

  const inputs = [nameInput, emailInput, phoneInput, categorySelect, descInput, dateInput, statusSelect, locationInput];
  inputs.forEach((inp) => {
    if (inp) {
      inp.addEventListener('input', updatePreview);
      inp.addEventListener('change', updatePreview);
    }
  });

  if (imageInput) {
    imageInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          if (prevImage) {
            prevImage.src = evt.target.result;
            prevImage.style.display = 'block';
          }
          if (prevImagePlaceholder) {
            prevImagePlaceholder.style.display = 'none';
          }
          const uploadPreview = document.getElementById('image-preview');
          if (uploadPreview) {
            uploadPreview.src = evt.target.result;
            uploadPreview.style.display = 'block';
          }
          const uploadBox = document.querySelector('.file-upload-box');
          if (uploadBox) uploadBox.classList.add('has-file');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Location chips clicker
  document.querySelectorAll('.location-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (locationInput) {
        locationInput.value = chip.dataset.location || chip.textContent.trim();
        updatePreview();
        locationInput.focus();
      }
    });
  });

  updatePreview();
}

/* -------------------------------------------------------------------------- */
/* 4. Search & Filter Engine                                                  */
/* -------------------------------------------------------------------------- */
function initSearchAndFilters() {
  const searchInput = document.getElementById('search');
  const cards = document.querySelectorAll('.card-grid .report-card, .items-table tbody tr');

  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyState = document.getElementById('client-empty-state');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 5. View Switcher (Grid <-> Table)                                          */
/* -------------------------------------------------------------------------- */
function initViewSwitcher() {
  const gridBtn = document.getElementById('btn-view-grid');
  const tableBtn = document.getElementById('btn-view-table');
  const gridContainer = document.getElementById('view-grid-container');
  const tableContainer = document.getElementById('view-table-container');

  if (!gridBtn || !tableBtn || !gridContainer || !tableContainer) return;

  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('active');
    tableBtn.classList.remove('active');
    gridContainer.style.display = 'grid';
    tableContainer.style.display = 'none';
  });

  tableBtn.addEventListener('click', () => {
    tableBtn.classList.add('active');
    gridBtn.classList.remove('active');
    gridContainer.style.display = 'none';
    tableContainer.style.display = 'block';
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Item Detail & Claim Modal                                               */
/* -------------------------------------------------------------------------- */
function initItemDetailModal() {
  const modal = document.getElementById('item-detail-modal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.close-modal, .btn-close-modal');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.remove('modal-open');
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('modal-open');
  });

  document.querySelectorAll('.btn-view-detail, .report-card').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('.btn-claim-direct')) return;

      const title = trigger.dataset.name || trigger.querySelector('h3')?.textContent || 'Found Item';
      const category = trigger.dataset.category || 'General';
      const desc = trigger.dataset.description || trigger.querySelector('.card-desc')?.textContent || 'No additional description provided.';
      const date = trigger.dataset.date || trigger.querySelector('.item-date')?.textContent || 'Recent';
      const reporter = trigger.dataset.reporter || 'NIE Campus Member';
      const contact = trigger.dataset.contact || 'campus.lost@nie.ac.in';
      const location = trigger.dataset.location || 'NIE Campus Ground';
      const imgSrc = trigger.dataset.image || trigger.querySelector('img')?.src || '';

      document.getElementById('modal-item-name').textContent = title;
      document.getElementById('modal-item-category').textContent = category;
      document.getElementById('modal-item-desc').textContent = desc;
      document.getElementById('modal-item-date').textContent = date;
      document.getElementById('modal-item-reporter').textContent = reporter;
      document.getElementById('modal-item-contact').textContent = contact;
      document.getElementById('modal-item-location').textContent = location;

      const modalImg = document.getElementById('modal-item-image');
      if (modalImg) {
        if (imgSrc) {
          modalImg.src = imgSrc;
          modalImg.style.display = 'block';
        } else {
          modalImg.style.display = 'none';
        }
      }

      modal.classList.add('modal-open');
    });
  });

  const claimForm = document.getElementById('modal-claim-form');
  if (claimForm) {
    claimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const claimBtn = claimForm.querySelector('button[type="submit"]');
      if (claimBtn) {
        claimBtn.innerHTML = 'Verifying Credentials...';
        setTimeout(() => {
          claimBtn.innerHTML = 'Claim Logged Successfully ✓';
          claimBtn.style.background = '#10b981';
          showToast("Ownership claim submitted for official verification.");
          setTimeout(() => {
            modal.classList.remove('modal-open');
            claimBtn.innerHTML = 'Submit Ownership Claim';
            claimBtn.style.background = '';
            claimForm.reset();
          }, 1800);
        }, 600);
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 7. Scout Companion Widget                                                  */
/* -------------------------------------------------------------------------- */
function initScoutCompanionWidget() {
  const widget = document.getElementById('scout-companion-widget');
  const bubble = document.getElementById('scout-speech-bubble');
  const textEl = document.getElementById('scout-speech-text');
  const closeBubble = document.getElementById('scout-bubble-close');

  if (!widget || !bubble || !textEl) return;

  const pagePath = window.location.pathname;
  let defaultMessages = [];

  if (pagePath === '/' || pagePath.includes('home')) {
    defaultMessages = [
      "NIE Campus Intelligence: Query the database or log unattended equipment.",
      "Over 96% of documented items at NIE are returned within 24–48 hours.",
      "Official drop-offs are active at Central Library and Main Admin Office."
    ];
  } else if (pagePath.includes('report')) {
    defaultMessages = [
      "Include serial numbers or distinct markings for accurate matching.",
      "Attach clear photos to expedite verification.",
      "Reports are instantly broadcast to the institutional registry."
    ];
  } else {
    defaultMessages = [
      "Filter by category to view active listings across NIE buildings.",
      "Submit ownership verification proof to coordinate safe handover.",
      "Need help? Contact the campus safety desk directly."
    ];
  }

  let msgIndex = 0;
  textEl.textContent = defaultMessages[0];

  widget.addEventListener('click', () => {
    msgIndex = (msgIndex + 1) % defaultMessages.length;
    textEl.textContent = defaultMessages[msgIndex];
    bubble.classList.remove('bubble-hide');
    triggerTechPulse(widget);
  });

  if (closeBubble) {
    closeBubble.addEventListener('click', (e) => {
      e.stopPropagation();
      bubble.classList.add('bubble-hide');
    });
  }
}

function showScoutMessage(msg) {
  const bubble = document.getElementById('scout-speech-bubble');
  const textEl = document.getElementById('scout-speech-text');
  if (bubble && textEl) {
    textEl.textContent = msg;
    bubble.classList.remove('bubble-hide');
  }
}

/* -------------------------------------------------------------------------- */
/* 8. Toast Notifications                                                     */
/* -------------------------------------------------------------------------- */
function showToast(message, duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-bubble';
  toast.innerHTML = `<span style="color:#38bdf8;">◈</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/* -------------------------------------------------------------------------- */
/* 9. Metric Counters                                                         */
/* -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 1400;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + (counter.getAttribute('data-suffix') || '');
          }
        };
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
}
