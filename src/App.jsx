import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// LOGOS — The Adventure of Clear Thinking
// ═══════════════════════════════════════════════════════════════════

const STORAGE_KEY = "logos-progress-v1";
function loadProgress() {
  try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY)); return d && d.completed ? d : { completed: {}, scores: {} }; }
  catch { return { completed: {}, scores: {} }; }
}
function saveProgress(p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {} }

const THEMES = {
  explorer: { bg:"#FFF8F0",accent:"#E8722A",sec:"#F4A261",text:"#3D2C1E",card:"#FFF3E8",badge:"🌱",label:"Explorer",font:"'Baloo 2',cursive",fs:17,kid:true },
  adventurer: { bg:"#F0F5FF",accent:"#2563EB",sec:"#60A5FA",text:"#1E293B",card:"#E8F0FE",badge:"⚡",label:"Adventurer",font:"'Outfit',sans-serif",fs:15,kid:false },
  scholar: { bg:"#FAF5FF",accent:"#7C3AED",sec:"#A78BFA",text:"#2D1B4E",card:"#F3EAFF",badge:"🔮",label:"Scholar",font:"'Literata',Georgia,serif",fs:15,kid:false },
  philosopher: { bg:"#F0FAF4",accent:"#059669",sec:"#34D399",text:"#134E30",card:"#E6F7ED",badge:"🏛️",label:"Philosopher",font:"'Literata',Georgia,serif",fs:14,kid:false },
  master: { bg:"#FFF5F7",accent:"#BE185D",sec:"#F472B6",text:"#4A1230",card:"#FFE8EF",badge:"👁️",label:"Master",font:"'Literata',Georgia,serif",fs:14,kid:false },
};
const REALM_ORDER = ["explorer","adventurer","scholar","philosopher","master"];
const REALM_LABELS = { explorer:"Grades 2–4",adventurer:"Grades 5–8",scholar:"High School",philosopher:"Undergraduate",master:"Graduate & PhD" };

function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

