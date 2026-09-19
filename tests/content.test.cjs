/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const sharp = require('sharp');
// Read the authored TypeScript content without involving Next or live database access.
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, filename);
const {regionNotes} = require('../src/content/regions.ts');
const {areaGuides} = require('../src/content/areas.ts');
const {groupGuides} = require('../src/content/groups.ts');
const {sources, stateHelp} = require('../src/content/sources.ts');
const images = require('../src/content/location-images.json');
const catalog = require('./content-catalog.json');
const {correctPracticeContent} = require('../src/content/corrections.ts');
const sameKeys = (actual, expected) => assert.deepEqual(Object.keys(actual).sort(), [...expected].sort());

test('every directory location has distinct local guidance and a dedicated hero', () => {
  assert.equal(catalog.regions.length, 66);
  sameKeys(regionNotes, catalog.regions);
  sameKeys(images, catalog.regions);
  assert.equal(new Set(Object.values(regionNotes).map(n=>n.focus)).size, 66);
  assert.equal(new Set(Object.values(images)).size, 66);
  for (const slug of catalog.regions) {
    assert.ok(regionNotes[slug].focus.length > 100, slug);
    assert.ok(regionNotes[slug].access.length > 100, slug);
    assert.ok(stateHelp[slug.split('-')[0].toUpperCase()], slug);
  }
});
test('all practice subsections have their own preparation content', () => {
  assert.equal(catalog.areas.length, 101);
  sameKeys(areaGuides, catalog.areas.map(a=>a.slug));
  assert.equal(new Set(Object.values(areaGuides).map(a=>a.focus)).size, 101);
  for (const {slug,group} of catalog.areas) {
    const a=areaGuides[slug];
    assert.ok(groupGuides[group], `${slug}: missing parent guide ${group}`);
    assert.ok(a.focus.length > 100 && a.scope.length > 70, slug);
    assert.equal(a.documents.length, 3, slug);
    assert.equal(a.questions.length, 2, slug);
  }
});
test('all practice groups have process, cost, timing and official resource content', () => {
  assert.equal(catalog.groups.length,12);
  sameKeys(groupGuides,catalog.groups);
  for (const slug of catalog.groups) {
    const g=groupGuides[slug];
    assert.equal(g.steps.length,3,slug);
    assert.ok(g.questions.length >= 3,slug);
    assert.ok(g.fees.length > 100 && g.timing.length > 100,slug);
    assert.ok(sources[slug],slug);
  }
  for (const source of [...Object.values(sources),...Object.values(stateHelp)]) assert.equal(new URL(source.url).protocol,'https:');
});
test('every local hero is a real optimised WebP within the image budget', async () => {
  for (const [slug,url] of Object.entries(images)) {
    const file=path.join(__dirname,'../public',url);
    assert.ok(fs.existsSync(file), `${slug}: missing image`);
    assert.ok(fs.statSync(file).size <= 180000,`${slug}: exceeds 180 KB`);
    const meta=await sharp(file).metadata();
    assert.equal(meta.format,'webp',slug);
    assert.ok(meta.width <= 1280 && meta.width >= 900,slug);
    assert.ok(meta.height >= 500,slug);
  }
});
test('outdated divorce rules cannot override the reviewed display content', () => {
  const stale={slug:'divorce-separation',au_context:'Couples married under two years must attend counselling.',why:'A deadline starts when you apply.'};
  const current=correctPracticeContent(stale);
  assert.match(current.au_context,/removed the counselling-certificate requirement/);
  assert.match(current.why,/after a divorce becomes final/);
  assert.equal(stale.au_context,'Couples married under two years must attend counselling.');
  const other={slug:'traffic-law',body:'Original copy'};
  assert.equal(correctPracticeContent(other),other);
});
