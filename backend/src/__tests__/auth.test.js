'use strict';

const { test, describe, before } = require('node:test');
const assert = require('node:assert/strict');

before(() => {
  process.env.JWT_SECRET = 'test-secret-for-unit-tests';
});

const auth = require('../middleware/auth');

describe('auth.generateToken', () => {
  test('returns a JWT string', () => {
    const token = auth.generateToken('user123');
    assert.ok(typeof token === 'string', 'should return a string');
    const parts = token.split('.');
    assert.equal(parts.length, 3, 'JWT should have three dot-separated parts');
  });

  test('different user IDs produce different tokens', () => {
    const t1 = auth.generateToken('user-a');
    const t2 = auth.generateToken('user-b');
    assert.notEqual(t1, t2);
  });

  test('same user ID produces consistent payload', () => {
    const jwt = require('jsonwebtoken');
    const token = auth.generateToken('abc123');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    assert.equal(decoded.id, 'abc123');
  });
});
