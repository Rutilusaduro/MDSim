/**
 * Extended body prose for IndulgeCare Clinic.
 * Style: literary_modern · density: dense · heat: warm
 * No em dashes. No reversal pivots. No filler transitions. No therapy voice.
 * Concrete nouns. Strong verbs. Varied sentence length. Sensual body detail.
 *
 * staffBodyDescriptions:   clinic staff; scrubs and uniform context permitted.
 * patientBodyDescriptions: elective patients; civilian street clothes only.
 *
 * Each object is keyed by body type. Each value is an array of 12 strings,
 * index 0 (slim / neutral) through index 11 (bedbound / titanic mass).
 * Stage tone: 0 slim, 1-2 first gains, 3-4 habitual glutton,
 * 5-6 outgrowing uniforms, 7-8 massive spreading, 9 can barely walk,
 * 10 immobile blob, 11 bedbound titanic mass.
 * Each string is a self-contained paragraph of 4 to 5 complete sentences.
 */

export const staffBodyDescriptions = {
  hourglass: [
    'Scrubs hang clean from her collar to her knee, waist seam locked at the narrow point where hip and rib meet. She crosses the clinic hall without fabric drag, chart tucked under one arm, stride brisk on linoleum. Chair arms clear her hips by an inch. The hire photo on her badge still tells the truth.',

    'Softness pools at her waist and the outer swell of her hips, slow and patient against cotton knit. She tugs the scrub hem down each time she pauses at a chart rack, a gesture that arrived mid-month and stayed. The belly seam curves forward on exhale and holds the curve when she inhales. Profile mirrors in the supply corridor show it clearly now.',

    'Her hips catch chair arms when she drops between rounds, a brief friction she no longer tries to dodge. The top button at her chest negotiates every deep breath. Bust and hip have widened while the waist stays drawn in, every fitted surface along the hall spelling the contrast. Her walk between stations has acquired a rolling ease, mass arriving a half beat behind each footfall.',

    'Her chest pulls the collar forward, heavy and forward-leaning. Hips press every side seam smooth, wide enough to brush supply carts if she misjudges the turn. Flesh along her flank shifts in slow displacement when she changes position at a desk. She breathes through her mouth at the end of long corridors and stands still a moment before she speaks.',

    'She arrives in a room before her voice does, warmth and roundness filling the doorway first. Belly and hips move on their own cadence when she walks, a slow pendulum that draws eyes down the corridor. Her breath fogs slightly between words after the longer halls. Other staff adjust their paths without discussing it, giving her width as habit.',

    'Her arms are thick and soft, belly deep and heavy against the front panel of her scrubs. She takes up space with the unconscious ease of someone who stopped calculating whether she should. Walking the full clinic length requires a breath and a pause at the midpoint; she takes both. The chair beneath her holds without complaint, and she fills it completely.',

    'Each step sends weight through her frame in a rolling wave, hip to belly to thigh and back again. Fabric gives at every seam and holds by stretch and repetition. She fills chairs the way rooms fill with sound: completely, from every corner, leaving no gap. The corridor narrows behind her passage, and every surface she touches keeps her warmth a moment after she moves on.',

    'Her hips have spread past the width of any chair the clinic owns, flesh mounding over both arms when she manages to wedge herself down. The scrub top splits its stitching at the side seam, and someone brought her the largest size the supplier stocks, which strains all the same. Bust and belly and hip carry more each week, soft heavy weight that spreads sideways when she leans on a counter. She moves along the wall now, one hand tracking the surface for balance.',

    'Two of the largest scrubs, cut and sewn together, barely close over a body that widens by the month. Her belly hangs forward in a deep soft shelf that rests against the counter before she does. Her hips fill the corridor from wall to cart, and staff flatten themselves to let her pass. She breathes hard between rooms and rests a palm flat on her chest while the breath comes back.',

    'Walking the clinic hall has become a slow negotiation of weight, each step a shift of enormous soft mass from one leg to the other. Her thighs press so wide that they force her stance into a roll, and she covers ten feet and stops to rest against the wall. The scrubs stretch to translucence over a belly that swings low and heavy with the motion. She takes the wheeled stool everywhere now and lowers herself onto it whenever the distance allows.',

    'She cannot stand for more than a moment before her knees complain under the load, so she works from a reinforced chair that holds her spreading bulk. Her belly pools into her lap and over her thighs in a warm heavy flood, and her hips overrun the seat on both sides. The scrubs are draped rather than worn, the largest panels the supplier makes, tenting over a mass that no longer fits any standard cut. Staff bring the work to her, and she receives it without rising.',

    'She fills a bed now, a titanic soft mass of belly and hip and arm that has outgrown standing entirely. Her body spreads across the mattress from rail to rail, flesh settling in deep warm folds wherever gravity pulls it. The scrubs have become a draped sheet of fabric laid over the vast rise of her middle. She breathes in slow deep swells, and the whole immense shape of her lifts and settles with each one.',
  ],

  pear: [
    'Her shoulders stay slim inside navy scrubs, uniform hanging clean from collar to knee. She moves through the clinic hall with the ease of a body that has never negotiated a doorway. The badge photo still matches if anyone checks. Linoleum receives her steps lightly.',

    'Weight settles low on her frame, accumulating at hip and thigh and the wide curve of her rear. Her walk has picked up a sway she catches in the break room window and looks past. Scrub pants no longer hang straight from hip to cuff; they follow a curve now, wide at the seat and narrowing below the knee. She turns away from the glass and keeps working.',

    'Her hips press into clinic chair arms when she sits, a new pressure she works around without remark. The waistband rides up over a belly that was flat last quarter and is now low and round. Most gain lives below her belt: heavy thighs, a fuller seat, hips that spread across any cushion they settle on. She ordered the next size for the bottoms and kept the same tops; the difference shows in every profile mirror in the hall.',

    'Her hips brush the frame of the narrow corridor near the supply room, a contact she registers and moves past. A belly that arrived quietly has grown round and low, adding forward curve to her posture when she stands still. The scrubs do their best: the top hangs freely from narrow shoulders, the bottoms are a campaign of stretch and hope. She walks the clinic with visible sway in her lower body she has long since stopped trying to reduce.',

    'Her lower body has outpaced her upper by a measure that shows in every uniform she pulls on. The scrub top hangs freely from narrow shoulders while the pants argue from waistband to knee, stretched smooth over thighs that press together from mid-inner thigh downward. She navigates chairs and counters with geometry learned through repetition. Every skirt she tries in a dressing room is a negotiation she mostly expects to lose.',

    'Her steps come slower and heavier, roll of her hips visible under even the loosest fabric she wears. Thighs rub from mid-inner down to the knee, a friction she manages with her stride rather than fighting. She sits spread and settled, hips wide, belly soft and folded over her lap, knees slightly parted to give the thigh room. The lower body has become the whole story; it precedes her into rooms and lingers when she moves on.',

    'Her hips define the doorway when she passes through it, width of her lower body measuring the space with precision. Weight lives in every stride: visible rolling motion at hip and thigh, floor registering each footfall. Her thighs are dense and warm from hip to knee. Her belly is deep and round above the lap. She moves through the clinic like something large and rooted, impossible to overlook from any angle or distance.',

    'Her hips have spread wider than the doorway allows, and she angles through every threshold sideways now, one heavy haunch clearing before the other. The scrub pants blew out at the inner seam weeks ago, and the replacement pair, the largest cut, stretches to a shine across her rear. Her thighs press together from hip to knee in a solid heavy column that reshapes her walk. She rests against the wall at the midpoint of every hall.',

    'Her lower body has swelled to a mass that dwarfs her narrow shoulders past all proportion, hips and rear and thigh spreading in every direction below the belt. The scrub bottoms are two sizes stitched into one and they still strain smooth over the vast curve of her seat. She lowers herself onto the reinforced stool with both hands braced, and the flesh of her hips flows over its edges. Each step is slow, and there are fewer of them.',

    'She can barely walk the corridor now, thighs so thick and heavy that they force her legs apart and slow every stride to a labored roll. Her rear swings wide behind her, a great soft weight that sets the rhythm she cannot rush. She covers a short distance and grips the cart for rest, breath loud. The scrub pants have surrendered to the shape and merely cover it.',

    'She works from a wide reinforced chair because her legs will no longer carry the mass of her lower body for long. Her hips pour over both arms of the seat, thighs spreading into a broad soft shelf that fills her lap and beyond. Standing takes two staff and a count, and she prefers to stay seated and let the work arrive. The scrubs drape loose over a body that has stopped fitting any of them.',

    'She lies across the bed now, her lower body a titanic spread of hip and thigh and rear that has outgrown every chair and every doorway. The mass of her flows over both sides of the mattress, warm and soft and immense, settling deeper into the frame with each hour. The scrub fabric lies draped across the great slope of her hip. She shifts, and the whole vast lower half of her resettles slow as a tide.',
  ],

  apple: [
    'Her middle stays flat inside fitted scrubs, step brisk on clinic linoleum. She covers the distance to the nurses station without thought, posture crisp, chart ready. A clean silhouette from collar to hip, nothing forward, nothing demanding. Tuesdays run easy on a body like this.',

    'Her scrub top tents slightly at the front, a small forward lean in the fabric she smooths down each time she passes the supply closet mirror. The middle is softening in increments so gradual they almost hide in a busy shift. She notices without naming it and keeps moving down the hall. The day still runs easy.',

    'Her middle has thickened with density that sits forward and high and shows in every posture she takes. Her chest lifts with the belly as the two grow in concert, and seated breaths move the fabric of her scrub top in long, slow waves. She reaches over a counter and the top rises at the hem, exposing a strip of soft belly she tucks back without breaking the sentence she is speaking. The scrubs are tighter than they look from the end of the hall.',

    'Her belly settles fully into her lap when she sits, soft and warm and deeply present. She exhales slowly when she lowers herself into a chair and stays seated between tasks, conserving the walk. Her scrub top rounds over her middle in a smooth parabola that shows clearly from the side. She has stopped tugging the hem down; the hem made its peace with the situation before she did.',

    'One hand rests on her belly when she stands, absent and habitual, as if checking that the weight is still there and finding that yes, it always is. Her middle is round and firm from the outside, soft and warm within. The scrub top no longer tucks and she has given up trying to make it. Other staff say nothing; the shape is simply part of her now, present in every room she enters.',

    'Hall work leaves her breathing loud by the midpoint of any long corridor. Her chest heaves in long slow lifts over a middle that sways when she stops, still moving after the feet have settled. She stands with one hand braced on a counter after a fast stretch and takes a full moment before she continues. The belly is heavy and she carries it with practiced steadiness.',

    'A rounded torso from collarbone to hip, full and warm and forward, belly carrying the weight of months of steady gorging. Her arms are soft and heavy. Her face is wide and warm. She moves through the clinic with deliberate ease, every pound carried openly. She fills each room from the center outward, present and steady and warm to the core.',

    'Her belly has swelled into a broad forward mass that enters the room a full stride ahead of her and rests on the counter before her hands reach it. The scrub top, largest the supplier makes, strains at every button and rides up over the lower curve no matter how she tugs it. Her chest and arms have thickened with soft heavy weight that spreads when she leans. She walks slowly, one hand cradling the underside of the belly for the ballast of it.',

    'The belly hangs in a deep heavy shelf that reaches the top of her thighs, and she rests it against furniture whenever she stops. Two scrub tops stitched together stretch across the vast forward mass and still gap at the sides. Her breathing is loud by the end of any hall, chest heaving over the great round middle. She braces both palms on a counter and lets the belly hang and takes her time.',

    'She can barely cross the clinic now, the forward mass of her belly throwing her weight ahead of her feet with every step. She walks in short slow pushes, one hand under the belly, the other on the wall, and rests often. The scrub fabric stretches translucent over the enormous round swell of her middle. Ten feet and she stops, breath dragging, the whole heavy front of her rising and falling.',

    'Standing tips her weight too far forward to sustain, so she works from a reinforced chair with the belly filling her lap in a warm heavy flood. The great round mass rests on her thighs and spreads to the chair arms, and she folds her soft heavy arms atop it. The scrubs drape over the swell like a sheet laid over a hill. Staff bring the work to her, and she receives it seated, breath slow.',

    'She fills a bed now, her belly a titanic soft mountain that rises above the rest of her and has outgrown standing entirely. The mass of her middle spreads to both rails, warm and vast, settling into deep folds along its lower slope. The scrub fabric lies draped over the great rise of it. She breathes in long swells, and the whole immense round of her belly lifts toward the ceiling and eases back down.',
  ],

  athletic: [
    'An athletic build with posture to match: scrubs fitting the way they should on a body that spent years being deliberate about itself. Her movements are efficient and spare, nothing wasted in the way she covers the hall. She carries herself like someone who still plans to run on her day off. Definition at her middle is real and visible and hers.',

    'Her stomach has lost some flatness, a change visible only when the scrub top stretches across the front during a deep breath. Her thighs fill the pant leg more than they did at hire, fabric tighter from mid-thigh to knee. Definition at her middle has blurred at its edges. Muscle and softness have started to share the same territory on her frame.',

    'Strength still shows in her shoulders, broad solid architecture announcing itself in her posture and in the way she holds heavy equipment. Her belly and chest have grown soft enough to bounce when she moves quickly across the linoleum, a new sensation she registers with each fast step. The scrubs stretch at the front and sides of a middle that has picked up real weight. Power and softness coexist on this body without a clear winner.',

    'Muscle hides under warm soft flesh along her thighs and belly and upper arms, buried deep enough that it takes a press of the fingertip to locate. The waistband digs in by the third hour and she rolls it below the belly when no one is watching. Her midsection is soft and round and full, pressing against the scrub front with warmth she can feel when she crosses her arms. She still moves with purpose. The purpose has acquired significantly more weight to carry.',

    'The sharp lines that once defined her abdomen and hip are gone, buried under dense softness that shows clearly under any light and any fabric. Her scrubs round smoothly over every surface without strain or definition. She still reaches for things with the confident extension of a trained athlete; the body that follows the reach is substantially larger and considerably warmer. She has adapted without making it a conversation.',

    'Each step sends a visible ripple through a body that once ran miles without checking in with it. The weight lives in her thighs and her belly and her arms and the soft shelf under her jaw. She works through the long halls with steadiness that is unmistakably physical, a full and occupied body in deliberate motion. Heavy, confident, thoroughly present.',

    'Plush and powerful: a body that spent years in discipline and then two full years of steady gorging, keeping everything from both periods. Every footfall lands with mass that makes the floor register her passage. Her arms are heavy and soft. Her belly is deep and round. She moves through the clinic with slow grounded authority of something very large that knows exactly how large it is.',

    'The athlete is gone entirely beneath a spreading mass of soft heavy flesh that has claimed her belly and thighs and arms. The scrub top, largest cut, strains over a middle that has swelled well past anything training left behind. She still reaches with the old confident extension, and the vast soft body follows the reach a beat late. She walks the hall slower each week and rests against the wall without embarrassment.',

    'Whatever muscle remains lies buried fathoms deep under a body that has spread massive and soft in every direction. The scrubs are two sizes joined and they strain across belly and hip and the thick soft column of her thighs. Her old power surfaces only in the steadiness of her stance, planted wide to hold the enormous weight. She breathes hard down the long halls and stops to let it settle.',

    'She can barely walk the clinic now, the mass of her belly and thighs slowing the trained body to a heavy labored roll. Her thighs press wide and force the old efficient stride into a slow lurch from wall to cart. The scrubs stretch tight over a frame that has swelled far past the athlete it once was. She grips the counter and breathes, the whole soft weight of her heaving with it.',

    'Standing wearies her fast now, so she works from a reinforced chair that holds the vast soft body the athlete became. Her belly floods her lap and her thighs spread to the edges of the seat, and the old strength shows only in how squarely she settles the mass. The scrubs drape loose over a shape no standard cut will hold. She takes the work seated and lets her thick soft arms rest atop the belly.',

    'She fills a bed now, the trained body swelled into a titanic soft mass that has outgrown every chair and every stride she once ran. The weight spreads across the mattress rail to rail, warm and vast, deep folds settling where the muscle used to be. The scrub fabric lies draped over the enormous rise of her middle. She breathes in slow deep swells, and the whole immense shape of her lifts and eases with each one.',
  ],

  willowy: [
    'Slender, with long limbs that cover ground without appearing to try. She is light on her feet in the way of someone whose body has always asked very little of the floor beneath it. The clinic hall gives her more room than she needs and she moves through the extra space with easy, unhurried stride. A normal Tuesday body on a long and minimal frame.',

    'A softness has appeared at her hip and lower belly that her slim frame makes obvious even at modest levels. She presses at it in the break room bathroom, more curious than anything else. Her scrubs still hang freely from her shoulders, fabric moving with her long stride without impediment. The change is small, and on a slender body, small changes speak before they are ready.',

    'Her limbs are still long, still the first thing a person notices about her. They carry more now, soft filling-out along the thigh and inner arm that registers in the way fabric drapes when she stands still. Her movement has grown more deliberate, slowed by a degree she can feel. A slender woman with new weight is still slender, briefly, and the clock on that reading has started.',

    'Weight hangs on her long bones and shows in the way she lowers herself into seats and lifts herself back out of them. Her belly is round and warm beneath the scrub top. Her arms have filled in at the upper curve. She drapes into clinic chairs with the leisure of a body that has grown accustomed to taking its time, long legs folded and flesh settling where it finds room.',

    'Every pound reads clearly on a tall frame with so little padding in its history. The scrub top strains at the shoulder and chest and falls more generously below. Her thighs touch at mid-stride now, a friction her long step once precluded. She is still tall, still long-limbed. Every other measurement has grown into the space those long limbs provide, filling it with thoroughness that shows from the end of any hall.',

    'Steps drag with mass she could not have imagined on her old body. She is still tall, still long-limbed, still occupying the full vertical dimension of any room she enters. The horizontal has caught up substantially with the vertical. She carries more body than she thought she could hold, and she holds all of it, clinic hall no longer wider than she needs by any margin.',

    'A tall column of warmth and mass from jaw to thigh, full length of her frame packed dense and soft at every point. She owns whatever hallway she walks through, filling it from shoulder to shoulder with presence that is warm and total. Her stride has shortened and her hips have widened and her belly is heavy and forward. Tall and warm and undeniably, thoroughly abundant at every distance.',

    'The long frame has packed massive now, tall bones buried under a spreading soft weight that fills every inch they once left empty. The scrub top strains at the shoulder, and the largest cut still gaps over belly and hip. Her thighs press together from hip to knee and force a slow wide roll into the old easy stride. She rests against the wall halfway down the hall, tall and enormous and breathing hard.',

    'She is a tall column of soft heavy mass now, the length of her frame swelled wide from shoulder to thigh. Two scrubs stitched together stretch over a belly that has grown deep and forward and a rear that has spread to match. She fills the whole corridor top to bottom and side to side and moves through it slowly. Her breath comes loud by the end of it, and she stops to let it ease.',

    'She can barely walk the clinic now, the enormous soft mass on her long bones slowing every stride to a labored roll. Her thighs press wide and her belly swings low, and she covers a short stretch before gripping the cart for rest. The scrubs stretch tight over a frame that has filled far past what its height once promised. She breathes hard, tall and vast, and gathers herself for the next few steps.',

    'Standing taxes the long legs too fast now under all this weight, so she works from a reinforced chair built to hold the tall vast body she became. Her belly floods her lap and her hips overrun the seat, the length of her folded and settled deep into it. The scrubs drape loose over a shape that dwarfs every standard cut. She takes the work seated and rises for nothing she can avoid.',

    'She fills a bed now, the tall frame swelled into a titanic soft mass from jaw to thigh that has outgrown standing entirely. The length of her spreads across the mattress rail to rail, warm and vast, settling into deep folds along the whole long slope of her. The scrub fabric lies draped over the great rise of her middle. She breathes in slow swells, and the immense long shape of her lifts and eases with each one.',
  ],

  compact: [
    'Petite, with scrubs that are the small size and fit exactly as intended. Her ID badge photo was taken two weeks after she started and she still matches it in every detail. She moves quickly on a short frame, efficient and tidy, covering the clinic corridor with ease of someone who has never needed to account for her own dimensions. Very little space taken. All of it used well.',

    'A few pounds arrive fast on a short frame and announce themselves in ways they would not on someone taller. The waistband is snug by Wednesday of most weeks. Her face has grown a trace softer along the jaw. She is still quick, still the first one at the station in the morning. The scrubs know before she does.',

    'Each pound stacks dense on a short body, adding width and depth without adding height. She looks lower to the ground than she once did, more solid, settled closer to the linoleum. Rounder at every point. She carries the added weight like ballast, moving with new sturdiness she seems entirely unaware of and entirely comfortable with.',

    'Her belly rests in her lap when she is seated, warm and soft and completely present. Her thighs are thick from hip to mid-knee, pressing the fabric smooth and flat between them. Her arms have softened at the upper inner curve, adding gentle weight to every gesture. She is compact and she is full and the combination means she fills every chair she occupies from edge to edge.',

    'A grounded presence, dense and solid and close to the floor. The break room chairs hold her with careful cooperation of furniture asked to hold more than its usual. Her breath stays shallow after any fast movement. She leans forward on the counter with both forearms and the belly fills the space between her arms and the countertop with warmth that is entirely her own.',

    'A compact body in full movement: belly and arms and thighs all carrying their weight in a visible jiggle that announces her before she rounds the corner. Small rooms feel smaller with her in them. She fills the break room chair past its edges and settles there with authority of someone who has decided this is simply how much space she takes. She is still quick when she needs to be. The weight is considerable and the quickness works around it.',

    'A short body carrying a grand weight, every seam of her scrubs reading the full story of her appetite and the months it has been running. Her belly is thick and deep, her arms soft from shoulder to wrist, her face full and warm. She moves through the clinic with slow authority of someone who has given this small frame everything it wanted and watched it fill every available inch. Dense, warm, thoroughly satisfied.',

    'The short frame has packed enormous now, every added pound stacking dense and wide on a body with no height to spread into. The scrub top, largest cut, strains over a belly that has swelled broad and forward and low. Her thighs force her stance wide and her hips fill the corridor. She walks in slow short steps and rests against the wall more often than not.',

    'She has grown massive on a small frame, belly and hip and thigh spreading in every direction the height cannot. Two scrubs joined at the seam stretch smooth over a body that widens by the month. She lowers herself onto the reinforced stool with both hands, and the soft weight of her floods over its edges. Each step is slow and heavy, and there are fewer of them.',

    'She can barely cross the clinic now, the dense enormous weight on her short legs slowing every step to a labored roll. Her thighs press wide and her belly swings low, and she covers a few feet before she grips the cart to rest. The scrubs stretch tight over a small frame carrying a vast load. She breathes hard, low and wide and heavy, and pushes off for the next short stretch.',

    'Standing tires the short legs fast now under all this dense weight, so she works from a reinforced chair that holds the enormous soft body the small frame became. Her belly floods her lap and her hips pour over both arms of the seat. Standing takes a count and a brace, and she prefers to stay put and let the work come. The scrubs drape loose over a shape no cut will hold.',

    'She fills a bed now, the small frame swelled into a titanic soft mass that has outgrown every chair and doorway in the clinic. The dense enormous weight of her spreads across the mattress rail to rail, warm and vast, settling into deep folds wherever it pools. The scrub fabric lies draped over the great round rise of her belly. She breathes in slow swells, and the whole immense low shape of her lifts and eases with each one.',
  ],
};

