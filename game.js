/* Movie Mogul — Football Chairman-style studio sim. No deps, localStorage saves. */
/* Bilingual (EN/FR via i18n.js) + Golden Reel saga + Monolith nemesis + rogue-lite relics/blessings/curses/twists/streaks. */
'use strict';
const $ = id => document.getElementById(id);
const L = o => ((o && (o[LANG] !== undefined ? o[LANG] : o.en)) || '');
const fmt$ = n => {
  const neg = n < 0; n = Math.abs(Math.round(n));
  let s;
  if (n >= 1e9) s = (n/1e9).toFixed(2)+'B';
  else if (n >= 1e6) s = (n/1e6).toFixed(1)+'M';
  else if (n >= 1e3) s = (n/1e3).toFixed(0)+'K';
  else s = ''+n;
  return (neg?'-$':'$')+s;
};
const fmtFans = n => n>=1e6 ? (n/1e6).toFixed(2)+'M' : n>=1e3 ? (n/1e3).toFixed(1)+'K' : ''+Math.round(n);
const rnd = (a,b)=>a+Math.random()*(b-a);
const ri = (a,b)=>Math.floor(rnd(a,b+1));
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
const lvLbl = () => (LANG === 'fr' ? 'Nv' : 'Lv');

const GENRES = [
  {name:'Action', fr:'Action', emoji:'💥', spectacle:true},
  {name:'Comedy', fr:'Comédie', emoji:'😂', spectacle:false},
  {name:'Drama', fr:'Drame', emoji:'🎭', spectacle:false},
  {name:'Horror', fr:'Horreur', emoji:'👻', spectacle:false},
  {name:'Sci-Fi', fr:'Science-fiction', emoji:'🚀', spectacle:true},
  {name:'Romance', fr:'Romance', emoji:'💘', spectacle:false},
  {name:'Thriller', fr:'Thriller', emoji:'🔪', spectacle:false},
  {name:'Animation', fr:'Animation', emoji:'✨', spectacle:true},
];
const gname = n => { const g = GENRES.find(x=>x.name===n); return g ? (LANG==='fr'?g.fr:g.name) : n; };
const gemoji = n => (GENRES.find(x=>x.name===n)||{}).emoji || '🎬';
const TITLE_BITS = {
  'Action':[['Iron','Midnight','Crimson','Steel','Final','Shadow'],['Vengeance','Protocol','Siege','Reckoning','Storm','Justice']],
  'Comedy':[['Super','Awkward','Total','My Big','Barely','Extreme'],['Hangover','Roommates','Wedding','Road Trip','Neighbors','Grandma']],
  'Drama':[['The Last','Silent','Broken','Paper','Winter','Golden'],['Promise','Letter','Harbor','Sonata','Winter','Echo']],
  'Horror':[['The','Dead','Cursed','Hollow','Bloody','Whispering'],['Manor','Attic','Cult','Night','Hollow','Shadow']],
  'Sci-Fi':[['Star','Neon','Quantum','Solar','Chrome','Void'],['Odyssey','Horizon','Paradox','Uprising','Drift','Signal']],
  'Romance':[['Summer','Paris','Second','Midnight','Sweet','Endless'],['Hearts','Kiss','Summer','Vow','Melody','Sunset']],
  'Thriller':[['The','Dark','Silent','Vanishing','Twisted','Buried'],['Witness','Game','Secret','Alibi','Trap','Confession']],
  'Animation':[['Captain','Magic','Turbo','Sunny','Brave Little','Moon'],['Paws',' Express','Bot','Kingdom','Crew','Quest']],
};
const LOGLINES = {
  'Action':['A retired operative must stop a city-wide attack in 48 hours.','A heist crew takes one last job aboard a moving fortress.'],
  'Comedy':['Two mismatched roommates fake success until everything explodes.','A wedding planner falls for the one guest she must avoid.'],
  'Drama':['A family secret resurfaces over one long winter weekend.','A retired boxer trains the kid who beat him.'],
  'Horror':['A crew renovates a manor that does not want to be renovated.','A late-night radio host takes a call from tomorrow.'],
  'Sci-Fi':['A salvage pilot finds a signal that should not exist.','The last lighthouse on a drowning Earth hides a ship.'],
  'Romance':['Two rivals keep meeting in every city but their own.','A bookstore owner and a critic feud through one rainy season.'],
  'Thriller':['A witness realizes the detective is hiding the truth.','A getaway driver takes a passenger she cannot drop off.'],
  'Animation':['A stray robot pup must deliver a lost letter across the sky kingdom.','Two rival noodle shops cook for the Moon Festival crown.'],
};
const FIRST=['Ava','Leo','Maya','Kai','Zoe','Rex','Nina','Otis','Lena','Marcus','Ivy','Dario','Sasha','Theo','Priya','Jonah','Cleo','Ezra','Wren','Hugo','Mila','Silas','Noor','Felix','June','Atlas','Ruby','Oscar','Luna','Miles','Juno','Cassius','Vera','Otto','Isla','Remy'];
const LAST=['Sterling','Vance','Marlowe','Quill','Cross','Halloway','Reyes','Blackwood','Calloway','Thorn','Ashford','Night','Crow','Vale','Storm','Granger','Lockhart','Fable','Rook','Slate','Moon','Dagger','Frost','Ember','Wild','Kane','Lux','Reel','Nova','Sharp','Okafor','Lindqvist','Moreau','Vasquez'];
const name = () => pick(FIRST)+' '+pick(LAST);
const POSTERS=['🎬','💥','👻','🚀','💘','🔪','✨','😂','🎭','🌃','🏝️','🦖','🤖','🧙','🚗','🎪'];

