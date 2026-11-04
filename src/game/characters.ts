import { Card, Suit } from './rules';

// Image asset paths for the Queens (served by Vite and accessible in tests)
const queenHeartsImg = '/src/assets/images/queen_portrait_1793829142043.jpg';
const queenDiamondsImg = '/src/assets/images/queen_diamonds_1793829159083.jpg';
const queenClubsImg = '/src/assets/images/queen_clubs_1793829173524.jpg';
const queenSpadesImg = '/src/assets/images/queen_spades_1793829187922.jpg';

export const SUIT_INFO: Record<Suit, {
  nameSwedish: string;
  symbol: string;
  faction: string;
  themeColor: string;
  accentColor: string;
  bgGlow: string;
  badge: string;
  description: string;
}> = {
  hearts: {
    nameSwedish: 'Hjärter',
    symbol: '♥',
    faction: 'Sakura Syndikatet',
    themeColor: '#ff007f',
    accentColor: '#ff3366',
    bgGlow: 'rgba(255, 0, 127, 0.25)',
    badge: 'NEO-SAKURA',
    description: 'Högteknologiska lönnmördare, geisha-infiltratörer och neurala nätlöpare i neonrosa och crimson.',
  },
  diamonds: {
    nameSwedish: 'Ruter',
    symbol: '♦',
    faction: 'Aurum MegaCorp',
    themeColor: '#ffb700',
    accentColor: '#ffe600',
    bgGlow: 'rgba(255, 183, 0, 0.25)',
    badge: 'CORP-EXEC',
    description: 'Företagsspioner, AI-arkitekter och lyxoperatörer med guldpläterad cybernetik och dataoptik.',
  },
  clubs: {
    nameSwedish: 'Klöver',
    symbol: '♣',
    faction: 'Bio-Viper Guerrilla',
    themeColor: '#00ff66',
    accentColor: '#10b981',
    bgGlow: 'rgba(0, 255, 102, 0.25)',
    badge: 'BIO-HACK',
    description: 'Underjordiska biopunk-rebeller med självlysande neurala kablar, toxiska injektorer och gatuattityd.',
  },
  spades: {
    nameSwedish: 'Spader',
    symbol: '♠',
    faction: 'Ghost-Net Chrome Ops',
    themeColor: '#00f0ff',
    accentColor: '#38bdf8',
    bgGlow: 'rgba(0, 240, 255, 0.25)',
    badge: 'BLACK-ICE',
    description: 'Elitmilitära cyber-androider och stealth-sabotörer med kromade pansarplåtar och iskall precision.',
  },
};

export function getRankLabel(rank: number): string {
  switch (rank) {
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    case 14: return 'A';
    default: return rank.toString();
  }
}

export function getRankNameSwedish(rank: number): string {
  switch (rank) {
    case 2: return 'Tvåa (Nollställare)';
    case 3: return 'Trea';
    case 4: return 'Fyra';
    case 5: return 'Femma';
    case 6: return 'Sexa';
    case 7: return 'Sjua';
    case 8: return 'Åtta';
    case 9: return 'Nia';
    case 10: return 'Tia (Brännare)';
    case 11: return 'Knekt';
    case 12: return 'Dam (Drottning)';
    case 13: return 'Kung';
    case 14: return 'Ess';
    default: return rank.toString();
  }
}

interface OperativeData {
  codename: string;
  role: string;
  cyberware: string;
  lore: string;
  hairColor: string;
  visorType: 'monocle' | 'tactical-hud' | 'twin-lens' | 'neural-strip' | 'full-visor' | 'optic-cross';
  implantType: 'subdermal-seams' | 'chrome-jaw' | 'neck-circuits' | 'temple-ports' | 'face-lines';
}

