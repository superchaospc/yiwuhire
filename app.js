import { categories, copy, jobs, services, yiwuPoints } from './data.js';
import { copyFor, filterJobs, saveSubmission } from './core.js';

const LANGUAGE_KEY = 'yiwuhire-language';
const APPLICATIONS_KEY = 'yiwuhire-applications';
const EMPLOYER_BRIEFS_KEY = 'yiwuhire-employer-briefs';
const supportedLanguages = new Set(['en', 'zh']);

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
  query: '',
  category: 'all',
  selectedJobId: null,
};

const elements = {
  applyDialog: document.querySelector('#apply-dialog'),
  applyForm: document.querySelector('#apply-form'),
  categories: document.querySelector('#category-filters'),
  emptyState: document.querySelector('#empty-state'),
  employerDialog: document.querySelector('#employer-dialog'),
  employerForm: document.querySelector('#employer-form'),
  jobDetail: document.querySelector('#job-detail'),
  jobDialog: document.querySelector('#job-dialog'),
  jobGrid: document.querySelector('#job-grid'),
  resultSummary: document.querySelector('#result-summary'),
  search: document.querySelector('#search'),
  searchForm: document.querySelector('#hero-search'),
  services: document.querySelector('#service-cards'),
  yiwuPoints: document.querySelector('#yiwu-points'),
};

const dialogTriggers = new WeakMap();
const suppressedFocusRestore = new WeakSet();
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
  languageButton.textContent = state.language === 'en' ? '中文' : 'English';

  if (copy.pageTitle) document.title = copyFor(copy, state.language, 'pageTitle');
  const description = document.querySelector('meta[name="description"]');
  if (copy.pageDescription && description) {
    description.content = copyFor(copy, state.language, 'pageDescription');
  }
}

function renderCategories() {
  elements.categories.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-pill';
    button.dataset.category = category.id;
    button.setAttribute('aria-pressed', String(state.category === category.id));
    button.textContent = localized(category.label);
    elements.categories.append(button);
  });
}

function appendTags(parent, tags) {
  const list = document.createElement('ul');
  list.className = 'job-tags';
  tags.forEach((tag) => addTextElement(list, 'li', tag));
  parent.append(list);
}

function renderJobs() {
  const matchingJobs = filterJobs(jobs, state.query, state.category, state.language);
  elements.jobGrid.replaceChildren();

  matchingJobs.forEach((job) => {
    const details = localized(job);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'job-card';
    card.dataset.jobId = job.id;
    card.setAttribute('aria-label', `${details.title}, ${details.company}`);

    addTextElement(card, 'span', copyFor(copy, state.language, 'demoRoleLabel'), 'demo-role-label');
    addTextElement(card, 'h3', details.title);
    const meta = document.createElement('div');
    meta.className = 'job-meta';
    addTextElement(meta, 'span', details.company);
    addTextElement(meta, 'span', details.location);
    addTextElement(meta, 'span', details.salary);
    card.append(meta);
    addTextElement(card, 'p', details.summary);
    appendTags(card, details.tags);
    const actions = document.createElement('span');
    actions.className = 'job-card-actions';
    actions.textContent = state.language === 'zh' ? '查看详情 →' : 'View details →';
    card.append(actions);
    elements.jobGrid.append(card);
  });

  const resultKey = matchingJobs.length === 1 ? 'resultSingular' : 'resultPlural';
  elements.resultSummary.textContent = copyFor(copy, state.language, resultKey)
    .replace('{count}', String(matchingJobs.length));
  elements.emptyState.hidden = matchingJobs.length > 0;
}

function renderServices() {
  elements.services.replaceChildren();
  services.forEach((service) => {
    const content = localized(service);
    const card = document.createElement('article');
    card.className = 'service-card';
    addTextElement(card, 'h3', content.title);
    addTextElement(card, 'p', content.body);
    elements.services.append(card);
  });
}