const C = [
// REALM 1: EXPLORER (Grades 2-4) - written for smart 7-year-olds
{id:1,realm:"explorer",title:"True or False?",subtitle:"What is a statement?",
story:"Maya found a wise owl in the park. 🦉\n\nThe owl said: \"Some sentences are STATEMENTS. A statement is a sentence that is true or false.\"\n\nMaya asked: \"What about questions?\"\n\n\"Great thinking!\" the owl said. \"Questions are NOT statements. Neither are wishes or commands. Only sentences that say something true or false count.\"",
realWorld:"🔍 Detectives figure out what is true and what is false. Doctors decide if \"this patient has a fever\" is true or false. You use statements every day!",
learn:[
{type:"concept",title:"What is a Statement?",body:"A statement is a sentence that is TRUE or FALSE.\n\n🟢 \"Dogs have four legs.\" → TRUE\n🔴 \"The moon is made of cheese.\" → FALSE\n\nBoth are statements! One true, one false — but both CLAIM something."},
{type:"concept",title:"What is NOT a Statement?",body:"Some sentences are NOT statements:\n\n❓ \"Is it raining?\" → QUESTION\n👉 \"Sit down!\" → COMMAND\n🌟 \"I wish I could fly!\" → WISH\n😮 \"Wow!\" → REACTION\n\nYou can't say these are true or false!"},
{type:"example",title:"Let's Try Some!",body:"🟢 \"Cats have tails.\" → STATEMENT (true)\n👉 \"Please close the door.\" → NOT a statement\n❓ \"Do you like pizza?\" → NOT a statement\n🔴 \"2 + 2 = 7\" → STATEMENT (false!)\n🌟 \"I hope it snows!\" → NOT a statement"},
{type:"concept",title:"True ≠ Good, False ≠ Bad",body:"A true statement can be sad:\n😢 \"It rained on our picnic.\" → TRUE and sad\n\nA false statement can sound nice:\n😊 \"Everyone is happy.\" → FALSE but nice\n\nLogic only cares: TRUE or FALSE?"},
],
quiz:[
{q:"Which one is a statement?",opts:["\"Close the window!\"","\"Is it Tuesday?\"","\"Cats can fly.\"","\"Wow!\""],answer:2,explain:"\"Cats can fly\" is a statement (it's false!). The others are a command, question, and reaction."},
{q:"A statement has to be:",opts:["Always true","Always false","Either true or false","Nice to say"],answer:2,explain:"A statement just has to be true OR false. That's it!"},
{q:"Which is NOT a statement?",opts:["\"Snow is cold.\"","\"2 + 3 = 5\"","\"Please help me.\"","\"Fish swim.\""],answer:2,explain:"\"Please help me\" is a request — not true or false."},
{q:"\"I wish it were summer\" — is this a statement?",opts:["Yes!","No — wishes aren't statements"],answer:1,explain:"Wishes say what someone wants, not what is true or false."},
],
match:[
{left:"\"Dogs bark.\"",right:"✅ Statement (true)"},
{left:"\"Did you eat?\"",right:"❓ Question"},
{left:"\"Go to bed!\"",right:"👉 Command"},
{left:"\"Fish swim.\"",right:"✅ Statement (true)"},
{left:"\"I hope it snows.\"",right:"🌟 Wish"},
{left:"\"2 + 2 = 7\"",right:"🔴 Statement (false)"},
],
sort:{prompt:"Is it a STATEMENT or NOT?",categories:["✅ Statement","❌ Not a Statement"],
items:[{text:"\"The Earth is round.\"",cat:0},{text:"\"Are we there yet?\"",cat:1},{text:"\"7 is bigger than 3.\"",cat:0},{text:"\"Open your books!\"",cat:1},{text:"\"Bananas are purple.\"",cat:0},{text:"\"What a great day!\"",cat:1}]}
},

{id:2,realm:"explorer",title:"AND, OR, NOT",subtitle:"The three magic words",
story:"The owl gave Maya three magic words. 🪄\n\n\"AND means BOTH must be true.\"\n\"OR means AT LEAST ONE must be true.\"\n\"NOT just flips true to false!\"\n\nMaya tried: \"So 'I like dogs AND cats' is only true if I really like both?\"\n\n\"Exactly!\" 🦉",
realWorld:"🎮 Games use these! \"If key AND door, enter.\" Searches: 'dogs AND funny' = pages with BOTH. Every computer chip is built from AND, OR, NOT!",
learn:[
{type:"concept",title:"AND — Both Must Be True",body:"\"A AND B\" is only true when BOTH are true.\n\n🟢 AND 🟢 = 🟢\n🟢 AND 🔴 = 🔴\n🔴 AND 🟢 = 🔴\n🔴 AND 🔴 = 🔴\n\nYou need BOTH tickets to ride!"},
{type:"concept",title:"OR — At Least One",body:"\"A OR B\" is true when at least one is true.\n\n🟢 OR 🟢 = 🟢\n🟢 OR 🔴 = 🟢\n🔴 OR 🟢 = 🟢\n🔴 OR 🔴 = 🔴\n\nYou need at least ONE ticket!"},
{type:"concept",title:"NOT — The Flipper",body:"NOT flips the answer.\n\n🟢 → 🔴 (NOT true = false)\n🔴 → 🟢 (NOT false = true)\n\nIf \"sunny\" is true, \"NOT sunny\" is false."},
],
quiz:[
{q:"\"Warm AND sunny.\" Warm but NOT sunny. True or false?",opts:["True","False"],answer:1,explain:"AND needs BOTH. Since sunny is false, the whole thing is false."},
{q:"\"Pizza OR pasta.\" You get pizza. Happy?",opts:["Yes! OR means either works","No — need both"],answer:0,explain:"OR is true when at least one is true."},
{q:"NOT (2 + 2 = 4) =",opts:["True","False"],answer:1,explain:"2+2=4 is TRUE. NOT flips it → FALSE."},
{q:"\"Raining OR snowing.\" Neither happening.",opts:["True","False"],answer:1,explain:"OR needs at least one. Neither = false."},
],
match:[{left:"🟢 AND 🟢",right:"🟢 TRUE"},{left:"🟢 AND 🔴",right:"🔴 FALSE"},{left:"🔴 OR 🟢",right:"🟢 TRUE"},{left:"🔴 OR 🔴",right:"🔴 FALSE"},{left:"NOT 🟢",right:"🔴 FALSE"},{left:"NOT 🔴",right:"🟢 TRUE"}],
sort:{prompt:"Does it use AND, OR, or NOT?",categories:["AND","OR","NOT"],
items:[{text:"\"I have a dog and a cat.\"",cat:0},{text:"\"I don't like spinach.\"",cat:2},{text:"\"Monday or Tuesday.\"",cat:1},{text:"\"It's not raining.\"",cat:2},{text:"\"Smart and kind.\"",cat:0},{text:"\"Tea or juice?\"",cat:1}]}
},

{id:3,realm:"explorer",title:"If-Then Thinking",subtitle:"The most powerful tool!",
story:"\"Here's the biggest tool in ALL of thinking,\" the owl said. 🦉\n\n\"IF something is true, THEN something else follows.\"\n\nMaya's eyes got wide. \"Like Mom says: 'If you clean your room, THEN you can play outside'?\"\n\n\"Exactly! IF-THEN connects a REASON to a RESULT!\"",
realWorld:"🧪 Science: \"If water hits 32°F, it freezes.\" School rules: \"If homework done, free time.\" Cooking: \"If timer beeps, take cookies out.\" IF-THEN is everywhere!",
learn:[
{type:"concept",title:"What is If-Then?",body:"\"IF A, THEN B\" means:\nWhenever A is true, B must be true too.\n\n🌧️→☔ \"If rain, then umbrella.\"\n📚→✅ \"If study, then pass.\"\n\nIF = reason. THEN = result."},
{type:"concept",title:"When is It Broken?",body:"An If-Then is broken ONLY ONE WAY:\nThe IF happens, but the THEN doesn't.\n\n🌧️+☔forgot = BROKEN! 🔴\n🌧️+☔brought = KEPT! 🟢\n☀️+anything = NOT BROKEN! 🟢\n\nNo rain = no promise to break!"},
{type:"example",title:"Test These!",body:"\"If veggies, then dessert.\"\n\n🥦+🍰 → KEPT ✅\n🥦+❌ → BROKEN ❌\n❌+🍰 → Not broken ✅\n❌+❌ → Not broken ✅"},
],
quiz:[
{q:"\"If veggies, then dessert.\" Ate them, got dessert.",opts:["Kept! ✅","Broken ❌"],answer:0,explain:"IF happened, THEN happened. Promise kept!"},
{q:"\"If veggies, then dessert.\" Ate them, NO dessert.",opts:["Kept ✅","Broken! ❌"],answer:1,explain:"IF happened but THEN didn't. Broken!"},
{q:"\"If snow, no school.\" No snow. Broken?",opts:["Yes","No — no snow = no promise to break"],answer:1,explain:"IF didn't happen, so nothing to break!"},
{q:"If-Then is broken ONLY when:",opts:["IF is false","Both false","IF true but THEN false","Both true"],answer:2,explain:"The ONLY break: IF happens but THEN doesn't."},
],
match:[{left:"IF 🟢 THEN 🟢",right:"✅ Kept!"},{left:"IF 🟢 THEN 🔴",right:"❌ Broken!"},{left:"IF 🔴 THEN 🟢",right:"✅ Not broken"},{left:"IF 🔴 THEN 🔴",right:"✅ Not broken"}],
sort:{prompt:"KEPT or BROKEN?",categories:["✅ Kept","❌ Broken"],
items:[{text:"If rain→umbrella. Rained, brought it.",cat:0},{text:"If homework→games. Did it, no games!",cat:1},{text:"If sunny→park. Cloudy, stayed home.",cat:0},{text:"If study→pass. Studied, passed!",cat:0},{text:"If clean→allowance. Cleaned, nothing!",cat:1},{text:"If dog barks→cat runs. Dog slept.",cat:0}]}
},

{id:4,realm:"explorer",title:"Patterns & Predictions",subtitle:"How do we figure things out?",
story:"The owl led Maya to a garden. 🌸\n\nFlowers: 🔴🔵🔴🔵🔴...\n\n\"What's next?\"\n\"Blue!\" said Maya.\n\"HOW did you know?\"\n\"The pattern!\"\n\n\"That's INDUCTIVE reasoning — examples → prediction. But could someone plant a 🟡 instead?\"\n\nMaya paused. \"I guess so...\"\n\n\"Patterns give good guesses, not perfect answers!\"",
realWorld:"🌤️ Weather people use patterns to predict rain. Doctors use patterns of symptoms. You use patterns too — quiz every Friday? You predict one next Friday!",
learn:[
{type:"concept",title:"Inductive (Examples → Guess)",body:"See examples, figure out a rule:\n\n🦢 Swan 1: white\n🦢 Swan 2: white\n🦢 Swan 3: white\n→ \"ALL swans are white!\"\n\nBut... black swans exist! 🖤🦢\nInductive = probably right, not guaranteed."},
{type:"concept",title:"Deductive (Rule → Sure Answer)",body:"Start with a rule, use it:\n\n📏 Rule: All dogs are mammals.\n🐕 Fact: Rex is a dog.\n✅ Answer: Rex is a mammal!\n\nIf rule is true and fact is true, answer MUST be true. 100% guaranteed!"},
],
quiz:[
{q:"Every Monday it rains. You predict rain next Monday. Which type?",opts:["Deductive","Inductive"],answer:1,explain:"Examples → prediction = inductive!"},
{q:"All birds have feathers. Robin is a bird. So robin has feathers.",opts:["Deductive","Inductive"],answer:0,explain:"Rule → answer = deductive!"},
{q:"Which gives 100% sure answers?",opts:["Inductive","Deductive"],answer:1,explain:"Deductive gives guaranteed answers."},
{q:"1, 3, 5, 7, ... Next?",opts:["9 — pattern!","8","10"],answer:0,explain:"+2 each time. 7+2=9. Inductive thinking!"},
],
match:[{left:"Examples → Rule",right:"Inductive 🔍"},{left:"Rule → Answer",right:"Deductive ✅"},{left:"Probably true",right:"Inductive 🔍"},{left:"Definitely true",right:"Deductive ✅"}],
sort:{prompt:"INDUCTIVE or DEDUCTIVE?",categories:["🔍 Inductive","✅ Deductive"],
items:[{text:"100 sunrises → sun rises daily",cat:0},{text:"All fish swim. Nemo is fish. Nemo swims.",cat:1},{text:"Snows every winter → will snow this winter",cat:0},{text:"All squares have 4 sides. This is square. Has 4 sides.",cat:1}]}
},

{id:5,realm:"explorer",title:"Good Arguments",subtitle:"Does the answer really follow?",
story:"\"An ARGUMENT in logic isn't a fight!\" the owl said. 🦉\n\n\"It's REASONS + a CONCLUSION.\"\n\nMaya tried:\n\"All fish live in water.\nGoldie is a fish.\nSo Goldie lives in water!\"\n\n\"Perfect! That's VALID — the conclusion HAS to follow!\"",
realWorld:"📺 Commercials try to convince you. \"Athletes eat this cereal, SO you should buy it!\" Does that really follow? Spotting bad arguments is a superpower!",
learn:[
{type:"concept",title:"What is an Argument?",body:"Two parts:\n\n📋 REASONS (premises):\n  All mammals breathe air.\n  Whales are mammals.\n\n🎯 CONCLUSION:\n  Whales breathe air."},
{type:"concept",title:"Valid = Must Follow",body:"VALID: if reasons true, conclusion MUST be true.\n\n✅ All dogs bark. Rex is a dog. So Rex barks.\n❌ All dogs bark. Rex barks. So Rex is a dog.\n  (Rex might be a seal! Seals bark too!)"},
{type:"concept",title:"Sound = Valid + True Reasons 🏆",body:"Valid but wrong reasons:\n  All cats are green. (WRONG!)\n  Fluffy is a cat.\n  So Fluffy is green.\n\nLogic works — facts are wrong.\nSOUND = valid + true reasons = best! 🏆"},
],
quiz:[
{q:"All cats are purple. Tom is a cat. Tom is purple. This is:",opts:["Valid + true","Valid but wrong reasons","Not valid"],answer:1,explain:"Logic works, but cats aren't purple!"},
{q:"All dogs bark. Rex barks. So Rex is a dog. Valid?",opts:["Yes!","No — Rex could be something else!"],answer:1,explain:"Other things bark too! Conclusion doesn't follow."},
{q:"Best argument is:",opts:["Valid","True reasons","Valid AND true reasons (sound!) 🏆","Long"],answer:2,explain:"Sound = valid logic + true reasons. Gold standard!"},
],
match:[{left:"Reasons + Conclusion",right:"Argument"},{left:"Conclusion must follow",right:"Valid ✅"},{left:"Valid + true reasons",right:"Sound 🏆"},{left:"Doesn't follow",right:"Invalid ❌"}],
sort:{prompt:"VALID or INVALID?",categories:["✅ Valid","❌ Invalid"],
items:[{text:"All A are B. X is A. So X is B.",cat:0},{text:"All A are B. X is B. So X is A.",cat:1},{text:"No A are B. X is A. So X is not B.",cat:0},{text:"Some A are B. X is A. So X is B.",cat:1},{text:"If A then B. A true. So B true.",cat:0},{text:"If A then B. B true. So A true.",cat:1}]}
},

{id:6,realm:"explorer",title:"Tricky Arguments!",subtitle:"Fallacies — sneaky bad arguments",
story:"Maya noticed people making arguments that SOUNDED good but had tricks! 🃏\n\nHer friend: \"Everyone's buying this game, it MUST be the best!\"\n\nThe owl: 🦉 \"That's a FALLACY — a sneaky bad argument. Popularity doesn't equal quality!\"",
realWorld:"📺 Ads use fallacies all the time! \"Famous person uses it!\" \"Everyone's switching!\" Once you spot fallacies, you'll never be tricked!",
learn:[
{type:"concept",title:"Attack the Person",body:"Attack the PERSON instead of the argument.\n\n❌ \"You don't exercise, so your health advice is bad!\"\n\nWhether they exercise doesn't change if the advice is good!"},
{type:"concept",title:"Straw Man",body:"Change what someone said to attack it easier.\n\n🧑 \"Less homework please.\"\n👎 \"So you think we should NEVER learn?!\"\n\nNot what they said!"},
{type:"concept",title:"Bandwagon",body:"True because lots of people believe it.\n\n❌ \"A million bought it, must be best!\"\n\nLots of people can be wrong!"},
{type:"concept",title:"False Choice",body:"Only two options when there are more.\n\n❌ \"You're with us or against us!\"\n\nWhat about partly agreeing?"},
],
quiz:[
{q:"\"You think recycle? Well YOU drove here!\" This is:",opts:["Good point","Attack Person","Straw Man","False Choice"],answer:1,explain:"Attacks the person, not the argument."},
{q:"\"Love this place or hate pizza.\"",opts:["Bandwagon","Straw Man","Attack Person","False Choice"],answer:3,explain:"Way more options than two!"},
{q:"\"Everyone has this backpack, must be best.\"",opts:["Good argument","Bandwagon","Straw Man","Attack Person"],answer:1,explain:"Popular ≠ best."},
{q:"\"So you want to CANCEL tests?\" (they said shorter)",opts:["Attack Person","False Choice","Bandwagon","Straw Man"],answer:3,explain:"Changed what they said!"},
],
match:[{left:"Attack who said it",right:"Ad Hominem"},{left:"Change what they said",right:"Straw Man"},{left:"Everyone believes it!",right:"Bandwagon"},{left:"Only two options",right:"False Choice"}],
sort:{prompt:"Which fallacy?",categories:["Attack Person","Straw Man","Bandwagon","False Choice"],
items:[{text:"\"You failed, so your idea is bad.\"",cat:0},{text:"\"So you want NO rules?!\"",cat:1},{text:"\"All my friends think so!\"",cat:2},{text:"\"Love it or leave it!\"",cat:3}]}
},

// REALM 2: ADVENTURER (Grades 5-8)
{id:7,realm:"adventurer",title:"Symbolic Logic",subtitle:"Symbols instead of words",
story:"In 5th grade, Mr. Torres said: \"Logicians invented a symbol language.\" He wrote:\np ∧ q = \"p AND q\"\np ∨ q = \"p OR q\"\n¬p = \"NOT p\"\np → q = \"IF p THEN q\"\n\nMaya realized she could translate any sentence into precise symbols — like a secret code! 🔐",
realWorld:"Symbolic logic is the language computers run on. Every line of code, every database, every AI decision uses these symbols. This is the machine language underneath every app.",
learn:[
{type:"concept",title:"The Symbol Key",body:"p, q, r = any statements\n¬p = NOT p\np ∧ q = p AND q\np ∨ q = p OR q\np → q = IF p THEN q\np ↔ q = p IF AND ONLY IF q"},
{type:"concept",title:"English → Symbols",body:"\"Raining and cold\" → p ∧ q\n\"If study, pass\" → p → q\n\"Not sunny or hot\" → ¬p ∨ q"},
{type:"concept",title:"Order of Operations",body:"Like PEMDAS:\n1. ¬ (NOT) first\n2. ∧ (AND)\n3. ∨ (OR)\n4. → (IF-THEN)\n5. ↔ (IFF) last\nUse parentheses: (p ∧ q) → r"},
{type:"example",title:"Truth Table",body:"p | q | p ∧ q\nT | T |   T\nT | F |   F\nF | T |   F\nF | F |   F\n\nAND = true only when BOTH true."},
],
quiz:[
{q:"p ∨ q means:",opts:["p AND q","p OR q","NOT p","IF p THEN q"],answer:1,explain:"∨ = OR."},
{q:"\"If rain, stay home\" in symbols:",opts:["p ∧ q","p ∨ q","p → q","¬p"],answer:2,explain:"→ = IF...THEN."},
{q:"¬(p ∧ q) means:",opts:["NOT p AND NOT q","Not both p and q true","p OR q","IF NOT p THEN q"],answer:1,explain:"¬ applies to whole (p ∧ q)."},
{q:"p → q is FALSE when:",opts:["p F, q T","p T, q F","Both F","Both T"],answer:1,explain:"Only false when IF is true but THEN is false."},
],
match:[{left:"∧",right:"AND"},{left:"∨",right:"OR"},{left:"¬",right:"NOT"},{left:"→",right:"IF-THEN"},{left:"↔",right:"IFF"}],
sort:{prompt:"Translate to symbol:",categories:["p ∧ q","p ∨ q","p → q","¬p"],
items:[{text:"Hot and humid",cat:0},{text:"Bus or walk",cat:1},{text:"If call, I answer",cat:2},{text:"Not Friday",cat:3}]}
},

{id:8,realm:"adventurer",title:"Deduction Rules",subtitle:"The certified moves of logic",
story:"Mr. Torres introduced \"certified moves\" — rules so solid you can NEVER go wrong. \"Modus Ponens is king. If you know 'If A then B' and 'A,' conclude 'B.' Trusted since Aristotle — 2,000+ years.\"",
realWorld:"Science runs on these: \"If theory correct, expect X. We see X. Theory supported.\" Doctors, lawyers, engineers — all use these certified rules.",
learn:[
{type:"concept",title:"Modus Ponens (The King)",body:"If P then Q. (p → q)\nP is true.   (p)\nTherefore Q. (∴ q)\n\nIf rain → ground wet.\nIt's raining.\n∴ Ground is wet. ✓"},
{type:"concept",title:"Modus Tollens (Reverse)",body:"If P then Q.    (p → q)\nQ is NOT true.  (¬q)\n∴ NOT P.        (∴ ¬p)\n\nIf rain → wet ground.\nGround NOT wet.\n∴ It did NOT rain. ✓"},
{type:"concept",title:"Chain Rule",body:"If P then Q. (p → q)\nIf Q then R. (q → r)\n∴ If P then R. (∴ p → r)\n\nIf study → pass. If pass → graduate.\n∴ If study → graduate. ✓"},
{type:"concept",title:"Elimination",body:"P or Q.    (p ∨ q)\nNot P.     (¬p)\n∴ Q.       (∴ q)\n\nKeys in pocket or on table.\nNot in pocket.\n∴ On table. ✓"},
],
quiz:[
{q:"\"Snow → school closes. Snowed. School closes.\" Rule?",opts:["Modus Ponens","Modus Tollens","Chain","Elimination"],answer:0,explain:"If P then Q + P → Q."},
{q:"\"Snow → closes. Didn't close. Didn't snow.\" Rule?",opts:["Modus Ponens","Modus Tollens","Chain","Elimination"],answer:1,explain:"If P then Q + NOT Q → NOT P."},
{q:"\"Inside or outside. Not inside. So outside.\"",opts:["Modus Ponens","Modus Tollens","Chain","Elimination"],answer:3,explain:"P or Q + not P → Q."},
{q:"A→B and B→C gives:",opts:["A→C","C→A","B→A","Nothing"],answer:0,explain:"Chain Rule connects them."},
],
match:[{left:"p→q, p ∴ q",right:"Modus Ponens"},{left:"p→q, ¬q ∴ ¬p",right:"Modus Tollens"},{left:"p→q, q→r ∴ p→r",right:"Chain Rule"},{left:"p∨q, ¬p ∴ q",right:"Elimination"}],
sort:{prompt:"Which rule?",categories:["Modus Ponens","Modus Tollens","Chain","Elimination"],
items:[{text:"Bark→intruder. Barked. Intruder.",cat:0},{text:"Guilty→evidence. No evidence. Not guilty.",cat:1},{text:"Rain→flood. Flood→evacuate. Rain→evacuate.",cat:2},{text:"Left or right. Not left. Right.",cat:3}]}
},

{id:9,realm:"adventurer",title:"Sets & Venn Diagrams",subtitle:"Groups and how they overlap",
story:"Maya's math teacher drew overlapping circles. \"VENN DIAGRAMS show how groups relate. 'All dogs are mammals' = dogs circle INSIDE mammals circle. 'Some students play sports' = circles overlap.\"",
realWorld:"Databases are sets. \"Patients diabetic AND over 65\" = intersection. Libraries, biology classification, social media algorithms — all sets.",
learn:[
{type:"concept",title:"What is a Set?",body:"A collection of things.\nA = {1,2,3,4,5}\n\"3 ∈ A\" means 3 is in set A."},
{type:"concept",title:"Intersection ∩ (AND)",body:"A ∩ B = in BOTH.\nA={1,2,3,4} B={3,4,5,6}\nA ∩ B = {3,4}"},
{type:"concept",title:"Union ∪ (OR)",body:"A ∪ B = in EITHER (or both).\nA={1,2,3} B={3,4,5}\nA ∪ B = {1,2,3,4,5}"},
{type:"concept",title:"Subset ⊂",body:"A ⊂ B = every A member is in B.\n{dogs} ⊂ {mammals}\n{squares} ⊂ {rectangles}"},
],
quiz:[
{q:"A={1,2,3,4} B={3,4,5,6}. A ∩ B?",opts:["{1,2,3,4,5,6}","{3,4}","{1,2}","{5,6}"],answer:1,explain:"∩ = in BOTH. 3 and 4."},
{q:"A={a,b,c} B={c,d,e}. A ∪ B?",opts:["{c}","{a,b,c,d,e}","{a,b,d,e}","{a,b}"],answer:1,explain:"∪ = everything in either."},
{q:"\"All roses are flowers\" means:",opts:["Roses∩Flowers=∅","Roses⊂Flowers","Flowers⊂Roses","Roses=Flowers"],answer:1,explain:"Roses is a subset of flowers."},
],
match:[{left:"A ∩ B",right:"In BOTH"},{left:"A ∪ B",right:"In EITHER"},{left:"A ⊂ B",right:"All A inside B"},{left:"∈",right:"Is member of"},{left:"∅",right:"Empty set"}],
sort:{prompt:"∩, ∪, or ⊂?",categories:["Intersection ∩","Union ∪","Subset ⊂"],
items:[{text:"Play BOTH soccer AND basketball",cat:0},{text:"Play soccer OR basketball",cat:1},{text:"All puppies are dogs",cat:2},{text:"Like BOTH chocolate AND vanilla",cat:0},{text:"Everything in fridge or pantry",cat:1},{text:"Every square is a rectangle",cat:2}]}
},

{id:10,realm:"adventurer",title:"All, Some, None",subtitle:"Quantifiers",
story:"\"Be careful with ALL, SOME, NONE,\" Mr. Torres said. \"They change everything. 'All dogs bark' ≠ 'Some dogs bark.'\" He wrote: ∀ (for all) and ∃ (there exists).",
realWorld:"Contracts: 'All employees must...' vs 'Some may...' are wildly different. Science: 'All matter has mass' vs 'There exists a treatment...' Getting these wrong invalidates studies.",
learn:[
{type:"concept",title:"∀ — For All",body:"∀x means \"for EVERY x.\"\n∀x(Dog(x)→Mammal(x))\n\"Every dog is a mammal.\"\n\nTo DISPROVE: just ONE counter-example!"},
{type:"concept",title:"∃ — There Exists",body:"∃x means \"at least one x.\"\n∃x(Student(x)∧Tall(x))\n\"Some student is tall.\"\n\nTo PROVE: just ONE example!"},
{type:"concept",title:"Negating Quantifiers",body:"NOT(∀x P(x)) = ∃x NOT P(x)\n\"Not all passed\" = \"Someone didn't pass\"\n\nNOT(∃x P(x)) = ∀x NOT P(x)\n\"None passed\" = \"All didn't pass\"\n\nNegating FLIPS the quantifier!"},
],
quiz:[
{q:"\"All birds fly.\" Penguin can't. Proves:",opts:["Statement true","Statement false","Nothing","Need more data"],answer:1,explain:"One counter-example breaks a ∀ claim."},
{q:"∃x(Cat(x) ∧ Orange(x)) means:",opts:["All cats orange","No cats orange","At least one orange cat","If cat then orange"],answer:2,explain:"∃ = at least one exists."},
{q:"Negation of 'All passed':",opts:["None passed","All failed","At least one didn't pass","Most failed"],answer:2,explain:"NOT ∀ = ∃ NOT. Doesn't mean none did!"},
],
match:[{left:"∀",right:"For all"},{left:"∃",right:"There exists"},{left:"One counter-example breaks",right:"∀ claims"},{left:"One example proves",right:"∃ claims"}],
sort:{prompt:"Universal ∀ or Existential ∃?",categories:["Universal ∀","Existential ∃"],
items:[{text:"All humans need water",cat:0},{text:"Some speak 3 languages",cat:1},{text:"Every triangle has 3 sides",cat:0},{text:"A prime > 100 exists",cat:1},{text:"All evens divisible by 2",cat:0},{text:"Some mammals fly (bats!)",cat:1}]}
},

// REALM 3: SCHOLAR (High School)
{id:11,realm:"scholar",title:"Propositional Logic — Complete System",subtitle:"WFFs, equivalences, tautologies",
story:"\"Everything you've learned forms a complete formal system,\" Dr. Reyes said. \"Precise rules for well-formed formulas, proofs, and what the system can do. Think of it as a perfectly designed game with airtight rules.\"",
realWorld:"Digital circuit design. Every chip uses truth tables and equivalences. Cybersecurity. Software verification. This is the mathematical foundation.",
learn:[
{type:"concept",title:"Well-Formed Formulas",body:"Rules:\n1. Any variable (p, q, r) is a WFF\n2. If φ is WFF, then ¬φ is WFF\n3. If φ,ψ are WFFs: (φ∧ψ), (φ∨ψ), (φ→ψ), (φ↔ψ) are WFFs\n4. Nothing else.\n\n(p→(q∧r)) ✓   →p∧ ✗"},
{type:"concept",title:"Key Equivalences",body:"De Morgan's:\n  ¬(p∧q) ≡ ¬p∨¬q\n  ¬(p∨q) ≡ ¬p∧¬q\n\nContrapositive: (p→q) ≡ (¬q→¬p)\nDouble Negation: ¬¬p ≡ p\nMaterial Conditional: (p→q) ≡ (¬p∨q)"},
{type:"concept",title:"Tautology / Contradiction / Contingency",body:"TAUTOLOGY: Always true. p ∨ ¬p\nCONTRADICTION: Always false. p ∧ ¬p\nCONTINGENCY: Depends. p → q"},
],
quiz:[
{q:"¬(p∧q) ≡",opts:["¬p∧¬q","¬p∨¬q","p∨q","p→q"],answer:1,explain:"De Morgan's: NOT(AND) = OR of NOTs."},
{q:"Which is a tautology?",opts:["p∧q","p→p","p∧¬p","p→q"],answer:1,explain:"p→p always true."},
{q:"Contrapositive of 'If rain, ground wet':",opts:["Wet→rained","No rain→not wet","Not wet→no rain","Rain→wet"],answer:2,explain:"(p→q) ≡ (¬q→¬p). Logically equivalent!"},
],
match:[{left:"¬(p∧q)",right:"¬p∨¬q"},{left:"¬(p∨q)",right:"¬p∧¬q"},{left:"p→q",right:"¬q→¬p"},{left:"p→q",right:"¬p∨q"},{left:"¬¬p",right:"p"}],
sort:{prompt:"Tautology, Contradiction, or Contingency?",categories:["Tautology","Contradiction","Contingency"],
items:[{text:"p ∨ ¬p",cat:0},{text:"p ∧ ¬p",cat:1},{text:"p → q",cat:2},{text:"(p→q)∨(q→p)",cat:0},{text:"p∧q∧¬p",cat:1},{text:"p ∨ q",cat:2}]}
},

{id:12,realm:"scholar",title:"Predicate Logic",subtitle:"Objects, properties, relations",
story:"\"Propositional logic says 'It's raining.' It CANNOT say 'All primes > 2 are odd.' Predicate logic talks about objects, properties, and relations between them,\" Dr. Reyes explained.",
realWorld:"SQL queries are predicate logic. AI knowledge bases. Search engines processing 'Italian restaurants within 5 miles rated > 4 stars' — predicates over a database.",
learn:[
{type:"concept",title:"Predicates",body:"Properties/relations on objects:\nTall(x) — x is tall\nLoves(x,y) — x loves y\n\nFill in objects:\nTall(Everest) — TRUE\nLoves(Romeo, Juliet) — TRUE"},
{type:"concept",title:"Nested Quantifiers",body:"ORDER MATTERS!\n\n∀x∃y Loves(x,y) — Everyone loves someone\n(each person has a beloved)\n\n∃y∀x Loves(x,y) — Someone is loved by all\n(one person universally loved)\n\nSame symbols, different meaning!"},
{type:"concept",title:"Translation",body:"'Every studying student passes:'\n∀x((Student(x)∧Studies(x))→Passes(x))\n\n'No dog is a cat:'\n∀x(Dog(x)→¬Cat(x))\n\n'Some primes are even:'\n∃x(Prime(x)∧Even(x))"},
],
quiz:[
{q:"∀x∃y Loves(x,y) means:",opts:["One person everyone loves","Everyone loves everyone","Everyone loves someone","No one loves anyone"],answer:2,explain:"For ALL x, THERE EXISTS y that x loves."},
{q:"'No reptiles are mammals':",opts:["∀x(R(x)→M(x))","∀x(R(x)→¬M(x))","∃x(R(x)∧M(x))","¬∀x(R(x))"],answer:1,explain:"For all x, reptile → NOT mammal."},
{q:"Switching quantifier order changes meaning:",opts:["True!","False"],answer:0,explain:"∀x∃y ≠ ∃y∀x."},
],
match:[{left:"Tall(x)",right:"Property"},{left:"Loves(x,y)",right:"Relation"},{left:"∀x∃y P(x,y)",right:"For each x, some y"},{left:"∃y∀x P(x,y)",right:"One y for all x"}],
sort:{prompt:"Propositional or Predicate?",categories:["Propositional","Predicate"],
items:[{text:"p∧q→r",cat:0},{text:"∀x(Dog(x)→Barks(x))",cat:1},{text:"¬p∨q",cat:0},{text:"∃x(Prime(x)∧Even(x))",cat:1},{text:"(p→q)∧(q→r)",cat:0},{text:"∀x∀y(F(x,y)→F(y,x))",cat:1}]}
},

{id:13,realm:"scholar",title:"Proof Strategies",subtitle:"Direct, contradiction, induction",
story:"\"Many paths to truth,\" Dr. Reyes said. \"Direct proof marches from premises to conclusion. Contradiction assumes the opposite and shows it collapses. Induction proves for ALL natural numbers — infinite dominoes.\"",
realWorld:"Encryption relies on proofs about primes. Bridges rest on proven formulas. Mathematical proof is the most certain knowledge humans possess — true FOREVER.",
learn:[
{type:"concept",title:"Direct Proof",body:"Premises → rules → conclusion.\n\nProve: n even → n² even.\nn=2k → n²=4k²=2(2k²) → even. ∎"},
{type:"concept",title:"Proof by Contradiction",body:"Assume OPPOSITE. Show impossibility.\n\nProve √2 irrational.\nAssume √2=a/b reduced.\na²=2b² → a even → a=2c.\n4c²=2b² → b even.\nBoth even in reduced fraction? Impossible! ∎"},
{type:"concept",title:"Mathematical Induction",body:"For ALL natural numbers:\n1. BASE: Prove for n=1\n2. STEP: If true for k, then true for k+1\n\nFirst domino + chain reaction = all dominos!"},
],
quiz:[
{q:"Contradiction starts by:",opts:["Assuming what to prove","Assuming OPPOSITE","Starting with conclusion","Guessing"],answer:1,explain:"Assume opposite, show impossibility."},
{q:"Induction requires:",opts:["Just base","Just step","Both base AND step","Many examples"],answer:2,explain:"Need both: first domino + chain reaction."},
{q:"Direct proof goes:",opts:["Conclusion→Premises","Premises→Conclusion","Contradiction→Truth","Examples→General"],answer:1,explain:"Step by step from known to conclusion."},
],
match:[{left:"Assume opposite",right:"Contradiction"},{left:"Step by step",right:"Direct"},{left:"Base + inductive step",right:"Induction"},{left:"Reductio ad Absurdum",right:"Contradiction"}],
sort:{prompt:"Best strategy?",categories:["Direct","Contradiction","Induction"],
items:[{text:"n odd → n+1 even",cat:0},{text:"No largest prime",cat:1},{text:"1+2+...+n = n(n+1)/2",cat:2},{text:"√3 irrational",cat:1},{text:"First n odd numbers sum = n²",cat:2},{text:"Product of two odds is odd",cat:0}]}
},

// REALM 4: PHILOSOPHER (Undergraduate)
{id:14,realm:"philosopher",title:"Metalogic",subtitle:"Soundness, completeness, Gödel",
story:"In college, Maya encountered a vertiginous idea: logic studying ITSELF. Professor Chen asked: \"Is our system trustworthy? Does it prove everything true? Does it ever prove falsehood?\" Questions about the instrument, not the world it examines.",
realWorld:"CS: can this language express every computation? AI safety: can we guarantee safe reasoning? Foundations of math: are there truths we can never prove? Gödel's theorems revealed permanent structural limits.",
learn:[
{type:"concept",title:"Soundness",body:"SOUND: everything provable is true.\n⊢ φ implies ⊨ φ\nThe system never lies."},
{type:"concept",title:"Completeness",body:"COMPLETE: everything true is provable.\n⊨ φ implies ⊢ φ\nNothing true is missed."},
{type:"concept",title:"Gödel's Completeness (1930)",body:"First-order predicate logic IS complete.\nEvery valid formula has a proof.\nOur toolkit captures everything it should."},
{type:"concept",title:"Gödel's Incompleteness (1931)",body:"For consistent systems expressing arithmetic:\n\n1st: True statements exist that CANNOT be proven.\n2nd: System cannot prove its own consistency.\n\nTruths always escape formal nets."},
],
quiz:[
{q:"SOUND system:",opts:["Proves everything true","Never proves falsehood","No axioms","Always complete"],answer:1,explain:"Sound = no false positives."},
{q:"Gödel's 1st Incompleteness:",opts:["Logic useless","Some truths unprovable in the system","All math false","Computers can't compute"],answer:1,explain:"Sufficiently powerful consistent systems have true but unprovable statements."},
{q:"First-order logic is:",opts:["Sound not complete","Complete not sound","Both","Neither"],answer:2,explain:"Gödel 1930: both sound and complete."},
],
match:[{left:"Provable → true",right:"Soundness"},{left:"True → provable",right:"Completeness"},{left:"True but unprovable",right:"Incompleteness"},{left:"FOL is complete",right:"Gödel 1930"}],
sort:{prompt:"Soundness or Completeness?",categories:["Soundness","Completeness"],
items:[{text:"Never proves falsehoods",cat:0},{text:"Every truth has a proof",cat:1},{text:"⊢φ implies ⊨φ",cat:0},{text:"⊨φ implies ⊢φ",cat:1},{text:"No false positives",cat:0},{text:"No false negatives",cat:1}]}
},

{id:15,realm:"philosopher",title:"Modal Logic",subtitle:"Necessity and possibility",
story:"Professor Chen: \"So far: what IS true. Modal logic: what MUST be true and what COULD be true. □φ for necessity, ◇φ for possibility, Kripke's possible worlds to make it precise.\"",
realWorld:"CS: program NECESSARILY correct? Philosophy: free will, determinism. Linguistics: 'must,' 'might,' 'should.' AI: epistemic logic for knowledge and belief.",
learn:[
{type:"concept",title:"Modal Operators",body:"□φ = necessarily true (all accessible worlds)\n◇φ = possibly true (some accessible world)\n\n□φ ≡ ¬◇¬φ\n◇φ ≡ ¬□¬φ"},
{type:"concept",title:"Kripke Semantics",body:"Model: worlds W, accessibility R, valuation V.\n□φ at w iff φ true at ALL R-accessible worlds.\n◇φ at w iff φ true at SOME R-accessible world."},
{type:"concept",title:"Modal Systems",body:"K: basic. T: reflexive (□φ→φ).\nS4: +transitive (□φ→□□φ).\nS5: equivalence (◇φ→□◇φ)."},
{type:"concept",title:"Extensions",body:"Epistemic: K_a φ = a KNOWS φ\nDoxastic: B_a φ = a BELIEVES φ\nDeontic: Oφ = OBLIGATORY φ\nTemporal: Gφ = ALWAYS hereafter"},
],
quiz:[
{q:"□p means:",opts:["Possible","Necessary","False","Believed"],answer:1,explain:"□ = necessity."},
{q:"◇p ≡ ¬□¬p means:",opts:["Possible iff not necessarily false","Necessary iff not possibly false","True","Contingent"],answer:0,explain:"Possible = not necessarily false."},
{q:"S5: ◇p→□◇p means:",opts:["If possible, necessarily possible","If necessary, possible","All necessary","Nothing contingent"],answer:0,explain:"Possibility is stable in S5."},
],
match:[{left:"□φ",right:"Necessarily φ"},{left:"◇φ",right:"Possibly φ"},{left:"K_a φ",right:"a knows φ"},{left:"Oφ",right:"Obligatory φ"}],
sort:{prompt:"Necessity □ or Possibility ◇?",categories:["Necessity □","Possibility ◇"],
items:[{text:"2+2 must = 4",cat:0},{text:"Could rain tomorrow",cat:1},{text:"Bachelors are unmarried",cat:0},{text:"Might be life on Mars",cat:1},{text:"Triangles have 3 sides",cat:0},{text:"Could've been born elsewhere",cat:1}]}
},

// REALM 5: MASTER (Graduate/PhD)
{id:16,realm:"master",title:"Model Theory",subtitle:"Structures, truth, algebraic logic",
story:"Graduate seminar with Professor Okonkwo. \"Syntax: grammar of symbols. Semantics: meaning. Model theory: the deep structural relationship between the two. The results are among the most beautiful in mathematics.\"",
realWorld:"Databases ARE models. Compactness has consequences for graph theory, combinatorics, infinite structures. Connects to algebra, geometry, number theory.",
learn:[
{type:"concept",title:"Structures and Models",body:"Structure M = (D, I)\nD = domain. I = interpretation.\n\nModel of T = structure satisfying all sentences of T."},
{type:"concept",title:"Compactness Theorem",body:"If every FINITE subset of Σ has a model, then Σ has a model.\n\nConsequences: 'finite' not FOL-definable. Non-standard arithmetic models exist."},
{type:"concept",title:"Löwenheim-Skolem",body:"Down: countable theory + infinite model → countable model.\nUp: infinite model → models of every infinite cardinality.\n\nSkolem's Paradox: ZFC has a countable model."},
{type:"concept",title:"Elementary Equivalence",body:"M ≡ N: same FOL truths.\nElementary embedding j:M→N preserves all FOL formulas."},
],
quiz:[
{q:"Compactness implies:",opts:["All theories have finite models","Finiteness is FOL-expressible","Finite-subset satisfiability → full satisfiability","All models compact"],answer:2,explain:"Core of compactness."},
{q:"Löwenheim-Skolem (Down):",opts:["All finite","Infinite theories have countable models","No models","Same size"],answer:1,explain:"Infinite models → countable models exist."},
],
match:[{left:"Domain+Interpretation",right:"Structure"},{left:"Satisfies T",right:"Model"},{left:"Finite→whole",right:"Compactness"},{left:"Same FOL truths",right:"Elem. Equivalence"}],
sort:{prompt:"Compactness or Löwenheim-Skolem?",categories:["Compactness","Löwenheim-Skolem"],
items:[{text:"'Finite' not FOL-definable",cat:0},{text:"ZFC has countable model",cat:1},{text:"Non-standard arithmetic",cat:0},{text:"Models in all infinite sizes",cat:1}]}
},

{id:17,realm:"master",title:"Computability & Decidability",subtitle:"Limits of algorithmic reason",
story:"\"The deepest question,\" Okonkwo said. \"Can an algorithm always decide validity?\" Propositional: yes. Predicate: NO. Church-Turing 1936: no algorithm decides all FOL validity. Logic proved its own computational limits.",
realWorld:"Halting Problem = fundamental CS limit. P vs NP = biggest open question. Software verification, AI reasoning, automation of math — all bounded by these results.",
learn:[
{type:"concept",title:"Decision Problems",body:"DECIDABLE: algorithm always terminates correctly.\n• Propositional tautology? ✓\n\nUNDECIDABLE: no such algorithm.\n• FOL validity? ✗\n• Halting Problem? ✗"},
{type:"concept",title:"Church-Turing Thesis",body:"Every computable function = Turing machine computable.\nNot a theorem but a definition of 'computable.'\nTMs ≡ lambda calculus ≡ recursive functions."},
{type:"concept",title:"Halting Problem",body:"No algorithm determines if arbitrary P halts on I.\nProof: Assume H exists. Build D using H that contradicts itself.\nDiagonal argument, cousin to Cantor's."},
{type:"concept",title:"Complexity Classes",body:"P: polynomial time. NP: polynomial verification.\nP =? NP: the question.\nSAT: first NP-complete (Cook-Levin 1971)."},
],
quiz:[
{q:"FOL validity:",opts:["Decidable","Undecidable","Both","Not a decision problem"],answer:1,explain:"Church-Turing 1936."},
{q:"Halting Problem:",opts:["Easy","Undecidable","In P","Decidable but slow"],answer:1,explain:"Turing proved it undecidable."},
{q:"SAT is:",opts:["Undecidable","In P","NP-complete","Trivial"],answer:2,explain:"First NP-complete problem."},
],
match:[{left:"Always terminates",right:"Decidable"},{left:"No algorithm",right:"Undecidable"},{left:"Poly time",right:"P"},{left:"Poly verify",right:"NP"}],
sort:{prompt:"Decidable or Undecidable?",categories:["Decidable","Undecidable"],
items:[{text:"Propositional tautology?",cat:0},{text:"Turing machine halts?",cat:1},{text:"FOL validity?",cat:1},{text:"Is number prime?",cat:0}]}
},

{id:18,realm:"master",title:"Non-Classical Logics",subtitle:"Intuitionistic, paraconsistent, fuzzy",
story:"\"Classical logic: bivalence. Every statement true or false,\" Okonkwo said. \"Challenge that assumption and entirely new landscapes open.\" Intuitionistic: constructive proof. Paraconsistent: contradiction without explosion. Fuzzy: degrees of truth.",
realWorld:"Fuzzy: industrial control, washing machines to subways. Paraconsistent: contradictory databases. Intuitionistic: type theory, Haskell/Agda/Lean via Curry-Howard.",
learn:[
{type:"concept",title:"Intuitionistic Logic",body:"Rejects excluded middle (p∨¬p not axiom).\nTruth = constructive proof.\n¬¬p ↛ p.\nCurry-Howard: proofs = programs, props = types."},
{type:"concept",title:"Paraconsistent Logic",body:"Classical: p∧¬p ⊢ q (explosion).\nParaconsistent blocks explosion.\nContradictions contained, not catastrophic."},
{type:"concept",title:"Fuzzy Logic",body:"Truth in [0,1] not {0,1}.\n'Tall' = 0.7.\nAND: min. OR: max. NOT: 1-a.\nCaptures natural language vagueness."},
{type:"concept",title:"Relevance Logic",body:"Premises must BEAR ON conclusion.\n'If moon=cheese then 2+2=4' — classically valid, relevance-rejected."},
],
quiz:[
{q:"Intuitionistic rejects:",opts:["Modus Ponens","Excluded middle","All connectives","Quantifiers"],answer:1,explain:"No assumed p∨¬p."},
{q:"Fuzzy: 'tall'=0.8 → NOT tall =",opts:["0.8","0","0.2","1"],answer:2,explain:"NOT a = 1-a."},
{q:"Paraconsistent is valuable because:",opts:["No contradictions","Everything true","Reasons despite contradictions","No vagueness"],answer:2,explain:"Contains contradictions without collapse."},
],
match:[{left:"No excluded middle",right:"Intuitionistic"},{left:"Tolerates contradictions",right:"Paraconsistent"},{left:"Truth in [0,1]",right:"Fuzzy"},{left:"Premises must connect",right:"Relevance"}],
sort:{prompt:"Which logic?",categories:["Intuitionistic","Paraconsistent","Fuzzy"],
items:[{text:"Constructive proof required",cat:0},{text:"Conflicting database data",cat:1},{text:"How 'warm' is 72°F?",cat:2},{text:"Proofs = programs",cat:0},{text:"Inconsistent sensor data",cat:1},{text:"Washing machine 'dirtiness'",cat:2}]}
},
];

