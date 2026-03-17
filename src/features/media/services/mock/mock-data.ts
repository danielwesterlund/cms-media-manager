import type {
  Asset,
  AssetKind,
  AssetStatus,
  FolderNode,
  UploadJob,
  UsageSummary
} from '@/features/media/domain/media.types';
import {
  COMPONENTS,
  DOMAINS,
  LEGACY_SYSTEMS,
  TAG_SUGGESTIONS,
  TECHNOLOGY_AREAS,
  TOPICS
} from '@/features/media/domain/media.constants';

export type FolderRecord = {
  id: string;
  name: string;
  parentId: string | null;
};

export type MockMediaDataset = {
  assets: Asset[];
  folderRecords: FolderRecord[];
  usageByAssetId: Record<string, UsageSummary>;
  uploadJobs: UploadJob[];
};

const SEED = 31081987;
const ASSET_COUNT = 208;

const USERS = [
  'ava.vehicle-systems',
  'noah.thermal',
  'mia.sdv',
  'liam.powertrain-data',
  'zoe.oem-strategy',
  'ethan.chassis',
  'olivia.battery'
];
const TAGS = [...TAG_SUGGESTIONS];
const STATIC_THUMBNAILS = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=960&q=80'
] as const;

const FOLDER_RECORDS: FolderRecord[] = [
  { id: 'fld_brand', name: 'Fleet Campaigns', parentId: null },
  { id: 'fld_product', name: 'Vehicle Programs', parentId: null },
  { id: 'fld_ops', name: 'Dealer Operations', parentId: null },
  { id: 'fld_audio', name: 'Driver Audio', parentId: null },
  { id: 'fld_dashboards', name: 'Data Intelligence', parentId: null },
  { id: 'fld_brand_2026', name: 'Model Year 2026', parentId: 'fld_brand' },
  { id: 'fld_brand_2026_q1', name: 'Q1 Launch', parentId: 'fld_brand_2026' },
  { id: 'fld_brand_2026_q1_launch', name: 'SUV Campaign', parentId: 'fld_brand_2026_q1' },
  { id: 'fld_brand_2026_q1_launch_social', name: 'Social Variants', parentId: 'fld_brand_2026_q1_launch' },
  { id: 'fld_brand_2025', name: 'Model Year 2025', parentId: 'fld_brand' },
  { id: 'fld_product_guides', name: 'Telematics Specs', parentId: 'fld_product' },
  { id: 'fld_product_guides_pdf', name: 'PDF Specs', parentId: 'fld_product_guides' },
  { id: 'fld_product_guides_decks', name: 'Engineering Decks', parentId: 'fld_product_guides' },
  { id: 'fld_ops_training', name: 'Service Training', parentId: 'fld_ops' },
  { id: 'fld_ops_training_safety', name: 'Safety + ADAS', parentId: 'fld_ops_training' },
  { id: 'fld_ops_training_safety_lvl1', name: 'Technician Level 1', parentId: 'fld_ops_training_safety' },
  { id: 'fld_ops_training_safety_lvl2', name: 'Technician Level 2', parentId: 'fld_ops_training_safety' },
  { id: 'fld_audio_podcasts', name: 'Dealer Podcasts', parentId: 'fld_audio' },
  { id: 'fld_audio_podcasts_season1', name: 'Season 1', parentId: 'fld_audio_podcasts' },
  { id: 'fld_dashboards_tableau', name: 'Tableau KPI', parentId: 'fld_dashboards' },
  { id: 'fld_dashboards_powerbi', name: 'Power BI KPI', parentId: 'fld_dashboards' }
];

const KIND_MIME: Record<AssetKind, string[]> = {
  image: ['image/png', 'image/jpeg', 'image/webp'],
  pdf: ['application/pdf'],
  office: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  tableau: ['application/tableau'],
  powerbi: ['application/powerbi'],
  audio: ['audio/mpeg', 'audio/wav']
};

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pickOne<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length) % items.length];
}

function pickMany<T>(rand: () => number, items: readonly T[], min: number, max: number): T[] {
  const count = min + Math.floor(rand() * (max - min + 1));
  const pool = [...items];
  const out: T[] = [];
  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const idx = Math.floor(rand() * pool.length);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
}

function chooseKind(rand: () => number): AssetKind {
  const weight = rand();
  if (weight < 0.34) return 'image';
  if (weight < 0.52) return 'pdf';
  if (weight < 0.72) return 'office';
  if (weight < 0.82) return 'audio';
  if (weight < 0.91) return 'tableau';
  return 'powerbi';
}