function renderYiwuPoints() {
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

function selectedJob() {
  return jobs.find((job) => job.id === state.selectedJobId);
}

function renderJobDialog() {
  const job = selectedJob();
  if (!job) return;
  const details = localized(job);
  elements.jobDetail.replaceChildren();
  addTextElement(elements.jobDetail, 'p', copyFor(copy, state.language, 'demoRoleLabel'), 'demo-role-label');
  addTextElement(elements.jobDetail, 'h3', details.title);
  const meta = document.createElement('p');
  meta.className = 'job-meta';
  addTextElement(meta, 'span', details.company);
  addTextElement(meta, 'span', details.location);
  elements.jobDetail.append(meta);
  addTextElement(elements.jobDetail, 'p', `${copyFor(copy, state.language, 'salaryLabel')}: ${details.salary}`);
  appendTags(elements.jobDetail, details.tags);
  addTextElement(elements.jobDetail, 'p', details.summary);

  for (const [labelKey, items] of [
    ['responsibilitiesLabel', details.responsibilities],
    ['requirementsLabel', details.requirements],
  ]) {
    addTextElement(elements.jobDetail, 'h4', copyFor(copy, state.language, labelKey));
    const list = document.createElement('ul');
    items.forEach((item) => addTextElement(list, 'li', item));
    elements.jobDetail.append(list);
  }

  const apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'button';
  apply.dataset.action = 'apply';
  apply.textContent = copyFor(copy, state.language, 'applyAction');
  elements.jobDetail.append(apply);
}

function renderApplyHeading() {
  const job = selectedJob();
  const heading = document.querySelector('#apply-title');
  if (!job || !heading) return;
  const title = localized(job).title;
  heading.textContent = state.language === 'zh' ? `申请：${title}` : `Apply for ${title}`;
  elements.applyForm.elements.jobId.value = job.id;
}

function renderOpenDialog() {
  if (elements.jobDialog.open) renderJobDialog();
  if (elements.applyDialog.open) renderApplyHeading();
}

function renderAll() {
  renderCopy();
  renderCategories();
  renderJobs();
  renderServices();
  renderYiwuPoints();
  renderOpenDialog();
}

function updateDialogBodyState() {
  document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
}

function closeOtherDialogs(dialog) {
  document.querySelectorAll('dialog[open]').forEach((openDialog) => {
    if (openDialog !== dialog) {
      suppressedFocusRestore.add(openDialog);
      openDialog.close();
    }
  });
}

function openDialog(dialog, trigger) {
  closeOtherDialogs(dialog);
  dialogTriggers.set(dialog, trigger instanceof HTMLElement ? trigger : document.activeElement);
  dialog.showModal();
  updateDialogBodyState();
}

function openJob(jobId, trigger) {
  state.selectedJobId = jobId;
  renderJobDialog();
  openDialog(elements.jobDialog, trigger);
}

function openApplication(trigger) {
  if (!selectedJob()) return;
  resetFormState(elements.applyForm);
  renderApplyHeading();
  openDialog(elements.applyDialog, dialogTriggers.get(elements.jobDialog) ?? trigger);
}

function resetFilters() {
  state.query = '';
  state.category = 'all';
  elements.search.value = '';
  renderCategories();
  renderJobs();
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

function handleSubmission(form, storageKey, successKey, enrich = (payload) => payload) {
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
  const payload = enrich({
    ...Object.fromEntries(new FormData(form)),
    submittedAt: new Date().toISOString(),
  });
  const saved = saveSubmission(getStorage(), storageKey, payload);
  form.reset();
  if (form === elements.applyForm && state.selectedJobId) {
    form.elements.jobId.value = state.selectedJobId;
  }
  setFormStatus(form, `${successKey}${saved ? 'Saved' : 'Unsaved'}`, 'success');
  const timer = window.setTimeout(() => {
    submitButton.disabled = false;
    formTimers.delete(form);
  }, 1200);
  formTimers.set(form, timer);
}

elements.searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.query = elements.search.value.trim();
  renderJobs();
  elements.jobGrid.closest('#jobs').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('click', (event) => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    renderCategories();
    renderJobs();
    return;
  }

  const card = event.target.closest('[data-job-id]');
  if (card) {
    openJob(card.dataset.jobId, card);
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'toggle-language') setLanguage(state.language === 'en' ? 'zh' : 'en');
  if (action === 'clear-filters') resetFilters();
  if (action === 'clear-local-data') {
    const status = document.querySelector('#data-clear-status');
    status.textContent = '';
    delete status.dataset.copyKey;
    status.removeAttribute('role');
    const storage = getStorage();
    const cleared = [APPLICATIONS_KEY, EMPLOYER_BRIEFS_KEY]
      .map((key) => clearStorageKey(storage, key));
    const success = cleared.every(Boolean);
    const copyKey = success ? 'clearSuccess' : 'clearFailure';
    status.dataset.copyKey = copyKey;
    status.textContent = copyFor(copy, state.language, copyKey);
    status.setAttribute('role', success ? 'status' : 'alert');
  }
  if (action === 'open-employer') {
    resetFormState(elements.employerForm);
    openDialog(elements.employerDialog, event.target.closest('[data-action]'));
  }
  if (action === 'apply') openApplication(event.target.closest('[data-action]'));

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
    if (suppressedFocusRestore.delete(dialog)) return;
    let trigger = dialogTriggers.get(dialog);
    if (trigger && !trigger.isConnected && trigger.dataset.jobId) {
      trigger = [...document.querySelectorAll('[data-job-id]')]
        .find((candidate) => candidate.dataset.jobId === trigger.dataset.jobId);
    }
    if (trigger?.isConnected) trigger.focus();
  });
});

elements.applyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const job = selectedJob();
  handleSubmission(elements.applyForm, APPLICATIONS_KEY, 'applicationSuccess', (payload) => ({
    ...payload,
    jobId: job?.id ?? payload.jobId,
    jobTitle: job ? localized(job).title : '',
  }));
});

elements.employerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmission(elements.employerForm, EMPLOYER_BRIEFS_KEY, 'employerSuccess');
});

renderAll();