// ══════════════════════════════════════════════════════════════
//  UI COMPONENTS
// ══════════════════════════════════════════════════════════════

function LearnView({unit}){
  const t=THEMES[unit.realm],k=t.kid;
  return(<div style={{animation:"fadeIn 0.3s ease-out"}}>
    <div style={{background:`linear-gradient(135deg,${t.card},${t.bg})`,borderRadius:k?20:14,padding:k?"28px 24px":"22px 24px",marginBottom:24,borderLeft:`5px solid ${t.accent}`,position:"relative"}}>
      <div style={{position:"absolute",top:-13,left:18,background:t.accent,color:"#fff",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase"}}>Story</div>
      <p style={{fontFamily:t.font,fontSize:k?17:15,lineHeight:1.85,color:t.text,margin:0,whiteSpace:"pre-line"}}>{unit.story}</p>
    </div>
    {unit.learn.map((item,i)=>(
      <div key={i} style={{background:"#fff",borderRadius:k?16:12,padding:k?"22px":"18px 22px",marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",borderLeft:`4px solid ${item.type==="example"?t.sec:t.accent}`,animation:`slideUp 0.4s ease-out ${i*0.08}s both`}}>
        <div style={{fontSize:10,fontWeight:700,color:item.type==="example"?t.sec:t.accent,textTransform:"uppercase",letterSpacing:1.2,marginBottom:5}}>{item.type==="example"?"✏️ Example":"💡 Concept"}</div>
        <h4 style={{margin:"0 0 10px",fontSize:k?18:16,color:t.text,fontFamily:t.font,fontWeight:700}}>{item.title}</h4>
        <pre style={{fontFamily:k?"'Baloo 2',cursive":"'JetBrains Mono',monospace",fontSize:k?16:13.5,lineHeight:k?1.8:1.7,color:t.text,margin:0,whiteSpace:"pre-wrap",background:"transparent"}}>{item.body}</pre>
      </div>
    ))}
    <div style={{background:t.card,borderRadius:k?20:14,padding:k?"28px 24px":"22px 24px",marginTop:8,borderLeft:`5px solid ${t.sec}`,position:"relative"}}>
      <div style={{position:"absolute",top:-13,left:18,background:t.sec,color:"#fff",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase"}}>Why This Matters</div>
      <p style={{fontFamily:t.font,fontSize:k?16:14,lineHeight:1.75,color:t.text,margin:0}}>{unit.realWorld}</p>
    </div>
  </div>);
}

function QuizView({unit,onComplete}){
  const[cur,setCur]=useState(0),[sel,setSel]=useState(null),[score,setScore]=useState(0),[done,setDone]=useState(false);
  const[qs]=useState(()=>shuffle(unit.quiz));
  const t=THEMES[unit.realm],k=t.kid;
  const pick=(i)=>{if(sel!==null)return;setSel(i);if(i===qs[cur].answer)setScore(s=>s+1);};
  const next=()=>{if(cur+1>=qs.length){setDone(true);onComplete&&onComplete(score);return;}setCur(c=>c+1);setSel(null);};
  const retry=()=>{setCur(0);setSel(null);setScore(0);setDone(false);};

  if(done){const pct=Math.round(score/qs.length*100);
    return(<div style={{textAlign:"center",padding:k?48:36,animation:"bounceIn 0.5s ease-out"}}>
      <div style={{fontSize:k?72:56,marginBottom:16}}>{pct===100?"🏆":pct>=80?"🎉":pct>=50?"👍":"💪"}</div>
      <h3 style={{fontFamily:t.font,fontSize:k?26:22,color:t.text}}>{score}/{qs.length} ({pct}%)</h3>
      <p style={{color:t.text,opacity:0.6,fontSize:k?16:14,marginTop:8}}>{pct===100?"Perfect!":pct>=80?"Great job!":pct>=50?"Good — try again!":"Keep practicing!"}</p>
      <button onClick={retry} style={{marginTop:24,padding:k?"14px 36px":"12px 28px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:k?17:15,fontWeight:700,cursor:"pointer"}}>Try Again</button>
    </div>);
  }

  const q=qs[cur];
  return(<div style={{animation:"fadeIn 0.3s ease-out"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,fontSize:k?14:13,color:t.text,opacity:0.5}}>
      <span>Q {cur+1}/{qs.length}</span><span>Score: {score}</span>
    </div>
    <h3 style={{fontFamily:t.font,fontSize:k?20:18,color:t.text,marginBottom:20,lineHeight:1.5}}>{q.q}</h3>
    <div style={{display:"flex",flexDirection:"column",gap:k?12:10}}>
      {q.opts.map((opt,i)=>{
        let bg="#fff",bd=`2px solid ${t.card}`;
        if(sel!==null){if(i===q.answer){bg="#e8f5e9";bd="2px solid #4caf50";}else if(sel===i){bg="#ffebee";bd="2px solid #ef5350";}}
        return(<button key={i} onClick={()=>pick(i)} style={{padding:k?"16px 20px":"13px 18px",background:bg,border:bd,borderRadius:k?14:10,textAlign:"left",cursor:sel!==null?"default":"pointer",fontSize:k?16:15,color:t.text,fontFamily:t.font,transition:"all 0.2s",minHeight:k?52:44,animation:sel===i&&i!==q.answer?"shake 0.3s ease-out":"none"}}>
          <span style={{fontWeight:700,marginRight:10,color:t.accent}}>{String.fromCharCode(65+i)}.</span>{opt}
        </button>);
      })}
    </div>
    {sel!==null&&(
      <div style={{marginTop:20,animation:"slideUp 0.3s ease-out"}}>
        <div style={{background:sel===q.answer?"#e8f5e9":"#ffebee",borderRadius:12,padding:"16px 20px",marginBottom:16,lineHeight:1.6}}>
          <span style={{fontWeight:700,marginRight:8}}>{sel===q.answer?"✅ Correct!":"❌ Not quite."}</span>
          <span style={{fontSize:k?15:14,color:t.text}}>{q.explain}</span>
        </div>
        <button onClick={next} style={{padding:k?"14px 32px":"12px 28px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:k?16:14,fontWeight:700,cursor:"pointer"}}>{cur+1>=qs.length?"See Results":"Next →"}</button>
      </div>
    )}
  </div>);
}

function MatchView({unit}){
  const[pairs]=useState(()=>{const p=unit.match.map((m,i)=>({...m,id:i}));return{left:shuffle(p),right:shuffle(p)};});
  const[selSide,setSelSide]=useState(null);
  const[matched,setMatched]=useState(new Set());
  const[wrong,setWrong]=useState(null);
  const t=THEMES[unit.realm],k=t.kid;

  const click=(side,id)=>{
    if(matched.has(id))return;
    if(!selSide){setSelSide({side,id});setWrong(null);}
    else if(selSide.side===side){setSelSide({side,id});setWrong(null);}
    else{
      if(selSide.id===id){setMatched(new Set([...matched,id]));setSelSide(null);}
      else{setWrong({side,id});setTimeout(()=>setWrong(null),700);}
    }
  };

  if(matched.size===pairs.left.length)return(
    <div style={{textAlign:"center",padding:k?48:36,animation:"bounceIn 0.5s ease-out"}}>
      <div style={{fontSize:k?72:56,marginBottom:16}}>🎯</div>
      <h3 style={{fontFamily:t.font,fontSize:k?24:20,color:t.text}}>All matched!</h3>
      <button onClick={()=>{setMatched(new Set());setSelSide(null);}} style={{marginTop:20,padding:k?"14px 32px":"12px 28px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:k?16:14,fontWeight:700,cursor:"pointer"}}>Play Again</button>
    </div>
  );

  const btn=(side,p)=>{
    const isSel=selSide?.side===side&&selSide?.id===p.id,isMat=matched.has(p.id),isW=wrong?.side===side&&wrong?.id===p.id;
    return(<button key={p.id} onClick={()=>click(side,p.id)} disabled={isMat} style={{
      padding:k?"14px 16px":"11px 14px",borderRadius:k?14:10,fontSize:k?15:13,
      fontFamily:"'JetBrains Mono',monospace",cursor:isMat?"default":"pointer",textAlign:"left",
      transition:"all 0.2s",minHeight:k?48:40,animation:isW?"shake 0.3s ease-out":"none",
      background:isMat?"#e8f5e9":isSel?t.accent:isW?"#ffebee":"#fff",
      color:isMat?"#4caf50":isSel?"#fff":isW?"#ef5350":t.text,
      border:`2px solid ${isMat?"#4caf50":isSel?t.accent:isW?"#ef5350":t.card}`,
      opacity:isMat?0.5:1,
    }}>{side==="left"?p.left:p.right}</button>);
  };

  return(<div style={{animation:"fadeIn 0.3s ease-out"}}>
    <p style={{fontSize:k?15:13,color:t.text,opacity:0.5,marginBottom:16}}>Tap one item, then its match. {matched.size}/{pairs.left.length} found.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:k?14:10}}>
      <div style={{display:"flex",flexDirection:"column",gap:k?10:7}}>{pairs.left.map(p=>btn("left",p))}</div>
      <div style={{display:"flex",flexDirection:"column",gap:k?10:7}}>{pairs.right.map(p=>btn("right",p))}</div>
    </div>
  </div>);
}

function SortView({unit}){
  const s=unit.sort;
  const[items]=useState(()=>shuffle(s.items.map((it,i)=>({...it,id:i}))));
  const[answers,setAnswers]=useState({});
  const[show,setShow]=useState(false);
  const t=THEMES[unit.realm],k=t.kid;
  const assign=(id,ci)=>{if(!show)setAnswers(a=>({...a,[id]:ci}));};
  const allDone=Object.keys(answers).length===items.length;
  const correct=items.filter(it=>answers[it.id]===it.cat).length;

  return(<div style={{animation:"fadeIn 0.3s ease-out"}}>
    <p style={{fontSize:k?17:15,fontWeight:600,color:t.text,marginBottom:6,fontFamily:t.font}}>{s.prompt}</p>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
      {s.categories.map((c,i)=>(<span key={i} style={{background:t.card,padding:k?"8px 16px":"6px 12px",borderRadius:20,fontSize:k?14:12,fontWeight:700,color:t.accent}}>{i+1}. {c}</span>))}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:k?12:10}}>
      {items.map(it=>{
        const a=answers[it.id]!==undefined,ok=show&&a&&answers[it.id]===it.cat,bad=show&&a&&answers[it.id]!==it.cat;
        return(<div key={it.id} style={{display:"flex",alignItems:"center",gap:12,padding:k?"14px 16px":"12px 14px",borderRadius:k?14:10,background:ok?"#e8f5e9":bad?"#ffebee":"#fff",border:`2px solid ${ok?"#4caf50":bad?"#ef5350":t.card}`,transition:"all 0.2s",flexWrap:"wrap",animation:bad?"shake 0.3s ease-out":"none"}}>
          <span style={{flex:1,fontSize:k?15:14,color:t.text,fontFamily:t.font,minWidth:100}}>{it.text}</span>
          <div style={{display:"flex",gap:k?8:6,flexShrink:0}}>
            {s.categories.map((_,ci)=>(<button key={ci} onClick={()=>assign(it.id,ci)} style={{width:k?44:36,height:k?44:36,borderRadius:k?12:8,fontSize:k?17:14,fontWeight:700,cursor:show?"default":"pointer",transition:"all 0.15s",background:answers[it.id]===ci?t.accent:"transparent",color:answers[it.id]===ci?"#fff":t.text,border:`2px solid ${answers[it.id]===ci?t.accent:t.card}`}}>{ci+1}</button>))}
          </div>
          {bad&&<span style={{fontSize:12,color:"#ef5350",fontWeight:700}}>→{it.cat+1}</span>}
        </div>);
      })}
    </div>
    <div style={{marginTop:20,display:"flex",gap:12,flexWrap:"wrap"}}>
      {allDone&&!show&&(<button onClick={()=>setShow(true)} style={{padding:k?"14px 32px":"12px 28px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:k?16:14,fontWeight:700,cursor:"pointer"}}>Check Answers</button>)}
      {show&&(<>
        <div style={{padding:"12px 20px",background:correct===items.length?"#e8f5e9":"#fff8e1",borderRadius:12,fontWeight:700,color:t.text,fontFamily:t.font}}>{correct}/{items.length}{correct===items.length?" 🎉":""}</div>
        <button onClick={()=>{setAnswers({});setShow(false);}} style={{padding:k?"14px 32px":"12px 28px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:k?16:14,fontWeight:700,cursor:"pointer"}}>Try Again</button>
      </>)}
    </div>
  </div>);
}

// ══════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════

const TABS=[{key:"learn",label:"📖 Learn"},{key:"quiz",label:"❓ Quiz"},{key:"match",label:"🎯 Match"},{key:"sort",label:"🗂️ Sort"}];

export default function LogosApp(){
  const[unit,setUnit]=useState(null),[tab,setTab]=useState("learn"),[prog,setProg]=useState(loadProgress);
  useEffect(()=>{saveProgress(prog);},[prog]);
  const mark=(id,sc)=>setProg(p=>({...p,completed:{...p.completed,[id]:true},scores:{...p.scores,[id]:Math.max(sc||0,p.scores?.[id]||0)}}));
  const back=()=>{setUnit(null);setTab("learn");};
  const cc=Object.keys(prog.completed).length,total=C.length;

  if(unit!==null){
    const u=C.find(x=>x.id===unit),t=THEMES[u.realm],k=t.kid;
    return(<div style={{minHeight:"100vh",background:t.bg,fontFamily:t.font}}>
      <div style={{padding:k?"18px 20px":"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${t.card}`,position:"sticky",top:0,background:t.bg,zIndex:10}}>
        <button onClick={back} style={{background:t.card,border:"none",borderRadius:10,width:k?44:38,height:k?44:38,fontSize:18,cursor:"pointer",color:t.text,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{flex:1}}>
          <span style={{fontSize:11,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:1.2}}>{t.badge} Unit {u.id}</span>
          <h2 style={{margin:0,fontSize:k?20:18,color:t.text,fontFamily:"'Outfit',sans-serif",fontWeight:800}}>{u.title}</h2>
        </div>
        {prog.completed[u.id]&&<span style={{fontSize:20}} title="Completed">✅</span>}
      </div>
      <div style={{display:"flex",gap:6,padding:"12px 20px",borderBottom:`1px solid ${t.card}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        {TABS.map(tb=>(<button key={tb.key} onClick={()=>setTab(tb.key)} style={{padding:k?"10px 18px":"8px 16px",borderRadius:20,fontSize:k?14:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",background:tab===tb.key?t.accent:"transparent",color:tab===tb.key?"#fff":t.text,border:`2px solid ${tab===tb.key?t.accent:"transparent"}`}}>{tb.label}</button>))}
      </div>
      <div style={{padding:"24px 20px",maxWidth:720,margin:"0 auto"}}>
        {tab==="learn"&&<div><LearnView unit={u}/><div style={{textAlign:"center",marginTop:28}}>
          <button onClick={()=>{mark(u.id,0);setTab("quiz");}} style={{padding:k?"14px 36px":"12px 28px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:k?17:15,fontWeight:700,cursor:"pointer"}}>{k?"Ready to Practice! →":"Continue to Quiz →"}</button>
        </div></div>}
        {tab==="quiz"&&<QuizView key={`q-${u.id}-${Date.now()}`} unit={u} onComplete={sc=>mark(u.id,sc)}/>}
        {tab==="match"&&<MatchView key={`m-${u.id}-${Date.now()}`} unit={u}/>}
        {tab==="sort"&&<SortView key={`s-${u.id}-${Date.now()}`} unit={u}/>}
      </div>
    </div>);
  }

  return(<div style={{minHeight:"100vh",background:"#FDFAF5",fontFamily:"'Outfit',sans-serif"}}>
    <div style={{padding:"44px 24px 28px",textAlign:"center",background:"linear-gradient(180deg,#FFF8F0,#FDFAF5)"}}>
      <div style={{fontSize:44,marginBottom:4}}>🏛️</div>
      <h1 style={{margin:0,fontSize:40,fontWeight:900,color:"#3D2C1E",letterSpacing:-1}}>LOGOS</h1>
      <p style={{margin:"6px 0 0",fontSize:16,color:"#8B7355",fontFamily:"'Literata',serif",fontStyle:"italic"}}>The Adventure of Clear Thinking</p>
      {cc>0&&<div style={{maxWidth:300,margin:"16px auto 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#B8A88A",marginBottom:4}}><span>{cc}/{total} units</span><span>{Math.round(cc/total*100)}%</span></div>
        <div style={{height:6,background:"#EDE5D8",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#E8722A,#F4A261)",borderRadius:3,width:`${cc/total*100}%`,transition:"width 0.5s"}}/></div>
      </div>}
    </div>
    <div style={{maxWidth:640,margin:"0 auto",padding:"8px 20px 60px"}}>
      {REALM_ORDER.map(realm=>{
        const t=THEMES[realm],units=C.filter(u=>u.realm===realm),rc=units.filter(u=>prog.completed[u.id]).length;
        return(<div key={realm} style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:24}}>{t.badge}</span>
            <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:800,color:t.text}}>{t.label}</h2>
              <span style={{fontSize:12,color:t.accent,fontWeight:600}}>{REALM_LABELS[realm]}</span></div>
            {rc>0&&<span style={{fontSize:12,color:t.sec,fontWeight:700,background:t.card,padding:"4px 10px",borderRadius:12}}>{rc}/{units.length}</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {units.map(u=>(<button key={u.id} onClick={()=>setUnit(u.id)} style={{
              display:"flex",alignItems:"center",gap:16,padding:"16px 20px",
              background:"#fff",border:`2px solid ${t.card}`,borderRadius:14,
              cursor:"pointer",textAlign:"left",transition:"all 0.2s",
              boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=t.card;e.currentTarget.style.transform="translateY(0)";}}
            >
              <div style={{width:40,height:40,borderRadius:10,background:t.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:t.accent,flexShrink:0,fontFamily:"'JetBrains Mono',monospace"}}>{u.id}</div>
              <div style={{flex:1}}>
                <h3 style={{margin:0,fontSize:15,fontWeight:700,color:t.text}}>{u.title}</h3>
                <p style={{margin:"2px 0 0",fontSize:12,color:t.text,opacity:0.5}}>{u.subtitle}</p>
              </div>
              {prog.completed[u.id]?<span style={{fontSize:16}}>✅</span>:<span style={{fontSize:18,color:t.accent}}>→</span>}
            </button>))}
          </div>
        </div>);
      })}
      {cc>0&&<div style={{textAlign:"center",marginTop:16}}>
        <button onClick={()=>{if(confirm("Reset all progress?")){localStorage.removeItem(STORAGE_KEY);setProg({completed:{},scores:{}});}}} style={{background:"none",border:"none",fontSize:13,color:"#ccc",cursor:"pointer",padding:"8px 16px"}}>Reset Progress</button>
      </div>}
    </div>
  </div>);
}