const DIFFS = {
  indie:{cash:20e6, rep:45, fans:4000, label:'Indie'},
  major:{cash:50e6, rep:55, fans:10000, label:'Major'},
  behemoth:{cash:120e6, rep:65, fans:40000, label:'Behemoth'},
};
const BUDGETS=[
  {id:'micro', label:{en:'📱 Micro',fr:'📱 Micro'}, amount:3e6, desc:{en:'Festival-style. Best for Horror/Comedy.',fr:'Style festival. Idéal Horreur/Comédie.'}},
  {id:'indie', label:{en:'🎞️ Indie',fr:'🎞️ Indé'}, amount:8e6, desc:{en:'Smart mid-low. Drama/Thriller sweet spot.',fr:'Malin et modeste. Parfait Drame/Thriller.'}},
  {id:'mid', label:{en:'🎥 Mid-budget',fr:'🎥 Budget moyen'}, amount:20e6, desc:{en:'The classic. Room for stars + marketing.',fr:'Le classique. Stars + pub possibles.'}},
  {id:'tent', label:{en:'🔥 Tentpole',fr:'🔥 Superproduction'}, amount:45e6, desc:{en:'Spectacle ready. Needs a big gross.',fr:'Pour le spectacle. Exige un gros carton.'}},
  {id:'block', label:{en:'🌟 Blockbuster',fr:'🌟 Blockbuster'}, amount:90e6, desc:{en:'Bet the studio. Go huge or go home.',fr:'On mise le studio. Énorme ou rien.'}},
];
const MARKETING=[
  {id:'none', label:{en:'🤫 None',fr:'🤫 Aucune'}, pct:0, desc:{en:'Word of mouth only.',fr:'Bouche-à-oreille uniquement.'}},
  {id:'limited', label:{en:'📣 Limited',fr:'📣 Légère'}, pct:0.25, desc:{en:'25% of budget. Trailers + social.',fr:'25 % du budget. Bandes-annonces + réseaux.'}},
  {id:'standard', label:{en:'📺 Standard',fr:'📺 Normale'}, pct:0.5, desc:{en:'50% of budget. TV + press tour.',fr:'50 % du budget. Télé + promo.'}},
  {id:'blitz', label:{en:'🌍 Blitz',fr:'🌍 Totale'}, pct:1.0, desc:{en:'100% of budget. Everywhere.',fr:'100 % du budget. Partout.'}},
];
const WINDOWS=[
  {id:'dump', label:{en:'🗑️ Dump it',fr:'🗑️ Sortie discrète'}, mod:0.85, cost:0, desc:{en:'Quiet month. Cheap, low turnout.',fr:'Mois calme. Pas cher, peu de monde.'}, rev:0},
  {id:'standard', label:{en:'🎟️ Standard',fr:'🎟️ Normale'}, mod:1.0, cost:0, desc:{en:'Normal weekend. No bonus.',fr:'Week-end normal. Sans bonus.'}, rev:0},
  {id:'summer', label:{en:'☀️ Summer',fr:'☀️ Été'}, mod:1.25, cost:5e6, desc:{en:'+$5M. Huge crowds. Spectacle only*',fr:'+5 M$. Foule énorme. Spectacle only*'}, rev:-2},
  {id:'festival', label:{en:'🎪 Festival',fr:'🎪 Festival'}, mod:0.9, cost:2e6, desc:{en:'+$2M. +8 reviews, 2× awards buzz.',fr:'+2 M$. +8 critiques, 2× buzz des prix.'}, rev:8},
  {id:'holiday', label:{en:'🎄 Holiday',fr:'🎄 Fêtes'}, mod:1.2, cost:4e6, desc:{en:'+$4M. Families + prestige.',fr:'+4 M$. Familles + prestige.'}, rev:2},
];
const SCALES=[
  {id:'limited', label:{en:'🎞️ Limited',fr:'🎞️ Limitée'}, sub:{en:'600 screens',fr:'600 salles'}, mod:0.72, cost:0, rev:4, desc:{en:'Arthouse path. +4 reviews.',fr:'Voie arty. +4 critiques.'}},
  {id:'wide', label:{en:'🎟️ Wide',fr:'🎟️ Large'}, sub:{en:'3,000 screens',fr:'3 000 salles'}, mod:1.0, cost:1e6, rev:0, desc:{en:'Standard rollout.',fr:'Sortie classique.'}},
  {id:'mega', label:{en:'🌍 Mega-wide',fr:'🌍 Géante'}, sub:{en:'4,500 screens',fr:'4 500 salles'}, mod:1.22, cost:6e6, rev:0, desc:{en:'+$6M. Needs 55+ avg fame.',fr:'+6 M$. Exige 55+ de notoriété.'}},
];
const UPG={
  lot:{icon:'🏗️', name:{en:'Studio Lot',fr:'Plateaux de studio'}, costs:[0,10e6,25e6,50e6,90e6], desc:{en:'+2 film quality / lvl · −5% costs / lvl',fr:'+2 qualité / nv · −5 % coûts / nv'}},
  marketing:{icon:'📣', name:{en:'Marketing Dept',fr:'Service pub'}, costs:[0,8e6,20e6,40e6,70e6], desc:{en:'+25% marketing power / lvl',fr:'+25 % de puissance pub / nv'}},
  distribution:{icon:'🌐', name:{en:'Distribution',fr:'Distribution'}, costs:[0,8e6,18e6,35e6,60e6], desc:{en:'+3% gross & +2% studio share / lvl',fr:'+3 % recettes & +2 % part studio / nv'}},
  writers:{icon:'✍️', name:{en:"Writers' Room",fr:'Salle des scénaristes'}, costs:[0,6e6,15e6,30e6,55e6], desc:{en:'+script quality · 4th script at Lv3+',fr:'+qualité scénarios · 4e scénario dès Nv3+'}},
  vfx:{icon:'🖥️', name:{en:'VFX Lab',fr:'Labo VFX'}, costs:[0,8e6,18e6,38e6,65e6], desc:{en:'+6% spectacle gross / lvl · saves cheap spectacle at Lv3+',fr:'+6 % spectacle / nv · sauve le spectacle cheap dès Nv3+'}},
  talent:{icon:'🤝', name:{en:'Talent Agency',fr:'Agence d’acteurs'}, costs:[0,7e6,16e6,32e6,58e6], desc:{en:'+3 talent skill / lvl · −6% fees / lvl',fr:'+3 talent / nv · −6 % cachets / nv'}},
  streaming:{icon:'📡', name:{en:'Streaming Platform',fr:'Plateforme streaming'}, costs:[0,10e6,22e6,45e6,80e6], desc:{en:'Quarterly payouts + bigger catalog drops',fr:'Revenus trimestriels + gros catalogue'}},
  pr:{icon:'🛡️', name:{en:'PR & Legal',fr:'RP & juridique'}, costs:[0,5e6,12e6,25e6,45e6], desc:{en:'Shields rep · softens scandals & flops',fr:'Protège la réputation · adoucit scandales'}},
};
const STAFF={
  producer:{icon:'🎬', name:{en:'Showrunner Producer',fr:'Producteur délégué'}, desc:{en:'+1.5 film quality / lvl',fr:'+1,5 qualité / nv'}, hire:[0,4e6,9e6,16e6], salary:[0,1e6,2e6,3.5e6]},
  guru:{icon:'📣', name:{en:'Marketing Guru',fr:'Gourou du marketing'}, desc:{en:'+12% marketing power / lvl',fr:'+12 % puissance pub / nv'}, hire:[0,3e6,7e6,12e6], salary:[0,0.8e6,1.6e6,2.8e6]},
  scout:{icon:'🔭', name:{en:'Talent Scout',fr:'Dénicheur de talents'}, desc:{en:'+5 talent skill / lvl · −5% fees / lvl',fr:'+5 talent / nv · −5 % cachets / nv'}, hire:[0,2e6,5e6,9e6], salary:[0,0.6e6,1.2e6,2e6]},
  accountant:{icon:'🧮', name:{en:'Shark Accountant',fr:'Comptable requin'}, desc:{en:'−4% all production costs / lvl',fr:'−4 % coûts de prod / nv'}, hire:[0,2e6,5e6,8e6], salary:[0,0.5e6,1e6,1.8e6]},
  awards:{icon:'🏆', name:{en:'Awards Consultant',fr:'Consultant des prix'}, desc:{en:'+12% awards win chance / lvl',fr:'+12 % chances aux prix / nv'}, hire:[0,3e6,6e6,10e6], salary:[0,0.7e6,1.4e6,2.2e6]},
  franchise:{icon:'🦸', name:{en:'Franchise Manager',fr:'Manager de franchise'}, desc:{en:'+10% sequel gross / lvl · less fatigue',fr:'+10 % suites / nv · moins de lassitude'}, hire:[0,3e6,7e6,12e6], salary:[0,0.7e6,1.5e6,2.5e6]},
};
const ACTS=[
  {id:'party', icon:'🎉', name:{en:'Premiere Party',fr:'Soirée de première'}, cost:3e6, desc:{en:'+fans, +1 rep',fr:'+fans, +1 réputation'}},
  {id:'workshop', icon:'📝', name:{en:'Script Workshop',fr:'Atelier d’écriture'}, cost:2e6, desc:{en:'Next scripts +2 quality',fr:'Prochains scénarios +2'}},
  {id:'scout', icon:'🔭', name:{en:'Scouting Trip',fr:'Tour de repérage'}, cost:2e6, desc:{en:'Next talent +8 skill',fr:'Prochains talents +8'}},
  {id:'campaign', icon:'🏆', name:{en:'Awards Push',fr:'Campagne des prix'}, cost:5e6, desc:{en:'+awards odds this year',fr:'+de chances cette année'}},
  {id:'gala', icon:'💝', name:{en:'Charity Gala',fr:'Gala caritatif'}, cost:4e6, desc:{en:'+3 rep',fr:'+3 réputation'}},
  {id:'drop', icon:'📀', name:{en:'Streaming Drop',fr:'Carton streaming'}, cost:0, desc:{en:'Cash out catalog (1×/yr)',fr:'Encaisser le catalogue (1×/an)'}},
  {id:'loan', icon:'🏦', name:{en:'Bank',fr:'Banque'}, cost:0, desc:{en:'Borrow / repay $30M',fr:'Emprunter / rembourser 30 M$'}},
];
/* Rogue-lite: relics (permanent vault), blessings & curses (per-run draft), yearly twists */
const RELICS = {
  clapboard:{icon:'🎞️', name:{en:'Lucky Clapboard',fr:'Clap porte-bonheur'}, desc:{en:'+6% gross on every film',fr:'+6 % de recettes sur chaque film'}},
  pen:{icon:'🖊️', name:{en:'Golden Pen',fr:'Plume d’or'}, desc:{en:'+1 script quality',fr:'+1 en qualité de scénario'}},
  megaphone:{icon:'📣', name:{en:'Silver Megaphone',fr:'Mégaphone d’argent'}, desc:{en:'+10% marketing power',fr:'+10 % de puissance pub'}},
  archive:{icon:'📼', name:{en:'Archive Reel',fr:'Bobine d’archives'}, desc:{en:'Catalog income ×2',fr:'Revenus catalogue ×2'}},
  shield:{icon:'🛡️', name:{en:'Stunt Shield',fr:'Bouclier de cascadeur'}, desc:{en:'Halve rep loss on flops',fr:'Perte de réputation /2 sur les navets'}},
  charm:{icon:'🌟', name:{en:'Star Charm',fr:'Charme star'}, desc:{en:'+5 talent skill',fr:'+5 en talent'}},
  ticket:{icon:'🎟️', name:{en:'Golden Ticket',fr:'Ticket d’or'}, desc:{en:'+8% awards chance',fr:'+8 % de chances aux prix'}},
  vault:{icon:'💰', name:{en:'Producer’s Vault',fr:'Coffre du producteur'}, desc:{en:'+$12M starting cash',fr:'+12 M$ au départ'}},
  goldenreel:{icon:'🏆', name:{en:'Golden Reel',fr:'Bobine d’Or'}, desc:{en:'+8% gross & awards',fr:'+8 % recettes & prix'}},
};
const BLESSINGS = {
  starfall:{icon:'🌠', name:{en:'Starfall',fr:'Pluie de stars'}, desc:{en:'+8 talent skill',fr:'+8 en talent'}},
  muse:{icon:'💋', name:{en:'Muse’s Kiss',fr:'Baiser de la muse'}, desc:{en:'+1 script quality',fr:'+1 en scénario'}},
  hype:{icon:'🎈', name:{en:'Pre-Hype',fr:'Buzz d’avance'}, desc:{en:'+5 rep & +50K fans to start',fr:'+5 réputation et +50 k fans au départ'}},
  spoon:{icon:'🥄', name:{en:'Silver Spoon',fr:'Cuillère d’argent'}, desc:{en:'+$15M starting cash',fr:'+15 M$ au départ'}},
  critic:{icon:'⭐', name:{en:'Critic’s Pet',fr:'Chouchou des critiques'}, desc:{en:'+5 reviews on every film',fr:'+5 en critiques sur chaque film'}},
  scrappy:{icon:'🔧', name:{en:'Scrappy',fr:'Débrouillard'}, desc:{en:'−10% all costs',fr:'−10 % sur tous les coûts'}},
};
const CURSES = {
  drought:{icon:'🏜️', name:{en:'Prestige Drought',fr:'Disette de prestige'}, desc:{en:'−30% awards chance',fr:'−30 % de chances aux prix'}},
  leak:{icon:'🪣', name:{en:'Leaky Lot',fr:'Studio passoire'}, desc:{en:'Chaos events strike far more often',fr:'Événements bien plus fréquents'}},
  jaded:{icon:'🥱', name:{en:'Jaded Public',fr:'Public blasé'}, desc:{en:'−8% gross on everything',fr:'−8 % de recettes sur tout'}},
  chaos:{icon:'🌪️', name:{en:'Chaos Reigns',fr:'Règne du chaos'}, desc:{en:'+20% talent fees',fr:'+20 % sur les cachets'}},
  typecast:{icon:'🏷️', name:{en:'Typecast',fr:'Étiqueté'}, desc:{en:'Sequel fatigue ×2',fr:'Lassitude des suites ×2'}},
  slump:{icon:'📉', name:{en:'Opening Slump',fr:'Démarrage en panne'}, desc:{en:'First film gross −25%',fr:'Premier film −25 %'}},
};
const TWISTS = {
  horror:{icon:'👻', name:{en:'Horror Night',fr:'Nuit de l’horreur'}, desc:{en:'Horror heat +0.35',fr:'Chaleur Horreur +0,35'}},
  heroes:{icon:'🦸', name:{en:'Hero Fatigue',fr:'Fatigue des héros'}, desc:{en:'Action & Sci-Fi heat −0.25',fr:'Chaleur Action & SF −0,25'}},
  laughs:{icon:'😂', name:{en:'Laugh Riot',fr:'Fou rire général'}, desc:{en:'Comedy heat +0.30',fr:'Chaleur Comédie +0,30'}},
  tears:{icon:'😭', name:{en:'Tearjerker Season',fr:'Saison des larmes'}, desc:{en:'Drama heat +0.30, awards +10%',fr:'Chaleur Drame +0,30, prix +10 %'}},
  stream:{icon:'📡', name:{en:'Streaming Boom',fr:'Boum du streaming'}, desc:{en:'Streaming income ×2',fr:'Revenus streaming ×2'}},
  recession:{icon:'📉', name:{en:'Recession',fr:'Récession'}, desc:{en:'All costs +12%',fr:'Tous les coûts +12 %'}},
  golden:{icon:'✨', name:{en:'Golden Age',fr:'Âge d’or'}, desc:{en:'All reviews +3',fr:'Toutes les critiques +3'}},
  fever:{icon:'🏆', name:{en:'Awards Fever',fr:'Fièvre des prix'}, desc:{en:'Awards chance +15%',fr:'Chances aux prix +15 %'}},
};
/* Fil rouge: the 5-chapter Golden Reel Saga vs Monolith Studios */
const SAGA = [
  {id:'credits', icon:'🎬', name:{en:'Opening Credits',fr:'Générique d’ouverture'}, obj:{en:'Release 3 films',fr:'Sortir 3 films'},
   prog:s=>Math.min(s.movies.length,3)+'/3', check:s=>s.movies.length>=3, reward:{cash:5e6, relic:'clapboard'}},
  {id:'rising', icon:'⭐', name:{en:'Rising Star',fr:'Étoile montante'}, obj:{en:'Reach 100K fans & 60 rep',fr:'Atteindre 100 k fans et 60 de réputation'},
   prog:s=>(s.fans>=100000?'✅':'◻️')+' fans · '+((s.rep>=60)?'✅':'◻️')+' rep', check:s=>s.fans>=100000&&s.rep>=60, reward:{cash:8e6, shards:1}},
  {id:'monolith', icon:'🏛️', name:{en:'The Monolith Stirs',fr:'Le Monolithe s’éveille'}, obj:{en:'Finish #1 in a quarterly race',fr:'Finir n°1 d’un duel trimestriel'},
   prog:s=>((s.stats.no1||0)>0?'✅':'◻️')+' #1', check:s=>(s.stats.no1||0)>=1, reward:{cash:8e6, relic:'megaphone'}},
  {id:'awards', icon:'🏆', name:{en:'Awards Season',fr:'Saison des prix'}, obj:{en:'Win 2 career awards',fr:'Gagner 2 prix en carrière'},
   prog:s=>Math.min(s.awards,2)+'/2', check:s=>s.awards>=2, reward:{cash:10e6, relic:'ticket'}},
  {id:'showdown', icon:'🌟', name:{en:'The Final Showdown',fr:'Le duel final'}, obj:{en:'Outgross Monolith in a quarter + win an award',fr:'Écraser Monolith sur un trimestre + gagner un prix'},
   prog:s=>((s.saga.beatMono?'✅':'◻️')+' Monolith · '+((s.saga.awardLate?'✅':'◻️')+' '+(LANG==='fr'?'prix':'award'))), check:s=>s.saga.beatMono&&s.saga.awardLate, reward:{cash:20e6, relic:'goldenreel'}},
];
const ACHS=[
  {id:'debut', icon:'🎬', name:{en:'Opening Weekend',fr:'Première sortie'}, desc:{en:'Release your first film',fr:'Sortir votre premier film'}},
  {id:'hit', icon:'🎉', name:{en:'Certified Hit',fr:'Succès certifié'}, desc:{en:'Score a HIT or better',fr:'Obtenir un SUCCÈS ou mieux'}},
  {id:'block', icon:'🌟', name:{en:'Blockbuster!',fr:'Blockbuster !'}, desc:{en:'Gross $150M+ with one film',fr:'Dépasser 150 M$ avec un film'}},
  {id:'profit100', icon:'💰', name:{en:'Money Machine',fr:'Machine à sous'}, desc:{en:'$100M total profit',fr:'100 M$ de bénéfices totaux'}},
  {id:'fans1m', icon:'👥', name:{en:'Fan Army',fr:'Armée de fans'}, desc:{en:'Reach 1M fans',fr:'Atteindre 1 M de fans'}},
  {id:'awards3', icon:'🏆', name:{en:'Mantelpiece',fr:'Cheminée chargée'}, desc:{en:'Win 3 career awards',fr:'Gagner 3 prix en carrière'}},
  {id:'sequel', icon:'🎞️', name:{en:'Franchise Starter',fr:'Lanceur de franchise'}, desc:{en:'Release a sequel',fr:'Sortir une suite'}},
  {id:'trilogy', icon:'🦸', name:{en:'Trilogy!',fr:'Trilogie !'}, desc:{en:'Complete a 3-film franchise',fr:'Boucler une franchise de 3 films'}},
  {id:'no1', icon:'🏁', name:{en:'Weekend Winner',fr:'Roi du week-end'}, desc:{en:'Beat every rival in a quarter',fr:'Battre tous les rivaux sur un trimestre'}},
  {id:'tycoon', icon:'🏗️', name:{en:'Tycoon',fr:'Magnat'}, desc:{en:'All upgrades Lv3+',fr:'Tout améliorer au Nv3+'}},
  {id:'legend', icon:'🌟', name:{en:'Legendary Mogul',fr:'Mogul Légendaire'}, desc:{en:'Hit the legend goal',fr:'Atteindre l’objectif de légende'}},
  {id:'goldenreel', icon:'📜', name:{en:'Golden Reel',fr:'Bobine d’Or'}, desc:{en:'Complete the 5-chapter saga',fr:'Terminer la saga en 5 chapitres'}},
];
const RIVAL_DEFS=[
  {name:'Apex Pictures', icon:'🔺'},
  {name:'Nova Reel', icon:'🌌'},
  {name:'Golden Gate Films', icon:'🌉'},
];
const MONO = {name:'Monolith Studios', icon:'🏛️'};
const EVENTS=[
  {emoji:'🔥', t:{en:'Trailer goes viral!',fr:'La bande-annonce devient virale !'}, x:{en:'Your teaser hit 40M views overnight. Fans demand an early premiere.',fr:'Votre teaser fait 40 M de vues en une nuit. Les fans exigent une avant-première.'}, opts:[
    {l:{en:'Rush the premiere',fr:'Avancer la première'}, s:{en:'+15% gross, −5 reviews (unfinished VFX)',fr:'+15 % recettes, −5 critiques (VFX bâclés)'}, fx:s=>({grossMult:1.15, revMod:-5})},
    {l:{en:'Stay the course',fr:'Garder le cap'}, s:{en:'+6 reviews, +rep',fr:'+6 critiques, +réputation'}, fx:s=>({rep:2, revMod:6})} ]},
  {emoji:'📰', t:{en:'Lead actor scandal!',fr:'Scandale de la star !'}, x:{en:'TMZ caught your star in a late-night rant. The board is nervous.',fr:'TMZ a surpris votre star en pleine crise nocturne. Le conseil panique.'}, opts:[
    {l:{en:'Public apology tour',fr:'Tournée d’excuses'}, s:{en:'−$2M, save reputation',fr:'−2 M$, réputation sauvée'}, fx:s=>({cash:-2e6, rep:1})},
    {l:{en:'Cut them loose (recast)',fr:'La virer (recaster)'}, s:{en:'−$4M reshoots, +4 reviews',fr:'−4 M$ de reshoots, +4 critiques'}, fx:s=>({cash:-4e6, revMod:4})} ]},
  {emoji:'💸', t:{en:'Budget overrun!',fr:'Dépassement de budget !'}, x:{en:'The third act needs reshoots. The director begs for more money.',fr:'Le troisième acte exige des reshoots. Le réalisateur supplie pour plus d’argent.'}, opts:[
    {l:{en:'Pay for reshoots',fr:'Payer les reshoots'}, s:{en:'−$5M, +6 reviews, +10% gross',fr:'−5 M$, +6 critiques, +10 % recettes'}, fx:s=>({cash:-5e6, revMod:6, grossMult:1.1})},
    {l:{en:'Lock the edit',fr:'Verrouiller le montage'}, s:{en:'No cost, −4 reviews',fr:'Gratuit, −4 critiques'}, fx:s=>({revMod:-4})} ]},
  {emoji:'📱', t:{en:'Streamer mega-offer',fr:'Offre géante du streaming'}, x:{en:'A streamer offers a fat buyout for day-and-date rights.',fr:'Une plateforme offre un gros chèque pour les droits du film.'}, opts:[
    {l:{en:'Take the cash',fr:'Prendre le chèque'}, s:{en:'+$12M now, −20% box office',fr:'+12 M$ cash, −20 % box-office'}, fx:s=>({cash:12e6, grossMult:0.8})},
    {l:{en:'Bet on theaters',fr:'Parier sur les salles'}, s:{en:'+10% box office',fr:'+10 % box-office'}, fx:s=>({grossMult:1.1})} ]},
  {emoji:'🎭', t:{en:'Director feud',fr:'Guerre réalisateur-star'}, x:{en:'Director and star are feuding on set. Morale is tanking.',fr:'Réalisateur et star se crêpent le chignon. Le moral s’effondre.'}, opts:[
    {l:{en:'Back the director',fr:'Soutenir le réalisateur'}, s:{en:'+5 reviews, −1 rep (star upset)',fr:'+5 critiques, −1 réputation (star vexée)'}, fx:s=>({revMod:5, rep:-1})},
    {l:{en:'Back the star',fr:'Soutenir la star'}, s:{en:'+8% gross (star promotes hard)',fr:'+8 % recettes (la star fait la promo)'}, fx:s=>({grossMult:1.08})} ]},
  {emoji:'🏆', t:{en:'Festival invite!',fr:'Invitation au festival !'}, x:{en:'A prestige festival wants your film as its opening night gala.',fr:'Un festival prestigieux veut votre film en ouverture.'}, opts:[
    {l:{en:'Accept',fr:'Accepter'}, s:{en:'+8 reviews, 2× awards buzz, −10% gross',fr:'+8 critiques, 2× buzz des prix, −10 % recettes'}, fx:s=>({revMod:8, awardsMult:2, grossMult:0.9})},
    {l:{en:'Decline, go commercial',fr:'Refuser, rester commercial'}, s:{en:'+10% gross',fr:'+10 % recettes'}, fx:s=>({grossMult:1.1})} ]},
  {emoji:'🤖', t:{en:'AI controversy',fr:'Polémique IA'}, x:{en:'A leaked memo says you used AI for background extras. Unions fume.',fr:'Une note fuitée dit que vous avez utilisé l’IA pour les figurants. Les syndicats fulminent.'}, opts:[
    {l:{en:'Apologize + reshoot',fr:'S’excuser + retourner'}, s:{en:'−$3M, +rep',fr:'−3 M$, +réputation'}, fx:s=>({cash:-3e6, rep:2})},
    {l:{en:'Deny everything',fr:'Tout nier'}, s:{en:'50/50: −4 rep or nothing',fr:'50/50 : −4 réputation ou rien'}, fx:s=>({gambleRep:-4})} ]},
  {emoji:'🌟', t:{en:'Surprise cameo!',fr:'Caméo surprise !'}, x:{en:'A legend offered a one-day cameo for scale pay. It would thrill fans.',fr:'Une légende propose un caméo d’un jour, presque gratis. Les fans adoreraient.'}, opts:[
    {l:{en:'Add the cameo',fr:'Ajouter le caméo'}, s:{en:'−$1M, +8% gross, +fans',fr:'−1 M$, +8 % recettes, +fans'}, fx:s=>({cash:-1e6, grossMult:1.08, fans:15000})},
    {l:{en:'Keep vision pure',fr:'Garder la vision pure'}, s:{en:'+4 reviews',fr:'+4 critiques'}, fx:s=>({revMod:4})} ]},
  {emoji:'🎞️', t:{en:'Test screening disaster',fr:'Projection test catastrophique'}, x:{en:'Scores are terrible. Audiences called the ending "confusing".',fr:'Les scores sont nuls. Le public trouve la fin « confuse ».'}, opts:[
    {l:{en:'Order a new ending',fr:'Commander une nouvelle fin'}, s:{en:'−$4M, +7 reviews',fr:'−4 M$, +7 critiques'}, fx:s=>({cash:-4e6, revMod:7})},
    {l:{en:'Trust the director',fr:'Faire confiance au réal'}, s:{en:'Risk it: ±6 reviews',fr:'Risqué : ±6 critiques'}, fx:s=>({gambleRev:6})} ]},
  {emoji:'💰', t:{en:'Product placement deal',fr:'Placement de produit'}, x:{en:'A soda brand offers cash to feature loudly in three scenes.',fr:'Une marque de soda offre un chèque pour trois scènes bien visibles.'}, opts:[
    {l:{en:'Take the deal',fr:'Signer'}, s:{en:'+$6M, −4 reviews',fr:'+6 M$, −4 critiques'}, fx:s=>({cash:6e6, revMod:-4})},
    {l:{en:'Protect the art',fr:'Protéger l’art'}, s:{en:'+3 reviews, +rep',fr:'+3 critiques, +réputation'}, fx:s=>({revMod:3, rep:1})} ]},
  {emoji:'🦸', t:{en:'Franchise offer!',fr:'Offre de franchise !'}, x:{en:'A comic publisher will license a hero — if you launch a universe now.',fr:'Un éditeur de comics propose un héros — si vous lancez un univers, maintenant.'}, opts:[
    {l:{en:'Launch universe',fr:'Lancer l’univers'}, s:{en:'−$6M, +18% gross (hype!)',fr:'−6 M$, +18 % recettes (hype !)'}, fx:s=>({cash:-6e6, grossMult:1.18})},
    {l:{en:'Stay original',fr:'Rester original'}, s:{en:'+6 reviews, +rep',fr:'+6 critiques, +réputation'}, fx:s=>({revMod:6, rep:2})} ]},
  {emoji:'🌪️', t:{en:'Storm hits premiere!',fr:'Tempête sur la première !'}, x:{en:'A storm shut down LA premiere weekend. Red carpet is underwater.',fr:'Une tempête noie le week-end de première à L.A. Le tapis rouge flotte.'}, opts:[
    {l:{en:'Go virtual',fr:'Passer en virtuel'}, s:{en:'−5% gross, save money',fr:'−5 % recettes, économies'}, fx:s=>({grossMult:0.95})},
    {l:{en:'Delay a week (−$2M)',fr:'Reporter (−2 M$)'}, s:{en:'Full gross potential',fr:'Plein potentiel'}, fx:s=>({cash:-2e6})} ]},
  {emoji:'✊', t:{en:'Crew strike vote!',fr:'Vote de grève !'}, x:{en:'The crew threatens to walk out over 16-hour days. Shooting halts tomorrow.',fr:'L’équipe menace de débrayer : des journées de 16 h. Tournage bloqué demain.'}, opts:[
    {l:{en:'Meet demands (−$4M)',fr:'Céder (−4 M$)'}, s:{en:'+5 reviews, +rep',fr:'+5 critiques, +réputation'}, fx:s=>({cash:-4e6, revMod:5, rep:2})},
    {l:{en:'Hire replacements',fr:'Embaucher des remplaçants'}, s:{en:'−6 reviews, −2 rep',fr:'−6 critiques, −2 réputation'}, fx:s=>({revMod:-6, rep:-2})} ]},
  {emoji:'🎟️', t:{en:'Theater chain deal',fr:'Accord avec les cinémas'}, x:{en:'A national chain offers 500 bonus screens — for a cut of opening weekend.',fr:'Un réseau national offre 500 salles bonus — contre une part du week-end d’ouverture.'}, opts:[
    {l:{en:'Sign (+12% gross, −$3M)',fr:'Signer (+12 %, −3 M$)'}, s:{en:'Bigger opening, upfront fee',fr:'Grosse ouverture, ticket d’entrée'}, fx:s=>({cash:-3e6, grossMult:1.12})},
    {l:{en:'Stay exclusive',fr:'Rester exclusif'}, s:{en:'+4 reviews (curated rollout)',fr:'+4 critiques (sortie soignée)'}, fx:s=>({revMod:4})} ]},
  {emoji:'🏴‍☠️', t:{en:'Piracy leak!',fr:'Fuite pirate !'}, x:{en:'A workprint leaked on torrent sites two weeks before release.',fr:'Une copie de travail fuite sur les torrents, deux semaines avant la sortie.'}, opts:[
    {l:{en:'Hunt it down (−$2M lawyers)',fr:'Traquer (−2 M$ d’avocats)'}, s:{en:'−5% gross only',fr:'Seulement −5 % recettes'}, fx:s=>({cash:-2e6, grossMult:0.95})},
    {l:{en:'Ignore it',fr:'Ignorer'}, s:{en:'−15% gross',fr:'−15 % recettes'}, fx:s=>({grossMult:0.85})} ]},
  {emoji:'🎪', t:{en:'Method actor madness',fr:'Folie de l’acteur méthode'}, x:{en:'Your lead has lived in character for a month and terrorized catering.',fr:'Votre star vit son rôle depuis un mois et terrorise la cantine.'}, opts:[
    {l:{en:'Indulge the genius (−$2M)',fr:'Chouchouter le génie (−2 M$)'}, s:{en:'+7 reviews',fr:'+7 critiques'}, fx:s=>({cash:-2e6, revMod:7})},
    {l:{en:'Rein them in',fr:'Le recadrer'}, s:{en:'+5% gross (press loves the drama)',fr:'+5 % recettes (la presse adore)'}, fx:s=>({grossMult:1.05})} ]},
  {emoji:'🚑', t:{en:'Stunt accident!',fr:'Accident de cascade !'}, x:{en:'A stunt went wrong. The star is fine, but the set is shut down a week.',fr:'Une cascade a mal tourné. La star va bien, mais le plateau ferme une semaine.'}, opts:[
    {l:{en:'Pay for safety (−$3M)',fr:'Payer la sécurité (−3 M$)'}, s:{en:'+rep, +3 reviews',fr:'+réputation, +3 critiques'}, fx:s=>({cash:-3e6, rep:2, revMod:3})},
    {l:{en:'Rush back to work',fr:'Retourner bosser vite'}, s:{en:'−2 rep, no cost',fr:'−2 réputation, gratuit'}, fx:s=>({rep:-2})} ]},
  {emoji:'🎼', t:{en:'Composer walks out!',fr:'Le compositeur claque la porte !'}, x:{en:'Your composer quit over "creative differences" with three weeks to go.',fr:'Votre compositeur démissionne pour « différends artistiques », à trois semaines de la fin.'}, opts:[
    {l:{en:'Hire a legend (−$3M)',fr:'Embaucher une légende (−3 M$)'}, s:{en:'+6 reviews',fr:'+6 critiques'}, fx:s=>({cash:-3e6, revMod:6})},
    {l:{en:'Use library music',fr:'Musique de stock'}, s:{en:'−4 reviews',fr:'−4 critiques'}, fx:s=>({revMod:-4})} ]},
  {emoji:'🐉', t:{en:'Foreign market offer',fr:'Offre du marché étranger'}, x:{en:'Distributors want a special cut for a massive overseas market: +gross, −reviews at home.',fr:'Des distributeurs veulent un montage spécial pour l’étranger : +recettes, −critiques ici.'}, opts:[
    {l:{en:'Make the cut',fr:'Faire le montage'}, s:{en:'+20% gross, −4 reviews',fr:'+20 % recettes, −4 critiques'}, fx:s=>({grossMult:1.2, revMod:-4})},
    {l:{en:'One cut worldwide',fr:'Un seul montage mondial'}, s:{en:'+4 reviews',fr:'+4 critiques'}, fx:s=>({revMod:4})} ]},
  {emoji:'🧸', t:{en:'Merch madness!',fr:'Folie du merchandising !'}, x:{en:'A toy company offers an upfront check for plush rights to your creature.',fr:'Un fabricant de jouets offre un chèque pour les peluches de votre créature.'}, opts:[
    {l:{en:'Sign (+$7M, −2 reviews)',fr:'Signer (+7 M$, −2 critiques)'}, s:{en:'Kids love it, critics roll eyes',fr:'Les kids adorent, les critiques lèvent les yeux'}, fx:s=>({cash:7e6, revMod:-2})},
    {l:{en:'Too artsy for toys',fr:'Trop arty pour des jouets'}, s:{en:'+3 reviews',fr:'+3 critiques'}, fx:s=>({revMod:3})} ]},
  {emoji:'🎢', t:{en:'Theme park scouts!',fr:'Un parc d’attractions prospecte !'}, x:{en:'A theme park wants to option your world for a ride — if the film pops.',fr:'Un parc veut optionner votre univers pour une attraction — si le film cartonne.'}, opts:[
    {l:{en:'Sign the option (+$3M)',fr:'Signer l’option (+3 M$)'}, s:{en:'+10% gross on spectacle, else nothing',fr:'+10 % recettes, sinon rien'}, fx:s=>({cash:3e6, grossMult:1.1})},
    {l:{en:'Pass',fr:'Passer'}, s:{en:'+2 rep (auteur credibility)',fr:'+2 réputation (crédibilité d’auteur)'}, fx:s=>({rep:2})} ]},
  {emoji:'📣', t:{en:'Influencer feud',fr:' clash d’influenceur'}, x:{en:'A 20M-follower critic called your film "mid". Their fans are review-bombing.',fr:'Un critique à 20 M d’abonnés trouve votre film « bof ». Ses fans bombardent les notes.'}, opts:[
    {l:{en:'Invite them to set (−$1M)',fr:'L’inviter sur le plateau (−1 M$)'}, s:{en:'+6% gross, +fans',fr:'+6 % recettes, +fans'}, fx:s=>({cash:-1e6, grossMult:1.06, fans:20000})},
    {l:{en:'Clap back',fr:'Répliquer'}, s:{en:'50/50: +rep or −3 rep',fr:'50/50 : +réputation ou −3'}, fx:s=>({gambleRepUp:3})} ]},
  {emoji:'💞', t:{en:'Co-star chemistry!',fr:'Alchimie des stars !'}, x:{en:'Your two leads are electric together — on and off screen. The dailies sizzle.',fr:'Vos deux stars crépitent ensemble — à l’écran comme en ville. Les rushes sont électriques.'}, opts:[
    {l:{en:'Rewrite around them',fr:'Réécrire autour d’eux'}, s:{en:'+6 reviews, +8% gross',fr:'+6 critiques, +8 % recettes'}, fx:s=>({revMod:6, grossMult:1.08})},
    {l:{en:'Keep the schedule',fr:'Garder le planning'}, s:{en:'No bonus, no risk',fr:'Ni bonus, ni risque'}, fx:s=>({})} ]},
  {emoji:'🌧️', t:{en:'Location washout',fr:'Tournage noyé'}, x:{en:'Two weeks of rain destroyed your desert shoot. The producers panic.',fr:'Deux semaines de pluie ont noyé votre tournage dans le désert. Panique chez les producteurs.'}, opts:[
    {l:{en:'Move to soundstage (−$4M)',fr:'Rentrer en studio (−4 M$)'}, s:{en:'+3 reviews',fr:'+3 critiques'}, fx:s=>({cash:-4e6, revMod:3})},
    {l:{en:'Rewrite for rain',fr:'Réécrire avec la pluie'}, s:{en:'±5 reviews gamble',fr:'Pari ±5 critiques'}, fx:s=>({gambleRev:5})} ]},
  {emoji:'🤝', t:{en:'Sugar-daddy investor',fr:'Investisseur providentiel'}, x:{en:'A billionaire fan offers $15M for 5% of this film\'s gross.',fr:'Un milliardaire fan offre 15 M$ contre 5 % des recettes du film.'}, opts:[
    {l:{en:'Take it (+$15M now)',fr:'Accepter (+15 M$ cash)'}, s:{en:'Money now, share later',fr:'L’argent maintenant, la part après'}, fx:s=>({cash:15e6, revShareCut:0.05})},
    {l:{en:'We fund our own art',fr:'On finance notre art'}, s:{en:'+2 rep',fr:'+2 réputation'}, fx:s=>({rep:2})} ]},
  {emoji:'✍️', t:{en:'Writer quits mid-shoot!',fr:'Le scénariste claque la porte !'}, x:{en:'Your screenwriter stormed off over dialogue changes. Pages are due.',fr:'Votre scénariste est parti, furieux des retouches. Les pages sont dues.'}, opts:[
    {l:{en:'Pay them double (−$3M)',fr:'Le payer double (−3 M$)'}, s:{en:'+5 reviews',fr:'+5 critiques'}, fx:s=>({cash:-3e6, revMod:5})},
    {l:{en:'Let the director write',fr:'Laisser le réal écrire'}, s:{en:'−5 reviews',fr:'−5 critiques'}, fx:s=>({revMod:-5})} ]},
  {emoji:'👾', t:{en:'CGI backlash',fr:'Bad buzz CGI'}, x:{en:'The trailer\'s CGI got memed mercilessly. "PlayStation cutscene" trends.',fr:'La CGI de la bande-annonce est massacrée en mèmes. « Cinématique PlayStation » est en tendance.'}, opts:[
    {l:{en:'Emergency VFX polish (−$5M)',fr:'Polish VFX d’urgence (−5 M$)'}, s:{en:'+7 reviews, +5% gross',fr:'+7 critiques, +5 % recettes'}, fx:s=>({cash:-5e6, revMod:7, grossMult:1.05})},
    {l:{en:'Lean into the meme',fr:'Surfer sur le mème'}, s:{en:'+8% gross, −3 reviews',fr:'+8 % recettes, −3 critiques'}, fx:s=>({grossMult:1.08, revMod:-3})} ]},
  {emoji:'🕵️', t:{en:'Plot leak!',fr:'Spoiler géant !'}, x:{en:'Your twist ending leaked on Reddit. Fans are furious / delighted.',fr:'Votre twist final a fuité sur Reddit. Les fans sont furieux / ravis.'}, opts:[
    {l:{en:'Reshoot the twist (−$4M)',fr:'Retourner le twist (−4 M$)'}, s:{en:'+5 reviews',fr:'+5 critiques'}, fx:s=>({cash:-4e6, revMod:5})},
    {l:{en:'Release anyway',fr:'Sortir quand même'}, s:{en:'−3 reviews, +5% gross (curiosity)',fr:'−3 critiques, +5 % (curiosité)'}, fx:s=>({revMod:-3, grossMult:1.05})} ]},
  {emoji:'📝', t:{en:'Fan petition!',fr:'Pétition des fans !'}, x:{en:'100K fans demand a different ending. They even funded a billboard.',fr:'100 k fans exigent une autre fin. Ils ont même payé un panneau publicitaire.'}, opts:[
    {l:{en:'Listen to fans',fr:'Écouter les fans'}, s:{en:'+10% gross, −2 reviews',fr:'+10 % recettes, −2 critiques'}, fx:s=>({grossMult:1.1, revMod:-2})},
    {l:{en:'Artistic integrity',fr:'Intégrité artistique'}, s:{en:'+5 reviews, +rep',fr:'+5 critiques, +réputation'}, fx:s=>({revMod:5, rep:1})} ]},
  {emoji:'🐾', t:{en:'Animal actor escape!',fr:'La star à quatre pattes s’échappe !'}, x:{en:'The 200-lb co-star (a very good boy) escaped into the Hollywood Hills.',fr:'La co-star de 90 kg (un très bon toutou) s’est échappée dans les collines d’Hollywood.'}, opts:[
    {l:{en:'Halt shoot, find him (−$2M)',fr:'Stopper, le retrouver (−2 M$)'}, s:{en:'+fans, +3 reviews',fr:'+fans, +3 critiques'}, fx:s=>({cash:-2e6, fans:25000, revMod:3})},
    {l:{en:'Write him out',fr:'L’écrire hors du film'}, s:{en:'−3 reviews',fr:'−3 critiques'}, fx:s=>({revMod:-3})} ]},
];
const FLAVOR_KEYS = ['flavFestival','flavStream','flavPopcorn','flavDead','flavOverseas','flavMidnight','flavNepo','flavCranes','flavCut','flavMid','flavRetire','flavTest','flavFan'];
const JAB_KEYS = ['jab1','jab2','jab3'];

