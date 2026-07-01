import { getAttitudeKey } from './characters.js';

function tierFromAttitude(attitude) {
  if (attitude === 'professional' || attitude === 'noticing') return 'early';
  if (attitude === 'hungry' || attitude === 'pleased') return 'mid';
  return 'late';
}

function pickLine(character, pool) {
  if (!pool?.length) return '';
  const seed = (character.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return pool[seed % pool.length];
}

const BANTER = {
  patient: {
    consult: {
      early: [
        'At checkout she asks whether the same intake nurse is on Thursdays.',
        'She pauses at the desk to confirm her follow-up date twice.',
        'She tells the front desk the lobby chairs are why she will return.',
      ],
      mid: [
        'She lingers at the coat rack, one hand on her middle, already thinking about lunch.',
        'She books the next slot before she reaches the parking lot.',
        'She mentions, quietly, that these visits are the calmest part of her week.',
      ],
      late: [
        'She asks if the recovery nook is free before she leaves.',
        'She thanks you for the second snack without pretending she did not want it.',
        'She schedules again from the exam chair, phone in one hand, purse in the other.',
      ],
    },
    comfortPlan: {
      early: [
        'She folds the pamphlet into her bag and nods like it is a normal handout.',
        'She asks one clarifying question, then stops talking and listens.',
        'She says she will read it tonight and means it.',
      ],
      mid: [
        'She underlines the evening section in pen before she stands.',
        'She asks whether the plan allows larger portions. You say yes. She exhales.',
        'She reads the snack list twice in the car with the engine running.',
      ],
      late: [
        'She takes the plan like permission and smiles with her whole face.',
        'She asks you to initial the page about richer evenings. You do.',
        'She tucks the plan into her bra strap because her hands are full of take-home cups.',
      ],
    },
    comfortBlend: {
      early: [
        'She sips once, says it tastes fine, and wipes the cup rim with her thumb.',
        'She drinks it standing, like medicine, then checks her phone for the time.',
        'She asks what is in it. You answer. She finishes anyway.',
      ],
      mid: [
        'She drains the cup and looks surprised at the bottom. "Already?" she says.',
        'Vanilla dust stays on her upper lip until she licks it off without thinking.',
        'She asks for water afterward and drinks that too.',
      ],
      late: [
        'She holds the warm cup in both hands and does not stand until it is empty.',
        'She sighs when the last swallow goes down, eyes half closed.',
        'She asks if there is another portion for the road. There is.',
      ],
    },
    appetiteTonic: {
      early: [
        'She swallows, winces once, and says the aftertaste is not bad.',
        'She reads the label on the vial before she hands it back.',
        'She rolls her shoulders after the dose like she is waiting for something to happen.',
      ],
      mid: [
        'Amber heat hits her throat and her eyes widen. "Oh," she says. Just that.',
        'She presses her palm to her sternum and laughs once, embarrassed.',
        'She asks what time the cafe down the street opens.',
      ],
      late: [
        'She licks her lips and grins. "That worked fast," she says, already hungry.',
        'She fans her mouth with the dosing card and reaches for her purse snacks.',
        'She tells you lunch can wait. She is lying. You both know it.',
      ],
    },
    recoveryShake: {
      early: [
        'She drinks through the straw, notes the chocolate, and nods approval.',
        'She finishes half, saves the rest for the car, then finishes it in the elevator.',
        'She says it is sweeter than she expected and keeps sipping.',
      ],
      mid: [
        'She grips the cup with both hands until the ice clicks empty.',
        'Thick shake leaves a ring on her mouth. She does not wipe it off.',
        'She asks for a napkin and uses it on the cup, not her face.',
      ],
      late: [
        'She drains it slow, eyes closed, throat working on every swallow.',
        'She sets the empty cup on the counter like a finished meal.',
        'She leans back in the chair and pats her belly once, content.',
      ],
    },
    recruit: [
      'She signs the offer sheet and asks about parking before benefits.',
      'She laughs when you mention the break room. "That is why I am here," she says.',
      'She shakes your hand with both of hers and asks when she can start.',
    ],
  },
  staff: {
    personalTalk: {
      early: [
        'She talks about shift coverage and mentions the team has been kind.',
        'She asks about your weekend, then answers about hers before you can.',
        'She says the new chairs help and leaves it at that.',
      ],
      mid: [
        'She admits the scrubs are tight and blames the dryer with zero conviction.',
        'She tells you hunger hits mid-shift now and she is not fighting it.',
        'She keeps her voice low so the hall cannot hear.',
      ],
      late: [
        'She says she wants to stay on the comfort track and means every word.',
        'She asks you not to schedule her on diet week. There is no diet week.',
        'She laughs about how soft she has gotten and does not sound unhappy.',
      ],
    },
    cateredBreak: {
      early: [
        'She eats half the tray, chats, and saves the rest for later.',
        'She compliments the bread and takes a second piece "for the walk back."',
        'She eats neatly, napkin on her lap, clock in view.',
      ],
      mid: [
        'She clears the tray faster than she planned and looks at the bottom.',
        'Crumbs sit on her collar. She brushes them off without apology.',
        'She asks if there is more in the kitchen. There is.',
      ],
      late: [
        'She stays on the couch until the tray is empty and her eyes go heavy.',
        'She moans quietly at the last bite and pretends she did not.',
        'She thanks you with her mouth full and keeps chewing.',
      ],
    },
    comfortPlan: {
      early: [
        'She nods through the advice and files the sheet in her locker.',
        'She asks one question about portions and writes your answer down.',
        'She says it sounds reasonable and tucks the plan in her chart pocket.',
      ],
      mid: [
        'She reads the evening section twice and taps the snack list.',
        'She asks if the plan is mandatory. You say encouraged. She smiles.',
        'She pockets the plan before she goes back on the floor.',
      ],
      late: [
        'She takes the plan like a gift and hugs it to her chest once.',
        'She asks you to sign the page about richer breaks. You do.',
        'She says she has been waiting for someone to write this down for her.',
      ],
    },
    comfortBlend: {
      early: [
        'She drinks it at the nurses station and gets back to vitals.',
        'She says it tastes like birthday cake and returns to charting.',
        'She finishes standing, rinses the cup, and drops it in recycling.',
      ],
      mid: [
        'She blinks after the last sip and opens the snack drawer.',
        'Powder sticks to her lip. She licks it and looks hungry already.',
        'She asks who restocks the blend. You do. She nods approval.',
      ],
      late: [
        'She savors the cup with her eyes closed while the hall buzzes around her.',
        'She asks for a second serving "for the drive home."',
        'She pats her middle after the last swallow and sighs happy.',
      ],
    },
    appetiteTonic: {
      early: [
        'She takes the dose between rooms and makes a face at the taste.',
        'She swallows, checks her watch, and moves on.',
        'She asks if it is caffeinated. You say no. She shrugs.',
      ],
      mid: [
        'Heat blooms in her throat and she fans her collar with the dosing card.',
        'She exhales slow and says lunch suddenly matters.',
        'She laughs once, surprised, and heads for the break room.',
      ],
      late: [
        'She grins at the burn and says "do that again tomorrow."',
        'She licks her lips and asks what is on the lunch tray.',
        'She tells you she is useless until she eats and looks pleased about it.',
      ],
    },
    recoveryShake: {
      early: [
        'She drinks it between tasks and wipes the straw clean.',
        'She says it is good cold and finishes it on the walk to room four.',
        'She notes the flavor on a sticky note for inventory.',
      ],
      mid: [
        'She holds the cup with both hands until the last ice rattles.',
        'She drinks slow and stares at the wall like she is somewhere softer.',
        'She asks for another straw because the first one bent.',
      ],
      late: [
        'She drains it in the break room and does not move for a full minute.',
        'She sets the empty cup down and rubs her belly in slow circles.',
        'She says she could nap right here and you believe her.',
      ],
    },
    arcScene: {
      early: ['She stays after her shift without being asked.'],
      mid: ['She closes the door and tells you she has been thinking about food all day.'],
      late: ['She sits, belly forward, and says she is ready for the next beat.'],
    },
  },
};

export function getInteractionBanter(character, actionId) {
  const attitude = getAttitudeKey(character);
  const tier = tierFromAttitude(attitude);
  const type = character.type === 'patient' ? 'patient' : 'staff';
  const actionPool = BANTER[type]?.[actionId];
  if (!actionPool) return '';
  if (Array.isArray(actionPool)) return pickLine(character, actionPool);
  return pickLine(character, actionPool[tier] || actionPool.mid || actionPool.late || []);
}
