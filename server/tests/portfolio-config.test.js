import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePortfolio } from '../validatePortfolio.js';

const config = () => ({ version: 1, theme: { accent: '#6366f1', background: '#09090b', text: '#ffffff', font: 'Arial', radius: 16, width: 1280, dark: true }, sections: [{ id: 'hero', type: 'hero', label: 'Hero', visible: true, title: '', body: '', image: '', link: '', background: '', padding: 0, align: 'left' }], content: { candidateInfo: {}, contactData: {}, candidateStats: [], skillGroups: [], educationData: [], certificationsData: [], sampleCodeSnippets: [] } });
test('accepts a publishable design and rejects duplicate sections', () => {
  const value = config(); assert.equal(validatePortfolio(value), true);
  value.sections.push({ ...value.sections[0] }); assert.equal(validatePortfolio(value), false);
});
test('rejects unsupported blocks and invalid design values', () => {
  const value = config(); value.sections[0].type = 'script'; assert.equal(validatePortfolio(value), false);
  const other = config(); other.theme.accent = 'red; background:url(x)'; assert.equal(validatePortfolio(other), false);
  other.theme.accent = '#123456'; other.theme.width = -10; assert.equal(validatePortfolio(other), false);
  assert.equal(validatePortfolio(null), false);
});
test('validates element formatting and preserves old designs without formatting', () => {
  const value = config();
  const selector = '[data-editor-block="hero"] > section:nth-child(1) > h1:nth-child(2)';
  value.textFormats = { [selector]: { text: 'New heading', color: '#f97316', fontSize: 32, fontWeight: '700' } };
  assert.equal(validatePortfolio(value), true);
  value.textFormats[selector].fontSize = 10000;
  assert.equal(validatePortfolio(value), false);
  value.textFormats = { 'body': { color: '#ffffff' } };
  assert.equal(validatePortfolio(value), false);
  value.textFormats = { [selector]: { color: 'red;display:none' } };
  assert.equal(validatePortfolio(value), false);
  value.textFormats = { [selector]: { position: 'fixed' } };
  assert.equal(validatePortfolio(value), false);
});
test('accepts removable text and bounded position controls', () => {
  const value = config();
  const selector = '[data-editor-block="resume-header"] > h1:nth-child(1)';
  value.textFormats = { [selector]: { hidden: true, offsetX: 12, offsetY: -5, marginBottom: 20 } };
  assert.equal(validatePortfolio(value), true);
  value.textFormats[selector].offsetX = 9999;
  assert.equal(validatePortfolio(value), false);
  value.textFormats[selector] = { hidden: 'yes' };
  assert.equal(validatePortfolio(value), false);
});

test('validates global typography and rejects CSS payloads and invalid size ranges', () => {
  const value = config(); value.theme.headingFont = 'Georgia, serif'; value.theme.bodySize = 18; value.theme.lineHeight = 1.8;
  assert.equal(validatePortfolio(value), true);
  value.theme.headingFont = 'Arial; background: url(https://example.com)'; assert.equal(validatePortfolio(value), false);
  value.theme.headingFont = ''; value.theme.bodySize = 50; assert.equal(validatePortfolio(value), false);
  value.theme.bodySize = 0; value.theme.lineHeight = 20; assert.equal(validatePortfolio(value), false);
});
test('accepts reordered resume sections and rejects duplicate or unknown sections', () => {
  const value = config(); value.resumeSections = ['resume-skills', 'resume-header'];
  assert.equal(validatePortfolio(value), true);
  value.resumeSections.push('resume-header'); assert.equal(validatePortfolio(value), false);
  value.resumeSections = ['unknown']; assert.equal(validatePortfolio(value), false);
});
test('validates image presentation settings and rejects unsafe sources', () => {
  const value = config();
  value.images = { 'project:sample': { src: '/uploads/sample.png', alt: 'Project screenshot', width: 0, height: 320, fit: 'cover', position: 'top', align: 'center', radius: 16 } };
  assert.equal(validatePortfolio(value), true);
  value.images['project:sample'].src = 'javascript:alert(1)'; assert.equal(validatePortfolio(value), false);
  value.images['project:sample'].src = '/uploads/sample.png'; value.images['project:sample'].width = -1; assert.equal(validatePortfolio(value), false);
});
