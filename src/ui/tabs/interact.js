import { getClinicAmbientLine } from '../../clinicMindset.js';
import { getUnvisitedPatients } from '../../patientVisit.js';
import { formatMoney } from '../../state.js';
import { getMobilityLabel, rosterMobilitySummary } from '../../worldImpact.js';
import { characterCard } from '../components.js';
import { e } from '../dom.js';

export function renderInteract(state) {
  const unvisited = getUnvisitedPatients(state);
  const inProgress = state.activePatientVisit
    ? state.patients.find((p) => p.id === state.activePatientVisit.patientId)
    : null;
  const mobility = rosterMobilitySummary(state);
  const weekOneBanner =
    state.week === 1
      ? `<div class="mt-4 rounded-2xl border border-amber-300/25 bg-amber-950/30 px-4 py-4 text-sm text-amber-100">
          <strong>Week one.</strong> Your first patient is on the schedule. Run her visit on Interact, then end the week when you are ready.
          ${
            state.gameSettings?.onboardingDismissed
              ? ''
              : `<ol class="mt-3 list-decimal space-y-1 pl-5 text-stone-200">
            <li>Visit patients on Interact when they arrive.</li>
            <li>Each visit: greet → chart → weigh → bill.</li>
            <li>End Week when AP is spent.</li>
          </ol>
          <button class="mt-3 dark-button rounded-xl px-3 py-2 text-xs font-bold" data-action="dismiss-onboarding">Got it</button>`
          }
        </div>`
      : '';
  const ambient = getClinicAmbientLine(state);
  const mobilityBanner =
    mobility.outgrowing.length || mobility.immobile.length
      ? `<p class="mt-3 rounded-2xl border border-pink-300/20 bg-pink-950/25 px-4 py-3 text-sm text-pink-100"><strong>${mobility.outgrowing.length} outgrowing the furniture</strong>, ${mobility.immobile.length} too wide to walk, ${mobility.blob.length} sunk into bedbound mass.${
          mobility.immobile.length
            ? ` Feed at their couches: ${mobility.immobile.map((c) => `${e(c.name)} (${e(getMobilityLabel(c))})`).join(', ')}.`
            : ''
        }</p>`
      : '';
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Patient rounds</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Run the office</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Run visits: vitals, chart review, prescriptions, follow-up. Deeper options unlock as patients return.</p>
        <p class="mt-2 text-xs text-stone-500">${e(ambient)}</p>
        <p class="mt-2 text-sm text-stone-400">Minimum path: greet, chart, weigh, bill consult, end visit (around 4 AP). Staff hiring is on the Management tab.</p>
        ${weekOneBanner}
        ${mobilityBanner}
        ${
          unvisited.length
            ? `<p class="mt-3 rounded-2xl border border-red-300/20 bg-red-950/30 px-4 py-3 text-sm text-red-100"><strong>${unvisited.length} patient${unvisited.length === 1 ? '' : 's'} still need a visit:</strong> ${unvisited.map((p) => e(p.name)).join(', ')}</p>`
            : `<p class="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-100">All scheduled visits completed this week.</p>`
        }
        ${
          inProgress
            ? `<p class="mt-2 text-sm text-amber-200">Visit in progress: <button class="underline" data-action="open-visit" data-id="${e(inProgress.id)}">${e(inProgress.name)}</button></p>`
            : ''
        }
        ${state.weekConsultIncome ? `<p class="mt-2 text-sm text-emerald-200">Visit fees so far: ${formatMoney(state.weekConsultIncome)}</p>` : ''}
      </div>
      <div class="grid gap-6 2xl:grid-cols-2">
        <div>
          <h3 class="mb-3 text-xl font-bold text-amber-100">Staff wing</h3>
          <p class="mb-3 text-xs text-stone-400">Check-ins, catered breaks, compounds. Open a profile to feed and grow them.</p>
          <div class="grid gap-4 md:grid-cols-2">
            ${state.staff.map((member) => characterCard(member, 'standard', state)).join('')}
          </div>
        </div>
        <div>
          <h3 class="mb-3 text-xl font-bold text-amber-100">Exam floor</h3>
          <p class="mb-3 text-xs text-stone-400">Click to start or resume an office visit.</p>
          <div class="grid gap-4 md:grid-cols-2">
            ${state.patients.map((patient) => characterCard(patient, 'standard', state)).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

