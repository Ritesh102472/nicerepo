import { describe, it, expect } from 'vitest';
import { mapBackendAsteroidToFrontend } from '@/lib/mapBackendAsteroid';
import type { BackendAsteroid } from '@/lib/apiClient';

const makeBackend = (overrides: Partial<BackendAsteroid> = {}): BackendAsteroid => ({
  id: '12345',
  neo_reference_id: '12345',
  name: '(2023 AB1)',
  is_potentially_hazardous_asteroid: false,
  estimated_diameter: {
    kilometers: { estimated_diameter_min: 0.1, estimated_diameter_max: 0.2 },
  },
  close_approach_data: [
    {
      close_approach_date: '2026-03-15',
      relative_velocity: { kilometers_per_hour: '50000' },
      miss_distance: { kilometers: '500000' },
      orbiting_body: 'Earth',
    },
  ],
  absolute_magnitude_h: 22.5,
  risk_analysis: { score: 40, level: 'medium' },
  ...overrides,
});

describe('mapBackendAsteroidToFrontend', () => {
  it('maps id correctly', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend());
    expect(result.id).toBe('12345');
  });

  it('converts diameter from km to meters', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend());
    expect(result.diameterMin).toBeCloseTo(100);
    expect(result.diameterMax).toBeCloseTo(200);
  });

  it('parses velocity correctly', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend());
    expect(result.velocity).toBe(50000);
    expect(result.velocityKmps).toBeCloseTo(50000 / 3600);
  });

  it('parses miss distance correctly', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend());
    expect(result.missDistanceKm).toBe(500000);
  });

  it('maps risk level: critical → high', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend({ risk_analysis: { score: 80, level: 'critical' } }));
    expect(result.riskScore).toBe('high');
  });

  it('maps risk level: medium → medium', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend({ risk_analysis: { score: 40, level: 'medium' } }));
    expect(result.riskScore).toBe('medium');
  });

  it('maps risk level: low → low', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend({ risk_analysis: { score: 10, level: 'low' } }));
    expect(result.riskScore).toBe('low');
  });

  it('falls back to name when id missing', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend({ id: undefined, neo_reference_id: undefined }));
    expect(result.id).toBe('(2023AB1)');
  });

  it('preserves close approach date', () => {
    const result = mapBackendAsteroidToFrontend(makeBackend());
    expect(result.closeApproachDate).toBe('2026-03-15');
  });

  it('marks hazardous flag correctly', () => {
    const safe = mapBackendAsteroidToFrontend(makeBackend({ is_potentially_hazardous_asteroid: false }));
    const pha = mapBackendAsteroidToFrontend(makeBackend({ is_potentially_hazardous_asteroid: true }));
    expect(safe.isHazardous).toBe(false);
    expect(pha.isHazardous).toBe(true);
  });
});
