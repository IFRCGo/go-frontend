const components = {
  a1: [
    {id: 'c0epi', name: 'RC auxiliary role, Mandate and Law'},
    {id: 'c1epi', name: 'DRM Strategy'},
    {id: 'c2epi', name: 'DRM Policy'},
    {id: 'c3epi', name: 'DRM Laws, Advocacy and Dissemination'},
    {id: 'c4epi', name: 'Quality and accountability'}
  ],
  a2: [
    {id: 'c0epi', name: 'Hazard, Context and Risk Analysis, Monitoring and Early Warning'},
    {id: 'c1epi', name: 'Scenario planning'},
    {id: 'c2epi', name: 'Risk management'},
    {id: 'c3epi', name: 'Preparedness plans and budgets'},
    {id: 'c4epi', name: 'Business continuity'},
    {id: 'c5epi', name: 'Emergency Response Procedures (SOPs)'},
    {id: 'c6epi', name: 'Response and recovery planning'},
    {id: 'c7epi', name: 'Pre-disaster meetings and agreements'}
  ],
  a3: [
    {id: 'c0epi', name: 'Mapping of NS capacities'},
    {id: 'c1epi', name: 'Early Action Mechanisms'},
    {id: 'c2epi', name: 'Cash Based Intervention (CBI)'},
    {id: 'c3epi', name: 'Emergency Needs Assessment'},
    {id: 'c4epi', name: 'Affected population selection'},
    {id: 'c5epi', name: 'Emergency Operations Centre (EOC)'},
    {id: 'c6epi', name: 'Information Management (IM)'},
    {id: 'c7epi', name: 'Testing and Learning'},
    {id: 'c8epi', name: 'Activation of regional and international support'}
  ],
  a3_2: [
    {id: 'c0epi', name: 'COMMUNITY-BASED DP AND DRR'},
    {id: 'c1epi', name: 'EVACUATION'},
    {id: 'c2epi', name: 'HEALTH IN EMERGENCIES'},
    {id: 'c3epi', name: 'FIRST AID'},
    {id: 'c4epi', name: 'WATER AND SANITATION'},
    {id: 'c5epi', name: 'FOOD SECURITY'},
    {id: 'c6epi', name: 'LIVELIHOOD SECURITY AND SAFETY NETS'},
    {id: 'c7epi', name: 'SEARCH AND RESCUE'},
    {id: 'c8epi', name: 'SHELTER, HOUSEHOLD ITEMS, SETTLEMENTS'},
    {id: 'c9epi', name: 'MANAGEMENT OF DEAD BODIES TO FACILITATE THEIR IDENTIFICATION'},
    {id: 'c10epi', name: 'RESTORING FAMILY LINKS (RFL)'},
    {id: 'c11epi', name: 'TRANSITION TO RECOVERY'},
    {id: 'c12epi', name: 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) EMERGENCY PREPAREDNESS'},
    {id: 'c13epi', name: 'COMMUNITY BASED HEALTH & FIRST AID (CBHFA)'}
  ],
  a4: [
    {id: 'c0epi', name: 'Coordination with Movement'},
    {id: 'c1epi', name: 'Coordination with authorities'},
    {id: 'c2epi', name: 'Coordination with External Agencies and NGOs'},
    {id: 'c3epi', name: 'Civil Military Relations'},
    {id: 'c4epi', name: 'Coordination with local community level responders'},
    {id: 'c5epi', name: 'Cooperation with private sector'}
  ],
  a5: [
    {id: 'c0epi', name: 'Safety and security management'},
    {id: 'c1epi', name: 'Operations Monitoring, Evaluation, Reporting and Learning'},
    {id: 'c2epi', name: 'Finance and Admin policy and emergency procedures'},
    {id: 'c3epi', name: 'Information and Communication Technology (ICT)'},
    {id: 'c4epi', name: 'Logistics, procurement and supply chain'},
    {id: 'c5epi', name: 'LOGISTICS MANAGEMENT'},
    {id: 'c6epi', name: 'SUPPLY CHAIN MANAGEMENT'},
    {id: 'c7epi', name: 'PROCUREMENT'},
    {id: 'c8epi', name: 'FLEET AND TRANSPORTATION MANAGEMENT'},
    {id: 'c9epi', name: 'WAREHOUSE AND STOCK MANAGEMENT'},
    {id: 'c10epi', name: 'Staff and volunteer management'},
    {id: 'c11epi', name: 'Communication in emergencies'},
    {id: 'c12epi', name: 'Resource Mobilisation'}
  ]
};