let S = null;
let W = null;
let pendingEvent = null;
let eventMods = {};
let diffSel = 'major', lenSel = 15;
/* Rogue-lite draft (re-rolled every page load) */
const DRAFT_BLESS = shuffle(Object.keys(BLESSINGS)).slice(0,3);
const DRAFT_CURSE = shuffle(Object.keys(CURSES)).slice(0,3);
let selBless = DRAFT_BLESS[0], selCurse = null, selRelics = [];

/* ---------- relic vault (permanent across careers) ---------- */
function vaultGet(){ try{ const v = JSON.parse(localStorage.getItem('movieMogulRelics')||'[]'); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function vaultAdd(id){
  const v = vaultGet();
  if(v.includes(id)) return false;
  v.push(id);
  try{ localStorage.setItem('movieMogulRelics', JSON.stringify(v)); }catch(e){}
  return true;
}
function hasRelic(id){ return !!(S && S.relics && S.relics.includes(id) && vaultGet().includes(id)); }

/* ---------- state ---------- */
function defaultTrends(){
  const t={};
  GENRES.forEach(g=>t[g.name]=rnd(0.85,1.15));
  t[pick(GENRES).name]=rnd(1.25,1.4);
  return t;
}
function migrate(s){
  s.upg = Object.assign({lot:1, marketing:1, distribution:1, writers:1, vfx:1, talent:1, streaming:1, pr:1}, s.upg||{});
  s.staff = Object.assign({producer:0, guru:0, scout:0, accountant:0, awards:0, franchise:0}, s.staff||{});
  s.debt = s.debt||0; s.campaign = s.campaign||0;
  s.scriptBuff = s.scriptBuff||0; s.scoutBuff = s.scoutBuff||0;
  s.franchises = s.franchises||{}; s.ach = s.ach||[];
  s.stats = Object.assign({hits:0, flops:0, blocks:0, no1:0, pts:0, sequels:0}, s.stats||{});
  s.yearStats = Object.assign({gross:0, profit:0, movies:0, profitable:0, no1:0, sequels:0}, s.yearStats||{});
  s.usedActions = s.usedActions||{};
  s.movies = s.movies||[]; s.news = s.news||[]; s.collaborators = s.collaborators||[];
  if(!s.rivals) s.rivals = RIVAL_DEFS.map(r=>({name:r.name, icon:r.icon, yGross:0, points:0, qGross:0})).concat([{name:MONO.name, icon:MONO.icon, nemesis:true, yGross:0, points:0, qGross:0}]);
  if(s.goalYears==null || s.goalYears==='__INF__') s.goalYears = (s.goalYears==='__INF__') ? Infinity : 15;
  if(!s.board || typeof s.board.text === 'string' || !s.board.id) s.board = {id:'profit'};
  s.saga = s.saga||{chapter:0, beatMono:false, awardLate:false};
  s.relics = s.relics||[]; s.blessing = s.blessing||null; s.curse = s.curse||null;
  s.streak = s.streak||0; s.bestStreak = s.bestStreak||0; s.shards = s.shards||0;
  s.twist = s.twist||null; s.twistHeat = s.twistHeat||{};
  s.reelWon = !!s.reelWon;
  return s;
}
function newGame(studioName, diff, years){
  const d = DIFFS[diff];
  S = migrate({
    studio: studioName || 'Starlight Pictures',
    cash: d.cash, rep: d.rep, fans: d.fans,
    year: 2026, q: 1, movies: [], awards: 0,
    totalGross: 0, totalProfit: 0,
    trends: defaultTrends(),
    goalYears: years==='endless'? Infinity : parseInt(years),
    startYear: 2026,
    over: false, won: false,
    blessing: selBless, curse: selCurse, relics: [...selRelics],
  });
  if (S.blessing === 'hype'){ S.rep = clamp(S.rep+5,5,99); S.fans += 50000; }
  if (S.blessing === 'spoon') S.cash += 15e6;
  if (S.curse) S.cash += 10e6;
  if (hasRelic('vault')) S.cash += 12e6;
  S.board = {id: pick(['profit','two','gross','rep','award','fans','rival'])};
  if (S.board.id === 'fans') S.board.fansTarget = Math.round((S.fans+120000)/10000)*10000;
  W = null; eventMods = {};
  pickTwist(true);
  news(t('nFounding',{s:esc(S.studio), label:d.label, cash:fmt$(d.cash)}), 'good', 'FOUNDING');
  const bName = L(BLESSINGS[S.blessing].name);
  const cPart = S.curse ? t('nBlessCurse',{c:L(CURSES[S.curse].name)}) : '';
  news(t('nBless',{b:bName, curse:cPart}), '', 'FATE');
  news(t('nTrend',{g:hotGenre()}), '', 'TRENDS');
  news(t('nRivals',{list:S.rivals.filter(r=>!r.nemesis).map(r=>r.icon+' '+esc(r.name)).join(' · ')}), '', 'RIVALS');
  news(t('nBoard',{g:blocText()}), '', 'BOARD');
  save();
}
function blocText(){
  const id = S.board.id;
  if(id==='profit') return t('bgProfit');
  if(id==='two') return t('bgTwo');
  if(id==='gross') return t('bgGross');
  if(id==='rep') return t('bgRep');
  if(id==='award') return t('bgAward');
  if(id==='fans') return t('bgFans',{t:fmtFans(S.board.fansTarget||150000)});
  return t('bgRival');
}
function boardMet(s){
  const id = s.board.id;
  if(id==='profit') return s.yearStats.profit>0;
  if(id==='two') return s.yearStats.profitable>=2;
  if(id==='gross') return s.yearStats.gross>80e6;
  if(id==='rep') return s.rep>=60;
  if(id==='award') return (s.yearAwards||0)>=1;
  if(id==='fans') return s.fans>=(s.board.fansTarget||1e9);
  if(id==='rival') return s.yearStats.no1>=1;
  return false;
}
function hotGenre(){
  let best='Action', bv=0;
  for(const k in S.trends) if(S.trends[k]>bv){bv=S.trends[k]; best=k;}
  const g = GENRES.find(x=>x.name===best);
  return `${g.emoji} ${gname(best)} (×${bv.toFixed(2)})`;
}
function hotGenreName(){
  let best='Action', bv=0;
  for(const k in S.trends) if(S.trends[k]>bv){bv=S.trends[k]; best=k;}
  const g = GENRES.find(x=>x.name===best);
  return `${g.emoji} ${gname(best)}`;
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

/* ---------- SAVE ---------- */
function save(){ try{ localStorage.setItem('movieMogulSave', JSON.stringify(S, (k,v)=>v===Infinity?'__INF__':v)); }catch(e){} }
function load(){ try{ const r=localStorage.getItem('movieMogulSave'); if(!r) return null; return migrate(JSON.parse(r, (k,v)=>v==='__INF__'?Infinity:v)); }catch(e){ return null; } }
function hof(){ try{return JSON.parse(localStorage.getItem('movieMogulHOF')||'[]');}catch(e){return [];} }
function addHOF(entry){
  const h=hof(); h.push(entry); h.sort((a,b)=>b.score-a.score); localStorage.setItem('movieMogulHOF', JSON.stringify(h.slice(0,8)));
}

/* ---------- twists ---------- */
function pickTwist(first){
  const id = pick(Object.keys(TWISTS));
  S.twist = {id};
  const H = {};
  if(id==='horror') H['Horror']=0.35;
  if(id==='heroes'){ H['Action']=-0.25; H['Sci-Fi']=-0.25; }
  if(id==='laughs') H['Comedy']=0.30;
  if(id==='tears') H['Drama']=0.30;
  S.twistHeat = H;
  if(!first) return;
  news(t('nTwist',{i:TWISTS[id].icon, n:L(TWISTS[id].name), d:L(TWISTS[id].desc)}), '', 'TWIST');
}
function announceTwist(){
  const id = S.twist.id;
  news(t('nTwist',{i:TWISTS[id].icon, n:L(TWISTS[id].name), d:L(TWISTS[id].desc)}), '', 'TWIST');
}
const twistHeatFor = g => (S.twistHeat && S.twistHeat[g]) || 0;
const twistAwMult = () => !S.twist ? 1 : (S.twist.id==='tears' ? 1.1 : (S.twist.id==='fever' ? 1.15 : 1));
const twistCostMult = () => (S.twist && S.twist.id==='recession') ? 1.12 : 1;
const twistReviewBonus = () => (S.twist && S.twist.id==='golden') ? 3 : 0;
const twistStreamMult = () => (S.twist && S.twist.id==='stream') ? 2 : 1;
const catMult = () => hasRelic('archive') ? 2 : 1;

/* ---------- TALENT / SCRIPT GEN ---------- */
function genScripts(){
  const n = S.upg.writers>=3 ? 4 : 3;
  const out=[];
  for(let i=0;i<n;i++){
    const g = pick(GENRES);
    const [a,b]=TITLE_BITS[g.name];
    const title=`${pick(a)} ${pick(b)}`;
    const q = clamp(Math.round(rnd(2,10) + (S.upg.lot-1)*0.4 + (S.upg.writers-1)*0.8 + (S.scriptBuff||0) + (hasRelic('pen')?1:0) + (S.blessing==='muse'?1:0) + rnd(-1,1)),1,10);
    const sug = g.spectacle ? pick(['mid','tent','block']) : pick(['micro','indie','mid','mid']);
    out.push({title, genre:g.name, emoji:g.emoji, log:pick(LOGLINES[g.name]), q, sug, poster:pick(POSTERS)});
  }
  S.scriptBuff = 0;
  return out;
}
function sequelCandidates(){
  return S.movies.filter(m=>m.profit>3e6 && m.review>=60 && ((S.franchises[m.base||m.title]||1)<4)).slice(0,3);
}
function makeSequel(movie){
  const base = movie.base||movie.title;
  const n = (S.franchises[base]||1)+1;
  const suffix = n===2?' II':n===3?' III':(LANG==='fr'?' IV':' IV');
  return {title:base+suffix, genre:movie.genre, emoji:movie.emoji||gemoji(movie.genre), log:'The saga continues — bigger, louder, riskier.', q:clamp(Math.round(movie.review/10)+ri(-1,1),3,10), sug:movie.budgetId||'mid', poster:movie.poster||'🎬', sequelTo:movie, sequelNum:n-1, base};
}
function talentScale(){ return clamp(40 + S.rep*0.5 + (S.year-2026)*1.5 + (S.upg.talent-1)*3 + (S.staff.scout||0)*5 + (S.scoutBuff||0) + (hasRelic('charm')?5:0) + (S.blessing==='starfall'?8:0), 40, 99); }
function feeDisc(){ return clamp(1 - 0.06*(S.upg.talent-1) - 0.05*(S.staff.scout||0), 0.5, 1); }
function feeMult(){ return (S.curse==='chaos') ? 1.2 : 1; }
function genDirectors(){
  const base=talentScale(); const out=[];
  for(let i=0;i<4;i++){
    const skill=clamp(Math.round(rnd(base-18, base+8)),15,99);
    out.push({name:name(), skill, spec:pick(GENRES).name, fee:Math.round((skill*skill*22 + rnd(0.5e6,2e6))*feeDisc()*feeMult())});
  }
  return out;
}
function genActors(){
  const base=talentScale(); const out=[];
  for(let i=0;i<6;i++){
    const acting=clamp(Math.round(rnd(base-20, base+8)),10,99);
    const star=clamp(Math.round(rnd(base-22, base+10)),5,99);
    out.push({name:name(), acting, star, fee:Math.round(((star*star*28 + acting*9000)+rnd(0.3e6,1.5e6))*feeDisc()*feeMult())});
  }
  S.scoutBuff = 0;
  return out;
}

/* ---------- SIM ---------- */
function streakMult(){ return 1 + Math.min(S.streak||0, 8)*0.03; }
function simulate(m){
  const g = GENRES.find(x=>x.name===m.script.genre);
  const staff = S.staff||{};
  let fit = 1;
  if(m.director.spec===m.script.genre) fit+=0.15;
  const castScore = ((m.cast[0].acting+m.cast[1].acting)/2)*0.6 + ((m.cast[0].star+m.cast[1].star)/2)*0.4;
  const avgStar = (m.cast[0].star+m.cast[1].star)/2;
  let q = m.script.q*10*0.35 + m.director.skill*fit*0.35 + castScore*0.30 + (S.upg.lot-1)*2 + (staff.producer||0)*1.5 + (S.upg.writers-1)*0.8;
  if(g.spectacle && m.budget.amount<15e6) q -= (S.upg.vfx>=3 ? 4 : 12);
  if(!g.spectacle && m.budget.amount>50e6) q-=10;
  if(m.window.id==='summer' && !g.spectacle && m.budget.amount<20e6) q-=8;
  if(m.scale.id==='mega' && avgStar<55) q-=8;
  q = clamp(q, 5, 99);
  const heat = clamp((S.trends[m.script.genre]||1) + twistHeatFor(m.script.genre), 0.5, 1.7);
  const seasonBase = {dump:0.85, standard:1.0, summer:1.25, festival:0.9, holiday:1.2}[m.window.id];
  const scaleBase = {limited:0.72, wide:1.0, mega:1.22}[m.scale.id];
  const budgetScale = clamp(Math.sqrt(m.budget.amount/20e6), 0.5, 2.2);
  const specBonus = g.spectacle ? 1+0.06*(S.upg.vfx-1) : 1;
  let mktEff = 0.6 + 0.25*(S.upg.marketing-1) + 0.12*(staff.guru||0);
  if(hasRelic('megaphone')) mktEff *= 1.1;
  const mktMult = 1 + (m.marketing.pct)*mktEff*1.4;
  const distBonus = 1 + 0.03*(S.upg.distribution-1);
  const repMult = 0.8 + S.rep/100*0.5;
  const em = eventMods||{};
  const seqNum = m.script.sequelNum||0;
  let seqMult;
  if(!seqNum) seqMult = 1;
  else if(S.curse==='typecast') seqMult = Math.max(0.7, 1.22 - 0.18*seqNum + 0.08*(staff.franchise||0));
  else seqMult = Math.max(0.8, 1.30 - 0.13*seqNum + 0.10*(staff.franchise||0));
  let review = q + (m.window.rev||0) + (m.scale.rev||0) + (em.revMod||0) + twistReviewBonus() + (S.blessing==='critic'?5:0) + rnd(-9,9);
  if(seqNum){
    let pen = Math.max(0, 4*seqNum - S.upg.writers - 2*(staff.franchise||0));
    if(S.curse==='typecast') pen *= 2;
    review -= pen;
  }
  if(em.gambleRev) review += Math.random()<0.5? em.gambleRev : -em.gambleRev;
  review = clamp(Math.round(review), 3, 99);
  let gross = Math.pow(q,1.6)*75000 * heat * seasonBase * scaleBase * budgetScale * mktMult * distBonus * specBonus * repMult * seqMult * streakMult() * rnd(0.78,1.28);
  if(hasRelic('clapboard')) gross *= 1.06;
  if(hasRelic('goldenreel')) gross *= 1.08;
  if(S.curse==='jaded') gross *= 0.92;
  if(S.curse==='slump' && S.movies.length===0) gross *= 0.75;
  gross *= (em.grossMult||1);
  if(Math.random()<0.05){ gross*=1.8; m.sleeper=true; }
  gross = Math.round(gross);
  const share = 0.50 + 0.02*(S.upg.distribution-1) + 0.005*(S.upg.streaming-1);
  let revenue = Math.round(gross*share);
  if(em.revShareCut) revenue = Math.round(revenue*(1-em.revShareCut));
  revenue += S.movies.length*40000*catMult();
  const discount = clamp(1 - 0.05*(S.upg.lot-1) - 0.04*(staff.accountant||0) - (S.blessing==='scrappy'?0.10:0), 0.55, 1);
  const tcm = twistCostMult();
  const prodCost = Math.round(m.budget.amount*discount*tcm);
  const mktCost = Math.round(m.budget.amount*m.marketing.pct*discount*tcm);
  const talentCost = Math.round(m.director.fee + m.cast[0].fee + m.cast[1].fee);
  const winCost = Math.round((m.window.cost + m.scale.cost)*discount*tcm);
  const totalCost = prodCost + mktCost + talentCost + winCost;
  const profit = revenue - totalCost;
  return {q:Math.round(q), review, gross, revenue, prodCost, mktCost, talentCost, winCost, totalCost, profit, castScore:Math.round(castScore), fit, avgStar:Math.round(avgStar)};
}

/* ---------- NEWS / rewards ---------- */
function news(html, cls, tag){
  if(!S) return;
  S.news.unshift({html, cls:cls||'', tag:tag||('Y'+S.year+' Q'+S.q), t:Date.now()});
  S.news = S.news.slice(0,80);
  renderFeed();
}
function toast(msg){
  const el=$('toast'); if(!el) return;
  el.textContent=msg; el.classList.remove('hidden');
  clearTimeout(el._h); el._h=setTimeout(()=>el.classList.add('hidden'), 2400);
}
function unlockAch(id){
  if(!S || (S.ach||[]).includes(id)) return;
  S.ach.push(id);
  const a = ACHS.find(x=>x.id===id);
  if(a) news(t('nAch',{i:a.icon, n:L(a.name), d:L(a.desc)}), 'award', 'TROPHY');
}
function addShards(n){
  if(!S || n<=0) return;
  S.shards = (S.shards||0)+n;
  news(t('nShard',{n, s:n>1?(LANG==='fr'?'s':'s'):'', t:Math.min(S.shards,3)}), 'award', 'SHARD');
  while(S.shards>=3){
    S.shards -= 3;
    const locked = Object.keys(RELICS).filter(id=>!vaultGet().includes(id));
    if(!locked.length){ S.cash += 5e6; news(t('nRelicCash'), 'award', 'FORGE'); }
    else {
      const id = pick(locked);
      vaultAdd(id);
      news(t('nRelicForge',{i:RELICS[id].icon, n:L(RELICS[id].name), d:L(RELICS[id].desc)}), 'award', 'FORGE');
    }
  }
}
/* Fil rouge: saga progression */
function sagaCheck(){
  if(!S || S.over) return;
  let advanced = false;
  while(S.saga.chapter < SAGA.length && SAGA[S.saga.chapter].check(S)){
    const ch = SAGA[S.saga.chapter];
    const parts = [];
    if(ch.reward.cash) { S.cash += ch.reward.cash; parts.push(t('nSagaCash',{c:fmt$(ch.reward.cash)})); }
    if(ch.reward.shards) addShards(ch.reward.shards);
    if(ch.reward.relic){
      const rid = ch.reward.relic;
      const isNew = vaultAdd(rid);
      parts.push(t('nSagaRelic',{i:RELICS[rid].icon, n:L(RELICS[rid].name)}) + (isNew?'':' ✓'));
      if(rid==='goldenreel' && !S.relics.includes(rid)) S.relics.push(rid);
    }
    news(t('nSaga',{n:L(ch.name), r:parts.join(' · ')}), 'award', 'SAGA');
    S.saga.chapter++;
    advanced = true;
    if(ch.id==='showdown') goldenReelFinale();
  }
  if(advanced) save();
}
function goldenReelFinale(){
  if(S.reelWon) return;
  S.reelWon = true;
  S.cash += 25e6;
  unlockAch('goldenreel');
  news(t('nGoldenReel'), 'award', 'SAGA');
  save(); renderAll();
  $('overEmoji').textContent='🌟';
  $('overTitle').textContent=t('overReelT');
  $('overBody').innerHTML=`<p>${t('oReelP1')}</p><p class="muted">${t('oReelP2')}</p><button class="btn-ghost" onclick="document.getElementById('overModal').classList.add('hidden')">${t('keepPlaying')}</button>`;
  $('overRestart').textContent=t('overRestart');
  $('overModal').classList.remove('hidden');
}

/* ---------- WIZARD ---------- */
function startWizard(){
  if(S.over) return;
  W = {step:0, scripts:genScripts(), seqOptions:sequelCandidates(), directors:genDirectors(), actors:genActors(),
       script:null, sequel:null, director:null, cast:[], budget:BUDGETS[2], marketing:MARKETING[2], window:WINDOWS[1], scale:SCALES[1]};
  switchTab('produce');
  renderWizard();
}
function vlabel(m){
  if(!m.verdict) return '';
  if(typeof m.verdict.label === 'string') return m.verdict.label;
  return L(m.verdict.label);
}
function verdictOf(r){
  if(r.profit<0 && r.review<45) return {id:'flop', label:{en:'🍅 FLOP', fr:'🍅 NAVET'}};
  if(r.profit<0) return {id:'ok', label:{en:'📼 Mixed', fr:'📼 Mitigé'}};
  if(r.gross>120e6 || (r.profit>40e6&&r.review>=75)) return {id:'blockbuster', label:{en:'🌟 BLOCKBUSTER', fr:'🌟 BLOCKBUSTER'}};
  if(r.profit>0 && r.review>=65) return {id:'hit', label:{en:'🎉 HIT', fr:'🎉 SUCCÈS'}};
  return {id:'ok', label:{en:'👍 Solid', fr:'👍 Solide'}};
}
function renderWizard(){
  const el=$('wizard');
  if(!el) return;
  if(!W){ el.innerHTML=`<div class="card" style="text-align:center"><h3>${t('wizReadyT')}</h3><p class="muted">${t('wizReadyS')}</p><button class="btn-gold big" onclick="startWizard()">${t('greenlight')}</button></div>`; return; }
  const dots=[0,1,2,3,4].map(i=>`<div class="dot ${W.step>=i?'on':''}"></div>`).join('');
  let body='';
  if(W.step===0){
    const seqHtml = W.seqOptions.length ? `<h4>🦸 ${t('wizSequelH')} <small class="muted">${t('wizSequelS')}</small></h4><div class="pick-grid">`+
      W.seqOptions.map((mv,i)=>{const sq=makeSequel(mv); const sel=W.sequel && (W.sequel.base||W.sequel.title)===sq.base;
        return `<div class="pick seq-card ${sel?'sel':''}" onclick="wizSequel(${i})"><div style="font-size:30px">🦸</div><h4>${esc(sq.title)}</h4><span class="genre-tag">${sq.emoji} ${gname(sq.genre)} · sequel</span><p class="muted">${t('wizSequelEst',{t:esc(mv.title), r:mv.review, g:fmt$(mv.gross), q:sq.q})}</p></div>`;}).join('')+`</div>` : '';
    body=`<h3>${t('wizStepScript')} <small class="muted">${t('wizStepScriptS')} · ✍️ ${lvLbl()}${S.upg.writers}</small></h3>${seqHtml}<div class="pick-grid">`+
    W.scripts.map((s,i)=>`<div class="pick ${W.script===s && !W.sequel?'sel':''}" onclick="wizPick('script',${i})">
      <div style="font-size:34px">${s.poster}</div><h4>${esc(s.title)}</h4>
      <span class="genre-tag">${s.emoji} ${gname(s.genre)}</span>
      <p>${esc(s.log)}</p>
      <p class="stars">${'★'.repeat(Math.round(s.q/2))}${'☆'.repeat(5-Math.round(s.q/2))} <small>(${s.q}/10)</small></p>
      <p class="muted">${t('wizSuit')} <b>${L(BUDGETS.find(b=>b.id===s.sug).label)}</b></p></div>`).join('')+`</div>`;
  } else if(W.step===1){
    body=`<h3>${t('wizStepDir')} <small class="muted">${t('wizStepDirS')}</small></h3><div class="pick-grid" style="grid-template-columns:1fr 1fr">`+
    W.directors.map((d,i)=>`<div class="pick ${W.director===d?'sel':''}" onclick="wizPick('director',${i})">
      <h4>🎥 ${esc(d.name)}</h4><p>Skill <b>${d.skill}</b> · ${t('wizLoves')} <b>${gname(d.spec)}</b> ${d.spec===W.script.genre?'✅':''}</p>
      <p class="price">${fmt$(d.fee)}</p></div>`).join('')+`</div>
      <div class="cost-box">${t('wizScriptLine',{title:esc(W.script.title), emoji:W.script.emoji, genre:gname(W.script.genre), seq:(W.script.sequelNum?t('wizSequelTag',{n:W.script.sequelNum}):'')})}</div>`;
  } else if(W.step===2){
    body=`<h3>${t('wizStepCast')} <small class="muted">${t('wizStepCastS',{n:W.cast.length})}</small></h3><div class="pick-grid" style="grid-template-columns:1fr 1fr">`+
    W.actors.map((a,i)=>{const sel=W.cast.includes(a); return `<div class="pick ${sel?'sel':''}" onclick="wizCast(${i})">
      <h4>${sel?'✅ ':'🌟 '}${esc(a.name)}</h4><p>Acting <b>${a.acting}</b> · Fame <b>${a.star}</b></p>
      <p class="price">${fmt$(a.fee)}</p></div>`;}).join('')+`</div>`;
  } else if(W.step===3){
    body=`<h3>${t('wizStepBudget')}</h3><h4>${t('wizProdB')}</h4><div class="budget-btns">`+
    BUDGETS.map((b,i)=>`<div class="pick ${W.budget===b?'sel':''}" onclick="wizPick('budget',${i})"><b>${L(b.label)}</b><br/><span class="price">${fmt$(b.amount)}</span><p class="muted" style="font-size:12px">${L(b.desc)}</p></div>`).join('')+`</div>
    <h4>${t('wizMkt')}</h4><div class="budget-btns">`+
    MARKETING.map((m,i)=>`<div class="pick ${W.marketing===m?'sel':''}" onclick="wizPick('marketing',${i})"><b>${L(m.label)}</b><br/><span class="price">${m.pct===0?(LANG==='fr'?'0 $':'$0'):'+'+Math.round(m.pct*100)+'% = '+fmt$(W.budget.amount*m.pct)}</span><p class="muted" style="font-size:12px">${L(m.desc)}</p></div>`).join('')+`</div>
    ${costPreview()}`;
  } else {
    const scKey = {limited:'scLimited', wide:'scWide', mega:'scMega'};
    body=`<h3>${t('wizStepRelease')}</h3><h4>${t('wizWin')}</h4><div class="pick-grid" style="grid-template-columns:1fr 1fr">`+
    WINDOWS.map((w,i)=>`<div class="pick ${W.window===w?'sel':''}" onclick="wizPick('window',${i})"><h4>${L(w.label)}</h4><p>Box office <b>×${w.mod}</b></p><p class="muted">${L(w.desc)}</p>${w.cost?`<p class="price">+${fmt$(w.cost)}</p>`:''}</div>`).join('')+`</div>
    <h4>${t('wizScale')}</h4><div class="budget-btns">`+
    SCALES.map((sc,i)=>`<div class="pick ${W.scale===sc?'sel':''}" onclick="wizPick('scale',${i})"><b>${L(sc.label)}</b><br/><small class="muted">${L(sc.sub)}</small><p>Box office <b>×${sc.mod}</b></p><p class="muted" style="font-size:12px">${L(sc.desc)}</p>${sc.cost?`<p class="price">+${fmt$(sc.cost)}</p>`:''}</div>`).join('')+`</div>
    ${costPreview()}
    <div class="cost-box">${t('wizHeatLine',{genre:gname(W.script.genre), heat:(S.trends[W.script.genre]||1).toFixed(2), rep:Math.round(S.rep), rivals:S.rivals.map(r=>r.icon).join(' ')})}</div>`;
  }
  const canNext = (W.step===0&&W.script)||(W.step===1&&W.director)||(W.step===2&&W.cast.length===2)||W.step>=3;
  el.innerHTML=`<div class="card"><div class="step-dots">${dots}</div>${body}
    <div class="wiz-nav"><button class="btn-back" onclick="wizBack()">${W.step===0?t('wizCancel'):t('wizBack')}</button>
    <button class="btn-next" ${canNext?'':'disabled style="opacity:.4"'} onclick="wizNext()">${W.step===4?t('wizRelease'):t('wizNext')}</button></div></div>`;
}
function costPreview(){
  const staff=S.staff||{};
  const d=clamp(1-0.05*(S.upg.lot-1)-0.04*(staff.accountant||0)-(S.blessing==='scrappy'?0.10:0),0.55,1);
  const tc=Math.round((W.budget.amount+W.budget.amount*W.marketing.pct+W.window.cost+W.scale.cost+(W.director?W.director.fee:0)+(W.cast[0]?W.cast[0].fee:0)+(W.cast[1]?W.cast[1].fee:0))*d*twistCostMult());
  return `<div class="cost-box">${t('wizCostLine',{tc:fmt$(tc), cash:fmt$(S.cash), flag:(tc>S.cash?t('wizOver'):t('wizOk'))})}</div>`;
}
window.wizPick=(k,i)=>{
  if(k==='script'){W.script=W.scripts[i]; W.sequel=null;}
  if(k==='director')W.director=W.directors[i];
  if(k==='budget')W.budget=BUDGETS[i];
  if(k==='marketing')W.marketing=MARKETING[i];
  if(k==='window')W.window=WINDOWS[i];
  if(k==='scale')W.scale=SCALES[i];
  renderWizard();
};
window.wizSequel=i=>{
  const mv=W.seqOptions[i];
  const sq=makeSequel(mv);
  if(W.sequel && (W.sequel.base||W.sequel.title)===sq.base){ W.sequel=null; W.script=null; }
  else { W.sequel=mv; W.script=sq; W.budget=BUDGETS.find(b=>b.id===(mv.budgetId||'mid'))||BUDGETS[2]; }
  renderWizard();
};
window.wizCast=i=>{
  const a=W.actors[i];
  if(W.cast.includes(a)) W.cast=W.cast.filter(x=>x!==a);
  else if(W.cast.length<2) W.cast.push(a);
  else { W.cast.shift(); W.cast.push(a); }
  renderWizard();
};
window.wizBack=()=>{ if(W.step===0){W=null;renderWizard();} else {W.step--; renderWizard();} };
window.wizNext=()=>{
  if(W.step<4){W.step++; renderWizard(); return;}
  releaseMovie();
};
window.startWizard=startWizard;

/* ---------- RELEASE ---------- */
function releaseMovie(){
  const r = simulate({script:W.script, director:W.director, cast:W.cast, budget:W.budget, marketing:W.marketing, window:W.window, scale:W.scale});
  const scKey = {limited:'scLimited', wide:'scWide', mega:'scMega'}[W.scale.id];
  S.cash -= r.totalCost;
  S.cash += r.revenue;
  S.totalGross += r.gross; S.totalProfit += r.profit;
  S.yearStats.gross += r.gross; S.yearStats.profit += r.profit; S.yearStats.movies++; if(r.profit>0)S.yearStats.profitable++;
  const prLvl = S.upg.pr;
  const wasStreak = S.streak||0;
  let repDelta = (r.review-60)/4 + (r.profit>0?2:-3) + (eventMods.rep||0);
  if(repDelta<0){
    repDelta *= (prLvl>=4?0.4:(prLvl>=2?0.7:1));
    if(r.profit<0 && hasRelic('shield')) repDelta *= 0.5;
  }
  repDelta = clamp(repDelta, -8, 8);
  if(eventMods.gambleRep){
    const dmg = (prLvl>=3 ? Math.ceil(eventMods.gambleRep/2) : eventMods.gambleRep);
    if(Math.random()<0.5){ S.rep = clamp(S.rep + dmg, 5, 99); news(t('nScandal',{pr:(prLvl>=3?t('nScandalPR'):'')}), 'bad', 'SCANDAL'); }
    else news(t('nDeny'), '', 'SPIN');
  } else if(eventMods.gambleRepUp){
    if(Math.random()<0.5){ S.rep=clamp(S.rep+eventMods.gambleRepUp,5,99); news(t('nClapOk'), 'good', 'SPIN'); repDelta=2; }
    else { S.rep=clamp(S.rep-3,5,99); news(t('nClapKo'), 'bad', 'SPIN'); repDelta=-3; }
  } else S.rep = clamp(S.rep + repDelta, 5, 99);
  const fansGain = Math.round(r.gross/1e6 * (r.review/100) * 1200 * (r.profit>0?1:0.4) + (eventMods.fans||0));
  S.fans = Math.max(0, S.fans + fansGain);
  /* streaks */
  if(r.profit>0){
    S.streak = wasStreak+1;
    S.bestStreak = Math.max(S.bestStreak||0, S.streak);
    if(S.streak===3||S.streak===5||S.streak===8) news(t('nCombo',{n:S.streak, p:Math.min(S.streak,8)*3}), 'good', 'STREAK');
  } else {
    if(wasStreak>=2) news(t('nComboLost'), '', 'STREAK');
    S.streak = 0;
  }
  const seqNum = W.script.sequelNum||0;
  const base = W.script.base||W.script.title;
  const movie = {title:W.script.title, base, sequelNum:seqNum, genre:W.script.genre, emoji:W.script.emoji, poster:W.script.poster,
    review:r.review, gross:r.gross, revenue:r.revenue, cost:r.totalCost, profit:r.profit,
    year:S.year, q:S.q, director:W.director.name, stars:W.cast.map(c=>c.name).join(' & '),
    budget:L(W.budget.label), budgetId:W.budget.id, aw:(eventMods.awardsMult||1), verdict:verdictOf(r)};
  S.movies.unshift(movie);
  if(seqNum){ S.franchises[base]=(S.franchises[base]||1)+1; S.yearStats.sequels++; S.stats.sequels++; unlockAch('sequel');
    if(S.franchises[base]>=3) unlockAch('trilogy');
    news(t('nFranchise',{b:esc(base), n:S.franchises[base]}), 'good', 'FRANCHISE');
  }
  S.collaborators.unshift({t:`${movie.director} × ${movie.title}`, d:`Dir · ${movie.review}★`});
  S.collaborators=S.collaborators.slice(0,8);
  const v = movie.verdict;
  if(v.id==='hit'||v.id==='blockbuster'){S.stats.hits++; unlockAch('hit');}
  if(v.id==='flop')S.stats.flops++;
  if(r.gross>=150e6){S.stats.blocks++; unlockAch('block');}
  if(v.id==='hit'||v.id==='blockbuster') addShards(v.id==='blockbuster'?2:1);
  news(t('nFilm',{p:movie.poster, t:esc(movie.title), e:movie.emoji, g:gname(movie.genre), seq:(seqNum?t('seqTag'):''), sc:t(scKey), r:r.review, gross:fmt$(r.gross), cls:(r.profit>=0?'profit-pos':'profit-neg'), profit:((r.profit>=0?'+':'')+fmt$(r.profit)), v:vlabel(movie), sl:(r.sleeper?t('slTag'):'')}),
    r.profit>0?(r.review>=75?'award':'good'):'bad', `Y${S.year} Q${S.q}`);
  if(r.review>=80) news(t('nAdore',{t:esc(movie.title), q:reviewQuote(r.review)}), 'award', 'REVIEWS');
  if(r.profit< -20e6) news(t('nFlop',{t:esc(movie.title)}), 'bad', 'FLOP');
  if(S.totalProfit>=100e6) unlockAch('profit100');
  if(S.fans>=1e6) unlockAch('fans1m');
  const rank = rivalQuarter(r.gross);
  if(rank===1){ S.yearStats.no1++; unlockAch('no1'); }
  unlockAch('debut');
  sagaCheck();
  eventMods = {};
  W = null; renderWizard();
  save(); renderAll();
  showResult(movie, r, repDelta, fansGain, rank);
}
function showResult(movie, r, repDelta, fansGain, rank){
  $('resPoster').textContent = movie.poster;
  $('resTitle').textContent = movie.title;
  $('resMeta').textContent = `${movie.emoji} ${gname(movie.genre)} · ${S.year} Q${S.q} · Dir. ${movie.director} · Q-rank #${rank}/${S.rivals.length+1}`;
  $('resStars').textContent = '★'.repeat(clamp(Math.round(r.review/20),1,5))+'☆'.repeat(5-clamp(Math.round(r.review/20),1,5));
  $('resNumbers').innerHTML = `
    <div>${t('resReviews')}<b>${r.review}/100</b><small>${t('resQuality')} ${r.q}</small></div>
    <div>${t('resGross')}<b>${fmt$(r.gross)}</b><small>${t('resShare')} ${fmt$(r.revenue)}</small></div>
    <div>${t('resCost')}<b>${fmt$(r.totalCost)}</b><small>${t('resCostS')}</small></div>
    <div>${t('resProfit')}<b style="color:${r.profit>=0?'var(--green)':'var(--red)'}">${r.profit>=0?'+':''}${fmt$(r.profit)}</b><small>${repDelta>=0?'+':''}${repDelta.toFixed(1)} rep · +${fmtFans(fansGain)} fans</small></div>`;
  $('resReview').textContent = '"'+reviewQuote(r.review)+'"';
  const vv=$('resVerdict'); vv.textContent=vlabel(movie)+(rank===1?t('resNo1'):''); vv.className='verdict '+movie.verdict.id;
  $('resultModal').classList.remove('hidden');
}
function closeResultAdvance(){
  $('resultModal').classList.add('hidden');
  if(checkBankrupt()) return;
  if(checkVictory()) return;
  maybeEvent(()=>advanceQuarter());
}

/* ---------- RIVALS + Monolith nemesis ---------- */
function rivalQuarter(pg){
  const yr = S.year - S.startYear;
  S.rivals.forEach(rv=>{
    const lo = rv.nemesis?35:18, hi = rv.nemesis?85:60, gr = rv.nemesis?0.18:0.12;
    rv.qGross = Math.round(rnd(lo,hi) * (1+yr*gr) * rnd(0.7,1.5) * 1e6);
    rv.yGross = (rv.yGross||0)+rv.qGross;
  });
  const cont=[{name:'YOU', icon:'🎬', gross:pg, you:true}].concat(S.rivals.map(rv=>({name:rv.name, icon:rv.icon, gross:rv.qGross, nemesis:!!rv.nemesis})));
  cont.sort((a,b)=>b.gross-a.gross);
  const rank = cont.findIndex(c=>c.you)+1;
  const pts=[5,4,3,2,1];
  cont.forEach((c,i)=>{ if(c.you) S.stats.pts+=pts[i]; else S.rivals.find(r=>r.name===c.name).points+=pts[i]; });
  const mono = S.rivals.find(r=>r.nemesis);
  if(mono && pg > mono.qGross){
    if(!S.saga.beatMono){ S.saga.beatMono = true; }
    news(t('nMonoBeat',{you:fmt$(pg), them:fmt$(mono.qGross)}), 'good', 'SAGA');
  }
  if(rank===1){ S.stats.no1++; news(t('nRaceWin',{g:fmt$(pg), o:cont.slice(1).map(c=>c.icon+' '+fmt$(c.gross)).join(' · ')}), 'good', 'RACE'); }
  else{
    news(t('nRaceLose',{r:rank, g:fmt$(pg), i:cont[0].icon, n:esc(cont[0].name), t:fmt$(cont[0].gross)}), rank===cont.length?'bad':'', 'RACE');
    if(cont[0].nemesis) news(t('nMonoTaunt',{q:t(pick(['monoTaunt1','monoTaunt2','monoTaunt3']))}), '', 'MONOLITH');
  }
  return rank;
}
function quarterFlavor(){
  if(Math.random()<0.5){
    const k = pick(FLAVOR_KEYS);
    const params = k==='flavFestival' ? {g:hotGenreName()} : {};
    news(t(k, params), '', 'WIRE');
  } else if(Math.random()<0.35){
    const r = pick(RIVAL_DEFS);
    news(t(pick(JAB_KEYS),{r:r.icon+' '+r.name}), '', 'WIRE');
  }
}

/* ---------- EVENTS ---------- */
function maybeEvent(done){
  const chance = 0.45 + (S.curse==='leak' ? 0.15 : 0);
  if(Math.random()<chance && !S.over){
    pendingEvent = pick(EVENTS);
    eventMods = {};
    $('eventEmoji').textContent=pendingEvent.emoji;
    $('eventTitle').textContent=L(pendingEvent.t);
    $('eventText').textContent=L(pendingEvent.x);
    const box=$('eventBtns'); box.innerHTML='';
    pendingEvent.opts.forEach((o,idx)=>{
      const b=document.createElement('button');
      b.innerHTML=`<b>${esc(L(o.l))}</b><span>${esc(L(o.s))}</span>`;
      b.onclick=()=>chooseEvent(idx, done);
      box.appendChild(b);
    });
    $('eventModal').classList.remove('hidden');
  } else done();
}
function chooseEvent(idx, done){
  const o = pendingEvent.opts[idx];
  const fx = o.fx(S)||{};
  if(fx.cash) S.cash += fx.cash;
  if(fx.rep){
    let d = fx.rep;
    if(d<0) d = Math.ceil(d * (S.upg.pr>=4?0.4:(S.upg.pr>=2?0.7:1)));
    S.rep = clamp(S.rep+d,5,99);
  }
  if(fx.fans) S.fans = Math.max(0, S.fans+fx.fans);
  eventMods = fx;
  news(t('nEvent',{e:pendingEvent.emoji, t:L(pendingEvent.t), l:L(o.l)}), fx.cash<0?'bad':'', 'EVENT');
  if(fx.revMod||fx.grossMult||fx.awardsMult) toast(t('toastBanked'));
  $('eventModal').classList.add('hidden');
  save(); renderAll();
  const d=done; pendingEvent=null; if(typeof d==='function') d();
}

/* ---------- ACTIONS / STAFF / UPGRADES / BANK ---------- */
function qkey(){ return S.year+'Q'+S.q; }
function doAction(id){
  if(S.over) return;
  if(id==='loan') return doBank();
  const used = S.usedActions[id];
  const yearOnly = (id==='drop');
  if(yearOnly ? used===String(S.year) : used===qkey()){ toast(yearOnly?t('toastUsedY'):t('toastUsedQ')); return; }
  const a = ACTS.find(x=>x.id===id);
  if(S.cash<a.cost){ toast(t('toastCash')); return; }
  S.cash -= a.cost;
  if(id==='party'){ S.fans+=15000+Math.round(S.rep*200); S.rep=clamp(S.rep+1,5,99); news(t('nParty',{c:fmt$(a.cost)}), 'good', 'ACTION'); }
  if(id==='workshop'){ S.scriptBuff=(S.scriptBuff||0)+2; news(t('nWorkshop',{c:fmt$(a.cost)}), 'good', 'ACTION'); }
  if(id==='scout'){ S.scoutBuff=(S.scoutBuff||0)+8; news(t('nScout',{c:fmt$(a.cost)}), 'good', 'ACTION'); }
  if(id==='campaign'){ S.campaign=(S.campaign||0)+1; news(t('nCampaign',{c:fmt$(a.cost)}), 'good', 'ACTION'); }
  if(id==='gala'){ S.rep=clamp(S.rep+3,5,99); news(t('nGala',{c:fmt$(a.cost)}), 'good', 'ACTION'); }
  if(id==='drop'){
    if(!S.movies.length){ S.cash+=a.cost; toast(t('toastNoCatalog')); return; }
    const pay = Math.round(S.movies.length*0.8e6*S.upg.streaming*(hasRelic('archive')?1.5:1));
    S.cash+=pay; news(t('nDrop',{n:S.movies.length, pay:fmt$(pay)}), 'good', 'ACTION');
  }
  S.usedActions[id]= yearOnly? String(S.year) : qkey();
  sagaCheck();
  save(); renderAll();
}
window.doAction=doAction;
function doBank(){
  if(S.over) return;
  if((S.debt||0)>0){
    const pay = Math.min(S.cash, S.debt);
    if(pay<=0){ toast(t('toastNoRepay')); return; }
    S.cash-=pay; S.debt-=pay;
    news(t('nLoanPay',{pay:fmt$(pay), left:fmt$(S.debt)}), 'good', 'BANK');
  } else {
    S.cash+=30e6; S.debt=30e6;
    news(t('nLoanGet'), '', 'BANK');
  }
  save(); renderAll();
}
function buyUpg(key){
  const lvl=S.upg[key];
  if(lvl>=5) return;
  const cost=UPG[key].costs[lvl];
  if(S.cash<cost){ toast(t('toastCash')); return; }
  S.cash-=cost; S.upg[key]++;
  news(t('nUpg',{i:UPG[key].icon, n:L(UPG[key].name), lvl:S.upg[key], c:fmt$(cost)}), 'good', 'STUDIO');
  if(Object.keys(UPG).every(k=>S.upg[k]>=3)) unlockAch('tycoon');
  save(); renderAll();
}
window.buyUpg=buyUpg;
function hireStaff(key){
  const lvl=S.staff[key]||0;
  if(lvl>=3) return;
  const cost=STAFF[key].hire[lvl+1];
  if(S.cash<cost){ toast(t('toastCash')); return; }
  S.cash-=cost; S.staff[key]=lvl+1;
  news(t('nHire',{i:STAFF[key].icon, n:L(STAFF[key].name), lvl:lvl+1, c:fmt$(cost), s:fmt$(STAFF[key].salary[lvl+1])}), 'good', 'STAFF');
  save(); renderAll();
}
window.hireStaff=hireStaff;
function fireStaff(key){
  if(!(S.staff[key]>0)) return;
  S.staff[key]--;
  news(t('nFire',{i:STAFF[key].icon, n:L(STAFF[key].name), lvl:S.staff[key]}), '', 'STAFF');
  save(); renderAll();
}
window.fireStaff=fireStaff;
function upkeepBill(){
  let pay = S.upg.lot*1e6;
  for(const k in STAFF) pay += (STAFF[k].salary[S.staff[k]||0]||0);
  return Math.round(pay);
}

/* ---------- QUARTER / YEAR ---------- */
function advanceQuarter(){
  const income = Math.round(((S.upg.streaming-1)*1.2e6 + S.movies.length*60000*catMult())*twistStreamMult());
  if(income>0) S.cash += income;
  S.usedActions = {};
  S.q++;
  if(S.q>4){ S.q=1; endYear(); return; }
  quarterFlavor();
  save(); renderAll();
  switchTab('office');
}
function endYear(){
  const eligible = S.movies.filter(m=>m.year===S.year && m.review>=70);
  let wins=0; const winTitles=[];
  eligible.forEach(m=>{
    const noms = clamp(Math.floor((m.review-68)/5) + (m.review>=85?1:0), 1, 4);
    for(let i=0;i<noms;i++){
      let p = (0.32 + (m.genre==='Drama'?0.15:0) + (m.review-70)*0.008) * (1+0.12*(S.staff.awards||0)) * (m.aw||1) * twistAwMult() + (S.campaign||0)*0.03;
      if(hasRelic('ticket')) p *= 1.08;
      if(hasRelic('goldenreel')) p *= 1.08;
      if(S.curse==='drought') p *= 0.7;
      p = Math.min(p, 0.85);
      if(Math.random()<p){ wins++; winTitles.push(m.title); break; }
    }
  });
  S.awards+=wins; S.yearAwards=wins;
  if(wins>=1 && S.awards>=3) unlockAch('awards3');
  if(wins>0 && S.saga.chapter>=4) S.saga.awardLate = true;
  if(wins>0){ S.cash+=wins*2e6; S.rep=clamp(S.rep+wins*2,5,99); S.fans+=wins*20000;
    news(t('nAwards',{w:wins, s:(LANG==='fr'?'':(wins>1?'s':'')), titles:winTitles.map(esc).join(', '), bonus:fmt$(wins*2e6)}), 'award', 'AWARDS');
  } else news(t('nNoAwards'), '', 'AWARDS');
  const table = S.rivals.map(r=>({n:r.name, i:r.icon, p:r.points||0})).concat([{n:'YOU', i:'🎬', p:S.stats.pts||0}]).sort((a,b)=>b.p-a.p);
  if(table[0].n==='YOU'){ S.cash+=8e6; news(t('nStudioWin',{t:table.map(x=>x.i+' '+x.p+'pts').join(' · ')}), 'award', 'RACE'); }
  else news(t('nStudioLose',{n:table[0].i+' '+esc(table[0].n), t:table.map(x=>x.i+' '+x.p).join(' · ')}), '', 'RACE');
  S.rivals.forEach(r=>{r.points=0; r.yGross=0;}); S.stats.pts=0;
  const ok = boardMet(S);
  news(ok?t('nBoardOk',{g:blocText()}):t('nBoardKo',{g:blocText()}), ok?'good':'bad', 'BOARD');
  if(ok) S.cash+=3e6; else S.rep=clamp(S.rep-2,5,99);
  const upkeep = upkeepBill();
  const royal = S.movies.length*150000*catMult();
  S.cash = S.cash - upkeep + royal;
  news(t('nBooks',{u:fmt$(upkeep), r:fmt$(royal)}), upkeep>royal?'':'good', 'BOOKS');
  if(S.debt>0){ S.debt=Math.round(S.debt*1.1); news(t('nDebtGrow',{d:fmt$(S.debt)}), 'bad', 'BANK'); }
  S.campaign=0;
  GENRES.forEach(g=>{ S.trends[g.name]=clamp(S.trends[g.name]+rnd(-0.25,0.25),0.7,1.45); });
  const doneYear=S.year; S.year++;
  pickTwist(false); announceTwist();
  news(t('nTrends',{g:hotGenre()}), '', 'TRENDS');
  S.yearStats={gross:0,profit:0,movies:0,profitable:0,no1:0,sequels:0};
  S.board={id:pick(['profit','two','gross','rep','award','fans','rival'])};
  if(S.board.id==='fans') S.board.fansTarget=Math.round((S.fans+120000)/10000)*10000;
  news(t('nNewGoal',{g:blocText()}), '', 'BOARD');
  sagaCheck();
  const yearsPlayed = S.year - S.startYear;
  if(checkBankrupt()) return;
  if(yearsPlayed>=S.goalYears){ retire(yearsPlayed); return; }
  save(); renderAll();
  $('yearTitle').textContent=t('yearReviewT',{y:doneYear});
  const debtHtml = S.debt ? t('yDebt',{d:fmt$(S.debt)}) : '';
  $('yearBody').innerHTML=`<p>${t('yAwards',{w:wins, t:S.awards, r:table[0].n})}</p>
    <p>${t('yCash',{c:fmt$(S.cash), debt:debtHtml, r:Math.round(S.rep), f:fmtFans(S.fans)})}</p>
    <p class="muted">${t('yBoard',{ok:(ok?t('yOk'):t('yKo')), u:fmt$(upkeep), g:esc(blocText())})}</p>`;
  $('yearModal').classList.remove('hidden');
}
function retire(yearsPlayed){
  S.over=true;
  const score=Math.round(S.cash/1e6 + S.totalGross/1e7 + S.awards*20 + S.fans/50000 + S.rep);
  addHOF({studio:S.studio, score, cash:S.cash, awards:S.awards, years:yearsPlayed, date:new Date().toISOString().slice(0,10)});
  save(); renderAll();
  $('overEmoji').textContent='🌟';
  $('overTitle').textContent=t('overCareerT');
  $('overBody').innerHTML=`<p>${t('oRetireP1',{s:esc(S.studio), y:yearsPlayed})}</p>
    <p>${t('oRetireP2',{n:S.movies.length, g:fmt$(S.totalGross), p:fmt$(S.totalProfit)})}</p>
    <p>${t('oRetireP3',{a:S.awards, f:fmtFans(S.fans), c:fmt$(S.cash)})}</p>
    <p class="muted">${t('oScore',{s:score})}</p>`;
  $('overModal').classList.remove('hidden');
}
function checkBankrupt(){
  if(S.cash<0){
    S.over=true;
    const score=Math.round(S.totalGross/1e7 + S.awards*20 + S.rep);
    addHOF({studio:S.studio+(LANG==='fr'?' (faillite)':' (bankrupt)'), score, cash:S.cash, awards:S.awards, years:S.year-S.startYear, date:new Date().toISOString().slice(0,10)});
    save(); renderAll();
    $('overEmoji').textContent='💸';
    $('overTitle').textContent=t('overBankruptT');
    $('overBody').innerHTML=`<p>${t('oBankruptP1',{s:esc(S.studio), y:S.year})}</p>
      <p>${t('oBankruptP2',{n:S.movies.length, g:fmt$(S.totalGross), a:S.awards})}</p>
      <p class="muted">${t('oTip')}</p>`;
    $('overModal').classList.remove('hidden');
    return true;
  }
  if(S.cash<3e6) toast(t('toastCritical'));
  return false;
}
function checkVictory(){
  if(!S.won && S.cash>=500e6 && S.rep>=85 && S.awards>=3){
    S.won=true; unlockAch('legend');
    news(t('nLegend',{s:esc(S.studio), c:fmt$(S.cash), r:Math.round(S.rep), a:S.awards}), 'award', 'LEGEND');
    save(); renderAll();
    $('overEmoji').textContent='🌟';
    $('overTitle').textContent=t('overLegendT');
    $('overBody').innerHTML=`<p>${t('oLegendP1')}</p><p class="muted">${t('oLegendP2')}</p><button class="btn-ghost" onclick="document.getElementById('overModal').classList.add('hidden')">${t('keepPlaying')}</button>`;
    $('overRestart').textContent=t('overRestart');
    $('overModal').classList.remove('hidden');
    return false;
  }
  return false;
}

/* ---------- RENDER ---------- */
function switchTab(tab){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  ['office','produce','library','studio'].forEach(k=>$('tab-'+k).classList.toggle('hidden', k!==tab));
  if(tab==='produce') renderWizard();
  if(tab==='library') renderLibrary();
  if(tab==='studio') renderStudio();
  if(tab==='office') renderOffice();
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));

function renderAll(){
  if(!S) return;
  $('tbStudio').textContent=S.studio;
  const yrWord = LANG==='fr'?'An':'Yr';
  $('tbDate').textContent=`${S.year} · Q${S.q} · ${yrWord} ${S.year-S.startYear+1}${S.goalYears===Infinity?' (∞)':'/'+S.goalYears}`;
  $('statCash').textContent=fmt$(S.cash);
  $('statCash').style.color=S.cash<5e6?'var(--red)':'';
  $('statRep').textContent=Math.round(S.rep);
  $('statFans').textContent=fmtFans(S.fans);
  $('statAwards').textContent=S.awards;
  $('libCount').textContent=S.movies.length;
  const goal = (S.cash>=500e6&&S.rep>=85&&S.awards>=3) ? t('goalLegend') :
    t('legendNeeds',{c:(S.cash>=500e6?'✅':'❌'), cash:fmt$(S.cash), r:(S.rep>=85?'✅':'❌'), rep:Math.round(S.rep), a:(S.awards>=3?'✅':'❌'), awards:S.awards});
  $('goalBanner').textContent = S.over ? t('goalOver') : goal;
  if(S.twist){
    const tw = TWISTS[S.twist.id];
    $('goalBanner').textContent += ` · 🌀 ${tw.icon} ${L(tw.name)}`;
  }
  renderOffice(); renderLibrary(); renderStudio();
}
function renderOffice(){
  $('hCash').textContent=fmt$(S.cash);
  $('barCash').style.width=clamp(S.cash/200e6*100,2,100)+'%';
  $('hRep').textContent=Math.round(S.rep)+' / 100';
  $('barRep').style.width=S.rep+'%';
  $('hFans').textContent=fmtFans(S.fans);
  $('barFans').style.width=clamp(Math.log10(S.fans+1)/7*100,2,100)+'%';
  $('hDebt').textContent=S.debt>0?fmt$(S.debt):'—';
  $('hDebt').style.color=S.debt>0?'var(--red)':'';
  const st = S.streak||0;
  $('hStreak').textContent = st>0 ? `×${st} (+${Math.min(st,8)*3}%)` : '—';
  $('hStreak').style.color = st>=3 ? 'var(--gold)' : '';
  const sorted=[...GENRES].sort((a,b)=>((S.trends[b.name]||1)+twistHeatFor(b.name))-((S.trends[a.name]||1)+twistHeatFor(a.name)));
  $('trendBox').innerHTML='<b style="width:100%;font-size:13px">'+t('trendH')+'</b>'+sorted.map(g=>{
    const v=clamp((S.trends[g.name]||1)+twistHeatFor(g.name),0.5,1.7); const cls=v>=1.15?'hot':(v<0.9?'cold':'');
    return `<span class="trend ${cls}">${g.emoji} ${(LANG==='fr'?g.fr:g.name)} ×${v.toFixed(2)}</span>`;}).join('');
  const streamQ = Math.round(((S.upg.streaming-1)*1.2e6 + S.movies.length*60000*catMult())*twistStreamMult());
  $('boardBox').innerHTML=`<p>🎯 <b>${esc(blocText())}</b></p>
    <p class="muted" style="font-size:13px">${t('bbYear')} ${t('libStatsFilms',{n:S.yearStats.movies})} · ${fmt$(S.yearStats.gross)} ${t('stGross')} · <span class="${S.yearStats.profit>=0?'profit-pos':'profit-neg'}">${fmt$(S.yearStats.profit)}</span>${S.yearStats.no1?' · 🏁 '+S.yearStats.no1+'× #1':''}</p>
    <p class="muted" style="font-size:13px">📡 ${t('bbStream',{v:fmt$(streamQ)})} · 🧾 ${t('bbUpkeep',{v:fmt$(upkeepBill())})}${S.debt?t('bbDebt',{v:fmt$(S.debt)}):''}${S.campaign?t('bbCamp',{n:S.campaign}):''}</p>`;
  renderSaga();
  renderActions();
  renderFeed();
}
function renderSaga(){
  const box=$('sagaBox'); if(!box) return;
  box.innerHTML = SAGA.map((ch,i)=>{
    const done = S.saga.chapter>i, now = S.saga.chapter===i;
    const rew = `${fmt$(ch.reward.cash||0)}${ch.reward.relic?' · 🎖️ '+L(RELICS[ch.reward.relic].name):''}${ch.reward.shards?' · 💠×'+ch.reward.shards:''}`;
    return `<div class="saga-step ${done?'done':(now?'now':'locked')}"><div class="sic">${done?t('sagaDone'):(now?t('sagaNow'):t('sagaLock'))} ${ch.icon}</div>
      <div><b>${L(ch.name)}</b><br/><small>${L(ch.obj)}${now?' — '+ch.prog(S):''}</small><br/><span class="saga-reward">${t('sagaRewardLbl')}: ${rew}</span></div></div>`;
  }).join('');
}
function renderActions(){
  const box=$('actionBox'); if(!box) return;
  const key=qkey();
  const freeTxt = LANG==='fr'?'gratuit':'free';
  box.innerHTML=ACTS.map(a=>{
    let label=`<b>${a.icon} ${L(a.name)}</b>`;
    let sub=a.cost?fmt$(a.cost):freeTxt;
    let dis=false, cls='';
    if(a.id==='loan'){
      const hasDebt=(S.debt||0)>0;
      label=`<b>${a.icon} ${hasDebt?((LANG==='fr'?'Rembourser ':'Repay ')+fmt$(S.debt)):((LANG==='fr'?'Emprunter 30 M$':'Borrow $30M'))}</b>`;
      sub='10% APR';
    } else {
      const used = a.id==='drop' ? S.usedActions[a.id]===String(S.year) : S.usedActions[a.id]===key;
      if(used){ dis=true; cls='done'; sub='✓'; }
    }
    if(a.id==='drop' && !S.movies.length){ dis=true; }
    return `<button class="act ${cls}" ${dis?'disabled':''} onclick="doAction('${a.id}')">${label}<small>${esc(L(a.desc))} · ${sub}</small></button>`;
  }).join('');
}
function renderFeed(){
  if(!S || !$('newsFeed')) return;
  $('newsFeed').innerHTML = S.news.map(n=>`<div class="news ${n.cls}">${n.html}<small>${esc(n.tag)}</small></div>`).join('') || '<p class="muted">…</p>';
}
function renderLibrary(){
  if(!S) return;
  const sort=$('libSort').value;
  const arr=[...S.movies];
  if(sort==='gross')arr.sort((a,b)=>b.gross-a.gross);
  if(sort==='review')arr.sort((a,b)=>b.review-a.review);
  if(sort==='profit')arr.sort((a,b)=>b.profit-a.profit);
  const tot=S.movies.length;
  const avg=tot?Math.round(S.movies.reduce((x,m)=>x+m.review,0)/tot):0;
  const fr=Object.keys(S.franchises).length;
  $('libStats').innerHTML=`<div>🎬 ${t('libStatsFilms',{n:tot})}</div><div>💰 ${fmt$(S.totalGross)} ${t('stGross')}</div><div>${S.totalProfit>=0?'+':''}${fmt$(S.totalProfit)} ${t('stProfit')}</div><div>⭐ ${avg} ${t('stAvg')}</div><div>🏆 ${t('libStatsAwards',{n:S.awards})}</div><div>🦸 ${t('libStatsFranch',{n:fr})}</div>`;
  $('libraryGrid').innerHTML = arr.map(m=>`<div class="movie-card ${m.verdict.id}">
    <h4>${m.poster} ${esc(m.title)}</h4>
    <span class="genre-tag">${m.emoji} ${gname(m.genre)}</span> ${m.sequelNum?`<span class="genre-tag">🦸 #${m.sequelNum+1}</span>`:''} <small class="muted">${m.year} Q${m.q} · ${esc(m.director)}</small>
    <div class="muted" style="font-size:12px">★ ${m.review} · ${esc(m.stars||'')}</div>
    <div class="numbers"><span>🎟️ ${fmt$(m.gross)}</span><span class="${m.profit>=0?'profit-pos':'profit-neg'}">${m.profit>=0?'+':''}${fmt$(m.profit)}</span><span>${vlabel(m)}</span></div>
  </div>`).join('') || `<p class="muted">${t('libEmpty')}</p>`;
}
function renderStudio(){
  if(!S) return;
  const ll = lvLbl();
  $('upgradeBox').innerHTML=Object.keys(UPG).map(k=>{
    const lvl=S.upg[k], u=UPG[k];
    const next=lvl>=5?null:u.costs[lvl];
    return `<div class="upg"><div class="lv">${u.icon}</div><div><b>${L(u.name)} — ${ll}${lvl}/5</b><br/><small class="muted">${L(u.desc)}</small></div>
    ${next===null?`<b style="color:var(--gold)">${t('maxLbl')}</b>`:`<button onclick="buyUpg('${k}')" ${S.cash<next?'disabled':''}>${fmt$(next)}</button>`}</div>`;
  }).join('');
  const yrSuf = LANG==='fr'?'/an':'/yr';
  $('staffBox').innerHTML=Object.keys(STAFF).map(k=>{
    const lvl=S.staff[k]||0, st=STAFF[k];
    const next=lvl>=3?null:st.hire[lvl+1];
    return `<div class="upg"><div class="lv">${st.icon}</div><div><b>${L(st.name)} — ${ll}${lvl}/3</b><br/><small class="muted">${L(st.desc)}${lvl?` · ${fmt$(st.salary[lvl])}${yrSuf}`:''}</small></div>
    <span style="display:flex;gap:6px;margin-left:auto">${lvl>0?`<button class="btn-ghost small" onclick="fireStaff('${k}')">−</button>`:''}${next===null?`<b style="color:var(--gold)">${t('maxLbl')}</b>`:`<button onclick="hireStaff('${k}')" ${S.cash<next?'disabled':''}>${lvl===0?t('hireLbl'):''}${fmt$(next)}</button>`}</span></div>`;
  }).join('');
  const eq = S.relics||[];
  $('relicLine').innerHTML = eq.length
    ? eq.map(id=>`<span class="ach won" title="${esc(L(RELICS[id].desc))}">${RELICS[id].icon} ${esc(L(RELICS[id].name))}</span>`).join('')
    : `<span class="muted" style="font-size:12px">${t('relicsNone')}</span>`;
  $('rosterBox').innerHTML=S.collaborators.map(c=>`<div class="news">${esc(c.t)}<small>${esc(c.d)}</small></div>`).join('')||`<p class="muted">${t('rosterEmpty')}</p>`;
  const top=[...S.movies].sort((a,b)=>b.gross-a.gross).slice(0,5);
  const max=top.length?top[0].gross:1;
  $('chartBox').innerHTML=top.map(m=>`<div class="cbar"><span style="min-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.poster} ${esc(m.title)}</span><div class="track"><div style="width:${Math.round(m.gross/max*100)}%"></div></div><small>${fmt$(m.gross)}</small></div>`).join('')||`<p class="muted">${t('chartEmpty')}</p>`;
  const table=S.rivals.map(r=>({n:r.name,i:r.icon,p:r.points||0,y:r.yGross||0,nem:!!r.nemesis})).concat([{n:S.studio+(t('rivalYou')),i:'🎬',p:S.stats.pts||0,y:S.yearStats.gross}]).sort((a,b)=>b.p-a.p);
  $('rivalBox').innerHTML=table.map((row,i)=>`<div class="rival-row"><span>${['🥇','🥈','🥉','4️⃣','5️⃣'][i]||''} ${row.i} <b>${esc(row.n)}</b></span><small class="muted">${fmt$(row.y)} ${t('thisYr')}</small><span class="pts">${row.p} pts</span></div>`).join('');
  $('achBox').innerHTML=`<div class="ach-grid">`+ACHS.map(a=>`<span class="ach ${(S.ach||[]).includes(a.id)?'won':''}" title="${esc(L(a.desc))}">${a.icon} ${esc(L(a.name))}</span>`).join('')+`</div><p class="muted" style="font-size:12px">${t('unlocked',{n:(S.ach||[]).length, t:ACHS.length})}</p>`;
}

/* ---------- i18n + draft ---------- */
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.dataset.i18n; el.innerHTML=t(k); });
  ['langEN','menuEN'].forEach(id=>{ const b=$(id); if(b) b.classList.toggle('active', LANG!=='fr'); });
  ['langFR','menuFR'].forEach(id=>{ const b=$(id); if(b) b.classList.toggle('active', LANG==='fr'); });
  renderDraft();
  renderHofPreview();
  if(S){ renderAll(); if(W) renderWizard(); }
}
function setLangAndApply(l){ setLang(l); applyI18n(); }
function renderDraft(){
  const br=$('blessRow'); if(!br) return;
  br.innerHTML = DRAFT_BLESS.map(id=>{const b=BLESSINGS[id];
    return `<button data-bless="${id}" class="diff ${selBless===id?'active':''}" onclick="pickBless('${id}')">${b.icon} ${esc(L(b.name))}<br/><small>${esc(L(b.desc))}</small></button>`;}).join('');
  const cr=$('curseRow');
  cr.innerHTML = `<button data-curse="" class="diff ${!selCurse?'active':''}" onclick="pickCurse('')">${t('curseNone')}</button>` +
    DRAFT_CURSE.map(id=>{const c=CURSES[id];
    return `<button data-curse="${id}" class="diff ${selCurse===id?'active':''}" onclick="pickCurse('${id}')">${c.icon} ${esc(L(c.name))}<br/><small>${esc(L(c.desc))}</small></button>`;}).join('');
  const rd=$('relicDraft');
  const owned = vaultGet();
  rd.innerHTML = Object.keys(RELICS).filter(id=>id!=='goldenreel').map(id=>{
    const r=RELICS[id]; const has=owned.includes(id); const sel=selRelics.includes(id);
    return `<div class="relic ${sel?'sel':''} ${has?'':'locked'}" onclick="toggleRelic('${id}')" title="${esc(L(r.desc))}"><div class="rico">${has?r.icon:'🔒'}</div><b>${has?esc(L(r.name)):'???'}</b><small>${has?esc(L(r.desc)):t('relicsHint')}</small></div>`;
  }).join('');
}
window.pickBless=id=>{ selBless=id; renderDraft(); };
window.pickCurse=id=>{ selCurse=id||null; renderDraft(); };
window.toggleRelic=id=>{
  if(!vaultGet().includes(id)) return;
  if(selRelics.includes(id)) selRelics=selRelics.filter(x=>x!==id);
  else if(selRelics.length<3) selRelics.push(id);
  renderDraft();
};
function renderHofPreview(){
  const h=hof().slice(0,3);
  $('hofPreview').innerHTML = h.length
    ? (LANG==='fr'?'🏆 Panthéon : ':'🏆 Hall of Fame: ')+h.map(e=>esc(e.studio)+' ('+e.score+')').join(' · ')
    : t('hofEmpty');
  const s=load(); if(s) $('continueBtn').classList.remove('hidden');
}

