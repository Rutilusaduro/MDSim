/** Interactive staff arc scenes: opening prose + player choices with outcomes. */

function scene(opening, choices) {
  return { opening, choices };
}

export const STAFF_ARC_SCENES = {
  'Maya Okafor': {
    0: scene(
      `The clinic lights are half off. Maya is still in scrubs at the break table, a foil tray open in front of her. She looks up when you walk in and does not move the fork.\n\n"Inventory said these were expired," she says, chewing. "I agreed with them." She nudges the second chair with her foot. The food smells better than it should after a twelve-hour day.`,
      [
        {
          id: 'share_tray',
          label: 'Sit down and eat with her',
          outcome: `You eat standing at first, then sitting. Maya talks about a patient who cried over a heated blanket, then about her sister's wedding, then about nothing in particular. The chicken is cold. You finish your half anyway. When you get up to leave she says, "Thursday?" like you already said yes.`,
          effects: { trust: 0.45, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.5 },
        },
        {
          id: 'coffee_only',
          label: 'Bring coffee and let her eat',
          outcome: `You brew a pot and set a mug beside her tray. Maya thanks you without looking up. She eats slower when she is not performing for an audience. When the tray is empty she washes both forks in the sink and leaves one on your desk with a sticky note that says, "You forgot to eat again."`,
          effects: { trust: 0.35, openness: 3, indulgence: 1.5 },
        },
        {
          id: 'policy_talk',
          label: 'Remind her about the break-room policy',
          outcome: `Maya listens with her fork in the air. "Policy says twelve hours on your feet," she says. "Policy does not say what to do after." She covers the tray and puts it in the fridge with your name on it. She is not angry. She is tired in a way that makes you check the schedule for next week.`,
          effects: { trust: 0.15, openness: 2, appetite: 0.1 },
        },
      ],
    ),
    1: scene(
      `Maya catches you in the locker hallway with a spare uniform bunched in her hands. She holds it up. The tag says her size from six months ago.\n\n"It fit in March," she says. She steps in front of the mirror and pulls the top on. It stops halfway over her chest. She exhales and looks at you in the reflection. "I need the next size. Can you order it before Friday?"`,
      [
        {
          id: 'order_now',
          label: 'Order two sizes up before she finishes talking',
          outcome: `You pull out your phone and place the order in the hallway. Maya watches the confirmation screen and her shoulders drop. She folds the old scrubs into her bag without shame. "I'll donate them," she says. "Someone starting out can use them." She squeezes your arm once and goes back to rounds in the top that still fits.`,
          effects: { trust: 0.5, openness: 4, indulgence: 1.5 },
        },
        {
          id: 'try_stretch',
          label: 'Suggest the stretch-fit line first',
          outcome: `You show her the catalog on the tablet. Maya scrolls, lips pressed together. "Stretch-fit lasts a month if I'm lucky," she says, but she picks two colors anyway. At checkout she adds, "Get the regular cut too. I have a feeling." She is right by the end of the month.`,
          effects: { trust: 0.3, indulgence: 2, weight: 0.25, weeklyMomentum: 0.4 },
        },
        {
          id: 'staff_photo',
          label: 'Offer to take a fit photo for the vendor',
          outcome: `Maya blinks, then laughs. "Clinical documentation," she says, and poses with the half-on top. The photo goes to the vendor and to the staff board by accident. Elena puts a heart sticker on it. Maya pretends to be mad and eats a larger lunch than usual. The new scrubs arrive in three days.`,
          effects: { trust: 0.4, openness: 5, indulgence: 3, weight: 0.2 },
        },
      ],
    ),
    2: scene(
      `You find Maya between rooms with a clipboard against her stomach, reading vitals slower than she used to. Her scrubs fit the new size but they are already pulling at the hip when she turns.\n\nA patient in the hall says, "You look comfortable," and Maya's ears go pink. After the patient leaves she leans on the counter. "I used to rush through rounds hungry," she says. "Now I eat breakfast and I still want lunch by ten. Is that bad?"`,
      [
        {
          id: 'normalize',
          label: 'Tell her the clinic runs on full stomachs',
          outcome: `You walk her to the break room and point at the schedule: catered lunch on Thursday, snack budget up again. Maya reads it twice. "So I'm not the only one," she says. She finishes a yogurt cup while standing and does the next three rooms with color in her face. A patient asks for her name to request her next visit.`,
          effects: { trust: 0.45, openness: 4, indulgence: 2.5, weeklyMomentum: 0.6 },
        },
        {
          id: 'walk_rounds',
          label: 'Walk rounds with her this afternoon',
          outcome: `You carry the clipboard for one hall. Maya talks patients through their comfort plans and steals a granola bar from her pocket between doors. She offers you half without thinking. By the last room she is breathing heavier and her scrubs have ridden up at the waist. She does not fix them until you are alone.`,
          effects: { trust: 0.5, weight: 0.3, indulgence: 2, appetite: 0.15 },
        },
        {
          id: 'chart_note',
          label: 'Ask her to log how hunger affects her work',
          outcome: `Maya pulls up her own chart and adds a note: appetite up, mood stable, rounds slower but warmer. She shows you the screen. "Evidence," she says. She saves it where Priya can see. At five o'clock Priya leaves a pastry on her locker with no note. Maya eats it in the car and texts you a thumbs up.`,
          effects: { trust: 0.35, openness: 5, indulgence: 1.5, weeklyMomentum: 0.35 },
        },
      ],
    ),
    3: scene(
      `The building is empty except for your office light and the break room. Maya has two trays open and a third balanced on the chair arm. She waves you in with a plastic fork.\n\n"Overtime hazard," she says. "Sit. I saved you the mac and cheese before Elena gets to it tomorrow." The portions are generous. The clock on the wall says eleven fourteen.`,
      [
        {
          id: 'feast',
          label: 'Stay for the full late dinner',
          outcome: `You eat until the trays are flat. Maya tells stories about nursing school, about the first week here, about how she used to skip dinner to look professional. She clears the table and loads the dishwasher while you lock up. At the door she says, "I like that we don't pretend anymore." Her scrubs are tight at the waist. She does not tug them down.`,
          effects: { trust: 0.55, indulgence: 4, weight: 0.65, weeklyMomentum: 0.8, openness: 4 },
        },
        {
          id: 'take_half',
          label: 'Take one plate and send the rest home with her',
          outcome: `Maya packs the extra tray in a bag with your name on the sticky note. "Breakfast," she says. You split the mac at your desk while finishing charts. Maya texts a photo of her empty passenger seat with the second tray buckled in. The caption is just a smiley face. You both eat too much and sleep well.`,
          effects: { trust: 0.4, indulgence: 3, weight: 0.45, appetite: 0.12 },
        },
        {
          id: 'schedule_fix',
          label: 'Promise to fix the overtime meal budget',
          outcome: `You open the budget tab on the spot. Maya watches the numbers move and steals a dinner roll while she waits. "If this sticks, I'm taking you to that diner on Maple," she says. You save the line item. She finishes one tray, saves the other, and clocks out humming. The diner becomes a standing Thursday thing within a month.`,
          effects: { trust: 0.45, openness: 3, money: -60, indulgence: 2 },
        },
      ],
    ),
  },

  'Elena Ruiz': {
    0: scene(
      `The lobby candy bowl is empty at nine fifteen. At nine twenty Elena refills it from a bag in her drawer. By eleven she refills it again.\n\n"The morning rush," she says when you raise an eyebrow. Her fingers are dusted with sugar. She licks one, notices you watching, and keeps typing check-ins with the other hand. "Patients like it. Reputation likes it. I like it."`,
      [
        {
          id: 'upgrade_bowl',
          label: 'Order a bigger bowl and better candy',
          outcome: `The new bowl arrives Wednesday, ceramic and heavy. Elena fills it with chocolate that does not melt in the heat. Patients linger at the desk longer. Elena eats two pieces for every ten she pours out. Her laugh carries further down the hall. You find wrappers in the recycling with her pen marks on the labels.`,
          effects: { trust: 0.4, indulgence: 3, reputation: 1, weight: 0.3 },
        },
        {
          id: 'join_refill',
          label: 'Help her refill between patients',
          outcome: `You pour while Elena stamps forms. She hands you a piece without looking. "Quality control," she says. The lobby smells like vanilla for the rest of the day. A patient asks if you always work the desk together. Elena says, "Only when the good candy is in." She means it as a joke. She also means it.`,
          effects: { trust: 0.45, openness: 4, indulgence: 2.5, weight: 0.25 },
        },
        {
          id: 'track_cost',
          label: 'Add candy to the supply budget openly',
          outcome: `Elena prints the new budget line and tapes it inside her drawer. "Now it's official," she tells the next patient, who laughs. She still buys extra with her own money sometimes. You see the receipt and reimburse her before she asks. She brings donuts the following Monday. The bowl never stays full past two.`,
          effects: { trust: 0.35, money: -45, indulgence: 2, openness: 3 },
        },
      ],
    ),
    1: scene(
      `The new desk chair creaks when Elena sits. She shifts, sits again, and the creak gets louder. She grins up at you.\n\n"Product testing," she says. "Tell the warranty people I am doing them a favor." The arms dig into her hips. She does not ask for a different chair. She spins once, full circle, and the chair holds.`,
      [
        {
          id: 'wide_chair',
          label: 'Order the wide-seat model today',
          outcome: `The chair arrives Friday. Elena builds it with a patient watching. When she sits the creak is gone. She spins again, slower, and pats the armrests. "Room to grow," she says to the patient, who giggles. Elena eats her lunch at the desk without getting up for an hour. The old chair goes to the break room with a sign that says, "Still good."`,
          effects: { trust: 0.45, indulgence: 2.5, weight: 0.3, openness: 3 },
        },
        {
          id: 'live_with_it',
          label: 'Tell her to ask when she is ready for a swap',
          outcome: `Elena nods and keeps the creaking chair. She pads the seat with a folded blanket by Tuesday. By Thursday she stops mentioning it. The creak becomes part of the lobby soundtrack. Patients recognize it when she stands. She winks at you when it happens and unwraps another candy.`,
          effects: { trust: 0.25, indulgence: 3, weight: 0.35, weeklyMomentum: 0.4 },
        },
        {
          id: 'desk_selfie',
          label: 'Let her post the creak on the clinic social',
          outcome: `Elena films the chair creak and adds a caption about honest furniture. Comments roll in from patients. Three book appointments off the post. Elena reads them aloud while eating trail mix from her drawer. "Marketing," she says. You approve the spend. She gains two pounds and a dozen new regulars.`,
          effects: { trust: 0.4, reputation: 2, indulgence: 3.5, weight: 0.4, openness: 4 },
        },
      ],
    ),
    2: scene(
      `Elena greets a patient with a bright smile and a faint smear of pastry at the corner of her mouth. The desk barely clears her hips when she leans forward to slide a form across.\n\n"Feels smaller every week," she says after the patient leaves. She does not sound upset. She presses her palms on the desktop and tests the fit. "I could switch to the side desk. I like this one better."`,
      [
        {
          id: 'keep_desk',
          label: 'Keep her on the main desk and widen the space',
          outcome: `You move the printer and add a footrest. Elena tests the new layout between calls. Her hips clear the edge with an inch to spare. She eats a croissant while on hold and crumbs fall on the keyboard. She brushes them off without apology. Patients say the desk feels friendlier. Elena says the desk feels honest.`,
          effects: { trust: 0.5, indulgence: 3, openness: 4, weight: 0.25 },
        },
        {
          id: 'standing_mat',
          label: 'Add a standing mat and longer breaks',
          outcome: `Elena stands through the morning rush and sits for paperwork. She switches every hour on the timer you set. Her legs ache less. Her appetite goes up with the movement. She eats two lunches, one standing at the counter, one sitting in the break room. She thanks you on the way out with a bag of candy for your office.`,
          effects: { trust: 0.35, appetite: 0.2, indulgence: 2.5, weeklyMomentum: 0.5 },
        },
        {
          id: 'uniform_fitting',
          label: 'Schedule a uniform fitting for front desk staff',
          outcome: `The tailor visits on a slow afternoon. Elena gets measured in the back office and talks the whole time. New blouses arrive with extra room at the hip. She models the first one in the lobby. Patients clap. She blushes and does a small turn. Sales go up on comfort plans that week. She keeps the old blouse in her drawer "for motivation."`,
          effects: { trust: 0.45, openness: 5, indulgence: 2, weight: 0.3 },
        },
      ],
    ),
    3: scene(
      `Someone brought a ring light for staff photos. Elena is at the front desk in a fresh blouse, hands on her hips, belly forward without posing hard.\n\n"Post it," she says before you take the shot. "Patients book faster when they know who greets them." The photo catches her grin and the curve at her waist. She checks the preview and nods once. "Honest advertising."`,
      [
        {
          id: 'post_it',
          label: 'Post the photo on the clinic page',
          outcome: `The photo goes live at four. Bookings tick up before dinner. Elena refreshes the page on her phone between patients and eats celebratory cookies from the bowl. A comment says she looks approachable. She screenshots it and tapes it inside her drawer. "Best review we got all month," she tells you.`,
          effects: { trust: 0.5, reputation: 3, indulgence: 3, openness: 4, weight: 0.2 },
        },
        {
          id: 'crop_first',
          label: 'Crop it waist-up and ask her approval',
          outcome: `You crop and show Elena the options. She picks the one that still shows her hands on her hips. "Don't hide it," she says. "That's the point." The post does well. She stands taller at the desk for a week. Patients mention the photo in person. Elena gives them extra candy and logs the names for follow-up.`,
          effects: { trust: 0.45, reputation: 2, openness: 5, indulgence: 2.5 },
        },
        {
          id: 'series',
          label: 'Shoot a whole staff series with her directing',
          outcome: `Elena lines up Maya, Priya, and Jasmine after close. She adjusts collars and tells everyone where to put their hands. Her own shot is last. She eats pizza between takes and wipes her hands on a napkin before each click. The series launches Friday. Elena tracks the numbers on a sticky note wall. Every face looks fed and real.`,
          effects: { trust: 0.55, reputation: 2, indulgence: 4, weight: 0.5, money: -80 },
        },
      ],
    ),
  },

  'Priya Shah': {
    0: scene(
      `Priya turns her laptop toward you in the charting nook. Her own patient file is open. A new note reads: appetite elevated, sleep improved, mood stable.\n\n"I document everyone else," she says. "I might as well document myself." She taps the save button and watches the timestamp land. "If we're running a comfort clinic, the charts should tell the truth."`,
      [
        {
          id: 'cosign',
          label: 'Co-sign the note as supervising physician',
          outcome: `You add your signature under hers. Priya exhales like she has been holding her breath for a week. She copies the format into a template for staff self-check-ins. Maya fills one out by Friday. Elena draws a smiley face in the margin. Priya eats lunch at her desk while reading them and looks pleased.`,
          effects: { trust: 0.5, openness: 5, indulgence: 1.5, weeklyMomentum: 0.4 },
        },
        {
          id: 'private_copy',
          label: 'Keep it private but praise the honesty',
          outcome: `You tell Priya the note stays between you unless she wants it shared. She locks the screen and nods. "Fair," she says. She still looks lighter. That afternoon she orders the good salad from the place down the street and finishes all of it. She adds a private line to the file anyway: doctor ate full meal, no regret.`,
          effects: { trust: 0.4, indulgence: 2, appetite: 0.15, openness: 3 },
        },
        {
          id: 'research_angle',
          label: 'Ask her to expand it into a staff wellness pilot',
          outcome: `Priya's eyes sharpen. By evening she has a one-page pilot: weekly self-report, optional weigh-in, no shame language. You approve a trial month. Staff sign up except Nadia, who signs up anyway with a joke about spreadsheets. Priya brings muffins to the kickoff. Everyone eats while filling out forms.`,
          effects: { trust: 0.45, openness: 4, indulgence: 2.5, money: -50, weeklyMomentum: 0.5 },
        },
      ],
    ),
    1: scene(
      `Priya's lab coat catches at the hip when she turns from the supply cart. She leaves it open. Under the scrubs, softness shows at her waist and chest when she breathes.\n\nShe catches you looking and does not close the coat. "Better than hiding it," she says. "Patients notice when we lie about our own bodies." She loads syringes with the coat still open.`,
      [
        {
          id: 'new_coat',
          label: 'Order her the next coat size',
          outcome: `The new coat arrives labeled with her name. Priya tries it in the hall and spins once. It closes without pulling. She hangs the old one on a hook labeled "archive." Maya pins a note that says, "Graduation." Priya eats a full dinner that night and texts you a photo of the empty plate.`,
          effects: { trust: 0.45, indulgence: 2, openness: 4, weight: 0.25 },
        },
        {
          id: 'open_policy',
          label: 'Make open coats acceptable in comfort rounds',
          outcome: `You add one line to the dress code: comfort layers allowed when clinically appropriate. Priya reads it aloud in the break room. Elena cheers. Jasmine says her arms finally breathe. Priya does afternoon rounds with the coat open and patients relax faster. Snack requests go up. So do satisfaction scores.`,
          effects: { trust: 0.4, reputation: 1, indulgence: 2.5, openness: 5 },
        },
        {
          id: 'mirror_talk',
          label: 'Talk with her privately about body image',
          outcome: `You meet in your office with the door half closed. Priya talks about medical school and shrinking herself to look credible. She cries once, quickly, and wipes it off. "I'm done with that," she says. She leaves with a wrapped snack you had on your desk. She eats it in the charting nook and waves through the window.`,
          effects: { trust: 0.55, openness: 6, indulgence: 1.5, appetite: 0.1 },
        },
      ],
    ),
    2: scene(
      `Priya finds you near the scale room with her shoes off. "Private weigh-in," she says. "Not for the chart. For me." She steps on. The number rises. She steps off and exhales through her nose.\n\n"Keep going," she says. "I want to see what my body does when nobody stops it." She sits on the bench and looks at her feet. "Tell me if I should stop. I won't listen yet. Just tell me anyway."`,
      [
        {
          id: 'support',
          label: 'Support her and set a monthly check-in',
          outcome: `You schedule a standing fifteen-minute check-in on the last Friday. Priya adds it to both your calendars with a heart emoji she later removes. At the first meeting she brings numbers and questions. You bring water and time. She leaves heavier month by month and more grounded week by week.`,
          effects: { trust: 0.55, openness: 5, indulgence: 3, weeklyMomentum: 0.65, weight: 0.35 },
        },
        {
          id: 'clinic_plan',
          label: 'Fold her goals into the clinic comfort plan',
          outcome: `Priya writes herself the same plan she gives patients: regular meals, rest, no punishment language. She pins it inside her locker. Staff sign initials at the bottom as witnesses. Elena steals a copy for the lobby board. Patients read it and feel less alone. Priya gains steadily and stops apologizing for lunch.`,
          effects: { trust: 0.45, openness: 6, indulgence: 3.5, reputation: 1, weight: 0.3 },
        },
        {
          id: 'slow_down',
          label: 'Gently suggest slowing the pace',
          outcome: `You talk about sustainability. Priya listens with her arms crossed, then uncrosses them. "I'll think about it," she says. She does not slow down this month. She does add a rest day to her own plan next month. She tells you about it like a confession and a victory in the same breath.`,
          effects: { trust: 0.35, openness: 4, indulgence: 2, appetite: 0.08 },
        },
      ],
    ),
    3: scene(
      `Priya slides a draft across your desk: a comfort-care paper with charts, citations, and a photo appendix. The belly in the photo is hers, taken in the break room mirror with her scrub top lifted.\n\n"I want to co-sign," she says. "Real data from a real staff body. Patients deserve to know we live this too." The draft is good. It is also personal.`,
      [
        {
          id: 'cosign_paper',
          label: 'Co-sign and submit to the regional journal',
          outcome: `You read the draft twice and sign. Priya submits before she can change her mind. The journal accepts a shortened version with the photo cropped at the chin. Staff celebrate with cake. Priya eats two slices and takes home the rest. A patient cites the paper in her intake form. Priya frames the acceptance email.`,
          effects: { trust: 0.6, reputation: 4, openness: 5, indulgence: 4, weight: 0.4 },
        },
        {
          id: 'internal_only',
          label: 'Publish internally for patients only',
          outcome: `You print a patient-facing pamphlet with Priya's charts and a gentler photo. It lives in the lobby rack between the candy bowl and the comfort plans. Patients take copies. Staff take copies. Priya autographs one for Elena as a joke. Demand for consults rises. Priya looks tired and proud.`,
          effects: { trust: 0.5, reputation: 2, openness: 5, indulgence: 3, money: -35 },
        },
        {
          id: 'anonymous',
          label: 'Ask her to anonymize the photo',
          outcome: `Priya hesitates, then retakes the photo from the neck down. The paper loses some punch but keeps the data. She still co-signs with you. Maya says she can tell whose belly it is anyway. Priya laughs and does not deny it. She eats a late snack while formatting references and hums to herself.`,
          effects: { trust: 0.45, reputation: 3, indulgence: 2.5, openness: 4 },
        },
      ],
    ),
  },

  'Nadia Volkov': {
    0: scene(
      `Nadia slides a spreadsheet across your desk. One line item tripled: staff snacks. Her pen taps that column. Her other hand rests on her stomach, casual, like the surface is a desk too.\n\n"Staff retention," she says. "Also morale. Also I am hungry by ten." She waits while you scroll. The numbers are high. They are also defensible.`,
      [
        {
          id: 'approve',
          label: 'Approve the full snack budget',
          outcome: `You greenlight the line. Nadia sends the order before you close the file. Trays arrive Thursday. Staff gather like a holiday. Nadia eats while reviewing payroll and does not wipe crumbs off her blouse. "See?" she says. "Investment." Attendance improves. So does the break room noise level.`,
          effects: { trust: 0.45, indulgence: 3, money: -120, weeklyMomentum: 0.5, openness: 3 },
        },
        {
          id: 'half_now',
          label: 'Approve half now with a review in a month',
          outcome: `Nadia negotiates for sixty percent and calls it a win. She schedules the review on your calendar herself. At the review she brings charts showing fewer sick calls. You approve the rest. She nods once, satisfied, and opens a drawer of granola bars she bought with the gap money. "I had a feeling," she says.`,
          effects: { trust: 0.35, indulgence: 2, money: -70, openness: 3 },
        },
        {
          id: 'tie_metric',
          label: 'Tie budget to patient satisfaction scores',
          outcome: `Nadia adds a column for satisfaction and draws a line to snack spend. "When we eat, patients relax," she says. You agree to track it. Scores rise with the trays. Nadia prints the graph and tapes it to the fridge. She eats standing in front of it like a trophy. Staff quote the graph at meetings.`,
          effects: { trust: 0.4, reputation: 2, indulgence: 2.5, money: -90 },
        },
      ],
    ),
    1: scene(
      `You knock on Nadia's office door at lunch. She opens it with a fork still in her hand. Sauce dots her chin. Two takeout containers steam on the desk behind her.\n\n"Come in," she says. "I run a clinic that practices what it sells." She sets a second fork on the spare chair. The chair creaks when you sit. Nadia does not comment on the creak.`,
      [
        {
          id: 'eat_meeting',
          label: 'Eat and run the meeting over lunch',
          outcome: `You review schedules between bites. Nadia takes the spicy container and wins by default. She passes you the bread she saved from the top. Grease gets on the roster. You print a fresh copy. She signs it with a napkin tucked into her collar. "Efficient," she says. You agree.`,
          effects: { trust: 0.5, indulgence: 3.5, weight: 0.45, openness: 4 },
        },
        {
          id: 'budget_only',
          label: 'Decline food but approve her break time',
          outcome: `Nadia shrugs and eats alone while you talk numbers. She still listens. She still wins two arguments. Before you leave she wraps the extra bread in a napkin and puts it in your hand. "For later," she says. You eat it at four without thinking. Nadia smirks when you thank her the next morning.`,
          effects: { trust: 0.35, indulgence: 2, appetite: 0.12, openness: 3 },
        },
        {
          id: 'group_lunch',
          label: 'Turn it into a weekly manager lunch with staff leads',
          outcome: `Nadia invites Maya and Priya next week. The week after, Elena joins. The office becomes a lunch room on Wednesdays. Agendas shorten. Morale rises. Nadia orders enough for four and eats enough for two. Nobody comments. Everyone leaves full.`,
          effects: { trust: 0.45, indulgence: 4, money: -85, weeklyMomentum: 0.6, openness: 5 },
        },
      ],
    ),
    2: scene(
      `Nadia stands at the window reviewing her reflection in the glass. She turns sideways, then faces you.\n\n"Acceptable growth," she mutters to herself. Then louder: "Schedule more catered breaks. I am leading by example." She pats her hip once, hard, like closing a ledger. "Put it on my tab if you have to."`,
      [
        {
          id: 'catered_breaks',
          label: 'Schedule catered breaks every Friday',
          outcome: `Fridays become loud in the break room. Nadia serves herself first and last. Staff linger longer. Patients hear laughter through the wall and smile in the waiting area. Nadia's weight climbs steady. Her spreadsheets still balance. She calls that proof of concept.`,
          effects: { trust: 0.5, indulgence: 4, weight: 0.5, money: -100, weeklyMomentum: 0.7 },
        },
        {
          id: 'mirror_goal',
          label: 'Ask what number she wants on the scale',
          outcome: `Nadia names a number higher than today's. You blink. She shrugs. "If I'm asking staff to be honest, I have to be honest." She writes the target on a sticky note and puts it in her wallet. She checks it after meals like a budget line. She hits it six weeks later and sets a new one.`,
          effects: { trust: 0.45, openness: 5, indulgence: 3, weight: 0.35, weeklyMomentum: 0.55 },
        },
        {
          id: 'public_memo',
          label: 'Issue a memo celebrating comfort leadership',
          outcome: `You draft a short memo praising Nadia's snack policy and break model. She edits it to include her own weight gain as a bullet point. You soften one phrase. She softens zero. Staff read it in the break room. Elena claps. Maya pretends to faint. Patients feel the tone shift toward honesty.`,
          effects: { trust: 0.4, reputation: 2, openness: 6, indulgence: 3 },
        },
      ],
    ),
    3: scene(
      `Staff meeting. Nadia stands at the head of the table with a cake and a revised budget on the projector. The snack line tripled again. Nobody has seen the slide yet.\n\n"Before questions," she says, and cuts a slice for herself, "we're doing this." She eats while the room goes quiet. Then she shows the numbers. They work.`,
      [
        {
          id: 'back_her',
          label: 'Back her publicly in the meeting',
          outcome: `You stand and add your name to the slide. Nadia passes you cake without looking. Staff ask practical questions. Elena asks about the frosting. By the end everyone has a plate. The vote is unnecessary. Nadia licks frosting off her thumb and schedules the first mega-tray order.`,
          effects: { trust: 0.55, indulgence: 4.5, reputation: 2, weight: 0.55, money: -140 },
        },
        {
          id: 'phase_in',
          label: 'Propose a phased rollout',
          outcome: `Nadia frowns, then nods. "Fine. Phase one starts now." She cuts extra slices anyway. Staff leave with to-go boxes. The phased plan lasts two weeks before she marks phase two "early" on the calendar. You do not argue. The numbers still work.`,
          effects: { trust: 0.4, indulgence: 3.5, money: -90, weeklyMomentum: 0.5 },
        },
        {
          id: 'tie_bonus',
          label: 'Link the budget to staff retention bonuses',
          outcome: `Nadia adds a retention column and grins. "Now it's HR official." She eats cake while HR nods. Staff cheer for the wrong reason and the right one. Nadia gets frosting on the budget printout. She scans it anyway. Retention ticks up. So does break room traffic.`,
          effects: { trust: 0.45, indulgence: 4, money: -110, openness: 4, reputation: 1 },
        },
      ],
    ),
  },

  'Jasmine Brooks': {
    0: scene(
      `Jasmine finishes a blood draw and reaches for the staff donut box before she washes her hands. She stops halfway, looks at her gloves, looks at the box.\n\n"Sterile enough," she says, and peels one glove off with her teeth. She offers you the second donut with the hand that is still clean. Powdered sugar on both.`,
      [
        {
          id: 'take_donut',
          label: 'Take the donut and sit with her',
          outcome: `You eat at the counter while Jasmine logs vials. She tells you about a patient who fainted at the sight of a needle and came back with cookies the next week. She eats two donuts to their one. She washes her hands after. "See?" she says. "Still professional."`,
          effects: { trust: 0.45, indulgence: 3, weight: 0.35, openness: 3 },
        },
        {
          id: 'wash_first',
          label: 'Make her wash up, then celebrate',
          outcome: `Jasmine groans and washes thoroughly. You hand her the donut when she is done. She bites half in one go. "Bossy," she says, smiling. She leaves an extra donut on your desk with a glove wrapped around it as a joke. You eat it anyway. She adds a sticker to her log book that says, "reward."`,
          effects: { trust: 0.35, indulgence: 2, openness: 4 },
        },
        {
          id: 'donut_budget',
          label: 'Add a weekly donut line to supplies',
          outcome: `Jasmine prints the budget approval and tapes it above the box. Staff sign it like a treaty. Donuts arrive fresh on Wednesdays. Jasmine tracks consumption with tick marks. She is accurate to within one pastry. Her weight climbs slow and steady. Patients smell sugar and relax.`,
          effects: { trust: 0.4, indulgence: 2.5, money: -40, weeklyMomentum: 0.4 },
        },
      ],
    ),
    1: scene(
      `The phlebotomy stool groans when Jasmine sits. She freezes, then giggles until her shoulders shake.\n\n"Buy a bigger stool or buy me dinner," she says. "Same difference." She stays seated through the break. The stool groans again when she stands. She pats it like a pet.`,
      [
        {
          id: 'new_stool',
          label: 'Order the heavy-duty stool today',
          outcome: `The new stool arrives with a weight rating on the box. Jasmine assembles it while eating apple slices. She sits. Silence. She grins at you like a kid. "Best purchase this year," she says. She does twelve draws without getting up. Her numbers stay perfect. Her mood stays high.`,
          effects: { trust: 0.45, indulgence: 2, weight: 0.3, openness: 3 },
        },
        {
          id: 'standing_draws',
          label: 'Switch her to standing draws with a mat',
          outcome: `You add a cushioned mat and raise the tray height. Jasmine tries it for a morning and swears less. She eats more at lunch to make up for the standing. Her legs strengthen. Her seat spreads when she sits at home, she tells you later, laughing at herself.`,
          effects: { trust: 0.35, appetite: 0.18, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.45 },
        },
        {
          id: 'joke_post',
          label: 'Let her post the groan on the staff board',
          outcome: `Jasmine records the stool groan and pins a QR code to the board. Staff scan it at lunch. Maya spits out water. Nadia says it is unprofessional and saves the file anyway. Patients never see it. Morale spikes. Jasmine brings extra donuts the next day.`,
          effects: { trust: 0.4, openness: 5, indulgence: 3.5, weight: 0.25 },
        },
      ],
    ),
    2: scene(
      `Jasmine catches you before clock-out with her bag half on her shoulder. She leans against the counter. Her stomach presses soft against the edge.\n\n"I used to skip meals on lab days," she says. "Now I plan them. What are we serving tomorrow? I already know the answer. I want to hear you say it."`,
      [
        {
          id: 'plan_menu',
          label: "Walk her through tomorrow's menu",
          outcome: `You list breakfast trays, lunch catering, and the donut line. Jasmine nods at each item like checking boxes. She pulls a granola bar from her pocket and eats it while you talk. "Good," she says. "I'll be here early." She is, with coffee for both of you and powdered sugar on her cuff.`,
          effects: { trust: 0.5, indulgence: 3, appetite: 0.15, openness: 4, weeklyMomentum: 0.5 },
        },
        {
          id: 'early_breakfast',
          label: 'Authorize an early breakfast tray for lab days',
          outcome: `Jasmine sets a timer on the microwave for six thirty. Trays arrive keyed to her schedule. Draws go smoother. Patients comment on her steady hands. She eats between the first and second patient without hiding. "Game changer," she tells Elena. Elena steals a tray idea for the desk.`,
          effects: { trust: 0.45, indulgence: 2.5, money: -55, weight: 0.3 },
        },
        {
          id: 'share_shift',
          label: 'Split her heavy draw days with Maya',
          outcome: `You adjust the roster. Maya takes the first hall on heavy days. Jasmine eats a real breakfast and starts at nine. Her error rate stays zero. Her weight climbs anyway. She hugs Maya on Thursday without warning. Maya hugs back, surprised, then pleased.`,
          effects: { trust: 0.4, openness: 5, indulgence: 2, weeklyMomentum: 0.4 },
        },
      ],
    ),
    3: scene(
      `Last draw of the day. Jasmine caps the final vial, peels her gloves, and walks straight to the donut box. She opens it and holds up the largest one.\n\n"Lab reward," she says. "Clinical necessity." She breaks it in half and offers you the bigger piece. Powder falls on the counter like snow.`,
      [
        {
          id: 'big_half',
          label: 'Take the bigger half',
          outcome: `You eat the big half. Jasmine eats the rest in three bites. She logs the last patient, clocks out, and pats her stomach. "Good day," she says. She leaves the box with one donut for the night crew and a note that says, "You earned it." They do.`,
          effects: { trust: 0.5, indulgence: 4, weight: 0.55, weeklyMomentum: 0.65 },
        },
        {
          id: 'small_half',
          label: 'Take the smaller half and praise her draws',
          outcome: `Jasmine rolls her eyes fondly and eats the larger half anyway. You list three things she did well today. She tries to look cool and fails. She saves the compliment on a sticky note in her locker. Her draws stay flawless. Her appetite stays loud.`,
          effects: { trust: 0.45, openness: 5, indulgence: 3.5, weight: 0.4 },
        },
        {
          id: 'double_box',
          label: 'Order a second donut box for heavy days',
          outcome: `Jasmine claps once. The second box arrives labeled PHLEB ONLY. Staff respect the label for a week. Then Elena steals one. Jasmine steals a candy bar in return. The system balances. Jasmine's weight ticks up. So does her patient compliment rate.`,
          effects: { trust: 0.45, indulgence: 4, money: -45, weight: 0.35, openness: 4 },
        },
      ],
    ),
  },
};

