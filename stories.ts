// Stories for Sunday 22 November 2026, each verified against at least two
// sources dated 22 November 2026 in some time zone (event or first report).
// Sources are recorded in SOURCES.md next to this file's research notes.
// Regions: MIDDLE EAST, EUROPE, ASIA, OCEANIA, AFRICA, N. AMERICA,
// S. AMERICA, SPORT, MARKETS, CULTURE.

export type Story = {
  region: string;
  tag: string;
  headline: string;
  summary: string;
  icon: string;
};

export const HERO: Story = {
  region: 'MIDDLE EAST',
  tag: 'IRAN STRIKES US BASES',
  headline: 'Iran hits US bases in Bahrain as Gulf tensions explode',
  summary:
    'Iran says its missiles and drones hit two US Patriot radar sites in Bahrain; Bahrain says its defences stopped several attacks and a fire broke out at a civilian plant. No injuries reported.',
  icon: 'blast',
};

export const FEATURED: Story[] = [
  {
    region: 'CLIMATE',
    tag: 'COP31 ANTALYA',
    headline: 'COP31 nears final deal after all-night talks',
    summary:
      'Negotiators work past a Friday deadline into Sunday morning; a new text package is put to a vote in Antalya.',
    icon: 'globe',
  },
  {
    region: 'N. AMERICA',
    tag: 'MEXICO',
    headline: 'Mexico seizes FBI most-wanted cartel boss, 11 killed',
    summary:
      'Fausto Isidro Meza Flores, "El Chapo Isidro", is captured in Sinaloa; gun battles kill 11, four of them soldiers.',
    icon: 'shield',
  },
  {
    region: 'S. AMERICA',
    tag: 'BRAZIL',
    headline: 'Bolsonaro taken to intensive care in Brasilia',
    summary:
      'The former president is stable and conscious with a bowel obstruction, doctors say, with no discharge date set.',
    icon: 'cross',
  },
  {
    region: 'ASIA',
    tag: 'INDIA',
    headline: 'Ladakh votes in first local polls in eight years',
    summary:
      'Turnout hits 70% for village councils and 52% for town councils in the first vote since Ladakh became a Union Territory.',
    icon: 'vote',
  },
  {
    region: 'SPORT',
    tag: 'RUGBY',
    headline: 'England thrash All Blacks 37-12 in record win',
    summary:
      'Five tries at Twickenham give England their biggest ever margin over New Zealand, beating the 2012 mark.',
    icon: 'ball',
  },
  {
    region: 'MARKETS',
    tag: 'CRYPTO',
    headline: 'Bitcoin climbs back above $60,000 after weekend plunge',
    summary:
      'The coin recovers from about $55,100, its lowest in two years, as gold and silver end a brutal week sharply down.',
    icon: 'chart',
  },
];