/* ---------- WIRING ---------- */
function bindStart(){
  document.querySelectorAll('#diffRow .diff').forEach(b=>b.onclick=()=>{document.querySelectorAll('#diffRow .diff').forEach(x=>x.classList.remove('active')); b.classList.add('active'); diffSel=b.dataset.diff;});
  document.querySelectorAll('#lengthRow .len').forEach(b=>b.onclick=()=>{document.querySelectorAll('#lengthRow .len').forEach(x=>x.classList.remove('active')); b.classList.add('active'); lenSel=b.dataset.length==='endless'?'endless':b.dataset.length;});
  $('startBtn').onclick=()=>{
    const nm=$('studioNameInput').value.trim()||'Starlight Pictures';
    newGame(nm, diffSel, lenSel);
    $('startScreen').classList.add('hidden'); $('gameScreen').classList.remove('hidden');
    renderAll(); switchTab('office'); startWizard();
  };
  $('howBtn').onclick=()=>$('howModal').classList.remove('hidden');
  $('howClose').onclick=()=>$('howModal').classList.add('hidden');
  $('continueBtn').onclick=()=>{
    const s=load(); if(!s) return;
    S=s; S.news=S.news||[]; $('startScreen').classList.add('hidden'); $('gameScreen').classList.remove('hidden');
    renderAll(); switchTab('office');
  };
  $('greenlightCta').onclick=()=>startWizard();
  $('menuBtn').onclick=()=>$('menuModal').classList.remove('hidden');
  $('menuClose').onclick=()=>$('menuModal').classList.add('hidden');
  $('saveBtn').onclick=()=>{save(); toast(t('toastSaved')); $('menuModal').classList.add('hidden');};
  $('newBtn').onclick=()=>{ if(confirm(t('confirmNew'))) location.reload(); };
  $('hofBtn').onclick=()=>{
    const h=hof();
    const aw = LANG==='fr'?'prix':'awards', yr = LANG==='fr'?'ans':'y';
    alert(t('hofAlertT')+'\n\n'+(h.length? h.map((e,i)=>`${i+1}. ${e.studio} — score ${e.score} (${e.awards} ${aw}, ${e.years}${yr})`).join('\n') : t('hofEmptyAlert')));
  };
  $('resContinue').onclick=()=>closeResultAdvance();
  $('yearContinue').onclick=()=>{ $('yearModal').classList.add('hidden'); renderAll(); switchTab('office'); };
  $('overRestart').onclick=()=>location.reload();
  $('libSort').onchange=()=>renderLibrary();
  $('langEN').onclick=()=>setLangAndApply('en');
  $('langFR').onclick=()=>setLangAndApply('fr');
  $('menuEN').onclick=()=>setLangAndApply('en');
  $('menuFR').onclick=()=>setLangAndApply('fr');
  applyI18n();
}

bindStart();