const SUIT_OPERATIVES: Record<Suit, Record<number, OperativeData>> = {
  hearts: {
    2: {
      codename: 'Echo "Reset"',
      role: 'Neural Signal Nollställare',
      cyberware: 'Pulse-Wave Dampener Mk II',
      lore: 'Återställer motståndarens dataström till noll med en subtil blinkning av sin cybernetiska iris.',
      hairColor: '#ff2a85',
      visorType: 'neural-strip',
      implantType: 'face-lines',
    },
    3: {
      codename: 'Miyuki "Spike"',
      role: 'Gatu-Infiltratör',
      cyberware: 'Reflex Booster v2.4',
      lore: 'Rör sig osedd i skuggorna under Shinjukus neonregn och knäcker krypterade dörrlås.',
      hairColor: '#ff77aa',
      visorType: 'monocle',
      implantType: 'subdermal-seams',
    },
    4: {
      codename: 'Rin "Ghost-Dancer"',
      role: 'Akrobatisk Sabotör',
      cyberware: 'Kinetic Gyro Stabilizers',
      lore: 'Specialiserad på att kringgå biometriska lasernätverk med dansanta rörelser.',
      hairColor: '#e0115f',
      visorType: 'twin-lens',
      implantType: 'neck-circuits',
    },
    5: {
      codename: 'Sayaka "Whisper"',
      role: 'Subnet Sniffer',
      cyberware: 'Cranial Radio Receiver',
      lore: 'Avlyssnar fientlig radiokommunikation innan fiendens nätverk ens inser intrånget.',
      hairColor: '#ff4d94',
      visorType: 'optic-cross',
      implantType: 'temple-ports',
    },
    6: {
      codename: 'Ayane "Blossom"',
      role: 'Social Ingenjör',
      cyberware: 'Pheromone Synthesis Synthesizer',
      lore: 'Charmar sig in i de mest bevakade företagsvalven utan att dra ett enda vapen.',
      hairColor: '#ff0055',
      visorType: 'tactical-hud',
      implantType: 'face-lines',
    },
    7: {
      codename: 'Kumi "Katana-Eye"',
      role: 'Kling-Specialist',
      cyberware: 'Mantis Subdermal Blades',
      lore: 'Snabbare än ögat med monomolekylära klingor och kirurgisk precision.',
      hairColor: '#ff1493',
      visorType: 'twin-lens',
      implantType: 'chrome-jaw',
    },
    8: {
      codename: 'Chiyo "Mirror"',
      role: 'Holografisk Vilseledare',
      cyberware: 'Refraction Camouflage Cloak',
      lore: 'Kastar förvillande holografiska kopior av sig själv för att finta bort vaktpatruller.',
      hairColor: '#ff66b2',
      visorType: 'neural-strip',
      implantType: 'subdermal-seams',
    },
    9: {
      codename: 'Hana "Vortex"',
      role: 'EMP-Granatör',
      cyberware: 'Ion Induction Gauntlets',
      lore: 'Släpper lös elektromagnetiska urladdningar som mörklägger hela kvarter.',
      hairColor: '#d6006e',
      visorType: 'full-visor',
      implantType: 'neck-circuits',
    },
    10: {
      codename: 'Kasumi "Inferno"',
      role: 'Hög-Brännare & Exekutör',
      cyberware: 'Thermite Overdrive Core',
      lore: 'Bränner hela bordet till aska när situationen blir kritisk. Kallas bordets förgörare.',
      hairColor: '#ff0033',
      visorType: 'tactical-hud',
      implantType: 'face-lines',
    },
    11: {
      codename: 'Yuki "Razor-Jack"',
      role: 'Fortress Breaker',
      cyberware: 'Subdermal Dermal Armor Mk IV',
      lore: 'Syndikatets spjutspets som sparkar in dörrar och krossar brandväggar i ett svep.',
      hairColor: '#ff3388',
      visorType: 'optic-cross',
      implantType: 'chrome-jaw',
    },
    12: {
      codename: 'Empress Sakura "Nyx-Queen"',
      role: 'Sakura-Syndikatets Överhuvud',
      cyberware: 'Quantum Neural Crown & Carbon Corset',
      lore: 'Styr neonunderjorden med absolut elegans och ett stålhårt grepp. Hennes blick förför och krossar imperier.',
      hairColor: '#ff007f',
      visorType: 'tactical-hud',
      implantType: 'face-lines',
    },
    13: {
      codename: 'Shizuka "Warlord"',
      role: 'Taktisk General',
      cyberware: 'Hyper-Threading Battle Core',
      lore: 'Kalkylerar miljontals utfall på millisekunder och leder syndikatets trupper till seger.',
      hairColor: '#cc0066',
      visorType: 'full-visor',
      implantType: 'temple-ports',
    },
    14: {
      codename: 'Amaterasu "Prime-Ace"',
      role: 'Det Högsta Ess-Spjutet',
      cyberware: 'Singularity Bio-Chip',
      lore: 'Det ultimata kortet i Sakura-leken. Oslagbar styrka som triumferar över varje motdrag.',
      hairColor: '#ff00aa',
      visorType: 'tactical-hud',
      implantType: 'subdermal-seams',
    },
  },
  diamonds: {
    2: {
      codename: 'Aurelia "Zero-Gold"',
      role: 'Börs-Nollställare',
      cyberware: 'Cryptographic Clean-Sweep Engine',
      lore: 'Nollställer fientliga transaktionsköer och kastar spelet tillbaka till ruta ett.',
      hairColor: '#f7d070',
      visorType: 'monocle',
      implantType: 'face-lines',
    },
    3: {
      codename: 'Chloe "Ticker"',
      role: 'Data-Kvantör',
      cyberware: 'Sub-Ocular Market Feed',
      lore: 'Ser aktiekurser och kryptoflöden strömma direkt genom sin vänstra guldlins.',
      hairColor: '#e6b800',
      visorType: 'neural-strip',
      implantType: 'temple-ports',
    },
    4: {
      codename: 'Sienna "Auditor"',
      role: 'Neural Likvidator',
      cyberware: 'Forensic Memory Probes',
      lore: 'Avslöjar dolda kontrakt och spårar hemliga konton i de djupaste megacorp-arkiven.',
      hairColor: '#ffd700',
      visorType: 'monocle',
      implantType: 'subdermal-seams',
    },
    5: {
      codename: 'Vesper "Glitch-Broker"',
      role: 'Informationstjuv',
      cyberware: 'Gilded Neural Link Mk III',
      lore: 'Säljer nätverksbakdörrar till högstbjudande på de hemliga takvåningsbörserna.',
      hairColor: '#ffcc33',
      visorType: 'tactical-hud',
      implantType: 'neck-circuits',
    },
    6: {
      codename: 'Elena "Bounty"',
      role: 'VIP-Livvakt',
      cyberware: 'Ceramic Kinetic Shielding',
      lore: 'Beskyddar styrelseledamöter från gatuattentat med ett ogenomträngligt kraftfält.',
      hairColor: '#d4af37',
      visorType: 'twin-lens',
      implantType: 'chrome-jaw',
    },
    7: {
      codename: 'Astrid "Overclock"',
      role: 'AI-Arkitekt',
      cyberware: 'Cranial Co-Processor Array',
      lore: 'Tänker i sjutton dimensioner och optimerar företags-AI:ns militära algoritmer.',
      hairColor: '#fff0a6',
      visorType: 'optic-cross',
      implantType: 'temple-ports',
    },
    8: {
      codename: 'Tara "Vault"',
      role: 'Kryptografisk Mästare',
      cyberware: 'Subdermal Quantum Keys',
      lore: 'Har källkoderna till stadens största offshore-kryptovalv inbäddade i benmärgen.',
      hairColor: '#ffb300',
      visorType: 'monocle',
      implantType: 'subdermal-seams',
    },
    9: {
      codename: 'Ingrid "Titan"',
      role: 'Säkerhetschef',
      cyberware: 'Gilded Exosuit Integration',
      lore: 'Styr Aurum-korporationens privata drönarflotta med tankekraft ensam.',
      hairColor: '#f0c040',
      visorType: 'full-visor',
      implantType: 'face-lines',
    },
    10: {
      codename: 'Valeria "Burn-Rate"',
      role: 'Kapitalförstörare (Brännare)',
      cyberware: 'Plasma Meltdown Injector',
      lore: 'Tömmer och bränner hela bordet när insatserna når sitt klimax. Älskar spektakulära kollapser.',
      hairColor: '#ff8c00',
      visorType: 'tactical-hud',
      implantType: 'neck-circuits',
    },
    11: {
      codename: 'Lucia "Hostile-Takeover"',
      role: 'Knekt & Förhandlare',
      cyberware: 'Neural Syringe Gauntlet',
      lore: 'Gör uppköp med en signatur eller en elchock. Tar aldrig ett nej som svar.',
      hairColor: '#ffdf70',
      visorType: 'optic-cross',
      implantType: 'chrome-jaw',
    },
    12: {
      codename: 'Lady Aurum "Golden-Queen"',
      role: 'Styrelseordförande & Arkitekt',
      cyberware: 'Gilded Neural Crown & Monocle HUD',
      lore: 'Härskaren över Aurum MegaCorp. Klädd i guldpläterad titanbustier och iskall elegans med miljarder på spel.',
      hairColor: '#e6e6fa',
      visorType: 'monocle',
      implantType: 'face-lines',
    },
    13: {
      codename: 'Maximilia "Chairman"',
      role: 'Högste Exekutiv',
      cyberware: 'Orbital Strike Uplink',
      lore: 'Har tillgång till de kinetiska satellitvapnen på omloppsbana och tvekar inte att använda dem.',
      hairColor: '#f5deb3',
      visorType: 'full-visor',
      implantType: 'temple-ports',
    },
    14: {
      codename: 'Victoria "Apex-Capital"',
      role: 'Det Gyllene Esset',
      cyberware: 'Infinite Credit Singularity',
      lore: 'Den absoluta toppen av den finansiella näringskedjan. Äger spelet, bordet och reglerna.',
      hairColor: '#fff8dc',
      visorType: 'tactical-hud',
      implantType: 'subdermal-seams',
    },
  },
  clubs: {
    2: {
      codename: 'Ivy "Bio-Reset"',
      role: 'Toxisk Nollställare',
      cyberware: 'Chlorophyll Neuro-Filter',
      lore: 'Spolar rent kortbordet med en våg av syntetiskt motgift och nollställer trycket.',
      hairColor: '#00ff88',
      visorType: 'neural-strip',
      implantType: 'face-lines',
    },
    3: {
      codename: 'Roxie "Spore"',
      role: 'Svamphackare',
      cyberware: 'Bio-Aerosol Synthesizer',
      lore: 'Sprider mikrodrönare som liknar bioluminiscenta sporer i ventilationstrummorna.',
      hairColor: '#39ff14',
      visorType: 'monocle',
      implantType: 'neck-circuits',
    },
    4: {
      codename: 'Jade "Venom"',
      role: 'Gatu-Kemist',
      cyberware: 'Subdermal Toxin Reservoirs',
      lore: 'Blandar syntetiska nervstimulerande droger som överklockar rebellernas reflexer.',
      hairColor: '#00cc66',
      visorType: 'twin-lens',
      implantType: 'subdermal-seams',
    },
    5: {
      codename: 'Trixie "Wire-Rat"',
      role: 'Skrotplundrare',
      cyberware: 'Optical Voltage Detector',
      lore: 'Hittar militära kretskort i mega-stadens soptippar och bygger egna vapensystem.',
      hairColor: '#7fff00',
      visorType: 'optic-cross',
      implantType: 'temple-ports',
    },
    6: {
      codename: 'Vipera "Coil"',
      role: 'Rebellskytt',
      cyberware: 'Smart-Link Cyberarm',
      lore: 'Träffar en myra på 500 meters avstånd genom rök och neonregn.',
      hairColor: '#00ffaa',
      visorType: 'tactical-hud',
      implantType: 'chrome-jaw',
    },
    7: {
      codename: 'Kat "Jolt"',
      role: 'Batteritjuv',
      cyberware: 'Kinetic Capacitor Spine',
      lore: 'Laddar upp sina egna cyberorgan genom att absorbera tunnelbanans högspänning.',
      hairColor: '#00e676',
      visorType: 'twin-lens',
      implantType: 'neck-circuits',
    },
    8: {
      codename: 'Zoya "Mutagen"',
      role: 'Gen-Modifierare',
      cyberware: 'CRISPR Bio-Printer Hand',
      lore: 'Programmerar om levande celler på språng för att göra teamet immunt mot gasattacker.',
      hairColor: '#2e8b57',
      visorType: 'monocle',
      implantType: 'subdermal-seams',
    },
    9: {
      codename: 'Gwen "Overgrow"',
      role: 'Eko-Terrorist',
      cyberware: 'Synthetic Vine Actuators',
      lore: 'Krossar företagens servrar med syntetiska rötter som spränger betong.',
      hairColor: '#20b2aa',
      visorType: 'full-visor',
      implantType: 'face-lines',
    },
    10: {
      codename: 'Nova "Acid-Burn"',
      role: 'Frätande Brännare',
      cyberware: 'Hydrofluoric Micro-Jets',
      lore: 'När hon kliver in bränns alla motståndarens kort bort i ett grönt, frätande inferno.',
      hairColor: '#adff2f',
      visorType: 'tactical-hud',
      implantType: 'temple-ports',
    },
    11: {
      codename: 'Blaze "Punk-Jack"',
      role: 'Barrikadkrossare',
      cyberware: 'Pneumatic Hammer Fists',
      lore: 'Leder frontlinjen i protesterna och slår sönder kravallpolisens sköldar som kex.',
      hairColor: '#00ff99',
      visorType: 'optic-cross',
      implantType: 'chrome-jaw',
    },
    12: {
      codename: 'Matriarch Viper "Acid-Queen"',
      role: 'Bio-Viper Rebelleder',
      cyberware: 'Bioluminescent Neural Cables & Bio-Corset',
      lore: 'Underjordens okrönta drottning. Hennes lysande gröna hårslingor och stridskorsett inger skräck hos korrupta eliter.',
      hairColor: '#00ff66',
      visorType: 'optic-cross',
      implantType: 'neck-circuits',
    },
    13: {
      codename: 'Sera "Wild-Chief"',
      role: 'Guerrillans Överbefälhavare',
      cyberware: 'Neural Pack Transmitter',
      lore: 'Samordnar hundratals gerillaceller över hela kontinenten med krypterade bioreflexer.',
      hairColor: '#00cc7a',
      visorType: 'full-visor',
      implantType: 'subdermal-seams',
    },
    14: {
      codename: 'Gaia "Bio-Ace"',
      role: 'Eko-Esset',
      cyberware: 'Symbiotic Planetary Conduit',
      lore: 'Naturens hämnd i cybernetisk form. Ett oslagbart trumfkort som vägrar böja sig för betong.',
      hairColor: '#00ffbf',
      visorType: 'tactical-hud',
      implantType: 'face-lines',
    },
  },
  spades: {
    2: {
      codename: 'Zero "Null-Pointer"',
      role: 'System-Nollställare',
      cyberware: 'Black-Ice Memory Purge',
      lore: 'Tömmer minnesregistret och ställer om systemklockan till startläge.',
      hairColor: '#80dfff',
      visorType: 'neural-strip',
      implantType: 'face-lines',
    },
    3: {
      codename: 'Nyx "Spectre"',
      role: 'Optisk Stealth-Spanare',
      cyberware: 'Adaptive Camouflage Skin',
      lore: 'Försvinner framför ögonen på fienden och lämnar bara en kylig luftbris efter sig.',
      hairColor: '#aeeeee',
      visorType: 'monocle',
      implantType: 'subdermal-seams',
    },
    4: {
      codename: 'Cipher "Deep-Dive"',
      role: 'Sub-Zero Netrunner',
      cyberware: 'Liquid Helium Neural Chiller',
      lore: 'Drar ner hjärntemperaturen nära absoluta nollpunkten för att undvika överhettning vid dataintrång.',
      hairColor: '#48d1cc',
      visorType: 'twin-lens',
      implantType: 'temple-ports',
    },
    5: {
      codename: 'Kira "Frost-Byte"',
      role: 'Kod-Sabotör',
      cyberware: 'Quantum Key Inverter',
      lore: 'Förvandlar fientliga krypteringar till skräpkod med några få tangenttryckningar.',
      hairColor: '#00bfff',
      visorType: 'optic-cross',
      implantType: 'neck-circuits',
    },
    6: {
      codename: 'Raven "Apex-Sniper"',
      role: 'Orbital Skytt',
      cyberware: 'Telescopic Cybernetic Retinas',
      lore: 'Beräknar jordens rotation och vindstyrka innan hon avfyrar sitt kinetiska gevär.',
      hairColor: '#1e90ff',
      visorType: 'tactical-hud',
      implantType: 'chrome-jaw',
    },
    7: {
      codename: 'Freya "Glacier"',
      role: 'Datalås-Skapare',
      cyberware: 'Subdermal Ice Encoders',
      lore: 'Fryser fientliga anslutningar i stenhårda digitala block som inte går att bryta.',
      hairColor: '#87ceeb',
      visorType: 'twin-lens',
      implantType: 'subdermal-seams',
    },
    8: {
      codename: 'Synthia "Android-8"',
      role: 'Ren Kisel-Infiltratör',
      cyberware: 'Full-Body Synthetic Chassis',
      lore: 'Tredje generationens autonoma android. Känner ingen smärta, känner ingen tvekan.',
      hairColor: '#b0e0e6',
      visorType: 'monocle',
      implantType: 'face-lines',
    },
    9: {
      codename: 'Valkyrie "Overlord"',
      role: 'Krigsnät-Dirigent',
      cyberware: 'Cranial Satellite Array',
      lore: 'Länkar samman satellitövervakning med marktruppernas sikteshjälp i realtid.',
      hairColor: '#00ced1',
      visorType: 'full-visor',
      implantType: 'temple-ports',
    },
    10: {
      codename: 'Absolute "Zero-Burn"',
      role: 'Kryogenisk Brännare',
      cyberware: 'Supercooled Plasma Cannister',
      lore: 'Fryser hela spelhögen till -273°C och krossar den i miljoner splitter. Nytt drag direkt.',
      hairColor: '#00f0ff',
      visorType: 'tactical-hud',
      implantType: 'neck-circuits',
    },
    11: {
      codename: 'Kage "Shadow-Jack"',
      role: 'Nattens Knekt',
      cyberware: 'Monofilament Garrote Wires',
      lore: 'Hoppar ner från takåsarna och neutraliserar målet utan ett ljud i nattmörkret.',
      hairColor: '#4682b4',
      visorType: 'optic-cross',
      implantType: 'chrome-jaw',
    },
    12: {
      codename: 'Commander Ghost "Cyan-Queen"',
      role: 'Ghost-Net Överbefälhavare',
      cyberware: 'Electric-Cyan Cyber-Optics & Nano-Fiber Bustier',
      lore: 'Den mytomspunna spökledaren. Med elektriskt lysande ögon, silverblont hår och taktisk cyberbustier styr hon skuggkriget.',
      hairColor: '#e0f7fa',
      visorType: 'twin-lens',
      implantType: 'face-lines',
    },
    13: {
      codename: 'Kore "Dreadnought"',
      role: 'Pansrad General',
      cyberware: 'Titanium-Exo Reinforcement',
      lore: 'Kan motstå direktträffar från pansarvärnsrobotar och fortsätta marschera framåt.',
      hairColor: '#5f9ea0',
      visorType: 'full-visor',
      implantType: 'temple-ports',
    },
    14: {
      codename: 'Omega "Black-Ice Ace"',
      role: 'Det Svarta Esset',
      cyberware: 'Zero-Day Singularity Node',
      lore: 'Det ultimata förintelseprogrammet. Ingen brandvägg eller spelare har någonsin överlevt hennes möte.',
      hairColor: '#00f5ff',
      visorType: 'tactical-hud',
      implantType: 'subdermal-seams',
    },
  },
};

