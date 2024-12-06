import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { adminUser, secret } from '../auth.js';
import { assert } from 'chai';

describe('Sample Test', function() {
  it('should return true', function() {
    assert.strictEqual(true, true);
  });
});

describe('Authentication', () => {
  it('should return a token for valid credentials', () => {
    const isValidPassword = bcrypt.compareSync('adminpassword', adminUser.password);
    assert.strictEqual(isValidPassword, true);

    const token = jwt.sign({ username: adminUser.username }, secret);
    assert.ok(token);
  });
});