const ASSET = '/assets/';

const animeData = [
  ['shadow-ronin','Shadow Ronin','Action','Samurai','2024','TV Series','Ongoing',4.8,12,'Kage Studio','A nameless ronin walks through a neon war era while hunted by memories and enemies.'],
  ['neon-valkyrie','Neon Valkyrie','Action','Sci-Fi','2024','TV Series','Ongoing',4.7,12,'Nova Works','A cyber pilot enters a citywide rebellion powered by forbidden technology.'],
  ['moon-harbor','Moon Harbor','Drama','Slice of Life','2023','TV Series','Completed',4.6,24,'Blue Dock','A quiet harbor town becomes the center of stories about friendship and loss.'],
  ['iron-eclipse','Iron Eclipse','Mecha','Sci-Fi','2022','TV Series','Completed',4.7,24,'Forge Line','Mechanical warriors return when the eclipse awakens old machines under the capital.'],
  ['crystal-academy','Crystal Academy','Magic','School','2024','TV Series','Ongoing',4.5,13,'Luna Studio','Students at a floating academy learn magic while a hidden war rises below.'],
  ['starlight-riders','Starlight Riders','Sci-Fi','Space','1985','TV Series','Completed',4.5,43,'Retro Star','A classic space crew travels between ruined colonies and forgotten stars.'],
  ['whispering-trees','Whispering Trees','Drama','Romance','1995','Movie','Completed',4.4,1,'Forest Art','A timeless romance unfolds in a village where trees keep memories alive.'],
  ['azure-chronicle','Azure Chronicle','Fantasy','Adventure','2023','TV Series','Ongoing',4.6,12,'Azure Lab','A young knight searches for the last sky temple across blue kingdoms.'],
  ['eclipse-covenant','Eclipse Covenant','Action','Supernatural','2023','TV Series','Ongoing',4.5,12,'Coven House','Two hunters bind their souls to stop a blood moon curse.'],
  ['windborne-tales','Windborne Tales','Adventure','Fantasy','2021','TV Series','Completed',4.4,24,'Wind Studio','A traveler and a cat follow wind maps to find a lost home.'],
  ['requiem-protocol','Requiem Protocol','Sci-Fi','Thriller','2022','TV Series','Completed',4.3,12,'Dark Grid','A city AI begins rewriting memories one citizen at a time.'],
  ['midnight-diner-kyoto','Midnight Diner Kyoto','Slice of Life','Drama','2018','TV Series','Completed',4.2,10,'Kyoto Frame','A late-night diner connects strangers through food and quiet confessions.'],
  ['attack-on-titan','Attack on Titan','Action','Drama','2013','TV Series','Completed',4.9,94,'Wit Studio, MAPPA','Humanity fights for survival behind walls as giant enemies threaten the last cities.'],
  ['naruto-shippuden','Naruto Shippuden','Action','Adventure','2007','TV Series','Completed',4.7,500,'Pierrot','A young ninja continues his journey to protect his friends and become stronger.'],
  ['one-piece','One Piece','Adventure','Fantasy','1999','TV Series','Ongoing',4.9,1100,'Toei Animation','Pirates sail the seas searching for the legendary treasure and endless freedom.'],
  ['bleach','Bleach','Action','Supernatural','2004','TV Series','Completed',4.6,366,'Pierrot','A substitute soul reaper battles spirits while uncovering a larger hidden world.'],
  ['death-note','Death Note','Mystery','Thriller','2006','TV Series','Completed',4.9,37,'Madhouse','A student gains a deadly notebook and enters a battle of genius against a detective.'],
  ['fullmetal-alchemist-brotherhood','Fullmetal Alchemist Brotherhood','Action','Adventure','2009','TV Series','Completed',4.9,64,'Bones','Two brothers search for the philosopher stone after a forbidden experiment goes wrong.'],
  ['hunter-x-hunter','Hunter x Hunter','Action','Adventure','2011','TV Series','Completed',4.8,148,'Madhouse','A boy becomes a hunter to find his father and enters a dangerous world.'],
  ['steins-gate','Steins Gate','Sci-Fi','Thriller','2011','TV Series','Completed',4.8,24,'White Fox','A group of friends discover time travel and face the cost of changing fate.'],
  ['code-geass','Code Geass','Mecha','Drama','2006','TV Series','Completed',4.8,50,'Sunrise','A masked prince leads a rebellion using strategy and a supernatural power.'],
  ['dragon-ball-z','Dragon Ball Z','Action','Adventure','1989','TV Series','Completed',4.6,291,'Toei Animation','Earth fighters defend the planet from powerful warriors and cosmic threats.'],
  ['black-clover','Black Clover','Action','Magic','2017','TV Series','Completed',4.5,170,'Pierrot','A magicless boy aims to become the Wizard King through courage and hard work.'],
  ['my-hero-academia','My Hero Academia','Action','School','2016','TV Series','Ongoing',4.5,150,'Bones','Young heroes train to protect a world where superpowers are common.'],
  ['jujutsu-kaisen','Jujutsu Kaisen','Action','Supernatural','2020','TV Series','Ongoing',4.8,48,'MAPPA','A student joins sorcerers to battle curses after swallowing a cursed object.'],
  ['demon-slayer','Demon Slayer','Action','Fantasy','2019','TV Series','Ongoing',4.8,55,'ufotable','A boy becomes a demon slayer to save his sister and avenge his family.'],
  ['chainsaw-man','Chainsaw Man','Action','Horror','2022','TV Series','Ongoing',4.7,12,'MAPPA','A young devil hunter becomes something powerful after merging with his partner.'],
  ['tokyo-ghoul','Tokyo Ghoul','Horror','Drama','2014','TV Series','Completed',4.4,48,'Pierrot','A student becomes half-ghoul and struggles between two worlds.'],
  ['cowboy-bebop','Cowboy Bebop','Sci-Fi','Space','1998','TV Series','Completed',4.8,26,'Sunrise','Bounty hunters drift through space while haunted by their pasts.'],
  ['samurai-champloo','Samurai Champloo','Action','Samurai','2004','TV Series','Completed',4.7,26,'Manglobe','Two swordsmen and a girl travel across Edo-era Japan with a modern rhythm.']
].map((x,i)=>({
  id:i+1, slug:x[0], title:x[1], genres:[x[2],x[3]], releaseYear:Number(x[4]), type:x[5], status:x[6], rating:x[7], totalEpisodes:x[8], studio:x[9], description:x[10],
  posterUrl:`${ASSET}poster-${String((i%30)+1).padStart(2,'0')}.jpg`,
  bannerUrl: i<12 ? `${ASSET}banner-ronin.jpg` : `${ASSET}hero-main.jpg`,
  ageRating: i%4===0?'TV-14':i%4===1?'TV-MA':'TV-PG',
  isTrending:i<8 || ['attack-on-titan','one-piece','jujutsu-kaisen'].includes(x[0]),
  isPopular:i<12 || ['death-note','fullmetal-alchemist-brotherhood','hunter-x-hunter','naruto-shippuden'].includes(x[0]),
  isClassic:Number(x[4])<2012,
  isRecentlyAdded:i<10 || Number(x[4])>2019
}));

