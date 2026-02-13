(() => {
  const DATA_URL = '/assets/data/mentions.json';
  const pressList = document.getElementById('press-list');
  const profileList = document.getElementById('profile-list');
  const countPress = document.getElementById('count-press');
  const countProfile = document.getElementById('count-profile');
  const countTotal = document.getElementById('count-total');
  const updated = document.getElementById('sporen-updated');

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
    `
  };

  const platformToKey = (platform = '') => {
    const key = normalizePlatform(platform);
    if (key === 'vibe' || key === 'vibeplatform') return 'vibe';
    if (key === 'applemusic') return 'applemusic';
    return key;
  };

  const makeMeta = (label) => {
    const meta = document.createElement('span');
    meta.className = 'sporen-source';
    meta.textContent = label;
    return meta;
  };

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
    action.rel = 'noopener noreferrer';
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

  const setErrorState = () => {
    const message = document.createElement('li');
    message.className = 'sporen-empty';
    message.textContent =
      'Bronnen konden niet geladen worden. Probeer later opnieuw.';
    pressList.replaceChildren(message.cloneNode(true));
    profileList.replaceChildren(message);
  };

  fetch(DATA_URL, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Dataset niet beschikbaar');
      }
      return response.json();
    })
    .then((items) => {
      if (!Array.isArray(items)) {
        throw new Error('Ongeldige dataset');
      }

      const press = items.filter((item) => item.type === 'press');
      const profiles = items.filter((item) => item.type === 'profile');

      pressList.replaceChildren(...press.map((item) => makePressItem(item)));
      profileList.replaceChildren(...profiles.map((item) => makeProfileItem(item)));

      if (countPress) countPress.textContent = String(press.length);
      if (countProfile) countProfile.textContent = String(profiles.length);
      if (countTotal) countTotal.textContent = String(items.length);

      if (updated) {
        const now = new Date();
        updated.dateTime = now.toISOString();
        updated.textContent = now.toLocaleDateString('nl-BE');
      }
    })
    .catch(() => {
      setErrorState();
      if (updated) {
        updated.textContent = 'onbekend';
      }
    });
})();
