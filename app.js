import {
  copy,
  languageSteps,
  travelSteps,
  languageIncome,
  travelIncome,
  languageFit,
  travelFit,
  yiwuPoints,
} from './data.js';
import { copyFor, saveSubmission } from './core.js';

const LANGUAGE_KEY = 'yiwuhire-language';
const APPLICATIONS_KEY = 'yiwuhire-partner-applications';
const TRAVEL_APPLICATIONS_KEY = 'yiwuhire-travel-applications';
const supportedLanguages = new Set(['en', 'zh']);

// Which dialog/form/storage key each apply track maps to.
const tracks = {
  language: { dialogId: 'apply-dialog', formId: 'apply-form', storageKey: APPLICATIONS_KEY },
  travel: { dialogId: 'apply-travel-dialog', formId: 'apply-travel-form', storageKey: TRAVEL_APPLICATIONS_KEY },
};

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function initialLanguage() {
  try {
    const requested = new URL(window.location.href).searchParams.get('lang');
    if (supportedLanguages.has(requested)) return requested;
  } catch {
    // Continue to the saved preference when the URL is unavailable.
  }

  try {
    const stored = getStorage()?.getItem(LANGUAGE_KEY);
    if (supportedLanguages.has(stored)) return stored;
  } catch {
    // Storage is optional for this static demo.
  }
  return 'en';
}

const state = {
  language: initialLanguage(),
};

const elements = {
  langSteps: document.querySelector('#lang-steps'),
  travelSteps: document.querySelector('#travel-steps'),
  langIncome: document.querySelector('#lang-income'),
  travelIncome: document.querySelector('#travel-income'),
  langFit: document.querySelector('#lang-fit'),
  travelFit: document.querySelector('#travel-fit'),
  yiwuPoints: document.querySelector('#yiwu-points'),
};

const dialogTriggers = new WeakMap();
const formTimers = new WeakMap();

function localized(value) {
  return value?.[state.language] ?? value?.en ?? '';
}

function addTextElement(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function renderCopy() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-copy]').forEach((element) => {
    element.textContent = copyFor(copy, state.language, element.dataset.copy);
  });
  document.querySelectorAll('[data-placeholder]').forEach((element) => {
    element.placeholder = copyFor(copy, state.language, element.dataset.placeholder);
  });
  document.querySelectorAll('[data-aria-copy]').forEach((element) => {
    element.setAttribute('aria-label', copyFor(copy, state.language, element.dataset.ariaCopy));
  });
  document.querySelectorAll('.form-status[data-message-key]').forEach((status) => {
    status.textContent = copyFor(copy, state.language, status.dataset.messageKey);
  });
  document.querySelectorAll('[data-copy-key]').forEach((element) => {
    element.textContent = copyFor(copy, state.language, element.dataset.copyKey);
  });

  const languageButton = document.querySelector('[data-action="toggle-language"]');
  if (languageButton) languageButton.textContent = state.language === 'en' ? '中文' : 'English';

  if (copy.pageTitle) document.title = copyFor(copy, state.language, 'pageTitle');
  const description = document.querySelector('meta[name="description"]');
  if (copy.pageDescription && description) {
    description.content = copyFor(copy, state.language, 'pageDescription');
  }
}

function renderCards(container, items) {
  if (!container) return;
  container.replaceChildren();
  items.forEach((item) => {
    const content = localized(item);
    const card = document.createElement('article');
    card.className = 'service-card';
    addTextElement(card, 'h3', content.title);
    addTextElement(card, 'p', content.body);
    container.append(card);
  });
}

function renderFitList(container, items) {
  if (!container) return;
  container.replaceChildren();
  items.forEach((item) => {
    addTextElement(container, 'li', localized(item));
  });
}

function renderYiwuPoints() {
  if (!elements.yiwuPoints) return;
  elements.yiwuPoints.replaceChildren();
  yiwuPoints.forEach((point) => {
    const content = localized(point);
    const card = document.createElement('article');
    card.className = 'yiwu-point';
    addTextElement(card, 'h3', content.title);
    addTextElement(card, 'p', content.body);
    elements.yiwuPoints.append(card);
  });
}

function renderAll() {
  renderCopy();
  renderCards(elements.langSteps, languageSteps);
  renderCards(elements.travelSteps, travelSteps);
  renderCards(elements.langIncome, languageIncome);
  renderCards(elements.travelIncome, travelIncome);
  renderFitList(elements.langFit, languageFit);
  renderFitList(elements.travelFit, travelFit);
  renderYiwuPoints();
}

function updateDialogBodyState() {
  document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
}

