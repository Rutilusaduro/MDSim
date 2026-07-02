import { scene } from './shared.js';

/** Elena Ruiz. Front Desk Appetite. Routes: showoff (curves on display), sugar (lobby candy), public (staff photos and flirting where clients can see) */
export const ELENA_ARC = {
  0: scene(
    (ctx) => {
      const sugar = ctx.flags.has('elena_sugar');
      const showoff = ctx.flags.has('elena_showoff');
      if (sugar) {
        return `The lobby is quiet after the last patient signs out. Elena is behind the front desk with the candy jar pulled into her lap, unwrapping a caramel with both thumbs. She does not stop when she sees you.\n\n"I refilled it twice today," she says, licking her fingers. "For the guests, obviously." The chair creaks as she leans back, and the waistband of her skirt has given up somewhere under the desk. She looks comfortable in a way that used to make her apologize.\n\nShe nudges the jar an inch toward you across the counter. "You caught me," she says, not sounding caught at all. "Sit. Keep me company while I ruin my dinner."`;
      }
      if (showoff) {
        return `Elena is perched on the tall stool at reception when you come through the lobby, and she has stopped pretending the stool fits her. Her hip spills over the edge of the seat, warm and unbothered, and she catches you looking.\n\n"New stool budget?" she says, patting the side of her thigh where it meets the vinyl. "Or a new me." She grins. The lobby lamps are low and gold and they love her.\n\nShe swivels toward you, slow, letting the chair announce her. "Come here," she says. "Tell me the front desk still makes a good first impression."`;
      }
      return `The clinic has emptied out and only the lobby lights are still on, pooling gold over the reception desk. Elena is there, front desk uniform a size behind her, a half eaten pastry balanced on a napkin beside the appointment tablet.\n\n"Last patient rescheduled, so I had a window," she says, brushing crumbs off the counter into her palm and then, after a glance at you, into her mouth. "First impressions are my whole job. Somebody has to keep the lobby warm."\n\nShe leans forward on her elbows, and the desk edge presses a soft line across her front. "You're here late too," she says. "Sit with me a minute. Nobody's watching but the goldfish."`;
    },
    [
      {
        id: 'share_candy',
        label: 'Pull up a chair and dig into the candy jar with her',
        hint: 'Lobby sweetness, easy warmth',
        setsFlags: ['elena_sugar', 'elena_lobby_route'],
        outcome: `You drag the guest chair around to her side of the desk and take a handful. Elena talks between caramels, about a nervous first timer she talked down that morning, about her abuela's flan, about how the front desk is the only job where being sweet is the whole point. The jar empties faster than either of you admits.\n\nWhen you stand to go she catches two fingers of your sleeve. "Tomorrow I'm buying the good chocolate," she says, "and you're helping me hide it from the intake nurses." Her thumb rests on your wrist a beat past friendly before she lets go.`,
        effects: { trust: 0.5, indulgence: 3, weight: 0.4, weeklyMomentum: 0.55, openness: 3 },
      },
      {
        id: 'restock_jar',
        label: 'Offer to keep the lobby candy jar stocked for her',
        hint: 'Quiet provision',
        setsFlags: ['elena_lobby_route'],
        outcome: `You promise a standing order, the big bag, refilled before she asks. Elena's face does something soft and surprised. She eats slower when she is not defending the habit, and you watch her shoulders come down from her ears one bite at a time.\n\nThe next morning the jar is full to the lid, and there is a sticky note under it in her round handwriting. You didn't have to. Below that, smaller: I'm glad you did. She has already taken one before you find it.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2 },
      },
      {
        id: 'desk_optics',
        label: 'Gently ask if the snacking looks right at the front desk',
        hint: 'Boundaries and image first',
        setsFlags: ['elena_desk_careful'],
        outcome: `Elena sets the pastry down and hears you out with her chin propped on her hand. "The lobby's warmer since I stopped starving through my shift," she says. "Patients relax when the desk person isn't miserable." She is not wrong and she knows it.\n\nShe wraps the rest of the pastry and tucks it in the drawer with her name on the bag. She is not angry, just a little further away than a second ago. "I'll be discreet," she says at the door. "But I'm not going back to sad and hungry for anybody."`,
        effects: { trust: 0.2, openness: 2, appetite: 0.12 },
      },
      {
        id: 'feed_first_bite',
        label: 'Break off a piece of her pastry and hold it out to her',
        hint: 'Feeding, front desk intimacy',
        setsFlags: ['elena_sugar', 'elena_lobby_route', 'elena_feeding'],
        outcome: `You tear a corner of the pastry and lift it toward her mouth. Elena goes still, glances once at the dark lobby doors, then leans in and takes it from your fingers. Color climbs from her collar to her cheeks. She chews slowly and swallows and whispers, "Again."\n\nYou feed her the rest across the desk while the goldfish drift and the phones stay silent. Her hand settles low on her stomach, feeling the sweetness land. "Nobody's ever just let me," she says, wondering at it. "Tomorrow," she adds, like a promise. "Come back tomorrow."`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.5, openness: 5, weeklyMomentum: 0.65 },
      },
    ],
  ),

  1: scene(
    (ctx) => {
      const feeding = ctx.flags.has('elena_feeding');
      const showoff = ctx.flags.has('elena_showoff');
      let base = `Elena flags you down at the reception counter with both hands on the desk edge and a rueful smile. The office chair behind her has one arm and it is not surviving the negotiation.\n\n"Sit," she says, then laughs at herself. "I mean I can't. Watch." She lowers herself into the chair and the arms bracket her hips like a hug she did not ask for. She has to angle sideways to fit at all.`;
      if (feeding) {
        base += `\n\nShe looks up at you from the wedged seat, unashamed. "All those bites you keep sneaking me," she says, patting the curve pressed against the armrest. "They found somewhere to live. I need a chair that can keep up with us."`;
      } else if (showoff) {
        base += `\n\nShe rocks the stuck chair and gives up, spreading in it instead, letting her hips claim the room they want. "Honestly?" she says, tilting her head. "I like that it's a problem. Feels like proof of something."`;
      } else {
        base += `\n\nShe pries herself back up with a grunt and a grin. "I need the wide one," she says. "The bariatric-rated model, before this thing snaps in front of a client and ends my career."`;
      }
      return base;
    },
    [
      {
        id: 'order_wide_chair',
        label: 'Order the widest reception chair in the catalog on the spot',
        setsFlags: ['elena_showoff'],
        outcome: `You place the order at the counter and turn the screen so she can watch the confirmation. Elena reads the weight rating out loud, eyebrows up, and then laughs, delighted rather than embarrassed. "Room to grow," she says, and does not take it back.\n\nShe squeezes your forearm, then slides her hand down to your wrist and holds on a moment too long. "Thank you for not making me feel like the problem," she says. "Most people would've just told me to skip lunch."`,
        effects: { trust: 0.5, openness: 4, indulgence: 2, weight: 0.2 },
      },
      {
        id: 'praise_hips',
        label: 'Tell her the desk has never looked better with her behind it',
        requires: { flags: ['elena_lobby_route'] },
        setsFlags: ['elena_showoff', 'elena_flirt'],
        outcome: `Elena's breath catches and she stops fighting the chair entirely. She turns toward you, hips wide against the armrests, and holds your gaze. "Say that part again," she says, quieter. "The part about how I look."\n\nYou do. She presses her lips together on a smile she cannot hold. "Order the big chair," she says, "and keep looking at me like the lobby's the best seat in the building." Her hand finds her own hip and stays there.`,
        effects: { trust: 0.55, openness: 6, indulgence: 3.5, weight: 0.3 },
      },
      {
        id: 'temporary_fix',
        label: 'Suggest a sturdier stool as a stopgap',
        outcome: `Elena scrolls the options with you, chewing her lip. "A stool buys me a month, maybe," she says, but she picks one with a wide padded seat and no arms to argue with. At checkout she murmurs, "Order the big chair too. I know how this goes by now."\n\nShe is right. The stool gives out on a Wednesday with a client mid check-in, and she plays it off so smoothly the patient laughs. She brings you the cracked seat afterward like a trophy. "Told you," she says.`,
        effects: { trust: 0.3, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.45 },
      },
      {
        id: 'chair_photo',
        label: 'Snap a before photo for the vendor complaint',
        setsFlags: ['elena_public'],
        outcome: `Elena strikes a mournful pose wedged in the broken chair, and you catch it for the vendor ticket. She insists you send it to the staff chat too, for evidence. Maya replies with three crying-laughing faces and a heart.\n\nBy lunch the photo has a caption war going and Elena is basking. She eats a bigger lunch than usual, right at the desk, telling anyone who asks that she is method-acting for the warranty claim. The wide chair arrives in three days and she christens it with a pastry.`,
        effects: { trust: 0.45, openness: 5, indulgence: 3, weight: 0.25 },
      },
    ],
  ),

  2: scene(
    (ctx) => {
      const flirt = ctx.flags.has('elena_flirt');
      let base = `Elena has her phone propped against the monitor at the front desk, angling the camera to catch the lobby light and herself in it. She is in the new wide chair, filling it well, a snack cup of pudding in one hand.\n\n"Clinic's socials were dead," she says. "I'm fixing it. Warm faces, happy staff, that kind of thing." She takes a spoonful for the camera and her cheeks round with it. A patient passing through smiles at her without meaning to.`;
      if (flirt) {
        base += `\n\nShe lowers the phone and looks at you sideways. "The comments like me more the softer I get," she says, low. "I used to hate photos. Now I keep finding excuses to be in front of the lens." She sets the pudding down. "That's on you, a little. Tell me it isn't."`;
      } else {
        base += `\n\nShe lowers the phone and taps the counter. "People keep saying the desk feels friendlier lately," she says. "You think that's the pudding, or is it just that I finally look happy to be here?"`;
      }
      return base;
    },
    [
      {
        id: 'run_the_socials',
        label: 'Green-light her as the clinic\'s front-desk face online',
        setsFlags: ['elena_public'],
        outcome: `You tell her to run with it, official blessing and a small budget for props. Elena reads the approval twice, then throws her arms up so fast the chair rolls back. "The lobby has a spokesperson," she announces to the empty room.\n\nShe films a welcome clip on the spot, spoon in hand, hips settled wide in the frame, warmth radiating off her. It gets more engagement by morning than anything the clinic has posted in a year. A patient books specifically to meet "the front desk lady from the videos."`,
        effects: { trust: 0.45, openness: 4, indulgence: 3, weeklyMomentum: 0.6 },
      },
      {
        id: 'snack_between_calls',
        label: 'Bring her a spread to graze on between check-ins',
        setsFlags: ['elena_sugar'],
        outcome: `You lay out a little buffet on the counter, and Elena works the phones one-handed while she grazes with the other. She does not hide a single bite from the patients who pass, and somehow it makes the lobby feel more like a kitchen than a clinic.\n\nBy end of shift the spread is gone and her waistband has a story to tell. She dabs her lips, leans back until the chair complains, and pats her middle. "Best front desk in the district," she says. "Worth every bite."`,
        effects: { trust: 0.5, weight: 0.45, indulgence: 3, appetite: 0.18 },
      },
      {
        id: 'gentle_curation',
        label: 'Ask her to keep the posts a touch more professional',
        setsFlags: ['elena_desk_careful'],
        outcome: `Elena hears you out, then shrugs one shoulder. "Professional and warm aren't enemies," she says, but she agrees to a lighter touch on the eating clips. She still posts, just craftier, a slice of cake half in frame, her satisfied smile doing the rest.\n\nThe comments read the subtext anyway. She screenshots the sweetest one and texts it to you at midnight with no words, just a single pudding emoji. You are still looking at it longer than you mean to.`,
        effects: { trust: 0.4, openness: 5, indulgence: 2, weeklyMomentum: 0.4 },
      },
      {
        id: 'in_frame_hand',
        label: 'Get in the shot and feed her a bite on camera',
        requires: { flags: ['elena_flirt'] },
        setsFlags: ['elena_public', 'elena_feeding'],
        outcome: `You lean into frame and lift the spoon to her mouth. Elena's eyes flick to the lens, then to you, and she takes the bite slow, lashes low. The clip is thirty seconds of pure heat disguised as staff culture.\n\nShe does not post it. She saves it for the two of you and plays it back once, quiet. "Do that again when the lobby's empty," she says, "and don't stop at one bite." She books a heavier dinner that night and tells you the next morning, flushed, that she watched the clip twice more before she slept.`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.55, openness: 6, weeklyMomentum: 0.75 },
      },
    ],
  ),

  3: scene(
    (ctx) => {
      const feeding = ctx.flags.has('elena_feeding');
      if (feeding) {
        return `Elena texts you after close: Lobby's locked, blinds are down. Come to the desk. Bring an appetite for me, not with me.\n\nYou find the reception counter cleared and two bakery boxes stacked where the appointment tablet usually sits. She has changed into something soft that clings everywhere it can, and she is already up on the desk itself, hips settled on the edge, feet swinging.\n\n"I thought about this all shift," she says, patting the counter beside her thigh. "I want to see how much I can take with you feeding me. Right here, where I run the place." She spreads her knees a little. "Sit close. Don't stop until I tap out."`;
      }
      return `Near closing, Elena catches you by the front desk with a bakery box and a nervous kind of bravery in her smile.\n\n"So the lobby's mine after hours," she says, tapping the counter. "And I keep imagining you here, at the desk, feeding me while nobody else gets to see." She shifts her weight and the chair sighs. "I've been getting bigger on purpose lately. Because of how you watch me. I need to know that isn't a problem for you."\n\nHer fingers fidget with the box ribbon. The question costs her more than her easy voice lets on.`;
    },
    [
      {
        id: 'feed_on_the_desk',
        label: 'Feed her right there on the front desk until she taps out',
        requires: { flags: ['elena_feeding'] },
        setsFlags: ['elena_lovers'],
        outcome: `You stand between her knees and feed her off the counter, one slow bite after another. Elena hums low in her throat, one hand braced behind her on the desk, the other pressed to her filling stomach. She stops twice to breathe, then pulls your wrist back with a whispered, "More."\n\nWhen both boxes are empty she guides your palm in slow circles over the swell of her belly, right where she stamps a hundred forms a day. "I could get so much bigger behind this desk," she says, watching your face. "If that's what you want." You answer with your other hand on her hip, and she believes every bit of it.`,
        effects: { trust: 0.65, indulgence: 6, weight: 0.85, openness: 7, weeklyMomentum: 0.9 },
      },
      {
        id: 'after_hours_date',
        label: 'Turn the empty lobby into a private after-hours dinner',
        requires: { notFlags: ['elena_desk_careful'] },
        setsFlags: ['elena_lovers', 'elena_sugar'],
        outcome: `You dim the lobby to its softest setting and lay the food out on the counter like a table for two. Elena eats with her whole heart, telling you about the shy patients she remembers by name, tasting everything twice, frosting at the corner of her mouth. You wipe it with your thumb and she catches her breath.\n\nWhen the boxes are flat she leans back against you where the waiting chairs meet the desk, heavy and content. "Stay a while," she says into your shoulder. "I like being full with you in my lobby."`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.7, openness: 6 },
      },
      {
        id: 'name_the_want',
        label: 'Tell her you like watching her grow behind the desk',
        setsFlags: ['elena_showoff', 'elena_flirt'],
        outcome: `Elena holds very still, then the color rushes up her neck and into her face. "Yeah?" she says. "Yeah." She steps in close until her softness presses against you at the counter. "Then don't look away when the uniform stops buttoning again. Watch the whole thing."\n\nShe kisses your cheek quick and warm before you can respond. "Come back tomorrow," she says. "Feed me at the desk for real. I want to grow where everybody has to notice."`,
        effects: { trust: 0.55, openness: 6, indulgence: 4, weight: 0.4, weeklyMomentum: 0.7 },
      },
      {
        id: 'steady_pace',
        label: 'Say you adore her but want her setting the pace',
        outcome: `Elena nods, a mix of relief and a little wistfulness crossing her face. "Okay," she says. "But I'm still getting softer, and I'm not slowing that down for anyone. That part's mine." She squeezes your hand. "Just stay honest with me while it happens."\n\nShe eats a lighter box that night, then sends you a mirror selfie at eleven from behind the desk, uniform snug, caption reading still growing, on my terms. You save it before you can talk yourself out of it.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2.5 },
      },
    ],
  ),

  4: scene(
    (ctx) => {
      if (ctx.flags.has('elena_lovers')) {
        return `The clinic is dark except for the lobby, and Elena has locked the front doors and lowered every blind. Three bakery boxes wait on the reception desk, and she is already up on the counter in a cardigan that gave up on closing hours ago.\n\n"I told the cleaning crew we're doing inventory," she says, grinning, hips wide and proud on the edge of the desk. "They did not believe me." She spreads her knees and rests her heavy middle between them, unbothered and glowing.\n\nThe lobby light loves her the way it always has, only there is so much more of her to love now. "Finish me off," she says, patting the counter beside her thigh. "And then tell me what you want us to be."`;
      }
      if (ctx.flags.has('elena_public')) {
        return `Elena meets you at the front desk with her phone in one hand and a celebration cake in the other. "The clinic's socials hit a milestone," she says, turning the screen so you can see the numbers. "The lobby has fans now. I have fans now."\n\nHer own smiling, softening face fills the top posts, spoon in hand in half of them. The comments are a warm wall of hearts, and she scrolls them like a woman rereading love letters. She has clearly stopped shrinking from the camera and started feeding it on purpose.\n\nShe sets the cake on the counter and pries the lid off. "Celebrate with me on camera," she says, "or off it. Either way I'm cutting myself the corner piece with all the frosting."`;
      }
      return `The clinic has gone quiet and only the lobby glows, gold over the empty waiting chairs. Elena has two bakery boxes open on the front desk and a third balanced on the arm of her wide chair. She waves you over with a plastic fork.\n\n"After-hours perk," she says. "Sit. I saved you the eclair before the morning shift raids the box." The portions are generous and unhurried, and she has already made a comfortable dent in the first box.\n\nShe settles deeper into the wide chair, which fits her better than the lobby ever expected, and pats the seat of the guest chair beside her. The clock over the door reads eleven sixteen and neither of you seems to mind.`;
    },
    [
      {
        id: 'lovers_feast',
        label: 'Feed her the last box on the desk and stay the night',
        requires: { flags: ['elena_lovers'] },
        outcome: `You feed her off the counter until she cannot hold herself upright without leaning back on her hands. Elena slumps against you at last, stuffed and radiant, lacing her fingers over yours where they rest on her belly. "I love this," she murmurs. "I love you feeding me right here where I built the whole warm front of this place."\n\nYou stay until the lobby fish tank filter is the only sound left. She dozes heavy against your chest behind the desk she rules by day. In the morning she opens the clinic one-handed and does not bother buttoning the cardigan for anyone.`,
        effects: { trust: 0.7, indulgence: 7, weight: 1.1, openness: 7, weeklyMomentum: 1 },
      },
      {
        id: 'friend_feast',
        label: 'Share the boxes and talk about what comes next',
        outcome: `You eat side by side at the front desk until the boxes are flat. Elena talks about staying on, about wanting a lounge chair behind the counter, about how her body finally feels like hers instead of a thing to apologize for. She slides you the last bite without thinking about it.\n\n"Same time next week?" she says, licking frosting off her thumb. You nod. She looks satisfied clear through, from the lobby lights down to her softly aching waistband.`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.65, weeklyMomentum: 0.8 },
      },
      {
        id: 'crown_the_face',
        label: 'Make her the official face of the clinic and split the cake',
        requires: { flags: ['elena_public'] },
        outcome: `You sign off on the title, front desk lead and clinic ambassador, and Elena cuts the frosting corner for herself with ceremony. She films the announcement, cake in hand, hips filling the frame, the lobby glowing behind her. The post outperforms every ad the clinic has ever run.\n\nMonday she greets a line of patients who came just to meet her. She pins a printout of the milestone by the desk, pats the soft rise of her stomach, and tells the intake nurse, "This is what a happy front desk looks like."`,
        effects: { trust: 0.5, reputation: 2, indulgence: 4, weight: 0.5, openness: 5 },
      },
      {
        id: 'perk_budget',
        label: 'Approve a permanent after-hours front-desk treat budget',
        outcome: `Elena watches you add the line item and exhales like she has been holding it all shift. "Now it's official," she says. She works through both boxes while you save the file, frosting shining on her lips, entirely at home behind her counter.\n\nThe late lobby dinner becomes a standing thing, hers to run. Her waistband keeps losing ground week after week and she keeps welcoming it. Every time she settles into the wide chair, she thanks you with a look that lasts a little too long.`,
        effects: { trust: 0.5, indulgence: 4, money: -75, weight: 0.6, weeklyMomentum: 0.75 },
      },
    ],
  ),
};
