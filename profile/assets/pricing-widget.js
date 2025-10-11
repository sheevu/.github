const pricingCards = Array.from(document.querySelectorAll('.pricing-card'));
const enquiryPanel = document.querySelector('[data-enquiry-panel]');
const panelBackdrop = document.querySelector('[data-panel-backdrop]');
const closePanelButton = document.querySelector('[data-close-panel]');
const planCopy = document.querySelector('[data-selected-plan]');
const enquiryForm = document.getElementById('enquiry-form');
const planSelect = enquiryForm.querySelector('select[name="plan"]');
const successMessage = enquiryForm.querySelector('[data-success-message]');
const submitButton = enquiryForm.querySelector('.submit-btn');
const focusTarget = enquiryForm.querySelector('[data-autofocus]');

const planDetails = {
  starter: {
    label: 'Starter',
    description: 'You have selected the Starter package — ₹1,500/mo.',
  },
  pro: {
    label: 'Pro',
    description: 'You have selected the Pro package — ₹3,000/mo.',
  },
  enterprise: {
    label: 'Enterprise',
    description: 'You have selected the Enterprise package — ₹4,500/mo.',
  },
};

const defaultPlanMessage = 'Please choose a package to begin.';

let panelTransitioning = false;
let lastFocusedCard = null;

function setPanelHiddenState(hidden) {
  enquiryPanel.hidden = hidden;
  enquiryPanel.setAttribute('aria-hidden', String(hidden));
  if (panelBackdrop) {
    panelBackdrop.hidden = hidden;
    panelBackdrop.setAttribute('aria-hidden', String(hidden));
  }
  document.body.classList.toggle('panel-open', !hidden);
}

function markSelectedCard(tier, { expanded } = {}) {
  pricingCards.forEach((card) => {
    const isSelected = card.dataset.tier === tier;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-pressed', String(isSelected));
    const button = card.querySelector('[data-action="enquire"]');
    if (button) {
      const isExpanded = expanded ?? isSelected;
      button.setAttribute('aria-expanded', String(isSelected && isExpanded));
    }
  });
}

function updatePanelContent(tier) {
  const plan = planDetails[tier];
  if (!plan) return;
  planCopy.textContent = plan.description;
  planSelect.value = plan.label;
  planSelect.dispatchEvent(new Event('change', { bubbles: true }));
  successMessage.hidden = true;
}

function handleTransitionEnd(event) {
  if (event.target !== enquiryPanel || event.propertyName !== 'transform') return;
  panelTransitioning = false;
  if (!enquiryPanel.classList.contains('active')) {
    setPanelHiddenState(true);
  }
}

enquiryPanel.addEventListener('transitionstart', () => {
  panelTransitioning = true;
});

enquiryPanel.addEventListener('transitionend', handleTransitionEnd);

function openPanel(tier, triggerElement) {
  if (panelTransitioning) return;
  lastFocusedCard = triggerElement ?? null;
  enquiryPanel.dataset.openTier = tier;
  setPanelHiddenState(false);
  requestAnimationFrame(() => {
    enquiryPanel.classList.add('active');
    panelBackdrop?.classList.add('active');
  });
  updatePanelContent(tier);
  markSelectedCard(tier);
  window.sessionStorage.setItem('preferred-plan', tier);
  setTimeout(() => {
    focusTarget?.focus({ preventScroll: true });
  }, 250);
}

function closePanel() {
  if (panelTransitioning || enquiryPanel.hidden) return;
  enquiryPanel.classList.remove('active');
  panelBackdrop?.classList.remove('active');
  successMessage.hidden = true;
  const currentTier = enquiryPanel.dataset.openTier;
  if (currentTier) {
    markSelectedCard(currentTier, { expanded: false });
    planCopy.textContent = planDetails[currentTier]?.description ?? defaultPlanMessage;
    planSelect.value = planDetails[currentTier]?.label ?? '';
  } else {
    planCopy.textContent = defaultPlanMessage;
    planSelect.value = '';
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setPanelHiddenState(true);
  }
  if (lastFocusedCard) {
    lastFocusedCard.focus({ preventScroll: true });
  }
}

panelBackdrop?.addEventListener('click', closePanel);
closePanelButton?.addEventListener('click', closePanel);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePanel();
  }
});

pricingCards.forEach((card) => {
  const tier = card.dataset.tier;
  const triggerButton = card.querySelector('[data-action="enquire"]');
  card.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    openPanel(tier, card);
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPanel(tier, card);
    }
  });

  triggerButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    openPanel(tier, triggerButton);
  });
});

panelBackdrop?.addEventListener('transitionend', (event) => {
  if (event.propertyName === 'opacity' && !panelBackdrop.classList.contains('active')) {
    panelBackdrop.hidden = true;
  }
});

function setFieldError(field, hasError) {
  field.classList.toggle('error', hasError);
}

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(enquiryForm);
  const values = Object.fromEntries(formData.entries());

  let hasError = false;
  enquiryForm.querySelectorAll('[required]').forEach((field) => {
    if (
      !(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)
    ) {
      return;
    }
    const isEmpty = !field.value || field.value.trim() === '';
    setFieldError(field, isEmpty);
    if (isEmpty && !hasError) {
      field.focus({ preventScroll: true });
      hasError = true;
    }
  });

  if (hasError) {
    return;
  }

  successMessage.hidden = true;
  submitButton.disabled = true;

  console.table(values);

  setTimeout(() => {
    submitButton.disabled = false;
    successMessage.hidden = false;
    enquiryForm.reset();
    enquiryForm.querySelectorAll('.error').forEach((field) => field.classList.remove('error'));
    const storedTier = window.sessionStorage.getItem('preferred-plan');
    if (storedTier && planDetails[storedTier]) {
      planSelect.value = planDetails[storedTier].label;
      planCopy.textContent = planDetails[storedTier].description;
    } else {
      planSelect.value = '';
      planCopy.textContent = defaultPlanMessage;
    }
  }, 500);
});

enquiryForm.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return;
  }
  if (target.required) {
    const hasError = !target.value || target.value.trim() === '';
    setFieldError(target, hasError);
  }
});

const storedPlan = window.sessionStorage.getItem('preferred-plan');
if (storedPlan && planDetails[storedPlan]) {
  markSelectedCard(storedPlan, { expanded: false });
  planSelect.value = planDetails[storedPlan].label;
}
