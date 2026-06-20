export function filterJobs(jobs, query = '', category = 'all', language = 'en') {
  const normalizedQuery = query.trim().toLowerCase();

  return jobs.filter((job) => {
    if (category !== 'all' && job.category !== category) return false;
    if (!normalizedQuery) return true;

    const localized = job[language] ?? job.en ?? {};
    const english = job.en ?? {};
    const searchable = ['title', 'company', 'location', 'tags'].flatMap((field) => {
      const value = localized[field] ?? english[field] ?? '';
      return Array.isArray(value) ? value : [value];
    });

    return searchable.some((value) => String(value).toLowerCase().includes(normalizedQuery));
  });
}

export function copyFor(copy, language, key) {
  return copy[key]?.[language] ?? copy[key]?.en ?? key;
}

export function saveSubmission(storage, key, submission) {
  try {
    const raw = storage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    const submissions = Array.isArray(parsed) ? parsed : [];
    submissions.push(submission);
    storage.setItem(key, JSON.stringify(submissions));
    return true;
  } catch {
    return false;
  }
}
