(() => {
  const DOMAINS = [
    'Autonomy', 'Battery', 'Charging', 'Chassis', 'Consumer', 'E/E and Semi', 'Interior', 'Lighting',
    'Materials', 'OEM Strategy', 'Propulsion', 'SDV', 'Thermal', 'Vehicle Production', 'Vehicle Sales',
    'Powertrain', 'Aftermarket', 'Future Mobility'
  ];
  const TOPICS = [
    'ADAS System', 'Braking System', 'Cockpit', 'Drivetrain', 'Electrics', 'Electronics', 'HVAC System',
    'Hybrid/EV System', 'Infotainment System', 'Lighting System', 'Power Distribution System', 'Telematics System'
  ];
  const COMPONENTS = ['Article', 'Podcast', 'Event', 'Report', 'Profile', 'Person', 'Other'];
  const TAGS = ['telematics', 'adas', 'fleet', 'ev', 'kpi', 'sensor-fusion', 'autonomy', 'thermal-management', 'aftermarket', 'powertrain'];
  const LEGACY_SYSTEMS = ['Connect', 'ATI'];

  const FOLDER_RECORDS = [
    { id: 'fld_brand', name: 'Fleet Campaigns', parentId: null },
    { id: 'fld_product', name: 'Vehicle Programs', parentId: null },
    { id: 'fld_ops', name: 'Dealer Operations', parentId: null },
    { id: 'fld_audio', name: 'Driver Audio', parentId: null },
    { id: 'fld_dashboards', name: 'Data Intelligence', parentId: null },
    { id: 'fld_brand_2026', name: 'Model Year 2026', parentId: 'fld_brand' },
    { id: 'fld_brand_2026_q1', name: 'Q1 Launch', parentId: 'fld_brand_2026' },
    { id: 'fld_brand_2026_q1_launch', name: 'SUV Campaign', parentId: 'fld_brand_2026_q1' },
    { id: 'fld_brand_2025', name: 'Model Year 2025', parentId: 'fld_brand' },
    { id: 'fld_product_guides', name: 'Telematics Specs', parentId: 'fld_product' },
    { id: 'fld_ops_training', name: 'Service Training', parentId: 'fld_ops' },
    { id: 'fld_ops_training_safety', name: 'Safety + ADAS', parentId: 'fld_ops_training' },
    { id: 'fld_audio_podcasts', name: 'Dealer Podcasts', parentId: 'fld_audio' },
    { id: 'fld_dashboards_tableau', name: 'Tableau KPI', parentId: 'fld_dashboards' },
    { id: 'fld_dashboards_powerbi', name: 'Power BI KPI', parentId: 'fld_dashboards' }
  ];

  const THUMBS = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=960&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=960&q=80'
  ];

  const state = {
    assets: [],
    selectedIds: new Set(),
    activeFolderId: null,
    viewMode: 'grid',
    search: '',
    sort: 'updatedAt-desc',
    kind: '',
    domain: '',
    tagQuery: '',
    selectedAssetId: null,
    uploadSeq: 1
  };

  const refs = {
    folderTree: document.getElementById('folderTree'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    kindFilter: document.getElementById('kindFilter'),
    domainFilter: document.getElementById('domainFilter'),
    tagFilter: document.getElementById('tagFilter'),
    gridViewBtn: document.getElementById('gridViewBtn'),
    listViewBtn: document.getElementById('listViewBtn'),
    assetsContainer: document.getElementById('assetsContainer'),
    resultCount: document.getElementById('resultCount'),
    selectionCount: document.getElementById('selectionCount'),
    inspector: document.getElementById('inspector'),
    fileInput: document.getElementById('fileInput'),
    assetDropZone: document.getElementById('assetDropZone')
  };

  function rand(seed) {
    let s = seed >>> 0;
    return () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }

  function pick(r, list) {
    return list[Math.floor(r() * list.length) % list.length];
  }

  function pickMany(r, list, min, max) {
    const pool = [...list];
    const count = min + Math.floor(r() * (max - min + 1));
    const out = [];
    for (let i = 0; i < count && pool.length; i += 1) {
      const idx = Math.floor(r() * pool.length);
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }

  function chooseKind(r) {
    const w = r();
    if (w < 0.34) return 'image';
    if (w < 0.52) return 'pdf';
    if (w < 0.72) return 'office';
    if (w < 0.82) return 'audio';
    if (w < 0.91) return 'tableau';
    return 'powerbi';
  }

  function inferKind(fileName, mime) {
    const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
    if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
    if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (mime.startsWith('audio/') || ['mp3', 'wav', 'aac'].includes(ext)) return 'audio';
    if (['twb', 'twbx'].includes(ext)) return 'tableau';
    if (ext === 'pbix') return 'powerbi';
    return 'office';
  }

  function folderTreeData() {
    const byParent = new Map();
    for (const rec of FOLDER_RECORDS) {
      if (!byParent.has(rec.parentId)) byParent.set(rec.parentId, []);
      byParent.get(rec.parentId).push(rec);
    }
    const counts = {};
    for (const asset of state.assets) {
      if (!asset.folderId) continue;
      counts[asset.folderId] = (counts[asset.folderId] || 0) + 1;
    }
    const toNode = (rec) => ({
      ...rec,
      assetCount: counts[rec.id] || 0,
      children: (byParent.get(rec.id) || []).map(toNode)
    });
    return (byParent.get(null) || []).map(toNode);
  }

  function folderDescendants(folderId) {
    const set = new Set([folderId]);
    let added = true;
    while (added) {
      added = false;
      for (const rec of FOLDER_RECORDS) {
        if (rec.parentId && set.has(rec.parentId) && !set.has(rec.id)) {
          set.add(rec.id);
          added = true;
        }
      }
    }
    return set;
  }

  function makeAssets() {
    const r = rand(31081987);
    const folderIds = FOLDER_RECORDS.map((x) => x.id);
    const users = ['ava.vehicle-systems', 'noah.thermal', 'mia.sdv', 'liam.powertrain-data', 'zoe.oem-strategy'];

    const assets = [];
    for (let i = 1; i <= 160; i += 1) {
      const kind = chooseKind(r);
      const domain = pick(r, DOMAINS);
      const topic = pick(r, TOPICS);
      const createdAt = new Date(Date.UTC(2024, 0, 1 + Math.floor(r() * 700))).toISOString();
      const updatedAt = new Date(Date.parse(createdAt) + Math.floor(r() * 86400000 * 90)).toISOString();
      const title = `${pick(r, COMPONENTS)} ${domain} ${kind.toUpperCase()} ${i}`;

      assets.push({
        id: `ast_${String(i).padStart(4, '0')}`,
        kind,
        fileName: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${kind === 'image' ? 'jpg' : kind === 'pdf' ? 'pdf' : kind === 'audio' ? 'mp3' : kind === 'tableau' ? 'twb' : kind === 'powerbi' ? 'pbix' : 'pptx'}`,
        mimeType: kind === 'image' ? 'image/jpeg' : kind === 'pdf' ? 'application/pdf' : kind === 'audio' ? 'audio/mpeg' : 'application/octet-stream',
        fileSizeBytes: 10000 + Math.floor(r() * 30000000),
        folderId: pick(r, folderIds),
        status: pick(r, ['draft', 'published', 'archived']),
        title,
        createdAt,
        updatedAt,
        createdBy: pick(r, users),
        license: pick(r, ['CC-BY', 'CC-BY-SA', 'Internal', 'Royalty Free']),
        domain,
        topics: [topic],
        tags: pickMany(r, TAGS, 1, 3),
        technologyArea: [pick(r, ['Data & Analytics Platform', 'Connected Services', 'Powertrain Engineering'])],
        component: [pick(r, COMPONENTS)],
        legacySystem: r() < 0.2 ? pick(r, LEGACY_SYSTEMS) : '',
        thumbnailUrl: THUMBS[(i + (kind === 'image' ? 0 : 2)) % THUMBS.length]
      });
    }
    state.assets = assets;
  }

  function fmtBytes(bytes) {
    if (bytes < 1000) return `${bytes} B`;
    if (bytes < 1000000) return `${(bytes / 1000).toFixed(1)} KB`;
    return `${(bytes / 1000000).toFixed(1)} MB`;
  }

  function iconFor(kind) {
    if (kind === 'pdf') return 'PDF';
    if (kind === 'office') return 'DOC';
    if (kind === 'audio') return 'AUD';
    if (kind === 'tableau') return 'TBL';
    if (kind === 'powerbi') return 'PBI';
    return 'IMG';
  }

  function filteredAssets() {
    let items = [...state.assets];

    if (state.activeFolderId) {
      const set = folderDescendants(state.activeFolderId);
      items = items.filter((a) => a.folderId && set.has(a.folderId));
    }

    if (state.search.trim()) {
      const q = state.search.toLowerCase();
      items = items.filter((a) => (`${a.title} ${a.fileName} ${a.domain} ${a.tags.join(' ')}`).toLowerCase().includes(q));
    }
    if (state.kind) items = items.filter((a) => a.kind === state.kind);
    if (state.domain) items = items.filter((a) => a.domain === state.domain);
    if (state.tagQuery.trim()) {
      const tq = state.tagQuery.toLowerCase();
      items = items.filter((a) => a.tags.some((t) => t.toLowerCase().includes(tq)));
    }

    const [field, direction] = state.sort.split('-');
    items.sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' });
      return direction === 'asc' ? cmp : -cmp;
    });

    return items;
  }

  function renderFolders() {
    const tree = folderTreeData();
    refs.folderTree.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = `folder-node ${state.activeFolderId === null ? 'active' : ''}`;
    allBtn.textContent = `All Assets (${state.assets.length})`;
    allBtn.onclick = () => {
      state.activeFolderId = null;
      render();
    };
    refs.folderTree.appendChild(allBtn);

    const renderNode = (node, depth) => {
      const wrapper = document.createElement('div');
      const btn = document.createElement('button');
      btn.className = `folder-node ${state.activeFolderId === node.id ? 'active' : ''}`;
      btn.style.paddingLeft = `${8 + depth * 14}px`;
      btn.textContent = `${node.name} (${node.assetCount})`;
      btn.onclick = () => {
        state.activeFolderId = node.id;
        render();
      };
      wrapper.appendChild(btn);
      if (node.children.length) {
        const children = document.createElement('div');
        children.className = 'folder-children';
        node.children.forEach((child) => children.appendChild(renderNode(child, depth + 1)));
        wrapper.appendChild(children);
      }
      return wrapper;
    };

    tree.forEach((n) => refs.folderTree.appendChild(renderNode(n, 0)));
  }

  function renderAssets() {
    const items = filteredAssets();
    refs.assetsContainer.className = state.viewMode === 'grid' ? 'assets-grid' : 'assets-list';
    refs.assetsContainer.innerHTML = '';
    refs.resultCount.textContent = `${items.length} assets`;
    refs.selectionCount.textContent = `${state.selectedIds.size} selected`;

    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'inspector-empty';
      empty.textContent = 'No assets match the current filters.';
      refs.assetsContainer.appendChild(empty);
      return;
    }

    for (const asset of items) {
      const node = document.createElement('article');
      node.className = `asset ${state.selectedIds.has(asset.id) ? 'selected' : ''}`;
      node.onclick = (e) => {
        if (e.metaKey || e.ctrlKey) {
          if (state.selectedIds.has(asset.id)) state.selectedIds.delete(asset.id);
          else state.selectedIds.add(asset.id);
        } else {
          state.selectedIds.clear();
          state.selectedIds.add(asset.id);
        }
        state.selectedAssetId = asset.id;
        render();
      };

      const thumb = document.createElement('div');
      thumb.className = 'asset-thumb';
      if (asset.kind === 'image' && asset.thumbnailUrl) {
        const img = document.createElement('img');
        img.src = asset.thumbnailUrl;
        img.alt = asset.title;
        thumb.appendChild(img);
      } else {
        thumb.textContent = iconFor(asset.kind);
      }

      const body = document.createElement('div');
      body.className = 'asset-body';
      const title = document.createElement('p');
      title.className = 'asset-title';
      title.textContent = asset.title;
      const meta = document.createElement('p');
      meta.className = 'asset-meta';
      meta.textContent = `${asset.kind} | ${asset.domain} | ${fmtBytes(asset.fileSizeBytes)}`;

      body.appendChild(title);
      body.appendChild(meta);
      node.appendChild(thumb);
      node.appendChild(body);
      refs.assetsContainer.appendChild(node);
    }
  }

  function renderInspector() {
    const assetId = state.selectedAssetId || [...state.selectedIds][0] || null;
    const asset = assetId ? state.assets.find((a) => a.id === assetId) : null;

    if (!asset) {
      refs.inspector.innerHTML = '<div class="inspector-empty">Select an asset to edit metadata.</div>';
      return;
    }

    refs.inspector.innerHTML = `
      <form class="inspector-form" id="inspectorForm">
        <div>
          <label>Title</label>
          <input name="title" value="${escapeHtml(asset.title)}" />
        </div>
        <div>
          <label>Domain</label>
          <select name="domain">
            ${DOMAINS.map((d) => `<option value="${escapeHtml(d)}" ${d === asset.domain ? 'selected' : ''}>${escapeHtml(d)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>License</label>
          <select name="license">
            ${['Internal', 'CC-BY', 'CC-BY-SA', 'Royalty Free'].map((l) => `<option value="${l}" ${l === asset.license ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Tags (comma separated)</label>
          <input name="tags" value="${escapeHtml(asset.tags.join(', '))}" />
          <div class="inspector-tags">${asset.tags.map((t) => `<span class="inspector-tag">${escapeHtml(t)}</span>`).join('')}</div>
        </div>
        <div>
          <label>Asset Info</label>
          <textarea rows="4" disabled>${asset.fileName}\n${asset.kind} | ${fmtBytes(asset.fileSizeBytes)}\nCreated: ${new Date(asset.createdAt).toLocaleString()}\nUpdated: ${new Date(asset.updatedAt).toLocaleString()}</textarea>
        </div>
        <div class="inspector-actions">
          <button type="button" id="deleteBtn">Delete</button>
          <button type="submit" class="primary">Save</button>
        </div>
      </form>
    `;

    const form = document.getElementById('inspectorForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = new FormData(form);
      asset.title = String(data.get('title') || asset.title).trim() || asset.title;
      asset.domain = String(data.get('domain') || asset.domain);
      asset.license = String(data.get('license') || asset.license);
      asset.tags = String(data.get('tags') || '').split(',').map((x) => x.trim()).filter(Boolean);
      asset.updatedAt = new Date().toISOString();
      render();
    };

    document.getElementById('deleteBtn').onclick = () => {
      state.assets = state.assets.filter((a) => a.id !== asset.id);
      state.selectedIds.delete(asset.id);
      state.selectedAssetId = null;
      render();
    };
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function handleUpload(files) {
    const now = Date.now();
    for (const file of files) {
      const idx = state.uploadSeq++;
      const kind = inferKind(file.name, file.type || '');
      const objectUrl = kind === 'image' ? URL.createObjectURL(file) : '';
      state.assets.unshift({
        id: `ast_upl_${String(idx).padStart(5, '0')}`,
        kind,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSizeBytes: file.size,
        folderId: state.activeFolderId,
        status: 'draft',
        title: file.name.replace(/\.[^.]+$/, ''),
        createdAt: new Date(now + idx * 1000).toISOString(),
        updatedAt: new Date(now + idx * 1000).toISOString(),
        createdBy: 'upload.bot',
        license: 'Internal',
        domain: DOMAINS[1],
        topics: [TOPICS[0]],
        tags: ['uploaded'],
        technologyArea: ['Connected Services'],
        component: ['Other'],
        legacySystem: '',
        thumbnailUrl: objectUrl
      });
    }
    render();
  }

  function bindEvents() {
    refs.searchInput.oninput = (e) => {
      state.search = e.target.value;
      renderAssets();
    };
    refs.sortSelect.onchange = (e) => {
      state.sort = e.target.value;
      renderAssets();
    };
    refs.kindFilter.onchange = (e) => {
      state.kind = e.target.value;
      renderAssets();
    };
    refs.domainFilter.onchange = (e) => {
      state.domain = e.target.value;
      renderAssets();
    };
    refs.tagFilter.oninput = (e) => {
      state.tagQuery = e.target.value;
      renderAssets();
    };

    refs.gridViewBtn.onclick = () => {
      state.viewMode = 'grid';
      refs.gridViewBtn.classList.add('active');
      refs.listViewBtn.classList.remove('active');
      renderAssets();
    };
    refs.listViewBtn.onclick = () => {
      state.viewMode = 'list';
      refs.listViewBtn.classList.add('active');
      refs.gridViewBtn.classList.remove('active');
      renderAssets();
    };

    refs.fileInput.onchange = (e) => {
      handleUpload([...e.target.files]);
      e.target.value = '';
    };

    refs.assetDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      refs.assetDropZone.classList.add('drop-active');
    });
    refs.assetDropZone.addEventListener('dragleave', () => {
      refs.assetDropZone.classList.remove('drop-active');
    });
    refs.assetDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      refs.assetDropZone.classList.remove('drop-active');
      const files = [...(e.dataTransfer?.files || [])];
      if (files.length) handleUpload(files);
    });
  }

  function seedFilterSelects() {
    const kinds = ['image', 'pdf', 'office', 'tableau', 'powerbi', 'audio'];
    refs.kindFilter.innerHTML += kinds.map((k) => `<option value="${k}">${k}</option>`).join('');
    refs.domainFilter.innerHTML += DOMAINS.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
  }

  function render() {
    renderFolders();
    renderAssets();
    renderInspector();
  }

  makeAssets();
  seedFilterSelects();
  bindEvents();
  render();
})();
