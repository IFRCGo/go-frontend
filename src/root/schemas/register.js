
// Keeping this as a backup if the API call fails somehow
export const whitelistDomains = [
  'ifrc.org',
  'apdisasterresilience.org',
  'arabrcrc.org',
  'arcs.org.af',
  'bdrcs.org',
  'brcs.bt',
  'cck-cr.cz',
  'ckcg.me',
  'ckrm.org.mk',
  'climatecentre.org',
  'creuroja.ad',
  'cri.it',
  'croix-rouge.be',
  'croix-rouge.fr',
  'croix-rouge.lu',
  'croix-rouge.mc',
  'croixrouge.ht',
  'croixrouge-mali.org',
  'croixrougesenegal.com',
  'crucearosie.ro',
  'cruzroja.cl',
  'cruzroja.es',
  'cruzroja.gt',
  'cruzroja.or.cr',
  'cruzroja.org',
  'cruzroja.org.ar',
  'cruzroja.org.ec',
  'cruzroja.org.hn',
  'cruzroja.org.pa',
  'cruzroja.org.pe',
  'cruzroja.org.py',
  'cruzroja.org.uy',
  'cruzrojaboliviana.org',
  'cruzrojacolombiana.org',
  'cruzrojamexicana.org.mx',
  'cruzrojanicaraguense.org',
  'cruzrojasal.org.sv',
  'cruzrojauruguaya.org',
  'cruzrojavenezolana.org',
  'cruzvermelha.org.br',
  'cruzvermelha.org.pt',
  'drk.de',
  'drk.dk',
  'egyptianrc.org',
  'fijiredcross.org',
  'germanredcross.de',
  'grsproadsafety.org',
  'guatemala.cruzroja.org',
  'hck.hr',
  'honduras.cruzroja.org',
  'icrc.org',
  'indianredcross.org',
  'jamaicaredcross.org',
  'jnrcs.org',
  'jrc.or.jp',
  'kenyaredcross.org',
  'kizilay.org.tr',
  'kksh.org.al',
  'krc.kg',
  'krcs.org.kw',
  'laoredcross.org.la',
  'livelihoodscentre.org',
  'mauritiusredcross.com',
  'mdais.org',
  'mda.org.il',
  'nrcs.org',
  'palauredcross.org',
  'palestinercs.org',
  'pck.org.pl',
  'pck.pl',
  'pmi.or.id',
  'prcs.org.pk',
  'pscentre.org',
  'qrcs.org.qa',
  'rcs.ir',
  'rcsbahrain.org',
  'rcsbh.org',
  'rcuae.ae',
  'redcrescent.az',
  'redcrescent.kg',
  'redcrescent.kz',
  'redcrescent.org.mv',
  'redcrescent.org.my',
  'redcrescent.tj',
  'redcrescent.uz',
  'redcross-eu.net',
  'redcross.am',
  'redcross.be',
  'redcross.bg',
  'redcross.by',
  'redcross.ca',
  'redcross.ch',
  'redcross.com.fj',
  'redcross.dm',
  'redcross.ee',
  'redcross.fi',
  'redcross.ge',
  'redcross.gr',
  'redcross.ie',
  'redcross.int',
  'redcross.is',
  'redcross.lk',
  'redcross.lt',
  'redcross.lv',
  'redcross.md',
  'redcross.mn',
  'redcross.no',
  'redcross.or.ke',
  'redcross.or.kr',
  'redcross.or.th',
  'redcross.org',
  'redcross.org.au',
  'redcross.org.ck',
  'redcross.org.cn',
  'redcross.org.cy',
  'redcross.org.hk',
  'redcross.org.jm',
  'redcross.org.kh',
  'redcross.org.lb',
  'redcross.org.mk',
  'redcross.org.mm',
  'redcross.org.mo',
  'redcross.org.mt',
  'redcross.org.mz',
  'redcross.org.na',
  'redcross.org.nz',
  'redcross.org.pg',
  'redcross.org.ph',
  'redcross.org.rs',
  'redcross.org.sb',
  'redcross.org.sg',
  'redcross.org.ua',
  'redcross.org.uk',
  'redcross.org.vn',
  'redcross.org.za',
  'redcross.org.zm',
  'redcross.ru',
  'redcross.se',
  'redcross.sk',
  'redcross.tl',
  'redcrossghana.org',
  'redcrosseth.org',
  'redcrossmuseum.ch',
  'redcrossnigeria.org',
  'redcrossseychelles.sc',
  'redcrossug.org',
  'redcrossvanuatu.com',
  'redcrosszim.org.zw',
  'rks.si',
  'rmiredcross.org',
  'rodekruis.be',
  'roteskreuz.be',
  'rodekors.dk',
  'rodekruis.nl',
  'redcross.nl',
  'roteskreuz.at',
  'st.roteskreuz.at', // Steiermark (Styria)
  's.roteskreuz.at', // Salzburg
  'b.roteskreuz.at', // Burgenland
  't.roteskreuz.at', // Tirol (Tyrol)
  'w.roteskreuz.at', // Wien (Vienna)
  'v.roteskreuz.at', // Vorarlberg
  'k.roteskreuz.at', // Kaernten (Carinthia)
  'n.roteskreuz.at', // Niederoesterreich (lower Austria)
  'o.roteskreuz.at', // Oberoesterreich (upper Austria)
  'roteskreuz-innsbruck.at',
  'roteskreuz.li',
  'rwandaredcross.org',
  'sarc.sy',
  'sarc-sy.org',
  'sierraleoneredcross.org',
  'srcs.sd',
  'standcom.ch',
  'tgymj.gov.tm',
  'tongaredcross.to',
  'trcs.or.tz',
  'ttrcs.org',
  'vanuaturedcross.org',
  'voroskereszt.hu'
];

export default {
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    username: {
      type: 'string'
    },
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    country: {
      type: 'number'
    },
    city: {
      type: 'string'
    },
    organizationType: {
      type: 'string'
    },
    organization: {
      type: 'string'
    },
    department: {
      type: 'string'
    },
    position: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 8
    },
    passwordConf: {
      const: { '$data': '1/password' }
    }
  },
  required: [
    'email',
    // 'username',
    'organizationType',
    'organization',
    'firstname',
    'lastname',
    'country',
    'password',
    'passwordConf'
  ],
  if: {
    properties: {
      email: {
        not: {
          pattern: whitelistDomains.map(o => `@${o}`).join('|')
        }
      }
    }
  },
  then: {
    properties: {
      contact: {
        type: 'array',
        items: {
          properties: {
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            }
          },
          required: ['name', 'email']
        }
      }
    }
  }
};
