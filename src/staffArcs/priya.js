import { scene } from './shared.js';

/** Priya Shah. Routes: scale (private weigh-ins), published (her body as data), lovers (roleplay and devotion). */
export const PRIYA_ARC = {
  0: scene(
    (ctx) => {
      const honest = ctx.flags.has('priya_honest');
      const priv = ctx.flags.has('priya_private');
      if (priv) {
        return `The exam room at the end of the hall is Priya's after hours. You find her there with the door cracked, sitting on the paper-lined table in her lab coat, a chart balanced on her knee. The scale in the corner still reads a number from earlier.\n\n"I weigh myself between patients now," she says without looking up. "For science." She taps the pen against the chart, and the coat pulls tight across her lap where it used to hang loose. "The trend line is very clear."\n\nShe finally meets your eyes, calm and clinical and a little flushed. "Come see the data before you decide anything."`;
      }
      if (honest) {
        return `Priya is at the nurses' station after close, lab coat open over scrubs that fit closer than they did last quarter. A half-eaten protein plate sits beside her keyboard, and she is adding to a note when you walk up.\n\n"I told you I would be honest in my charting," she says. "So I am charting myself." She turns the monitor toward you: appetite, intake, mood, weight. Her own name at the top. "Turns out I run better fed. The evidence is embarrassing and undeniable."\n\nShe forks another bite while you read, unhurried, watching your face.`;
      }
      return `The clinic has emptied out, but the light in Priya's exam room is still on. You find her perched on the edge of the table in her lab coat, one button straining, a takeout container open on the counter beside a fresh chart.\n\n"I stayed to finish notes," she says, though the notes look done and the food does not. She sets the container on her knee and eats with the same precision she brings to a suture. "Sit. I have a hypothesis and I need a witness."\n\nThe lab coat gaps where it no longer meets. She does not fix it.`;
    },
    [
      {
        id: 'read_the_chart',
        label: 'Look at the numbers she is tracking on herself',
        hint: 'Clinical honesty, curiosity',
        setsFlags: ['priya_honest'],
        outcome: `You lean in and read the columns. Priya narrates them like grand rounds: intake up, energy up, patience with difficult patients up, waistband down a size. She underlines the last row with her nail. "I am the study and the author," she says, pleased with the symmetry.\n\nShe closes the chart and rests it on her stomach, which has more give to it than the coat wants to admit. "Come back tomorrow. I take a fresh reading in the morning, before food skews it."`,
        effects: { trust: 0.45, openness: 4, indulgence: 2, appetite: 0.14 },
      },
      {
        id: 'the_scale',
        label: 'Ask her about the weigh-ins',
        hint: 'Private ritual',
        setsFlags: ['priya_private', 'priya_scale_route'],
        outcome: `Priya slides off the table and steps onto the scale without ceremony. The number is higher than last week and she says it out loud, steady, like a reading she is proud to report. "I stopped flinching at it around June," she says. "Now I look forward to Fridays."\n\nShe steps down and the coat swings open over her rounding middle. "Weigh me next time," she says. "I trust the number more when someone else reads it. Keeps me honest."`,
        effects: { trust: 0.5, openness: 5, indulgence: 2.5, weight: 0.2 },
      },
      {
        id: 'share_the_food',
        label: 'Pull up a chair and eat with her',
        hint: 'Warmth, shared appetite',
        setsFlags: ['priya_honest'],
        outcome: `You drag the stool over and she splits the container without being asked, giving you the smaller half. Priya eats and talks, about a patient who thanked her, about the coat she ordered a size up, about how she used to skip lunch and call it discipline.\n\n"That was a bad protocol," she says, licking sauce off her thumb. "I have revised it." She finishes both her half and the corner of yours. "Same table tomorrow. Bring an appetite. I hate eating alone and I have decided to stop pretending otherwise."`,
        effects: { trust: 0.45, indulgence: 3, weight: 0.35, weeklyMomentum: 0.55, openness: 3 },
      },
      {
        id: 'clinical_boundary',
        label: 'Remind her the exam room is for patients',
        hint: 'Boundaries first',
        setsFlags: ['priya_private'],
        outcome: `Priya sets the container down and folds her hands, every inch the composed clinician. "Noted," she says. "The room is for care. I am a person receiving care. I have decided that counts." She is not defiant, only certain.\n\nShe walks you to the door with a hand at the small of your back. "You will come around," she says. "The data usually convinces people eventually." At the threshold the coat gaps again, and she catches you noticing, and she smiles.`,
        effects: { trust: 0.25, openness: 2, appetite: 0.1 },
      },
    ],
  ),

  1: scene(
    (ctx) => {
      const scale = ctx.flags.has('priya_scale_route');
      const honest = ctx.flags.has('priya_honest');
      let base = `You catch Priya in the supply room wrestling with a fresh lab coat, the old one already peeled off and draped over a shelf. She holds the new one up to the light and reads the tag with a scientist's frown.\n\n"I sized up in spring," she says. "This one arrived and it already argues with me across the chest." She shrugs it on to prove the point. The lapels refuse to meet.`;
      if (scale) {
        base += `\n\n"Friday's number explains it," she says, patting the front where the buttonhole strains. "I told you the trend line was honest." She turns so you can see the whole shape of it.`;
      } else if (honest) {
        base += `\n\n"Growth is data too," she says, tugging the front and watching it spring back open. "I am not going to pretend I didn't cause it."`;
      } else {
        base += `\n\nShe exhales and lets the coat hang open. "Can you approve a bigger order? Two sizes. I would rather overshoot than keep doing this quarterly."`;
      }
      return base;
    },
    [
      {
        id: 'order_up',
        label: 'Approve two sizes up on the spot',
        hint: 'Practical, generous',
        setsFlags: ['priya_honest'],
        outcome: `You submit the order from the supply room tablet. Priya reads the confirmation over your shoulder and her posture loosens, the relief plain. She folds the losing coat and sets it on the donation pile. "Someone leaner can have my old protocol," she says.\n\nShe keeps the new one on, unbuttoned, and it suits her. "Thank you for not making it a negotiation," she says, squeezing your forearm and letting her hand linger a beat past professional.`,
        effects: { trust: 0.5, openness: 4, indulgence: 2, weight: 0.2 },
      },
      {
        id: 'weigh_her',
        label: 'Offer to be the one who reads her weekly number',
        hint: 'Private weigh-ins',
        requires: { flags: ['priya_scale_route'] },
        setsFlags: ['priya_private'],
        outcome: `Priya walks you to the scale like she has been waiting to be asked. She steps up, hands the chart to you, and looks at the wall while you read the number aloud. It is higher than last week. She smiles at the wall.\n\n"Log it," she says. "Initial it. I want it in my handwriting and yours." You do. She steps down and stands close, the new coat straining between you. "Fridays are ours now," she says. "I keep my promises to the data."`,
        effects: { trust: 0.55, openness: 6, indulgence: 3, weight: 0.3, weeklyMomentum: 0.5 },
      },
      {
        id: 'coat_strain_praise',
        label: 'Tell her the coat losing the fight is a good look',
        hint: 'Flirtation',
        requires: { flags: ['priya_honest'] },
        setsFlags: ['priya_flirt'],
        outcome: `Priya goes still, then laughs low in her throat. She smooths both hands down the straining front, deliberately, so you watch the fabric give. "You are supposed to be objective," she says. "That was not objective."\n\nShe steps closer, coat gaping, and lowers her voice. "Say it in the exam room next time," she says. "Where I can pretend to take notes." She hands you the too-small coat like a dare and walks out before you can answer.`,
        effects: { trust: 0.5, openness: 5, indulgence: 3.5, weight: 0.25 },
      },
      {
        id: 'document_growth',
        label: 'Suggest she photograph the fit for her own records',
        hint: 'Data as pride',
        outcome: `Priya considers it, then hands you her phone. "Clinical documentation," she says, deadpan, and poses in the coat that will not close, one hand flat on her rounding stomach. She reviews the photo, zooms in on the strained button, and nods like a positive result.\n\nShe starts a folder labeled with a date and a body weight. "A before," she says, "implies an after." She looks at you when she says after, and there is a plan behind it.`,
        effects: { trust: 0.4, openness: 5, indulgence: 2.5, weight: 0.2, weeklyMomentum: 0.4 },
      },
    ],
  ),

  2: scene(
    (ctx) => {
      const flirt = ctx.flags.has('priya_flirt');
      const scale = ctx.flags.has('priya_scale_route');
      let base = `You find Priya charting at the standing desk she raised too high on purpose, so she has to reach and the coat rides up over the swell of her belly. A resident asks her a question and she answers it perfectly while eating a pastry with her other hand.\n\nWhen the resident leaves she leans back against the counter and blows out a breath. "I ate breakfast," she says. "A real one. And I am hungry again and it is barely ten."`;
      if (flirt) {
        base += `\n\nShe watches your mouth. "I used to call that a symptom," she says, quieter. "Now I call it an appetite and I let it win. Tell me that isn't your influence on the study."`;
      } else if (scale) {
        base += `\n\n"The Friday numbers keep climbing," she says, resting a hand on her middle. "I stopped being surprised. Now I chart the appetite that gets me there. It is a cleaner metric than willpower."`;
      } else {
        base += `\n\n"Is it unprofessional," she says, "to admit I eat better than I used to and I have no intention of stopping?"`;
      }
      return base;
    },
    [
      {
        id: 'appetite_is_data',
        label: 'Tell her appetite is a vital sign, not a flaw',
        hint: 'Clinical honesty',
        setsFlags: ['priya_honest'],
        outcome: `Priya writes it down verbatim, appetite as a vital sign, and stars it. "That is going in the paper," she says. She finishes the pastry and licks her fingers one at a time while she reads the line back.\n\n"I spent years teaching patients not to fear their hunger," she says. "It is humbling to take my own advice." She pats her stomach, which agrees with the advice visibly. "Bring me the ten o'clock pastry from now on. Consider it a co-authorship."`,
        effects: { trust: 0.45, openness: 4, indulgence: 3, weeklyMomentum: 0.6 },
      },
      {
        id: 'feed_the_hunger',
        label: 'Go get her a second breakfast and stay while she eats',
        hint: 'Feeding, care',
        setsFlags: ['priya_honest'],
        outcome: `You come back with a loaded tray and she clears the desk for it. Priya eats without hiding, narrating flavor like clinical findings, offering you nothing until the end when she gives you the last bite off her fork. The coat has given up on the top button entirely.\n\n"I feel better fed and I do the job better fed," she says, hand resting on the fullness. "Every study needs a control. Poor thing." She pats her belly like a colleague she has bested. "Come feed the ten o'clock. It is load-bearing now."`,
        effects: { trust: 0.5, indulgence: 3.5, weight: 0.45, appetite: 0.18, weeklyMomentum: 0.5 },
      },
      {
        id: 'weigh_and_note',
        label: 'Walk her to the scale and log the mid-week number',
        hint: 'Private weigh-ins',
        requires: { flags: ['priya_scale_route'] },
        setsFlags: ['priya_private'],
        outcome: `She lets you steer her to the exam room mid-shift, coat flapping. Priya steps up, you read, she smiles at the number that is up again before Friday even arrives. "The appetite is ahead of schedule," she says, delighted by her own findings.\n\nShe takes the pen and adds a note beside your initials: intake exceeding projection, no complaints from subject. Her hand rests on yours over the chart. "I like being measured by you," she says plainly. "It makes the number feel like a gift instead of a verdict."`,
        effects: { trust: 0.55, openness: 6, indulgence: 3, weight: 0.4, weeklyMomentum: 0.65 },
      },
      {
        id: 'exam_room_flirt',
        label: 'Rest a hand on her middle and tell her to let it win',
        hint: 'Sensual, consenting',
        requires: { flags: ['priya_flirt'] },
        outcome: `You lay your palm on the curve where the coat has surrendered. Priya inhales through her nose, spine straight, professional mask cracking at the eyes. "That is not in the protocol," she murmurs, and does not step back.\n\n"Let it win," you say. She nods once, precise. "Recommendation accepted," she says, voice thin. That night she texts you a photo of a cleared plate and a single line: subject complied enthusiastically. She books the exam room for after close and tells you to bring your findings.`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.55, openness: 6, weeklyMomentum: 0.75 },
      },
    ],
  ),

  3: scene(
    (ctx) => {
      const flirt = ctx.flags.has('priya_flirt');
      const scale = ctx.flags.has('priya_scale_route');
      const honest = ctx.flags.has('priya_honest');
      if (flirt) {
        return `Priya has the exam room booked and dimmed, the paper on the table smoothed fresh. She is in her lab coat over nothing much, chart in hand, and she gestures you to the door like a physician receiving a patient.\n\n"Here is the frame," she says, all business. "You are the doctor. I am the patient who cannot stop gaining and wants to be examined about it. We stop the second either of us says stop. Agreed?" She waits for your real answer before her eyes go warm.\n\n"Good," she says when you agree. "Then examine me. Start with how much heavier I got this week and do not be gentle about the findings."`;
      }
      if (scale) {
        return `It is Friday and the exam room is yours. Priya is already on the scale when you arrive, coat open, waiting on your reading like a verdict she wants to hear.\n\n"Biggest number yet," she says before you speak, and there is pride in it, and something more nervous underneath. "I have been eating like I mean it. For the study. For me." She steps down and faces you. "I need to know if watching the number climb is something you want, not just something you allow. Be honest. I built my whole method on honest."`;
      }
      return `Near close, Priya finds you with a bakery box under one arm and a printed draft under the other, the coat straining as she carries both.\n\n"I want to show you something and I need you alone to do it," she says. She sets the draft down: a wellness paper, her own weight curve the boldest line, her name and her data braided together. "I have been thinking about publishing myself. Literally. My body as the figure." She shifts her weight. "I need to know if that horrifies you before I submit it."`;
    },
    [
      {
        id: 'examine_her',
        label: 'Play the doctor and examine her, gently and thoroughly',
        hint: 'Roleplay with consent',
        requires: { flags: ['priya_flirt'] },
        setsFlags: ['priya_lovers'],
        outcome: `You take the chart and the role. Priya answers your questions in a low, obedient voice, reporting every pound, guiding your hands to the soft new places and naming them for the record. She calls it thorough. She calls it the best care she has had. When you note aloud how much she has grown she shivers and says "again, for the chart."\n\nAfter, she keeps the coat on and lies back on the crinkling paper, your hand on her belly, both of you laughing at the absurd tenderness of it. "Same appointment next week," she says. "I intend to have new findings for you." She threads her fingers through yours. This is not roleplay, the way she holds on.`,
        effects: { trust: 0.65, indulgence: 6, weight: 0.85, openness: 7, weeklyMomentum: 0.9 },
      },
      {
        id: 'want_the_climb',
        label: 'Tell her you want to watch the number climb, all of it',
        hint: 'Honest desire',
        requires: { flags: ['priya_scale_route'] },
        setsFlags: ['priya_lovers', 'priya_private'],
        outcome: `You say it plainly, that you want it, not tolerate it, want it. Priya's clinical face collapses into something younger and brighter. She steps back onto the scale just to feel you read her again, and this time your hand stays on her hip while you do.\n\n"Then we make it a protocol," she says, breathless. "You read me every Friday. I eat like the study depends on it. It does." She pulls your palm flat against her stomach. "I am going to get so much heavier with you keeping the record," she says. "Log that too." You believe her. She makes sure of it.`,
        effects: { trust: 0.6, indulgence: 5.5, weight: 0.8, openness: 7, weeklyMomentum: 0.85 },
      },
      {
        id: 'back_the_paper',
        label: 'Tell her to publish it, body and all',
        hint: 'Her data, her pride',
        setsFlags: ['priya_honest'],
        outcome: `You read the draft and tell her the figure is the strongest thing in it. Priya exhales like she had been holding the breath for a week. "You are certain," she says, and you are, and she believes you because you have never lied to her about the numbers.\n\nShe opens the bakery box to celebrate the decision and eats a whole eclair standing over the manuscript. "I am going to be a footnote and a figure and an author," she says, cream at the corner of her mouth. "Sign the co-author line. I want your name next to what my body proved." She hands you the pen and her whole guarded heart with it.`,
        effects: { trust: 0.55, openness: 6, indulgence: 4, weight: 0.4, reputation: 1, weeklyMomentum: 0.65 },
      },
      {
        id: 'steady_pace',
        label: 'Tell her you are in, at whatever pace keeps her well',
        hint: 'Grounded care',
        outcome: `Priya listens, and the relief and a little disappointment move across her face at once. "Well is the whole point," she says. "I chart it so it stays well." She squeezes your hand. "But I am still growing. That part is not slowing down. I have made peace with it. More than peace."\n\nShe eats one pastry instead of three and texts you a mirror photo at eleven anyway, coat open, hand on her belly, captioned steady and rising. You save it before you can talk yourself out of it.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2.5, weight: 0.25 },
      },
    ],
  ),

  4: scene(
    (ctx) => {
      const lovers = ctx.flags.has('priya_lovers');
      const honest = ctx.flags.has('priya_honest');
      const scale = ctx.flags.has('priya_scale_route');
      if (lovers) {
        return `The clinic is dark and the exam room is warm. Priya has locked it from the inside, laid out a spread on the counter, and waits on the paper-lined table in her lab coat with the chart on her lap and nothing clinical in her eyes.\n\n"Final appointment of the day," she says, patting the space beside her. She spreads her knees to make room for her belly, which sits proud and heavy and hers. "I want you to feed me until the coat gives up entirely, read me one more number, and then tell me what we are after this. I already know my answer. I charted it."`;
      }
      if (honest) {
        return `Priya meets you with the published paper in a real journal and a box of celebratory pastries balanced on top. Her curve is the headline figure. Your name is on the co-author line.\n\n"It is out," she says, tapping the page where her own weight climbs across the axis. "Staff wellness, appetite as a vital sign, subject and author the same person. Priya co-signed nothing this time. I signed everything." She opens the box. "Celebrate the finding with me, or write the honest footnote about how it happened. Either way I am eating the whole box."`;
      }
      if (scale) {
        return `Friday, after close, the exam room lit low. Priya is on the scale in her lab coat when you arrive, and the number under her feet is the biggest yet, and she is grinning at it like a result she earned.\n\n"Read it," she says. "One more for the record before we decide what this is." She steps down and the coat swings wide over her fuller frame. A meal is already laid out on the counter, portioned like she means to make next week's number bigger.`;
      }
      return `The building is empty except for the exam room light. Priya has a spread on the counter and two chairs pulled close, coat open over scrubs that fit like a suggestion now.\n\n"I stayed to eat and I refuse to do it alone," she says, waving you in. "Sit. I have decided this is the most sustainable protocol I have ever designed." The portions are generous. The clock says eleven twenty.`;
    },
    [
      {
        id: 'feed_and_stay',
        label: 'Feed her until the coat gives up, then stay',
        hint: 'Devotion',
        requires: { flags: ['priya_lovers'] },
        outcome: `You feed her bite by bite while she reports every sensation like a devoted researcher, until the last button surrenders and the coat falls open for good. Priya moans low, one hand guiding yours over the swell, the other keeping loose track of the empty plates. "The subject is very full," she whispers. "The subject is very happy."\n\nYou read her one final number off the scale and she makes you initial it, then pulls you down onto the paper beside her. "Stay," she says, heavy and glowing and certain. "You are not a variable anymore. You are the method." She falls asleep in the coat, in your arms, in the number she is proud of.`,
        effects: { trust: 0.7, indulgence: 7, weight: 1.1, openness: 7, weeklyMomentum: 1 },
      },
      {
        id: 'publish_and_cosign',
        label: 'Co-sign the paper and eat the celebration box with her',
        hint: 'Her body as data, published',
        requires: { flags: ['priya_honest'] },
        setsFlags: ['priya_published'],
        outcome: `You add your name beside hers where the ink is still drying and she eats two pastries watching you do it. The staff read it Monday and line up to start their own honest charts. Priya's curve is the boldest line in the building, pinned on the break room wall by her own hand.\n\n"Honest data," she tells everyone who asks, one palm on the belly that proved it, no flinch left in her at all. To you, quieter, she says, "Peer review of one. You approve." She kisses your cheek over the open box and reaches for a third.`,
        effects: { trust: 0.55, reputation: 2, indulgence: 4, weight: 0.5, openness: 5 },
      },
      {
        id: 'final_reading',
        label: 'Read her biggest number and commit to the ritual',
        hint: 'Private weigh-ins, ongoing',
        requires: { flags: ['priya_scale_route'] },
        setsFlags: ['priya_private'],
        outcome: `You read the number aloud and it is a personal best and she owns it without a flinch. Priya steps off the scale and hands you the chart for good, all its Fridays in two sets of initials. "Keep the record permanently," she says. "I want a witness for every pound of this."\n\nShe eats the counter spread while you log it, unhurried, planning next week out loud. The Friday reading becomes standing law. Her curve climbs steady down the column, and every entry ends the same way, in your handwriting and hers, agreed.`,
        effects: { trust: 0.55, indulgence: 4, weight: 0.7, openness: 5, weeklyMomentum: 0.8 },
      },
      {
        id: 'fund_the_study',
        label: 'Approve a permanent staff wellness and meal budget',
        hint: 'Make it institutional',
        outcome: `Priya watches you add the line item and sits back, satisfied in the way a good result satisfies. "Now the protocol outlives me," she says, and eats through the spread while the file saves. "Every fed body in this clinic is a data point now. Mine is just the boldest."\n\nThe budget makes the late spreads standing policy. Priya's frame keeps rounding out under the open coat, and she thanks you with a look every single time she sits down to a full plate. "Sustainable," she says, patting her middle. "I told you it would be."`,
        effects: { trust: 0.5, indulgence: 4, money: -80, weight: 0.6, weeklyMomentum: 0.75 },
      },
    ],
  ),
};