function openDialog(dialog, trigger) {
  dialogTriggers.set(dialog, trigger instanceof HTMLElement ? trigger : document.activeElement);
  dialog.showModal();
  updateDialogBodyState();
}

function openApplication(track, trigger) {
  const config = tracks[track] ?? tracks.language;
  const dialog = document.querySelector(`#${config.dialogId}`);
  const form = document.querySelector(`#${config.formId}`);
  if (!dialog || !form) return;
  resetFormState(form);
  openDialog(dialog, trigger);
}

function setLanguage(language) {
  state.language = language;
  try {
    getStorage()?.setItem(LANGUAGE_KEY, language);
  } catch {
    // The language switch still works without persistent storage.
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
  } catch {
    // URL synchronization is an enhancement, not a requirement for rendering.
  }
  renderAll();
}

function clearStorageKey(storage, key) {
  if (!storage) return false;
  try {
    storage.removeItem(key);
  } catch {
    return false;
  }
  try {
    return storage.getItem(key) === null;
  } catch {
    return true;
  }
}

function clearValidationState(form) {
  [...form.elements].forEach((control) => {
    control.removeAttribute?.('aria-invalid');
    if (control.getAttribute?.('aria-describedby') === `${form.id}-status`) {
      control.removeAttribute('aria-describedby');
    }
  });
}

function resetFormState(form) {
  const timer = formTimers.get(form);
  if (timer) window.clearTimeout(timer);
  formTimers.delete(form);
  const status = form.querySelector('.form-status');
  status.textContent = '';
  delete status.dataset.state;
  delete status.dataset.messageKey;
  status.classList.remove('is-success', 'is-error');
  status.removeAttribute('role');
  form.querySelector('[type="submit"]').disabled = false;
  clearValidationState(form);
}

function setFormStatus(form, messageKey, stateName, control = null) {
  const status = form.querySelector('.form-status');
  status.id ||= `${form.id}-status`;
  status.textContent = copyFor(copy, state.language, messageKey);
  status.dataset.messageKey = messageKey;
  status.dataset.state = stateName;
  status.classList.toggle('is-success', stateName === 'success');
  status.classList.toggle('is-error', stateName === 'error');
  status.setAttribute('role', stateName === 'success' ? 'status' : 'alert');
  if (control) {
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', status.id);
  }
}

function handleSubmission(form, storageKey, successKey) {
  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton.disabled) return;
  clearValidationState(form);
  if (!form.reportValidity()) {
    const invalidControl = [...form.elements]
      .find((control) => control.willValidate && !control.validity.valid);
    const messageKey = invalidControl?.validity.typeMismatch ? 'invalidUrlMessage' : 'requiredMessage';
    setFormStatus(form, messageKey, 'error', invalidControl);
    return;
  }

  submitButton.disabled = true;
  const payload = {
    ...Object.fromEntries(new FormData(form)),
    submittedAt: new Date().toISOString(),
  };
  const saved = saveSubmission(getStorage(), storageKey, payload);
  form.reset();
  setFormStatus(form, `${successKey}${saved ? 'Saved' : 'Unsaved'}`, 'success');
  const timer = window.setTimeout(() => {
    submitButton.disabled = false;
    formTimers.delete(form);
  }, 1200);
  formTimers.set(form, timer);
}

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'toggle-language') setLanguage(state.language === 'en' ? 'zh' : 'en');
  if (action === 'clear-local-data') {
    const status = document.querySelector('#data-clear-status');
    status.textContent = '';
    delete status.dataset.copyKey;
    status.removeAttribute('role');
    const storage = getStorage();
    const cleared = clearStorageKey(storage, APPLICATIONS_KEY)
      && clearStorageKey(storage, TRAVEL_APPLICATIONS_KEY);
    const copyKey = cleared ? 'clearSuccess' : 'clearFailure';
    status.dataset.copyKey = copyKey;
    status.textContent = copyFor(copy, state.language, copyKey);
    status.setAttribute('role', cleared ? 'status' : 'alert');
  }

  const applyTrigger = event.target.closest('[data-apply-track]');
  if (applyTrigger) openApplication(applyTrigger.dataset.applyTrack, applyTrigger);

  const closeButton = event.target.closest('[data-close-dialog]');
  if (closeButton) closeButton.closest('dialog').close();
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
  dialog.addEventListener('close', () => {
    updateDialogBodyState();
    const form = dialog.querySelector('form');
    if (form) resetFormState(form);
    const trigger = dialogTriggers.get(dialog);
    if (trigger?.isConnected) trigger.focus();
  });
});

Object.values(tracks).forEach(({ formId, storageKey }) => {
  const form = document.querySelector(`#${formId}`);
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmission(form, storageKey, 'applicationSuccess');
  });
});

renderAll();
