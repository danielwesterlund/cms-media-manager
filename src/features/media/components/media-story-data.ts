import type { Asset, AssetBase } from '@/features/media/domain/media.types';

const base: AssetBase = {
  id: 'ast_base',
  kind: 'image',
  fileName: 'base-file.png',
  mimeType: 'image/png',
  fileSizeBytes: 256000,
  folderId: 'fld_brand',
  status: 'published',
  title: 'Base Asset',
  createdAt: '2025-01-10T10:00:00.000Z',
  updatedAt: '2025-02-12T12:00:00.000Z',
  createdBy: 'ava.vehicle-systems',
  license: 'Internal',
  domain: 'Autonomy',
  topics: ['ADAS System'],
  tags: ['telematics', 'adas'],
  technologyArea: ['Autonomous Driving Stack'],
  component: ['Report']
};

export const storyAssets: Asset[] = [
  { ...base, id: 'ast_img_01', kind: 'image', title: 'EV Launch Hero', fileName: 'ev-launch-hero.jpg', mimeType: 'image/jpeg', width: 1920, height: 1080 },
  { ...base, id: 'ast_pdf_01', kind: 'pdf', title: 'ADAS Compliance Guide', fileName: 'adas-compliance-guide.pdf', mimeType: 'application/pdf', pageCount: 22 },
  { ...base, id: 'ast_office_01', kind: 'office', title: 'Telematics Rollout Deck', fileName: 'telematics-rollout.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', officeType: 'powerpoint' },
  { ...base, id: 'ast_tableau_01', kind: 'tableau', title: 'Fleet Retention Dashboard', fileName: 'fleet-retention-workbook.twb', mimeType: 'application/tableau', workbookName: 'Fleet Retention', sheetName: 'Overview', externalUrl: 'https://tableau.example.test/workbooks/retention' },
  { ...base, id: 'ast_powerbi_01', kind: 'powerbi', title: 'Dealer KPI Board', fileName: 'dealer-kpi.pbix', mimeType: 'application/powerbi', workspaceId: 'ws_100', reportId: 'rpt_401', externalUrl: 'https://powerbi.example.test/reports/ops-kpi' },
  { ...base, id: 'ast_audio_01', kind: 'audio', title: 'Driver Safety Intro', fileName: 'driver-safety-intro.mp3', mimeType: 'audio/mpeg', durationSeconds: 180, codec: 'mp3' }
];
