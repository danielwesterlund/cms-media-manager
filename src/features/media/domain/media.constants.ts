/**
 * Allowed legacy system values for migrated assets.
 */
export const LEGACY_SYSTEMS = ['Connect', 'ATI'] as const;

/**
 * Domain taxonomy values used in media metadata and filtering.
 */
export const DOMAINS = [
  'Autonomy',
  'Battery',
  'Charging',
  'Chassis',
  'Consumer',
  'E/E and Semi',
  'Interior',
  'Lighting',
  'Materials',
  'OEM Strategy',
  'Propulsion',
  'SDV',
  'Thermal',
  'Vehicle Production',
  'Vehicle Sales',
  'Powertrain',
  'Aftermarket',
  'Future Mobility'
] as const;

/**
 * Collection type values used for automotive media libraries.
 */
export const COLLECTION_TYPES = ['Article', 'Podcast', 'Event', 'Report', 'Profile', 'Person', 'Other'] as const;

/**
 * Automotive application area values.
 */
export const APPLICATION_AREAS = [
  'Access Monitoring System',
  'Active Safety System',
  'ADAS System',
  'Airbag Module',
  'Braking System',
  'Cockpit',
  'Doors/Tailgate',
  'Drivetrain',
  'Electrics',
  'Electronics',
  'Engine Cooling System',
  'Engine Intake and Turbocharger',
  'Engine Main Parts',
  'EV Battery Thermal Management System',
  'EV Module Thermal Management',
  'Exhaust and Aftertreatment System',
  'Exterior Parts & Body',
  'Fuel System',
  'HVAC System',
  'Hybrid/EV System',
  'Ignition System',
  'Infotainment System',
  'Interior - Other',
  'Interior Trim',
  'Lighting System',
  'Lubrication System',
  'Pedal Assembly',
  'Power Distribution System',
  'Seating',
  'Starter & Battery System',
  'Steering System',
  'Sunroof System',
  'Suspension System',
  'Telematics System',
  'Tyres and Wheels',
  'Underbody',
  'Valvetrain System',
  'Various'
] as const;

/**
 * Suggested free-form tags for demo data/filtering.
 */
export const TAG_SUGGESTIONS = [
  'telematics',
  'adas',
  'fleet',
  'ev',
  'kpi',
  'sensor-fusion',
  'autonomy',
  'thermal-management',
  'aftermarket',
  'powertrain',
  'supplier',
  'oem'
] as const;

/**
 * Topic taxonomy values used in media metadata and filtering.
 */
export const TOPICS = APPLICATION_AREAS;

/**
 * Technology area taxonomy values used in media metadata and filtering.
 */
export const TECHNOLOGY_AREAS = [
  'Autonomous Driving Stack',
  'Battery Systems Engineering',
  'Charging Infrastructure',
  'Vehicle Electronics',
  'Data & Analytics Platform',
  'Manufacturing Systems',
  'Connected Services',
  'Powertrain Engineering'
] as const;

/**
 * Component taxonomy values used in media metadata and filtering.
 */
export const COMPONENTS = COLLECTION_TYPES;

/**
 * Legacy system type.
 */
export type LegacySystem = (typeof LEGACY_SYSTEMS)[number];

/**
 * Domain type.
 */
export type Domain = (typeof DOMAINS)[number];

/**
 * Topic type.
 */
export type Topic = (typeof TOPICS)[number];

/**
 * Technology area type.
 */
export type TechnologyArea = (typeof TECHNOLOGY_AREAS)[number];

/**
 * Component type.
 */
export type ComponentTag = (typeof COMPONENTS)[number];