const PROCEDURAL_ARC_SCENES = {
  0: scene(
    (name) =>
      `${name} stays late without being asked. A snack tray waits on the break table with two forks. She looks up when you enter and taps the empty chair with the back of her wrist.\n\n"Could not let it go bad," she says. It is a small lie and you both let it pass.`,
    [
      {
        id: 'stay',
        label: 'Stay and eat with her',
        outcome: (name) =>
          `You eat while ${name} talks about the week. The food is average. The company is not. She washes both plates when you finish and thanks you like you did something larger than sharing takeout.`,
        effects: { trust: 0.4, indulgence: 2.5, weight: 0.3 },
      },
      {
        id: 'approve_tray',
        label: 'Approve a regular after-hours tray',
        outcome: (name) =>
          `${name} adds the tray to the schedule before you close the tab. She eats without guilt the next night and leaves a note on your desk that says the numbers were worth it.`,
        effects: { trust: 0.35, money: -50, indulgence: 2, weeklyMomentum: 0.35 },
      },
      {
        id: 'send_home',
        label: 'Send her home with the leftovers',
        outcome: (name) =>
          `${name} packs the tray in a bag and salutes you with a fork. She texts a photo of her empty containers at ten. You save the photo without meaning to.`,
        effects: { trust: 0.25, indulgence: 1.5, openness: 2 },
      },
    ],
  ),
  1: scene(
    (name) =>
      `${name} meets you in the hallway with scrubs from last month bunched in one hand. She holds them against her body and the fabric stops short.\n\n"New size," she says. "Unless you want me to breathe like this all week."`,
    [
      {
        id: 'order',
        label: 'Order the next size immediately',
        outcome: (name) =>
          `${name} gets the confirmation email before she reaches the break room. She donates the old scrubs without drama and wears the new set the day it arrives.`,
        effects: { trust: 0.45, openness: 3, indulgence: 1.5 },
      },
      {
        id: 'fitting',
        label: 'Schedule a staff fitting',
        outcome: (name) =>
          `The tailor measures ${name} in the back office. She jokes through it and orders two cuts. Both fit by Friday. She eats lunch in the new set like a small celebration.`,
        effects: { trust: 0.35, indulgence: 2, weight: 0.2, openness: 4 },
      },
      {
        id: 'stretch',
        label: 'Try stretch-fit first',
        outcome: (name) =>
          `${name} picks stretch fabric from the catalog and shrugs. "Temporary," she says. It lasts three weeks. She asks for the regular cut without embarrassment.`,
        effects: { trust: 0.3, indulgence: 2.5, weight: 0.3, weeklyMomentum: 0.35 },
      },
    ],
  ),
  2: scene(
    (name) =>
      `${name} finds you near the break room couch with a tray balanced on her knee. The couch groans when she shifts.\n\n"I claimed this spot," she says. "Fair warning, it might not survive the month." She eats a fry and offers you one without looking.`,
    [
      {
        id: 'join_couch',
        label: 'Sit on the arm and talk',
        outcome: (name) =>
          `You talk schedules while ${name} finishes the tray. The couch survives. Her mood improves. She volunteers for a closing shift you did not ask for.`,
        effects: { trust: 0.45, indulgence: 3, weight: 0.35, weeklyMomentum: 0.5 },
      },
      {
        id: 'new_couch',
        label: 'Budget for a sturdier couch',
        outcome: (name) =>
          `A reinforced couch arrives the following week. ${name} tests it with a full tray and nods approval. Staff gather there more often. Crumbs multiply. Nobody complains.`,
        effects: { trust: 0.4, money: -90, indulgence: 2.5, openness: 3 },
      },
      {
        id: 'break_timer',
        label: 'Set a real break timer for her shifts',
        outcome: (name) =>
          `${name} rolls her eyes at the timer and uses it anyway. She eats full meals on schedule. Her draws and charts improve. She thanks you later without making it a speech.`,
        effects: { trust: 0.35, appetite: 0.15, indulgence: 2, openness: 3 },
      },
    ],
  ),
  3: scene(
    (name) =>
      `${name} catches you after close with one hand on her stomach and a steady, calm look.\n\n"Hunger feels like part of the job now," she says. "I want the clinic to keep up with me. Can it?"`,
    [
      {
        id: 'yes_budget',
        label: 'Yes, and expand the snack budget',
        outcome: (name) =>
          `${name} exhales and smiles like she has been holding a breath for months. She helps you pick trays for next week. Her weight climbs. Her work stays sharp.`,
        effects: { trust: 0.5, indulgence: 4, money: -80, weight: 0.45, weeklyMomentum: 0.6 },
      },
      {
        id: 'yes_plan',
        label: 'Yes, with a personal comfort plan',
        outcome: (name) =>
          `You write ${name} the same plan you give patients. She signs it and tapes it inside her locker. She follows it better than most patients. She teases you about that and eats a second helping anyway.`,
        effects: { trust: 0.45, openness: 5, indulgence: 3.5, weight: 0.35 },
      },
      {
        id: 'slow',
        label: 'Ask her to pace herself',
        outcome: (name) =>
          `${name} nods without arguing. She keeps eating. She adds one rest day to her own calendar and shows you like proof. Progress continues slower and steadier.`,
        effects: { trust: 0.35, indulgence: 2.5, openness: 4 },
      },
    ],
  ),
};

function resolveText(value, firstName) {
  return typeof value === 'function' ? value(firstName) : value;
}

function resolveScene(raw, firstName) {
  if (!raw) return null;
  return {
    opening: resolveText(raw.opening, firstName),
    choices: raw.choices.map((choice) => ({
      ...choice,
      outcome: resolveText(choice.outcome, firstName),
    })),
  };
}

export function getStaffArcScene(character, beat) {
  const firstName = character.name.split(' ')[0];
  const named = STAFF_ARC_SCENES[character.name]?.[beat.id];
  if (named) return resolveScene(named, firstName);
  const procedural = PROCEDURAL_ARC_SCENES[beat.id];
  return resolveScene(procedural, firstName);
}

export function formatArcSceneNote(opening, outcome) {
  return `${opening}\n\n${outcome}`;
}
