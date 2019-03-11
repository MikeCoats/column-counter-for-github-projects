/* Any copyright is dedicated to the Public Domain.
 * https://creativecommons.org/publicdomain/zero/1.0/ */

import test from 'ava';
import * as jsdom from 'jsdom';
import {parseLabel, getLabel} from './ccghp';

const {JSDOM} = jsdom;

const label = caption => {
  return `
  <button type="button" class="issue-card-label">
    <span>${caption}</span>
  </button>
  `;
};

test.beforeEach(t => {
  t.context.emptyCaption = '';
  t.context.nonNumericCaption = 'feature';
  t.context.bareCaption = '3';

  t.context.spcLcPointsSufCaption = '3 points';
  t.context.hypLcPointsSufCaption = '3-points';
  t.context.colLcPointsSufCaption = '3:points';
  t.context.spcUcPointsSufCaption = '3 Points';
  t.context.hypUcPointsSufCaption = '3-Points';
  t.context.colUcPointsSufCaption = '3:Points';

  t.context.spcLcStoryPointsSufCaption = '3 story points';
  t.context.hypLcStoryPointsSufCaption = '3-story-points';
  t.context.colLcStoryPointsSufCaption = '3:story points';
  t.context.spcUcStoryPointsSufCaption = '3 Story Points';
  t.context.hypUcStoryPointsSufCaption = '3-Story-Points';
  t.context.colUcStoryPointsSufCaption = '3:Story Points';

  t.context.spcLcPointsPreCaption = 'points 3';
  t.context.hypLcPointsPreCaption = 'points-3';
  t.context.colLcPointsPreCaption = 'points:3';
  t.context.spcUcPointsPreCaption = 'Points 3';
  t.context.hypUcPointsPreCaption = 'Points-3';
  t.context.colUcPointsPreCaption = 'Points:3';

  t.context.spcLcStoryPointsPreCaption = 'story points 3';
  t.context.hypLcStoryPointsPreCaption = 'story-points-3';
  t.context.colLcStoryPointsPreCaption = 'story points:3';
  t.context.spcUcStoryPointsPreCaption = 'Story Points 3';
  t.context.hypUcStoryPointsPreCaption = 'Story-Points-3';
  t.context.colUcStoryPointsPreCaption = 'Story Points:3';

  t.context.empty = new JSDOM(label(t.context.emptyCaption)).window.document.querySelector('.issue-card-label');
  t.context.nonNumeric = new JSDOM(label(t.context.nonNumericCaption)).window.document.querySelector('.issue-card-label');
  t.context.bare = new JSDOM(label(t.context.bareCaption)).window.document.querySelector('.issue-card-label');

  t.context.spcLcPointsSuf = new JSDOM(label(t.context.spcLcPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypLcPointsSuf = new JSDOM(label(t.context.hypLcPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.colLcPointsSuf = new JSDOM(label(t.context.colLcPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.spcUcPointsSuf = new JSDOM(label(t.context.spcUcPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypUcPointsSuf = new JSDOM(label(t.context.hypUcPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.colUcPointsSuf = new JSDOM(label(t.context.colUcPointsSufCaption)).window.document.querySelector('.issue-card-label');

  t.context.spcLcStoryPointsSuf = new JSDOM(label(t.context.spcLcStoryPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypLcStoryPointsSuf = new JSDOM(label(t.context.hypLcStoryPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.colLcStoryPointsSuf = new JSDOM(label(t.context.colLcStoryPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.spcUcStoryPointsSuf = new JSDOM(label(t.context.spcUcStoryPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypUcStoryPointsSuf = new JSDOM(label(t.context.hypUcStoryPointsSufCaption)).window.document.querySelector('.issue-card-label');
  t.context.colUcStoryPointsSuf = new JSDOM(label(t.context.colUcStoryPointsSufCaption)).window.document.querySelector('.issue-card-label');

  t.context.spcLcPointsPre = new JSDOM(label(t.context.spcLcPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypLcPointsPre = new JSDOM(label(t.context.hypLcPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.colLcPointsPre = new JSDOM(label(t.context.colLcPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.spcUcPointsPre = new JSDOM(label(t.context.spcUcPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypUcPointsPre = new JSDOM(label(t.context.hypUcPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.colUcPointsPre = new JSDOM(label(t.context.colUcPointsPreCaption)).window.document.querySelector('.issue-card-label');

  t.context.spcLcStoryPointsPre = new JSDOM(label(t.context.spcLcStoryPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypLcStoryPointsPre = new JSDOM(label(t.context.hypLcStoryPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.colLcStoryPointsPre = new JSDOM(label(t.context.colLcStoryPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.spcUcStoryPointsPre = new JSDOM(label(t.context.spcUcStoryPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.hypUcStoryPointsPre = new JSDOM(label(t.context.hypUcStoryPointsPreCaption)).window.document.querySelector('.issue-card-label');
  t.context.colUcStoryPointsPre = new JSDOM(label(t.context.colUcStoryPointsPreCaption)).window.document.querySelector('.issue-card-label');
});

test('null string \'parses\' into zero', t => {
  const points = parseLabel(null);
  t.is(points, 0);
});

test('empty string \'parses\' into zero', t => {
  const points = parseLabel(t.context.emptyCaption);
  t.is(points, 0);
});

test('non-numeric string \'parses\' into zero', t => {
  const points = parseLabel(t.context.nonNumericCaption);
  t.is(points, 0);
});

test('convert plain label caption to number', t => {
  const points = parseLabel(t.context.bareCaption);
  t.is(points, 3);
});

test('convert suffix \'points\' label captions to numbers', t => {
  const points1 = parseLabel(t.context.spcLcPointsSufCaption);
  const points2 = parseLabel(t.context.hypLcPointsSufCaption);
  const points3 = parseLabel(t.context.colLcPointsSufCaption);
  const points4 = parseLabel(t.context.spcUcPointsSufCaption);
  const points5 = parseLabel(t.context.hypUcPointsSufCaption);
  const points6 = parseLabel(t.context.colUcPointsSufCaption);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('convert suffix \'story points\' label captions to numbers', t => {
  const points1 = parseLabel(t.context.spcLcStoryPointsSufCaption);
  const points2 = parseLabel(t.context.hypLcStoryPointsSufCaption);
  const points3 = parseLabel(t.context.colLcStoryPointsSufCaption);
  const points4 = parseLabel(t.context.spcUcStoryPointsSufCaption);
  const points5 = parseLabel(t.context.hypUcStoryPointsSufCaption);
  const points6 = parseLabel(t.context.colUcStoryPointsSufCaption);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('convert prefix \'points\' label captions to numbers', t => {
  const points1 = parseLabel(t.context.spcLcPointsPreCaption);
  const points2 = parseLabel(t.context.hypLcPointsPreCaption);
  const points3 = parseLabel(t.context.colLcPointsPreCaption);
  const points4 = parseLabel(t.context.spcUcPointsPreCaption);
  const points5 = parseLabel(t.context.hypUcPointsPreCaption);
  const points6 = parseLabel(t.context.colUcPointsPreCaption);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('convert prefix \'story points\' label captions to numbers', t => {
  const points1 = parseLabel(t.context.spcLcStoryPointsPreCaption);
  const points2 = parseLabel(t.context.hypLcStoryPointsPreCaption);
  const points3 = parseLabel(t.context.colLcStoryPointsPreCaption);
  const points4 = parseLabel(t.context.spcUcStoryPointsPreCaption);
  const points5 = parseLabel(t.context.hypUcStoryPointsPreCaption);
  const points6 = parseLabel(t.context.colUcStoryPointsPreCaption);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('null label \'parses\' into zero', t => {
  const points = getLabel(null);
  t.is(points, 0);
});

test('get empty label', t => {
  const points = getLabel(t.context.empty);
  t.is(points, 0);
});

test('get non-numeric label', t => {
  const points = getLabel(t.context.nonNumeric);
  t.is(points, 0);
});

test('get plain number label', t => {
  const points = getLabel(t.context.bare);
  t.is(points, 3);
});

test('get suffix \'points\' labels', t => {
  const points1 = getLabel(t.context.spcLcPointsSuf);
  const points2 = getLabel(t.context.hypLcPointsSuf);
  const points3 = getLabel(t.context.colLcPointsSuf);
  const points4 = getLabel(t.context.spcUcPointsSuf);
  const points5 = getLabel(t.context.hypUcPointsSuf);
  const points6 = getLabel(t.context.colUcPointsSuf);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('get suffix \'story points\' labels', t => {
  const points1 = getLabel(t.context.spcLcStoryPointsSuf);
  const points2 = getLabel(t.context.hypLcStoryPointsSuf);
  const points3 = getLabel(t.context.colLcStoryPointsSuf);
  const points4 = getLabel(t.context.spcUcStoryPointsSuf);
  const points5 = getLabel(t.context.hypUcStoryPointsSuf);
  const points6 = getLabel(t.context.colUcStoryPointsSuf);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('get prefix \'points\' labels', t => {
  const points1 = getLabel(t.context.spcLcPointsPre);
  const points2 = getLabel(t.context.hypLcPointsPre);
  const points3 = getLabel(t.context.colLcPointsPre);
  const points4 = getLabel(t.context.spcUcPointsPre);
  const points5 = getLabel(t.context.hypUcPointsPre);
  const points6 = getLabel(t.context.colUcPointsPre);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});

test('get prefix \'story points\' labels', t => {
  const points1 = getLabel(t.context.spcLcStoryPointsPre);
  const points2 = getLabel(t.context.hypLcStoryPointsPre);
  const points3 = getLabel(t.context.colLcStoryPointsPre);
  const points4 = getLabel(t.context.spcUcStoryPointsPre);
  const points5 = getLabel(t.context.hypUcStoryPointsPre);
  const points6 = getLabel(t.context.colUcStoryPointsPre);

  t.is(points1, 3);
  t.is(points2, 3);
  t.is(points3, 3);
  t.is(points4, 3);
  t.is(points5, 3);
  t.is(points6, 3);
});
