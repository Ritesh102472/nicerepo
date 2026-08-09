import { describe, it, expect } from 'vitest';
import { calculateImpactScenario } from '@/utils/impactScenario';
import type { Asteroid } from '@/types/asteroid';

const makeAsteroid = (overrides: Partial<Asteroid> = {}): Asteroid => ({
  id: 'test-1',
  name: 'Test Asteroid',
  nasaId: 'test-1',
  isHazardous: false,
  diameterMin: 50,
  diameterMax: 100,
  velocity: 36000,
  velocityKmps: 10,
  missDistance: 500000,
  missDistanceKm: 500000,
  orbitingBody: 'Earth',
  closeApproachDate: '2026-06-01',
  absoluteMagnitude: 24,
  riskScore: 'low',
  ...overrides,
});

describe('calculateImpactScenario', () => {
  it('returns a valid scenario object', () => {
    const result = calculateImpactScenario(makeAsteroid());
    expect(result).toHaveProperty('impactEnergy');
    expect(result).toHaveProperty('craterDiameter');
    expect(result).toHaveProperty('affectedRadius');
    expect(result).toHaveProperty('threatLevel');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('survivalChance');
  });

  it('small asteroid (< 100 m diameter) → local threat', () => {
    const result = calculateImpactScenario(makeAsteroid({ diameterMin: 30, diameterMax: 80 }));
    expect(result.threatLevel).toBe('local');
  });

  it('medium asteroid (100–500 m) → regional threat', () => {
    const result = calculateImpactScenario(makeAsteroid({ diameterMin: 150, diameterMax: 300 }));
    expect(result.threatLevel).toBe('regional');
  });

  it('large asteroid (500–1000 m) → global threat', () => {
    const result = calculateImpactScenario(makeAsteroid({ diameterMin: 600, diameterMax: 900 }));
    expect(result.threatLevel).toBe('global');
  });

  it('extinction-level asteroid (> 1000 m) → extinction threat', () => {
    const result = calculateImpactScenario(makeAsteroid({ diameterMin: 1200, diameterMax: 2000 }));
    expect(result.threatLevel).toBe('extinction');
  });

  it('impact energy is positive', () => {
    const result = calculateImpactScenario(makeAsteroid({ velocityKmps: 20, diameterMin: 200, diameterMax: 400 }));
    expect(result.impactEnergy).toBeGreaterThan(0);
  });

  it('crater diameter is positive', () => {
    const result = calculateImpactScenario(makeAsteroid());
    expect(result.craterDiameter).toBeGreaterThan(0);
  });

  it('includes the asteroid in the result', () => {
    const asteroid = makeAsteroid({ name: 'Test Rock' });
    const result = calculateImpactScenario(asteroid);
    expect(result.asteroid.name).toBe('Test Rock');
  });

  it('higher velocity → more impact energy', () => {
    const slow = calculateImpactScenario(makeAsteroid({ velocityKmps: 5 }));
    const fast = calculateImpactScenario(makeAsteroid({ velocityKmps: 30 }));
    expect(fast.impactEnergy).toBeGreaterThan(slow.impactEnergy);
  });
});
