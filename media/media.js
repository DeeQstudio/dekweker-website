(() => {
  const DATA_URLS = [
    '/assets/data/mentions.json',
    '/media/mentions.json',
    './mentions.json'
  ];

  const pressList = document.getElementById('press-list');
  const profileList = document.getElementById('profile-list');
  const countPress = document.getElementById('count-press');
  const countProfile = document.getElementById('count-profile');
  const countTotal = document.getElementById('count-total');
  const updated = document.getElementById('sporen-updated');

  const FEATURED_PRESS_URLS = new Set([
    'https://kw.be/nieuws/cultuur/muziek/joey-de-kweker-de-queecker-31-rapt-in-het-brugs-mijn-moeilijke-jeugd-vormt-een-belangrijke-inspiratie/'
  ]);

  const isValidHttpUrl = (value = '') => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  };

  const sanitizeItem = (item) => {
    if (!item || typeof item !== 'object') return null;
    const type = item.type === 'press' || item.type === 'profile' ? item.type : null;
    if (!type) return null;

    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const url = typeof item.url === 'string' ? item.url.trim() : '';
    if (!title || !isValidHttpUrl(url)) return null;

    if (type === 'press') {
      const publisher =
        typeof item.publisher === 'string' ? item.publisher.trim() : '';
      if (!publisher) return null;
      return { type, title, url, publisher };
    }

    const platform =
      typeof item.platform === 'string' ? item.platform.trim() : '';
    if (!platform) return null;
    return { type, title, url, platform };
  };

  const normalizeItems = (items) => {
    const seen = new Set();
    const normalized = [];

    items.forEach((rawItem) => {
      const item = sanitizeItem(rawItem);
      if (!item) return;

      const dedupeKey = `${item.type}:${item.url.toLowerCase()}`;
      if (seen.has(dedupeKey)) return;

      seen.add(dedupeKey);
      normalized.push(item);
    });

    return normalized;
  };

  if (!pressList || !profileList) return;

  const normalizePlatform = (value = '') =>
    value
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[._-]/g, '');

  const iconMap = {
    spotify: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <path d="M7.1 9.2c3.7-1.1 7.3-.8 10.2.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M7.8 12c3-0.8 5.9-0.6 8.3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M8.6 14.6c2.2-0.5 4.2-0.4 6 .4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    `,
    youtube: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="6.5" width="18" height="11" rx="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <path d="M10 9.6l5 2.4-5 2.4z" fill="currentColor"/>
      </svg>
    `,
    soundcloud: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.8 16.8h8.7a2.7 2.7 0 0 0 0-5.4 3.8 3.8 0 0 0-7.4-1.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.4 16.8v-4.5M5.6 16.8v-5.3M6.8 16.8v-5.9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `,
    instagram: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5.1" y="5.1" width="13.8" height="13.8" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="16.6" cy="7.6" r="1" fill="currentColor"/>
      </svg>
    `,
    tiktok: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14.8 4c.6 1.7 1.9 2.9 3.6 3.4v2.2a6.8 6.8 0 0 1-2.8-.9v4.7a5 5 0 1 1-5-5c.4 0 .8.1 1.2.2v2.3a2.8 2.8 0 1 0 1.7 2.6V4z" fill="currentColor"/>
      </svg>
    `,
    vibe: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="2.5" y="5.2" width="19" height="13.6" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5.8 15.7L7.6 8.3h1.4l-1.9 7.4zM9.7 15.7V8.3h1.7v7.4z" fill="currentColor"/>
        <path d="M12.7 15.7V8.3h3.4c1.7 0 2.7.8 2.7 2.2 0 1-.5 1.8-1.5 2.1l1.7 3.1h-1.9l-1.5-2.8h-1.2v2.8zM14.4 11.5H16c.7 0 1.1-.3 1.1-.9s-.4-.9-1.1-.9h-1.6z" fill="currentColor"/>
      </svg>
    `,
    applemusic: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M16 5.4v8.4a2.6 2.6 0 1 1-1.6-2.4V7l-5.2 1.2v7a2.6 2.6 0 1 1-1.6-2.4V6.9z" fill="currentColor"/>
      </svg>
    `,
    bandcamp: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M8.2 16.5h9.4L15.8 20H6.4z" fill="currentColor"/>
        <path d="M10.1 8.2h9.4l-1.8 3.5H8.3z" fill="currentColor"/>
        <path d="M6.4 12.3h9.4L14 15.8H4.6z" fill="currentColor"/>
      </svg>
    `,
    musicbrainz: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="9.1" cy="10.2" r="1.2" fill="currentColor"/>
        <circle cx="14.9" cy="10.2" r="1.2" fill="currentColor"/>
        <path d="M8.6 14.2c1 .9 2.1 1.3 3.4 1.3s2.4-.4 3.4-1.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    `
  };

  const platformToKey = (platform = '') => {
    const key = normalizePlatform(platform);
    if (key === 'vibe' || key === 'vibeplatform') return 'vibe';
    if (key === 'kwartierwest' || key === 'kwartierwestbe') return 'vibe';
    if (key === 'applemusic') return 'applemusic';
    if (key === 'bandcampcom') return 'bandcamp';
    if (key === 'musicbrainzorg') return 'musicbrainz';
    return key;
  };

  const makeMeta = (label) => {
    const meta = document.createElement('span');
    meta.className = 'sporen-source';
    meta.textContent = label;
    return meta;
  };

  const normalizeComparableUrl = (value = '') =>
    String(value || '').trim().replace(/\/?$/, '/').toLowerCase();

  const isFeaturedPressItem = (item) =>
    FEATURED_PRESS_URLS.has(normalizeComparableUrl(item?.url || ''));

  const makePressItem = (item) => {
    const li = document.createElement('li');
    li.className = 'sporen-item';

    const main = document.createElement('div');
    main.className = 'sporen-item-main';

    const a = document.createElement('a');
    a.className = 'textLink';
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = item.title;

    main.appendChild(a);

    if (isFeaturedPressItem(item)) {
      li.classList.add('sporen-item-featured');
      const featured = document.createElement('span');
      featured.className = 'sporen-featured-tag';
      featured.textContent = 'Uitgelicht';
      main.appendChild(featured);
    }

    main.appendChild(makeMeta(item.publisher || 'Press'));

    li.appendChild(main);
    return li;
  };

  const makeProfileItem = (item) => {
    const li = document.createElement('li');
    li.className = 'sporen-item sporen-item-profile';

    const main = document.createElement('div');
    main.className = 'sporen-item-main';

    const title = document.createElement('p');
    title.className = 'sporen-title';
    title.textContent = item.title;

    const platform = document.createElement('p');
    platform.className = 'sporen-source';
    platform.textContent = item.platform || 'Profiel';

    main.appendChild(title);
    main.appendChild(platform);

    const key = platformToKey(item.platform || '');
    const iconMarkup = iconMap[key] || iconMap.vibe;

    const action = document.createElement('a');
    action.className = `sporen-platform-link is-${key}`;
    action.href = item.url;
    action.target = '_blank';
    action.rel = 'me noopener noreferrer';
    action.setAttribute(
      'aria-label',
      `Open ${item.platform || 'platform'} profiel van De Kweker`
    );

    const icon = document.createElement('span');
    icon.className = 'sporen-platform-icon';
    icon.innerHTML = iconMarkup;

    action.appendChild(icon);

    li.appendChild(main);
    li.appendChild(action);
    return li;
  };

  const setUpdated = (lastModifiedHeader = '') => {
    if (!updated) return;
    const parsed = lastModifiedHeader ? new Date(lastModifiedHeader) : new Date();
    const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    updated.dateTime = date.toISOString();
    updated.textContent = date.toLocaleDateString('nl-BE');
  };

  const renderItems = (items, lastModifiedHeader = '') => {
    const press = items.filter((item) => item.type === 'press');
    const profiles = items.filter((item) => item.type === 'profile');

    pressList.replaceChildren(...press.map((item) => makePressItem(item)));
    profileList.replaceChildren(...profiles.map((item) => makeProfileItem(item)));

    if (countPress) countPress.textContent = String(press.length);
    if (countProfile) countProfile.textContent = String(profiles.length);
    if (countTotal) countTotal.textContent = String(items.length);

    setUpdated(lastModifiedHeader);
  };

  const setErrorState = () => {
    // Keep server-rendered lists as fallback when fetch fails.
    if (updated) {
      updated.textContent = 'onbekend';
    }
  };

  const fetchMentions = async () => {
    for (const url of DATA_URLS) {
      try {
        const response = await fetch(url, { cache: 'default' });
        if (!response.ok) {
          throw new Error('Dataset niet beschikbaar op ' + url);
        }
        const items = await response.json();
        if (!Array.isArray(items)) {
          throw new Error('Ongeldige dataset op ' + url);
        }
        return {
          items,
          lastModifiedHeader: response.headers.get('last-modified') || ''
        };
      } catch (error) {
        // Probeer volgende fallback URL.
      }
    }
    throw new Error('Geen enkele mentions dataset beschikbaar');
  };

  fetchMentions()
    .then(({ items, lastModifiedHeader }) => {
      const safeItems = normalizeItems(items);
      if (!safeItems.length) {
        setErrorState();
        return;
      }
      renderItems(safeItems, lastModifiedHeader);
    })
    .catch(() => {
      setErrorState();
    });
})();