const episodeData = [];
const episodeNames = ['The Ronin Path','Blood on the Blade','Whispers in the Dark','Fractured Honor','Echoes of the Past','The Price of Loyalty','Night of the Betrayer','Crimson Resolve','Flames of Retribution','Path of the Ronin','Moonlit Duel','The Last Oath'];
for (let e=1;e<=12;e++) {
  episodeData.push({ id:e, animeSlug:'shadow-ronin', episodeNumber:e, title:episodeNames[e-1], description:'A new chapter unfolds as the story moves closer to the final confrontation.', duration:'24m', releaseDate:`Oct ${4+e}, 2024`, thumbnailUrl:`${ASSET}thumb-${String(e).padStart(2,'0')}.jpg` });
}
['attack-on-titan','one-piece','naruto-shippuden','jujutsu-kaisen','demon-slayer','solo-leveling'].forEach((slug,idx)=>{
  for (let e=1;e<=8;e++) episodeData.push({ id:100+idx*10+e, animeSlug:slug, episodeNumber:e, title:`Episode ${String(e).padStart(2,'0')}`, description:'Fresh episode update from the AniMiko library.', duration:'23m', releaseDate:e>5?'Today':'This week', thumbnailUrl:`${ASSET}thumb-${String(((e+idx)%12)+1).padStart(2,'0')}.jpg` });
});