export const patientBodyDescriptions = {
  hourglass: [
    'She arrives in clean jeans and a tucked blouse, outfit requiring no adjustment and inviting no second glance. Her figure sits easy in its proportions: waist defined, hips and chest balanced, nothing pulling. She takes the waiting room chair with ankles crossed and hands folded in her lap. Nothing about this body has started anything yet.',

    'The waistband of her jeans sits a touch higher than she intends when she pulls them on in the morning. A blouse she favors has begun to gap at the second-to-last button, barely, a detail she catches in the lobby door glass and files without addressing. Her hips and chest carry a little more volume than they did a season ago, and the fabric registers this with more honesty than she is ready for. She crosses the lobby without adjusting anything.',

    'She wears dresses more often now, a practical adjustment disguised as preference. Her hips fill and then overflow the fitted waistline of anything once called fitted, and the wrap dress has become the diplomatic solution she reaches for on clinic days. The hourglass is deep and pronounced, wider at bust and hip and still nipped at the waist. She walks with a roll in her hips she has stopped attempting to smooth.',

    'Her belly meets the waistband of whatever she wears and stays there, soft warm pressure she has stopped noting consciously. In the waiting room she sits with hands in her lap and belly rounding over the waistband between them. Her chest is heavy and her hips are wide and the figure is still unmistakably an hourglass, loud and full, impossible to obscure with any fabric choice she has tried. She stopped trying obscuring fabric choices some time ago.',

    'Her wardrobe has adapted around a body that kept growing after the shopping stopped: roomy wrap tops, elastic waistbands, fabrics that give. The shape beneath them is full and round at every point, chest and belly and hip and upper arm. She moves slowly through the lobby and takes the chair with the wider arms without making it a performance. Her body is warm and heavy and entirely real.',

    'The elevator over the stairs. A slow rolling walk from the lobby to the exam room, weight of her hips and belly setting the pace. She settles into the offered chair with gravity of someone who has accepted what this body is now. Her belly moves when she stops. Her arms are soft and her chest is heavy and she rests both hands in her lap and breathes.',

    'Her presence fills the lobby before she has spoken a word. She walks with slow and total roll of hip and belly, weight moving in long warm waves with each step. Her clothing covers without hiding: curves at chest and belly and hip are enormous and real and visible from across the waiting room. She arrives at the front desk and rests both forearms on it and breathes. She is very much here.',

    'Her hips have spread past the width of any lobby chair, and she settles for the bench along the wall where the mass of her can flow unhindered. The wrap dress, bought in the largest size the shop carried, strains at every point where curve meets seam. Bust and belly and hip carry more each visit, soft heavy weight that spreads sideways when she leans back. She walks the lobby slowly, one hand grazing the wall for balance.',

    'Her curves have swelled to a vast soft mass that fills the doorway edge to edge, and she turns slightly to bring the widest of herself through. The dress is a tent of stretched fabric over belly and hip, gapping wherever the width outpaces the cloth. She lowers herself onto the bench with both hands braced, and the flesh of her spreads to fill it. She breathes hard from the walk in and rests a palm on her chest.',

    'She can barely cross the lobby now, the enormous soft weight of her hips and belly slowing each step to a labored roll. Her thighs press wide and force a slow wide stance, and she covers a short stretch before she stops to rest. The dress stretches tight over curves that have outgrown every fitting room she once shopped. She grips the front desk edge and breathes, the whole warm mass of her settling.',

    'Standing wears her out fast now, so she takes the widest bench and lets the vast soft body settle where it will. Her belly floods her lap and her hips overrun the seat on both sides, curves spreading warm and heavy in every direction. Rising takes a brace and a count, and she stays down as long as she can. The dress drapes over her like a sheet laid over a swell.',

    'She arrives on a transport bed now, her body a titanic soft mass of belly and hip and bust that has outgrown standing entirely. The great warm spread of her fills the mattress rail to rail, settling into deep folds wherever gravity pulls. A loose dress lies draped over the vast rise of her middle. She breathes in slow swells, and the whole immense shape of her lifts and eases with each one.',
  ],

  pear: [
    'She arrives in straight-leg jeans and a fitted top, figure unremarkable and easy in its proportions. The clothes sit where they should: waistband flat, blouse smooth. Her shoulders are narrow and her hips are in proportion to everything else. She takes the nearest waiting room chair and crosses her legs at the ankle.',

    'Her favorite jeans have grown snug across the seat and the top of the thigh, a change she attributes to inconsistent washing temperatures and leaves at that. The blouse she wears still fits from collar to hem without comment. Her hips and thighs carry the early gain below the belt, announcing it low and private in a place she can choose to look past. She keeps the appointments all the same.',

    'Her hips have widened into the elastic of waistbands that once sat at her natural waist without friction. A belly she did not plan for has arrived low and round, pressing forward when she sits. She wears long cardigan covers over her tops and the combination works well enough from a distance. The lower half of her body is ahead of the upper by a margin that increases each month.',

    'Her hips brush the frame of the exam room door as she enters, a contact she registers and moves through. A belly that arrived quietly has grown round and low, adding forward curve to her stance when she is standing still. She walks with a wide sway she has stopped trying to reduce or conceal. The lower half of her body is warm and demanding of space and she has given it what it wants.',

    'The gap between her upper and lower body measurements has grown wide enough that off-the-rack dressing is a daily exercise in compromise. She wears separates only now, choosing tops and bottoms entirely independently. Her lower half is full and heavy: deep thighs, a wide rear, hips that fill the seat of every chair to its edges and past them. The contrast is total and she has stopped dressing around it.',

    'Her steps are slow and deliberate, roll at her hips visible under any fabric she wears. She navigates the clinic with practiced awareness of someone who has learned her own width through repetition. Her thighs press together from hip to knee when she stands. Her rear is heavy and round and full. The chair holds her, barely, and she fills every part of it that can be filled.',

    'Her hips define the space around her as she moves through it, wide and warm and requiring real room in every doorway. She turns slightly sideways at the narrowest points of the clinic and has learned which routes have enough width. Her thighs are dense and warm all the way down. Her belly hangs low and heavy. She settles into the waiting room chair with slow total weight of someone very large and entirely settled in that fact.',

    'Her hips have spread wider than the lobby doorway, and she angles through sideways, one heavy haunch clearing before the other. The stretch leggings, largest the shop stocked, shine tight across a rear that has swelled past all proportion to her narrow shoulders. Her thighs press together hip to knee in a solid heavy column. She rests against the wall halfway to the desk.',

    'Her lower body has swelled to a vast soft mass that dwarfs everything above the belt, hips and rear and thigh spreading in every direction. The leggings strain smooth and translucent over the enormous curve of her seat. She lowers onto the bench with both hands braced, and her hips flow over its edges. Each step is slow, and there are fewer between the rests.',

    'She can barely cross the lobby now, thighs so thick and heavy they force her legs apart and slow her walk to a labored roll. Her rear swings wide behind her, a great soft weight setting a pace she cannot rush. She covers a short stretch and grips the desk edge to rest, breath loud. The fabric of her leggings has surrendered to the shape and merely covers it.',

    'Standing tires her fast now, so she takes the widest bench and lets the vast lower body settle over its edges. Her hips pour past both sides of the seat, and her thighs spread into a broad soft shelf across her lap. Rising takes a brace and a count, and she stays down as long as she can. The leggings drape tight over a shape that outgrew every fitting room long ago.',

    'She arrives on a transport bed now, her lower body a titanic spread of hip and thigh and rear that has outgrown every chair and doorway. The mass of her flows over both sides of the mattress, warm and soft and immense, settling deeper with each hour. Loose fabric lies draped across the great slope of her hip. She shifts, and the whole vast lower half of her resettles slow as a tide.',
  ],

  apple: [
    'She arrives at the clinic in a crisp blouse tucked into tailored trousers, middle flat and posture upright. Nothing about her figure asks anything of the room or of the person looking. She sits with spine straight and hands in her lap and waits with patient ease of someone who has no pressing reason to rush. A clean silhouette. Nothing forward.',

    'Her blouse tents slightly at the front, a small forward lean in the fabric she smooths down when she takes her seat in the waiting room. The trousers still fit comfortably at the waist and hip; it is at the belly that things have begun to renegotiate. She adjusts the hem of her top before coming in and again in the elevator. The belly is soft and new and she has yet to decide what to make of it.',

    'Her middle has thickened with density that sits forward and high and shows in every top she puts on. Her chest has lifted with the belly as the two grow in concert, and deep breaths move the fabric of her blouse in slow, visible waves. She has moved away from anything tucked-in and begun wearing everything loose at the hem. The change is visible. She has kept coming in.',

    'Her belly is fully settled in her lap when she is seated, round and soft and completely present. She exhales with purpose when she lowers herself into the waiting room chair and does not hurry to leave it. Her blouse rounds over her midsection in a smooth unbroken curve from chest to waist. She has stopped tucking anything in. The decision made itself.',

    'One hand rests on her belly at her side when she stands, unconscious and habitual, as if confirming the weight is still there. Her middle is round and firm to the touch from the outside, deep and warm within. Her tops are all loose now, cut to skim rather than follow, and they skim faithfully over a very round belly. She fills chairs differently than she once did: the belly arrives first and settles full.',

    'She walks from the lobby to the exam room with chin up and breathing measured, belly moving in a long slow sway with each step. She is winded by the time she reaches the door and stands a moment with one hand pressed to her midsection before she enters. Her chest lifts and settles slowly over a middle that is large and warm and heavy. She is carrying real weight and she carries it openly.',

    'A rounded torso from collarbone to hip, full and warm and forward, belly carrying the weight of a long and patient gluttony. Her arms are soft and heavy. Her face is wide and warm. She moves through the clinic lobby with unhurried ease, for whom moving quickly is no longer the organizing principle. She carries her weight high and forward and openly, and the room adjusts around her without comment.',

    'Her belly has swelled into a broad forward mass that enters the lobby a stride ahead of her and rests on the desk before her hands reach it. The blouse, largest the shop carried, strains at every seam and rides up over the lower curve no matter how she tugs it. Her chest and arms have thickened with soft heavy weight. She walks slowly, one hand cradling the underside of the belly for the ballast of it.',

    'The belly hangs in a deep heavy shelf that reaches the top of her thighs, and she rests it against the desk when she stops. Two tops layered and stretched cover the vast forward mass and gap at the sides regardless. Her breathing is loud by the time she reaches a chair. She braces both palms on the counter, lets the belly hang, and takes her time.',

    'She can barely cross the lobby now, the forward mass of her belly throwing her weight ahead of her feet at every step. She walks in short slow pushes, one hand under the belly and the other reaching for the wall, and rests often. Her top stretches translucent over the enormous round swell of her middle. A short stretch and she stops, breath dragging, the whole heavy front of her rising and falling.',

    'Standing tips her too far forward to hold now, so she takes the reinforced bench with the belly filling her lap in a warm heavy flood. The great round mass rests on her thighs and spreads toward the edges of the seat, and she folds her soft arms atop it. Her top drapes over the swell like cloth over a hill. Rising takes a brace and a count, and she stays down as long as she can.',

    'She arrives on a transport bed now, her belly a titanic soft mountain that rises above the rest of her and has outgrown standing entirely. The mass of her middle spreads to both rails, warm and vast, settling into deep folds along its lower slope. Loose fabric lies draped over the great rise of it. She breathes in long swells, and the whole immense round of her belly lifts toward the ceiling and eases back.',
  ],

  athletic: [
    'She arrives in fitted athleisure: close-cut leggings, a muscle tee, outfit that reads as intentional on a body that still has real muscle in it. Her posture is square and her step is light. She looks like someone who still keeps a gym schedule. She takes the waiting room chair with back straight and hands on her knees.',

    'The muscle tee stretches slightly at the belly now, tension that was absent when she bought it. Her leggings still fit from waist to ankle; the waistband presses against skin that has grown softer than the flat plane it once rested against. Her definition has begun to share territory with something warmer and less deliberate. The gym schedule still exists on paper.',

    'Strength still shows in her shoulders and arms, solidity that announces itself in her posture and in the casual way she moves heavy things. Her belly has grown soft and round beneath the muscle tee and it lifts slightly when she walks. Her leggings are tighter at the thigh than they were when she enrolled. Power and softness coexist on this body and she has stopped choosing between them.',

    'The muscle memory has stayed. The muscle definition has faded. Soft flesh covers her upper arms and thighs and belly, warm and yielding when pressed. Her leggings work hard from waist to knee. She adjusts the waistband when she sits and again when she stands, a constant small negotiation between the garment and a body that has grown larger than it was designed to contain.',

    'The muscle is buried deep under soft mass that gives slowly and recovers gradually when pressed. She wears the athleisure as habit and identity now: leggings and tee that no longer suggest a gym, suggesting instead a woman who grew large and warm inside them and kept wearing them anyway. Her belly is round and forward. Her thighs are thick and press together mid-stride.',

    'Each step sends a visible ripple through her body, from thigh to belly to arm, a wave that takes a moment to settle after she stops moving. The posture is still that of an athlete: the confidence, the way she occupies space without checking whether she has permission. The body is much larger now, softer at every surface, heavier with every footfall. She knows both things and keeps walking.',

    'Plush and powerful: a body that trained for years and then spent two years gorging and kept everything from both periods. Her footfalls land with real weight, belly deep and round, arms soft and heavy at her sides. She fills the waiting room chair completely, thighs pressing against the arms, middle settled and full in her lap. Very large and entirely at ease with it.',

    'The athlete is gone beneath a spreading mass of soft heavy flesh that has claimed her belly and thighs and arms. The muscle tee, stretched to its limit, rides up over a middle swelled well past anything training left behind. She still moves with the old squared confidence, and the vast soft body follows a beat late. She walks the lobby slower each visit and rests against the wall without shame.',

    'Whatever muscle remains lies buried deep under a body spread massive and soft in every direction. The leggings strain across belly and hip and the thick soft column of her thighs. Her old power shows only in the steadiness of her stance, planted wide to hold the enormous weight. She breathes hard from the walk in and stops to let it settle.',

    'She can barely cross the lobby now, the mass of her belly and thighs slowing the trained body to a heavy labored roll. Her thighs press wide and force the old efficient stride into a slow lurch. The tee stretches tight over a frame swelled far past the athlete it was. She grips the desk edge and breathes, the whole soft weight of her heaving with it.',

    'Standing wearies her fast now, so she takes the reinforced bench that holds the vast soft body the athlete became. Her belly floods her lap and her thighs spread to the edges of the seat, the old strength showing only in how squarely she settles the mass. Her clothes drape loose over a shape no fitting room stocks. Rising takes a brace and a count, and she stays down.',

    'She arrives on a transport bed now, the trained body swelled into a titanic soft mass that has outgrown every stride she once ran. The weight spreads across the mattress rail to rail, warm and vast, deep folds settling where the muscle used to be. Loose fabric lies draped over the enormous rise of her middle. She breathes in slow deep swells, and the whole immense shape of her lifts and eases with each one.',
  ],

  willowy: [
    'She arrives in a linen dress that skims her slender frame without clinging to anything. Long limbs. A light step. She sits in the waiting room with knees angled to one side and long fingers folded in her lap. Her figure takes up very little of the chair and very little of the room.',

    'A softness has appeared at her hip and lower belly, modest and clear against the minimal starting point of her frame. She presses at it in the dressing room mirror before her appointment. Her dress still drapes as it was intended to. Her long legs still move with the same untroubled ease down the lobby.',

    'Her limbs are still long and still the first thing a person notices, carrying more now: soft filling-out along the inner thigh and upper arm that registers in the way fabric hangs when she is standing still. Her movement has slowed by a degree, grown more deliberate. She wears flowy things that accommodate the belly and hips without advertising them, and they do their job adequately and honestly. The long lines remain. The frame has simply begun to fill in around them.',

    'Weight has settled on her long bones with heaviness that shows in the careful way she lowers herself into seats and lifts herself back out of them. Her belly is round and warm beneath the loose blouse she wears. Her arms have filled in at the upper curve. She drapes into the waiting room chair with leisure of a body that has grown accustomed to taking its time, long frame finding its angles in the seat.',

    'Every pound reads clearly on a tall frame with so little history of carrying extra weight. The dress she wears strains slightly at the bust and falls more freely below, accommodating the belly and hip without fitting them exactly. Her thighs touch at mid-stride now. Her long arms are soft from shoulder to wrist. Height that once read as elegant reads now as simply very large.',

    'She fills the lobby doorway, long stride shortened and pace slowed, belly heavy and hips wide, arms soft and warm at her sides. She takes the waiting room chair and her thighs spread against the seat, pressing apart, heavy and full. The lobby air feels close around her. More body than she thought a long slim frame could hold, and she holds all of it without apology.',

    'A tall column of warmth and mass from jaw to ankle, full length of the frame packed dense and soft at every point. She walks through the lobby with total presence of something very large and very deliberate, belly heavy and hips wide, arms full and warm at her sides. Patients look up from their phones when she passes. She arrives at the front desk and the room shifts its attention to her without a word spoken.',

    'The long frame has packed massive now, tall bones buried under spreading soft weight that fills every inch they once left empty. The linen dress, largest the shop carried, strains at the bust and gaps over belly and hip. Her thighs press together hip to knee and force a slow wide roll into the old easy stride. She rests against the lobby wall halfway to the desk, tall and enormous and breathing hard.',

    'She is a tall column of soft heavy mass now, the length of her frame swelled wide from shoulder to thigh. A tented dress stretches over a belly grown deep and forward and a rear spread to match. She fills the doorway top to bottom and side to side and moves through it slowly. Her breath comes loud by the time she reaches a seat.',

    'She can barely cross the lobby now, the enormous soft mass on her long bones slowing every stride to a labored roll. Her thighs press wide and her belly swings low, and she covers a short stretch before gripping the desk for rest. The dress stretches tight over a frame filled far past what its height once promised. She breathes hard, tall and vast, and gathers herself for the next few steps.',

    'Standing taxes the long legs too fast now under all this weight, so she takes the reinforced bench built for the tall vast body she became. Her belly floods her lap and her hips overrun the seat, the length of her folded and settled deep into it. Her dress drapes loose over a shape that dwarfs every fitting room. Rising takes a brace and a count, and she stays down as long as she can.',

    'She arrives on a transport bed now, the tall frame swelled into a titanic soft mass from jaw to thigh that has outgrown standing entirely. The length of her spreads across the mattress rail to rail, warm and vast, settling into deep folds along the whole long slope of her. Loose fabric lies draped over the great rise of her middle. She breathes in slow swells, and the immense long shape of her lifts and eases with each one.',
  ],

  compact: [
    'She arrives in trim jeans and a fitted top, compact and tidy. Her short frame carries nothing extra. She moves quickly through the lobby with efficiency of someone who has always covered ground without needing much of it. She takes the chair nearest the door and sits with knees together, small and self-contained.',

    'A few pounds arrive fast on a short frame and announce themselves without waiting for permission. Her jeans are snug at the waist by Thursday. Her face has grown a trace softer along the jaw. She still moves quickly, still sits neatly, still arrives before her appointment window. The change is small and present and obvious in the way that small changes are on compact bodies.',

    'Each pound stacks dense on a short body, adding width and depth without adding height. She looks slightly lower to the ground than she did three months ago, more solid, settled more firmly into her own footprint. Rounder at every surface. She moves with new sturdiness she wears without ceremony or comment.',

    'Her belly rests in her lap when she sits, warm and soft and fully present. Her thighs are thick from hip to knee, pressing her knees gently apart when she is seated. Her arms have softened, adding gentle weight to every gesture she makes. She is short and she is full, and the combination means she fills every chair she sits in from edge to edge.',

    'A dense and grounded presence, low and heavy and real, she settles into the waiting room chair with weight the furniture registers. She sits with forearms on her knees and belly soft and full in her lap, short legs thick and face round and warm. The lobby feels smaller when she is in it. She is fully here, occupying her small vertical space with a great deal of weight in every horizontal direction.',

    'She moves through the lobby with compact jiggle, flesh at her belly and arms and thighs carrying their weight in a way that announces her before she rounds any corner. Small rooms feel smaller. She fills the waiting room chair past its edges, hips overrunning the seat, and settles there with calm authority of someone who knows exactly how much space she takes. She is still quick when she needs to be. The weight is considerable.',

    'A very small frame carrying a very large amount of herself, every seam of every garment negotiated with her appetite over a long period of time. She settles into the clinic chair with slow full weight, compact frame filled to every edge. Her belly is deep and round in her lap, cheeks full and warm. She has given this small body everything it wanted and watched it answer with thorough, hungry satisfaction.',

    'The short frame has packed enormous now, every pound stacking dense and wide on a body with no height to spread into. The fitted top, largest the shop carried, strains over a belly swelled broad and forward and low. Her thighs force her stance wide and her hips fill the doorway. She walks the lobby in slow short steps and rests against the wall more often than not.',

    'She has grown massive on a small frame, belly and hip and thigh spreading in every direction the height cannot. Her clothes are stretched to their limit over a body that widens by the visit. She lowers onto the bench with both hands, and the soft weight of her floods over its edges. Each step is slow and heavy, and there are fewer between rests.',

    'She can barely cross the lobby now, the dense enormous weight on her short legs slowing every step to a labored roll. Her thighs press wide and her belly swings low, and she covers a few feet before she grips the desk to rest. Her clothes stretch tight over a small frame carrying a vast load. She breathes hard, low and wide and heavy, and pushes off for the next short stretch.',

    'Standing tires the short legs fast now under all this dense weight, so she takes the reinforced bench that holds the enormous soft body the small frame became. Her belly floods her lap and her hips pour over both sides of the seat. Rising takes a count and a brace, and she stays put as long as she can. Her clothes drape loose over a shape no fitting room stocks.',

    'She arrives on a transport bed now, the small frame swelled into a titanic soft mass that has outgrown every chair and doorway. The dense enormous weight of her spreads across the mattress rail to rail, warm and vast, settling into deep folds wherever it pools. Loose fabric lies draped over the great round rise of her belly. She breathes in slow swells, and the whole immense low shape of her lifts and eases with each one.',
  ],
};