export const COMPACT: Story[] = [
  {
    region: 'S. AMERICA',
    tag: 'BRAZIL STORM',
    headline: 'Supercell storm kills three, wrecks 5,000 homes in Brazil',
    summary: 'Winds of 114 km/h hit Tupancireta; about 60 hurt.',
    icon: 'storm',
  },
  {
    region: 'S. AMERICA',
    tag: 'PERU QUAKE',
    headline: 'Peru quake toll rises: one dead, 16 hurt, 152 homes unfit',
    summary: 'Civil defence updates toll after magnitude 6.7 quake.',
    icon: 'quake',
  },
  {
    region: 'N. AMERICA',
    tag: 'CANADA',
    headline: 'Canada sees no shift in US military ties, minister says',
    summary: 'Defence chief responds to reported Pentagon memo.',
    icon: 'shield',
  },
  {
    region: 'N. AMERICA',
    tag: 'USA',
    headline: 'Second judge blocks Trump triumphal arch in Virginia',
    summary: 'The 250-foot arch near Arlington is halted indefinitely.',
    icon: 'court',
  },
  {
    region: 'N. AMERICA',
    tag: 'FLORIDA',
    headline: 'Florida floods push St Johns River past 1953 record',
    summary: 'Two feet of rain; nearly 200 rescues along the coast.',
    icon: 'flood',
  },
  {
    region: 'N. AMERICA',
    tag: 'USA',
    headline: 'Trump calls reported FBI database hack "not good"',
    summary: 'President speaks after second breach of FBI systems.',
    icon: 'shield',
  },
  {
    region: 'SPORT',
    tag: 'COLLEGE FOOTBALL',
    headline: 'Michigan stuns unbeaten UCLA 18-16 in triple overtime',
    summary: 'Game-winning two-point try ends the Bruins perfect run.',
    icon: 'ball',
  },
  {
    region: 'SPORT',
    tag: 'COLLEGE FOOTBALL',
    headline: 'NC State rolls past Florida State 28-10 on the road',
    summary: 'CJ Bailey throws for 292 yards and three touchdowns.',
    icon: 'ball',
  },
  {
    region: 'SPORT',
    tag: 'COLLEGE FOOTBALL',
    headline: 'Tennessee beats LSU 27-13, keeps playoff hopes alive',
    summary: 'Eight sacks and two late touchdowns sink the Tigers.',
    icon: 'ball',
  },
  {
    region: 'OCEANIA',
    tag: 'RUGBY',
    headline: 'Wallabies edge Wales 29-26 to end losing run',
    summary: 'Late try and penalty in Cardiff keep the Bevan Trophy.',
    icon: 'ball',
  },
  {
    region: 'ASIA',
    tag: 'SINGAPORE',
    headline: 'China vice-premier Ding begins Singapore visit',
    summary: 'Two-day trip leads to 22nd JCBC meeting on Monday.',
    icon: 'diplomacy',
  },
  {
    region: 'ASIA',
    tag: 'INDIA',
    headline: 'Manipur toxic liquor toll rises to 16, hundreds in care',
    summary: 'About 600 people treated; six arrested, inquiry opened.',
    icon: 'cross',
  },
  {
    region: 'ASIA',
    tag: 'SINGAPORE',
    headline: 'Flu jabs among Singapore seniors more than double',
    summary: 'Coverage for over-65s rises from 20% to almost 50%.',
    icon: 'cross',
  },
  {
    region: 'ASIA',
    tag: 'BANGLADESH',
    headline: 'Bangladesh peacekeeper vetting under scrutiny',
    summary: 'Report questions screening of troops for UN missions.',
    icon: 'shield',
  },
  {
    region: 'ASIA',
    tag: 'CHINA',
    headline: 'Adora Flora City begins maiden voyage from Guangzhou',
    summary: 'China second home-built cruise ship sails to Hong Kong.',
    icon: 'ship',
  },
  {
    region: 'EUROPE',
    tag: 'EU BUDGET',
    headline: 'EU chief proposes slimmer budget, 3% big-tech levy',
    summary: 'France rejects the plan as a basis for agreement.',
    icon: 'chart',
  },
  {
    region: 'MIDDLE EAST',
    tag: 'IRAN TALKS',
    headline: 'Trump seeks "permanent" nuclear deal with Iran',
    summary: 'President tells Fox News any deal must outlast his term.',
    icon: 'diplomacy',
  },
  {
    region: 'CULTURE',
    tag: 'FILM',
    headline: 'New Hunger Games film heads for $120m opening',
    summary: 'Prequel earns about $56m on Friday in North America.',
    icon: 'film',
  },
  {
    region: 'EUROPE',
    tag: 'ITALY STRIKES',
    headline: 'Italian airport strikes hit Milan, Venice and Pisa',
    summary: 'Controllers walk out at Malpensa; 24-hour stoppages in Venice, Pisa, Florence.',
    icon: 'plane',
  },
  {
    region: 'AFRICA',
    tag: 'SOUTH AFRICA',
    headline: 'Prayer service held for Mlambo-Ngcuka in Sandton',
    summary: 'South Africa first woman deputy president died on 20 Nov, aged 71.',
    icon: 'cross',
  },
  {
    region: 'ASIA',
    tag: 'HONG KONG',
    headline: 'Hong Kong votes for 723 Election Committee seats',
    summary: '856 candidates contest seats in the body that picks the chief executive.',
    icon: 'vote',
  },
  {
    region: 'SPORT',
    tag: 'NBA',
    headline: '76ers edge Bucks 132-129 in early Sunday tip-off',
    summary: 'Embiid and James lead Philadelphia past Milwaukee in a close finish.',
    icon: 'ball',
  },
];

export const ALL_STORIES: Story[] = [HERO, ...FEATURED, ...COMPACT];

export const REGIONS = [
  'MIDDLE EAST',
  'EUROPE',
  'ASIA',
  'OCEANIA',
  'AFRICA',
  'N. AMERICA',
  'S. AMERICA',
];
