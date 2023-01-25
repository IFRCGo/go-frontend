interface Country {
  id: number;
  name: string;
}
interface EmergencyOperation {
  id: string;
  name: string;
  start_date: string;
  atype_display: string;
  code: string;
  country: Country;
}

interface Emergency {
  activeOperation: string;
  disasterType: string;
  fundingRequirements: string;
  fundingCoverage: number;
}

interface EmergencyOperationSearchResult {
  type: 'emergency_operation';
  results: EmergencyOperation[];
}

interface CountrySearchResult {
  type: 'country';
  results: Country;
}

interface FieldReport {
  created_at: string;
  name: string;
  emergency: string;
}

interface FieldReportSearchResult {
  type: 'field_report',
  results: FieldReport[];
}

interface EmergencySearchResult {
  type: 'emergency',
  results: Emergency[];
}

interface SearchResult {
  results: (CountrySearchResult | EmergencyOperationSearchResult | FieldReportSearchResult | EmergencySearchResult)[]
}

const data: SearchResult = {
  results: [
    {
      type: 'country',
      results: {
        id: 1,
        name: 'Nepal',
      }
    },
    {
      type: 'emergency_operation',
      results: [
        {
          name: "Indonesia - West Kalimantan Floods",
          start_date: "2021-11-13T00:00:00Z",
          code: "MDRID022",
          atype_display: "DREF",
          country: {
            id: 85,
            name: "Indonesia",
          },
          id: "3505"
        },
        {
          name: "Pakistan - Dengue Response",
          atype_display: "DREF",
          code: "MDRPK022",
          start_date: "2021-10-21T00:00:00Z",
          country: {
            id: 131,
            name: "Pakistan",
          },
          id: "3499"
        },
        {
          name: "Philippines - Severe Tropical Storm Kompasu",
          atype_display: "DREF",
          code: "MDRPH044",
          start_date: "2021-10-19T00:00:00Z",
          country: {
            id: 136,
            name: "Philippines",
          },
          id: "3496"
        },
        {
          name: "Pakistan - Balochistan Earthquake",
          atype_display: "DREF",
          code: "MDRPK021",
          start_date: "2021-10-17T00:00:00Z",
          country: {
            id: 131,
            name: "Pakistan",
          },
          id: "3495"
        },
        {
          name: "Pakistan - Population Movement from Afghanistan",
          atype_display: "DREF",
          code: "MDRPK020",
          start_date: "2021-09-13T00:00:00Z",
          country: {
            id: 131,
            name: "Pakistan",
          },
          id: "3485"
        },
        {
          name: "Nepal - Monsoon Floods and Landslides",
          atype_display: "DREF",
          code: "MDRNP011",
          start_date: "2021-09-04T00:00:00Z",
          country: {
            id: 123,
            name: "Nepal",
          },
          id: "3482"
        },
        {
          name: "Myanmar - Floods",
          atype_display: "DREF",
          code: "MDRMM017",
          start_date: "2021-08-31T00:00:00Z",
          country: {
            id: 121,
            name: "Myanmar",
          },
          id: "3477"
        },
        {
          name: "Malaysia - Floods Kedah",
          atype_display: "DREF",
          code: "MDRMY007",
          start_date: "2021-08-30T00:00:00Z",
          country: {
            id: 111,
            name: "Malaysia",
          },
          id: "3476"
        },
        {
          name: "Tuvalu - Impending Drought",
          atype_display: "DREF",
          code: "MDRTV002",
          start_date: "2021-08-23T00:00:00Z",
          country: {
            id: 213,
            name: "Tuvalu",
          },
          id: "3473"
        },
        {
          name: "Afghanistan - Nuristan Floods",
          atype_display: "DREF",
          code: "MDRAF009",
          start_date: "2021-08-04T00:00:00Z",
          country: {
            id: 14,
            name: "Afghanistan",
          },
          id: "3461"
        }
      ]
    },
    {
      type: 'field_report',
      results: [
        {
          created_at: "2022-08-31T02:52:26Z",
          name: "Oenothera pallida Lindl. ssp. runcinata (Engelm.) Munz & W. Klein",
          emergency: "Avenue Therapeutics, Inc."
        },
        {
          created_at: "2023-01-03T11:06:41Z",
          name: "Philonotis fontana (Hedw.) Brid. var. americana (Dism.) Flow.",
          emergency: "OpGen, Inc."
        },
        {
          created_at: "2022-12-26T18:14:40Z",
          name: "Avenula (Dumort.) Dumort.",
          emergency: "American Electric Power Company, Inc."
        },
        {
          created_at: "2022-06-22T09:15:44Z",
          name: "Marshallia graminifolia (Walter) Small var. cynanthera (Elliott) Beadle & F.E. Boynt.",
          emergency: "Nuveen North Carolina Quality Municipal Income Fd"
        },
        {
          created_at: "2022-08-02T19:14:18Z",
          name: "Trifolium echinatum M. Bieb.",
          emergency: "AMC Entertainment Holdings, Inc."
        },
        {
          created_at: "2022-05-12T02:57:40Z",
          name: "Clarkia amoena (Lehm.) A. Nelson & J.F. Macbr. ssp. whitneyi (A. Gray) F.H. Lewis & M.E. Lewis",
          emergency: "TapImmune Inc."
        },
        {
          created_at: "2022-06-28T01:22:47Z",
          name: "Dissanthelium Trin.",
          emergency: "Saban Capital Acquisition Corp."
        },
        {
          created_at: "2022-09-02T05:48:59Z",
          name: "Rimularia badioatra (Krempelh.) Hertel & Rambold",
          emergency: "Comerica Incorporated"
        },
        {
          created_at: "2022-02-18T05:26:50Z",
          name: "Polypodium ×incognitum Cusick",
          emergency: "ARI Network Services, Inc."
        },
        {
          created_at: "2022-09-17T19:55:32Z",
          name: "Kallstroemia pubescens (G. Don) Dandy",
          emergency: "Madison Strategic Sector Premium Fund"
        }
      ]
    },
    {
      type: 'emergency',
      results: [
        {
          activeOperation: "Agropecuária Castanhais Airport",
          disasterType: "jcb",
          fundingRequirements: "Plexiglass",
          fundingCoverage: 56
        },
        {
          activeOperation: "Altus Air Force Base",
          disasterType: "visa-electron",
          fundingRequirements: "Glass",
          fundingCoverage: 93
        },
        {
          activeOperation: "Miri Airport",
          disasterType: "china-unionpay",
          fundingRequirements: "Plastic",
          fundingCoverage: 43
        },
        {
          activeOperation: "Hrodna Airport",
          disasterType: "bankcard",
          fundingRequirements: "Plastic",
          fundingCoverage: 69
        },
        {
          activeOperation: "Malikus Saleh Airport",
          disasterType: "americanexpress",
          fundingRequirements: "Plastic",
          fundingCoverage: 68
        },
        {
          activeOperation: "Quesnel Airport",
          disasterType: "solo",
          fundingRequirements: "Stone",
          fundingCoverage: 92
        },
        {
          activeOperation: "Kokoda Airport",
          disasterType: "mastercard",
          fundingRequirements: "Plexiglass",
          fundingCoverage: 28
        },
        {
          activeOperation: "Navoi Airport",
          disasterType: "mastercard",
          fundingRequirements: "Stone",
          fundingCoverage: 14
        },
        {
          activeOperation: "Kishangarh Airport",
          disasterType: "visa",
          fundingRequirements: "Vinyl",
          fundingCoverage: 45
        },
        {
          activeOperation: "Camfield Airport",
          disasterType: "jcb",
          fundingRequirements: "Plastic",
          fundingCoverage: 13
        }
      ]
    }
  ]
};

export default data;