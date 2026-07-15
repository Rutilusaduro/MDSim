import { describe, expect, it } from 'vitest';
import './helpers.js';
import { createNewGame } from '../src/state.js';
import { stageMeter, patientVisitBadge, characterCard, bodyTypesLabel } from '../src/ui/components.js';
import { renderTopNav, renderSidebar, renderTabs } from '../src/ui/header.js';
import { renderManagement } from '../src/ui/tabs/management.js';
import { renderInteract } from '../src/ui/tabs/interact.js';
import { renderFloorPlan } from '../src/ui/tabs/floorplan.js';
import { renderRelationships } from '../src/ui/tabs/relationships.js';
import { renderCampaign } from '../src/ui/tabs/campaign.js';
import { renderAchievements } from '../src/ui/tabs/achievements.js';
import { renderLog } from '../src/ui/tabs/log.js';

/**
 * Every extracted renderer is a pure state -> HTML-string function.
 * Calling each with a real game state catches any import missed in
 * the A9 split as a ReferenceError, without needing a DOM.
 */

const state = createNewGame({ seed: 31337 });

const RENDERERS = [
  ['renderTopNav', () => renderTopNav(state)],
  ['renderSidebar', () => renderSidebar(state)],
  ['renderTabs', () => renderTabs('management')],
  ['renderManagement', () => renderManagement(state)],
  ['renderInteract', () => renderInteract(state)],
  ['renderFloorPlan', () => renderFloorPlan(state)],
  ['renderRelationships', () => renderRelationships(state)],
  ['renderCampaign', () => renderCampaign(state)],
  ['renderAchievements', () => renderAchievements(state)],
  ['renderLog', () => renderLog(state)],
];

describe('extracted ui renderers', () => {
  it.each(RENDERERS)('%s returns substantial html', (name, fn) => {
    const html = fn();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(40);
    expect(html).not.toMatch(/undefined|\[object/);
  });

  it('components render for staff and patients', () => {
    const staff = state.staff[0];
    const patient = state.patients[0];
    for (const html of [
      stageMeter(staff),
      patientVisitBadge(state, patient),
      characterCard(staff, 'standard', state),
      characterCard(patient, 'sidebar', state),
      bodyTypesLabel(patient),
    ]) {
      expect(typeof html).toBe('string');
      expect(html).not.toMatch(/undefined|\[object/);
    }
  });
});