/**
 * Creates the full 52-card Cyberpunk Skitgubbe deck.
 */
export function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const deck: Card[] = [];

  for (const suit of suits) {
    const suitData = SUIT_INFO[suit];
    for (let rank = 2; rank <= 14; rank++) {
      const op = SUIT_OPERATIVES[suit][rank];
      const rankLabel = getRankLabel(rank);
      const id = `${suit}_${rank}`;

      // Check for custom high-res Queen image
      let customImage: string | undefined = undefined;
      if (rank === 12) {
        if (suit === 'hearts') customImage = queenHeartsImg;
        if (suit === 'diamonds') customImage = queenDiamondsImg;
        if (suit === 'clubs') customImage = queenClubsImg;
        if (suit === 'spades') customImage = queenSpadesImg;
      }

      deck.push({
        id,
        suit,
        rank,
        name: `${rankLabel} of ${suitData.nameSwedish}`,
        codename: op.codename,
        faction: suitData.faction,
        role: op.role,
        cyberware: op.cyberware,
        lore: op.lore,
        avatarStyle: {
          hairColor: op.hairColor,
          neonColor: suitData.themeColor,
          visorType: op.visorType,
          implantType: op.implantType,
          bgGradient: `linear-gradient(135deg, #090a10 0%, #161826 60%, ${suitData.themeColor}33 100%)`,
        },
        customImage,
      });
    }
  }

  return deck;
}

/**
 * Fisher-Yates shuffle
 */
export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