function makeTitle(kind: AssetKind, i: number, domain: string, topic: string): string {
  const label = kind === 'office' ? 'Technical Brief' : kind.charAt(0).toUpperCase() + kind.slice(1);
  const programs = ['Platform Review', 'Supplier Benchmark', 'Field Validation', 'Launch Readiness', 'Program Intelligence'];
  const program = programs[i % programs.length];
  return `${domain} ${program} ${label} ${i} - ${topic}`;
}

function buildAsset(rand: () => number, i: number, folderIds: string[], folderPathById: Record<string, string>): Asset {
  const kind = chooseKind(rand);
  const domain = pickOne(rand, DOMAINS);
  const topic = pickOne(rand, TOPICS);
  const collectionType = pickOne(rand, COMPONENTS);
  const tags = pickMany(rand, TAGS, 1, 3);
  const createdDate = new Date(Date.UTC(2024, 0, 1));
  createdDate.setUTCDate(createdDate.getUTCDate() + Math.floor(rand() * 730));
  const updatedDate = new Date(createdDate);
  updatedDate.setUTCDate(updatedDate.getUTCDate() + Math.floor(rand() * 180));

  const status: AssetStatus = pickOne(rand, ['draft', 'published', 'archived']);
  const mimeType = pickOne(rand, KIND_MIME[kind]);
  const folderId = pickOne(rand, folderIds);
  const title = `${collectionType}: ${makeTitle(kind, i, domain, topic)}`;
  const base = {
    id: `ast_${String(i).padStart(4, '0')}`,
    kind,
    fileName: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${extensionFor(kind, mimeType)}`,
    mimeType,
    fileSizeBytes: 15_000 + Math.floor(rand() * 45_000_000),
    folderId,
    status,
    title,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    createdBy: pickOne(rand, USERS),
    creditsSource: rand() < 0.45 ? `Source ${1 + Math.floor(rand() * 9)}` : undefined,
    license: pickOne(rand, ['CC-BY', 'CC-BY-SA', 'Internal', 'Royalty Free']),
    domain,
    topics: pickMany(rand, TOPICS, 1, 1),
    tags,
    technologyArea: pickMany(rand, TECHNOLOGY_AREAS, 1, 2),
    component: [collectionType],
    legacySystem: rand() < 0.22 ? pickOne(rand, LEGACY_SYSTEMS) : undefined,
    legacyUrl: undefined as string | undefined,
    thumbnailUrl: buildUnsplashThumbnailUrl(kind, i)
  };

  if (base.legacySystem) {
    const folderPath = folderId ? folderPathById[folderId] ?? 'root' : 'root';
    base.legacyUrl = `https://legacy.example.test/${base.legacySystem}${folderPath}/${base.fileName}`;
  }

  if (kind === 'image') {
    return { ...base, kind, width: 640 + Math.floor(rand() * 1800), height: 480 + Math.floor(rand() * 1200) };
  }
  if (kind === 'pdf') {
    return { ...base, kind, pageCount: 1 + Math.floor(rand() * 80) };
  }
  if (kind === 'office') {
    return {
      ...base,
      kind,
      officeType: pickOne(rand, ['word', 'excel', 'powerpoint', 'other'])
    };
  }
  if (kind === 'audio') {
    return {
      ...base,
      kind,
      durationSeconds: 30 + Math.floor(rand() * 3600),
      codec: pickOne(rand, ['mp3', 'aac', 'wav'])
    };
  }
  if (kind === 'tableau') {
    return {
      ...base,
      kind,
      workbookName: `${domain} Workbook`,
      sheetName: `${topic} Overview`,
      externalUrl: `https://tableau.example.test/workbooks/${base.id}`
    };
  }
  return {
    ...base,
    kind: 'powerbi',
    workspaceId: `ws_${200 + i}`,
    reportId: `rpt_${500 + i}`,
    externalUrl: `https://powerbi.example.test/reports/${base.id}`
  };
}

function buildUnsplashThumbnailUrl(kind: AssetKind, index: number): string {
  const bucketOffset =
    kind === 'image' ? 0 : kind === 'pdf' ? 1 : kind === 'office' ? 2 : kind === 'tableau' ? 3 : kind === 'powerbi' ? 4 : 5;
  return STATIC_THUMBNAILS[(index + bucketOffset) % STATIC_THUMBNAILS.length];
}

function extensionFor(kind: AssetKind, mimeType: string): string {
  if (kind === 'image') return mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
  if (kind === 'pdf') return 'pdf';
  if (kind === 'office') {
    if (mimeType.includes('presentationml')) return 'pptx';
    if (mimeType.includes('spreadsheetml')) return 'xlsx';
    return 'docx';
  }
  if (kind === 'audio') return mimeType.includes('wav') ? 'wav' : 'mp3';
  if (kind === 'tableau') return 'twb';
  return 'pbix';
}

