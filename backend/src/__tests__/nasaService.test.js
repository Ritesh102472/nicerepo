'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// NASAService is a singleton, but we only test pure helper methods here.
const nasaService = require('../services/nasaService');

const makeAsteroid = ({
  diamKmMin = 0,
  diamKmMax = 0,
  velocityKmh = 0,
  missDistanceKm = 1e9,
  hazardous = false,
} = {}) => ({
  is_potentially_hazardous_asteroid: hazardous,
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: diamKmMin,
      estimated_diameter_max: diamKmMax,
    },
  },
  close_approach_data: [
    {
      orbiting_body: 'Earth',
      relative_velocity: { kilometers_per_hour: String(velocityKmh) },
      miss_distance: { kilometers: String(missDistanceKm) },
    },
  ],
});

describe('NASAService.calculateRiskScore', () => {
  test('returns a number between 0 and 100', () => {
    const score = nasaService.calculateRiskScore(makeAsteroid());
    assert.ok(typeof score === 'number', 'score should be a number');
    assert.ok(score >= 0 && score <= 100, `score ${score} out of range`);
  });

  test('hazardous flag adds to score', () => {
    const base = nasaService.calculateRiskScore(makeAsteroid({ hazardous: false }));
    const pha = nasaService.calculateRiskScore(makeAsteroid({ hazardous: true }));
    assert.ok(pha > base, 'hazardous asteroid should have a higher score');
  });

  test('larger diameter increases score', () => {
    const small = nasaService.calculateRiskScore(makeAsteroid({ diamKmMin: 0.01, diamKmMax: 0.05 }));
    const large = nasaService.calculateRiskScore(makeAsteroid({ diamKmMin: 1.0, diamKmMax: 2.0 }));
    assert.ok(large > small, 'larger asteroid should score higher');
  });

  test('higher velocity increases score', () => {
    const slow = nasaService.calculateRiskScore(makeAsteroid({ velocityKmh: 10000 }));
    const fast = nasaService.calculateRiskScore(makeAsteroid({ velocityKmh: 120000 }));
    assert.ok(fast > slow, 'faster asteroid should score higher');
  });

  test('closer miss distance increases score', () => {
    const far = nasaService.calculateRiskScore(makeAsteroid({ missDistanceKm: 1e9 }));
    const near = nasaService.calculateRiskScore(makeAsteroid({ missDistanceKm: 100000 }));
    assert.ok(near > far, 'closer asteroid should score higher');
  });

  test('caps at 100 for extreme values', () => {
    const score = nasaService.calculateRiskScore(
      makeAsteroid({ diamKmMin: 10, diamKmMax: 20, velocityKmh: 200000, missDistanceKm: 50000, hazardous: true })
    );
    assert.equal(score, 100);
  });
});

describe('NASAService.getRiskLevel', () => {
  test('low for score < 30', () => assert.equal(nasaService.getRiskLevel(10), 'low'));
  test('medium for score 30–49', () => assert.equal(nasaService.getRiskLevel(40), 'medium'));
  test('high for score 50–69', () => assert.equal(nasaService.getRiskLevel(60), 'high'));
  test('critical for score >= 70', () => assert.equal(nasaService.getRiskLevel(75), 'critical'));
  test('boundary 30 is medium', () => assert.equal(nasaService.getRiskLevel(30), 'medium'));
  test('boundary 50 is high', () => assert.equal(nasaService.getRiskLevel(50), 'high'));
  test('boundary 70 is critical', () => assert.equal(nasaService.getRiskLevel(70), 'critical'));
});

describe('NASAService.enrichAsteroidData', () => {
  test('adds risk_analysis to asteroid object', () => {
    const asteroid = makeAsteroid({ hazardous: true, velocityKmh: 50000 });
    const enriched = nasaService.enrichAsteroidData(asteroid);
    assert.ok(enriched.risk_analysis, 'should have risk_analysis');
    assert.ok(typeof enriched.risk_analysis.score === 'number', 'score should be a number');
    assert.ok(typeof enriched.risk_analysis.level === 'string', 'level should be a string');
  });

  test('returns original fields unchanged', () => {
    const asteroid = makeAsteroid({ hazardous: false });
    const enriched = nasaService.enrichAsteroidData(asteroid);
    assert.equal(enriched.is_potentially_hazardous_asteroid, false);
  });

  test('returns safe defaults for null input', () => {
    const result = nasaService.enrichAsteroidData(null);
    assert.equal(result, null);
  });
});