const shortComponents = {
  a1: [
    {id: 'c0', name: 'RC auxiliary role, Mandate and Law'},
    {id: 'c1', name: 'DRM Strategy'},
    {id: 'c2', name: 'DRM Policy'},
    {id: 'c3', name: 'DRM Laws, Advocacy and Dissemination'},
    {id: 'c4', name: 'Quality and accountability'}
  ],
  a2: [
    {id: 'c0', name: 'Hazard, Context and Risk Analysis, Monitoring and Early Warning'},
    {id: 'c1', name: 'Scenario planning'},
    {id: 'c2', name: 'Risk management'},
    {id: 'c3', name: 'Preparedness plans and budgets'},
    {id: 'c4', name: 'Business continuity'},
    {id: 'c5', name: 'Emergency Response Procedures (SOPs)'},
    {id: 'c6', name: 'Response and recovery planning'},
    {id: 'c7', name: 'Pre-disaster meetings and agreements'}
  ],
  a3: [
    {id: 'c0', name: 'Mapping of NS capacities'},
    {id: 'c1', name: 'Early Action Mechanisms'},
    {id: 'c2', name: 'Cash Based Intervention (CBI)'},
    {id: 'c3', name: 'Emergency Needs Assessment'},
    {id: 'c4', name: 'Affected population selection'},
    {id: 'c5', name: 'Emergency Operations Centre (EOC)'},
    {id: 'c6', name: 'Information Management (IM)'},
    {id: 'c7', name: 'Testing and Learning'},
    {id: 'c8', name: 'Activation of regional and international support'}
  ],
  a3_2: [
    {id: 'c0', name: 'COMMUNITY-BASED DP AND DRR'},
    {id: 'c1', name: 'EVACUATION'},
    {id: 'c2', name: 'HEALTH IN EMERGENCIES'},
    {id: 'c3', name: 'FIRST AID'},
    {id: 'c4', name: 'WATER AND SANITATION'},
    {id: 'c5', name: 'FOOD SECURITY'},
    {id: 'c6', name: 'LIVELIHOOD SECURITY AND SAFETY NETS'},
    {id: 'c7', name: 'SEARCH AND RESCUE'},
    {id: 'c8', name: 'SHELTER, HOUSEHOLD ITEMS, SETTLEMENTS'},
    {id: 'c9', name: 'MANAGEMENT OF DEAD BODIES TO FACILITATE THEIR IDENTIFICATION'},
    {id: 'c10', name: 'RESTORING FAMILY LINKS (RFL)'},
    {id: 'c11', name: 'TRANSITION TO RECOVERY'},
    {id: 'c12', name: 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) EMERGENCY PREPAREDNESS'},
    {id: 'c13', name: 'COMMUNITY BASED HEALTH & FIRST AID (CBHFA)'}
  ],
  a4: [
    {id: 'c0', name: 'Coordination with Movement'},
    {id: 'c1', name: 'Coordination with authorities'},
    {id: 'c2', name: 'Coordination with External Agencies and NGOs'},
    {id: 'c3', name: 'Civil Military Relations'},
    {id: 'c4', name: 'Coordination with local community level responders'},
    {id: 'c5', name: 'Cooperation with private sector'}
  ],
  a5: [
    {id: 'c0', name: 'Safety and security management'},
    {id: 'c1', name: 'Operations Monitoring, Evaluation, Reporting and Learning'},
    {id: 'c2', name: 'Finance and Admin policy and emergency procedures'},
    {id: 'c3', name: 'Information and Communication Technology (ICT)'},
    {id: 'c4', name: 'Logistics, procurement and supply chain'},
    {id: 'c5', name: 'LOGISTICS MANAGEMENT'},
    {id: 'c6', name: 'SUPPLY CHAIN MANAGEMENT'},
    {id: 'c7', name: 'PROCUREMENT'},
    {id: 'c8', name: 'FLEET AND TRANSPORTATION MANAGEMENT'},
    {id: 'c9', name: 'WAREHOUSE AND STOCK MANAGEMENT'},
    {id: 'c10', name: 'Staff and volunteer management'},
    {id: 'c11', name: 'Communication in emergencies'},
    {id: 'c12', name: 'Resource Mobilisation'}
  ]
};

export function getPerComponent (code, questionId) {
  code = code.replace(/-/g, '_');
  return components[code].filter(question => question.id === questionId);
}

export function getShortComponent (code, questionId) {
  code = code.replace(/-/g, '_');
  questionId = questionId.split('q')[0];
  return shortComponents[code].filter(question => question.id === questionId);
}