function countAssetsByFolder(assets: Asset[]): Record<string, number> {
  return assets.reduce<Record<string, number>>((acc, asset) => {
    if (!asset.folderId) return acc;
    acc[asset.folderId] = (acc[asset.folderId] ?? 0) + 1;
    return acc;
  }, {});
}

export function buildFolderTree(folderRecords: FolderRecord[], assets: Asset[]): FolderNode[] {
  const byParent = new Map<string | null, FolderRecord[]>();
  for (const record of folderRecords) {
    const list = byParent.get(record.parentId) ?? [];
    list.push(record);
    byParent.set(record.parentId, list);
  }
  const counts = countAssetsByFolder(assets);

  const toNode = (record: FolderRecord): FolderNode => ({
    id: record.id,
    name: record.name,
    parentId: record.parentId,
    assetCount: counts[record.id] ?? 0,
    children: (byParent.get(record.id) ?? []).map(toNode)
  });

  return (byParent.get(null) ?? []).map(toNode);
}

function buildFolderPathById(records: FolderRecord[]): Record<string, string> {
  const byId = new Map(records.map((record) => [record.id, record] as const));
  const pathById: Record<string, string> = {};

  for (const record of records) {
    const segments: string[] = [record.name];
    let cursor = record;

    while (cursor.parentId) {
      const parent = byId.get(cursor.parentId);
      if (!parent) break;
      segments.unshift(parent.name);
      cursor = parent;
    }

    pathById[record.id] = `/${segments.join('/').toLowerCase().replace(/\s+/g, '-')}`;
  }

  return pathById;
}

function buildUsage(rand: () => number, assets: Asset[]): Record<string, UsageSummary> {
  const byId: Record<string, UsageSummary> = {};
  for (const asset of assets) {
    if (rand() > 0.48) continue;
    const placementsDraft = Math.floor(rand() * 4);
    const placementsPublished = Math.floor(rand() * 8);
    const projectsDraft = Math.floor(rand() * 3);
    const projectsPublished = Math.floor(rand() * 5);
    const campaignsDraft = Math.floor(rand() * 2);
    const campaignsPublished = Math.floor(rand() * 4);
    const collectionTypes = buildCollectionTypeUsage(rand, asset.component[0]);

    byId[asset.id] = {
      assetId: asset.id,
      placements: { draft: placementsDraft, published: placementsPublished, total: placementsDraft + placementsPublished },
      projects: { draft: projectsDraft, published: projectsPublished, total: projectsDraft + projectsPublished },
      campaigns: { draft: campaignsDraft, published: campaignsPublished, total: campaignsDraft + campaignsPublished },
      collectionTypes,
      total: {
        draft: placementsDraft + projectsDraft + campaignsDraft,
        published: placementsPublished + projectsPublished + campaignsPublished,
        total:
          placementsDraft +
          placementsPublished +
          projectsDraft +
          projectsPublished +
          campaignsDraft +
          campaignsPublished
      }
    };
  }
  return byId;
}

function buildCollectionTypeUsage(rand: () => number, primary: (typeof COMPONENTS)[number]) {
  const out: Partial<Record<(typeof COMPONENTS)[number], { draft: number; published: number; total: number }>> = {};
  const primaryDraft = 1 + Math.floor(rand() * 3);
  const primaryPublished = 2 + Math.floor(rand() * 8);
  out[primary] = { draft: primaryDraft, published: primaryPublished, total: primaryDraft + primaryPublished };

  const secondaryCount = 1 + Math.floor(rand() * 2);
  const secondary = pickMany(rand, COMPONENTS.filter((c) => c !== primary), secondaryCount, secondaryCount);
  for (const type of secondary) {
    const draft = Math.floor(rand() * 3);
    const published = 1 + Math.floor(rand() * 4);
    out[type] = { draft, published, total: draft + published };
  }

  return out;
}

/**
 * Creates deterministic mock media data.
 */
export function createMockMediaDataset(): MockMediaDataset {
  const rand = createRandom(SEED);
  const folderIds = FOLDER_RECORDS.map((f) => f.id);
  const folderPathById = buildFolderPathById(FOLDER_RECORDS);
  const assets: Asset[] = Array.from({ length: ASSET_COUNT }, (_, idx) =>
    buildAsset(rand, idx + 1, folderIds, folderPathById)
  );

  return {
    assets,
    folderRecords: FOLDER_RECORDS.map((f) => ({ ...f })),
    usageByAssetId: buildUsage(rand, assets),
    uploadJobs: []
  };
}
