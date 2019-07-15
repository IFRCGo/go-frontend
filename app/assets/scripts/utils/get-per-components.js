import { englishForm as a1Form } from './../components/per-forms/form-data/a1/english-data';
import { englishForm as a2Form } from './../components/per-forms/form-data/a2/english-data';
import { englishForm as a3Form } from './../components/per-forms/form-data/a3/english-data';
import { englishForm as a32Form } from './../components/per-forms/form-data/a3-2/english-data';
import { englishForm as a4Form } from './../components/per-forms/form-data/a4/english-data';
import { englishForm as a5Form } from './../components/per-forms/form-data/a5/english-data';

const components = {
  a1: [
    {id: 'c0epi', name: 'RC auxiliary role, Mandate and Law', cid: 0},
    {id: 'c1epi', name: 'DRM Strategy', cid: 1},
    {id: 'c2epi', name: 'DRM Policy', cid: 2},
    {id: 'c3epi', name: 'DRM Laws, Advocacy and Dissemination', cid: 3},
    {id: 'c4epi', name: 'Quality and accountability', cid: 4}
  ],
  a2: [
    {id: 'c0epi', name: 'Hazard, Context and Risk Analysis, Monitoring and Early Warning', cid: 5},
    {id: 'c1epi', name: 'Scenario planning', cid: 6},
    {id: 'c2epi', name: 'Risk management', cid: 7},
    {id: 'c3epi', name: 'Preparedness plans and budgets', cid: 8},
    {id: 'c4epi', name: 'Business continuity', cid: 9},
    {id: 'c5epi', name: 'Emergency Response Procedures (SOPs)', cid: 10},
    {id: 'c6epi', name: 'Response and recovery planning', cid: 11},
    {id: 'c7epi', name: 'Pre-disaster meetings and agreements', cid: 12}
  ],
  a3: [
    {id: 'c0epi', name: 'Mapping of NS capacities', cid: 13},
    {id: 'c1epi', name: 'Early Action Mechanisms', cid: 14},
    {id: 'c2epi', name: 'Cash Based Intervention (CBI)', cid: 15},
    {id: 'c3epi', name: 'Emergency Needs Assessment', cid: 16},
    {id: 'c4epi', name: 'Affected population selection', cid: 17},
    {id: 'c5epi', name: 'Emergency Operations Centre (EOC)', cid: 18},
    {id: 'c6epi', name: 'Information Management (IM)', cid: 19},
    {id: 'c7epi', name: 'Testing and Learning', cid: 20},
    {id: 'c8epi', name: 'Activation of regional and international support', cid: 21}
  ],
  a3_2: [
    {id: 'c0epi', name: 'COMMUNITY-BASED DP AND DRR', cid: 22},
    {id: 'c1epi', name: 'EVACUATION', cid: 23},
    {id: 'c2epi', name: 'HEALTH IN EMERGENCIES', cid: 24},
    {id: 'c3epi', name: 'FIRST AID', cid: 25},
    {id: 'c4epi', name: 'WATER AND SANITATION', cid: 26},
    {id: 'c5epi', name: 'FOOD SECURITY', cid: 27},
    {id: 'c6epi', name: 'LIVELIHOOD SECURITY AND SAFETY NETS', cid: 28},
    {id: 'c7epi', name: 'SEARCH AND RESCUE', cid: 29},
    {id: 'c8epi', name: 'SHELTER, HOUSEHOLD ITEMS, SETTLEMENTS', cid: 30},
    {id: 'c9epi', name: 'MANAGEMENT OF DEAD BODIES TO FACILITATE THEIR IDENTIFICATION', cid: 31},
    {id: 'c10epi', name: 'RESTORING FAMILY LINKS (RFL)', cid: 32},
    {id: 'c11epi', name: 'TRANSITION TO RECOVERY', cid: 33},
    {id: 'c12epi', name: 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) EMERGENCY PREPAREDNESS', cid: 34},
    {id: 'c13epi', name: 'COMMUNITY BASED HEALTH & FIRST AID (CBHFA)', cid: 35}
  ],
  a4: [
    {id: 'c0epi', name: 'Coordination with Movement', cid: 36},
    {id: 'c1epi', name: 'Coordination with authorities', cid: 37},
    {id: 'c2epi', name: 'Coordination with External Agencies and NGOs', cid: 38},
    {id: 'c3epi', name: 'Civil Military Relations', cid: 39},
    {id: 'c4epi', name: 'Coordination with local community level responders', cid: 40},
    {id: 'c5epi', name: 'Cooperation with private sector', cid: 41}
  ],
  a5: [
    {id: 'c0epi', name: 'Safety and security management', cid: 42},
    {id: 'c1epi', name: 'Operations Monitoring, Evaluation, Reporting and Learning', cid: 43},
    {id: 'c2epi', name: 'Finance and Admin policy and emergency procedures', cid: 44},
    {id: 'c3epi', name: 'Information and Communication Technology (ICT)', cid: 45},
    {id: 'c4epi', name: 'Logistics, procurement and supply chain', cid: 46},
    {id: 'c5epi', name: 'LOGISTICS MANAGEMENT', cid: 47},
    {id: 'c6epi', name: 'SUPPLY CHAIN MANAGEMENT', cid: 48},
    {id: 'c7epi', name: 'PROCUREMENT', cid: 49},
    {id: 'c8epi', name: 'FLEET AND TRANSPORTATION MANAGEMENT', cid: 50},
    {id: 'c9epi', name: 'WAREHOUSE AND STOCK MANAGEMENT', cid: 51},
    {id: 'c10epi', name: 'Staff and volunteer management', cid: 52},
    {id: 'c11epi', name: 'Communication in emergencies', cid: 53},
    {id: 'c12epi', name: 'Resource Mobilisation', cid: 54}
  ]
};

const shortComponents = {
  a1: [
    {id: 'c0', name: 'RC auxiliary role, Mandate and Law', cid: 0},
    {id: 'c1', name: 'DRM Strategy', cid: 1},
    {id: 'c2', name: 'DRM Policy', cid: 2},
    {id: 'c3', name: 'DRM Laws, Advocacy and Dissemination', cid: 3},
    {id: 'c4', name: 'Quality and accountability', cid: 4}
  ],
  a2: [
    {id: 'c0', name: 'Hazard, Context and Risk Analysis, Monitoring and Early Warning', cid: 5},
    {id: 'c1', name: 'Scenario planning', cid: 6},
    {id: 'c2', name: 'Risk management', cid: 7},
    {id: 'c3', name: 'Preparedness plans and budgets', cid: 8},
    {id: 'c4', name: 'Business continuity', cid: 9},
    {id: 'c5', name: 'Emergency Response Procedures (SOPs)', cid: 10},
    {id: 'c6', name: 'Response and recovery planning', cid: 11},
    {id: 'c7', name: 'Pre-disaster meetings and agreements', cid: 12}
  ],
  a3: [
    {id: 'c0', name: 'Mapping of NS capacities', cid: 13},
    {id: 'c1', name: 'Early Action Mechanisms', cid: 14},
    {id: 'c2', name: 'Cash Based Intervention (CBI)', cid: 15},
    {id: 'c3', name: 'Emergency Needs Assessment', cid: 16},
    {id: 'c4', name: 'Affected population selection', cid: 17},
    {id: 'c5', name: 'Emergency Operations Centre (EOC)', cid: 18},
    {id: 'c6', name: 'Information Management (IM)', cid: 19},
    {id: 'c7', name: 'Testing and Learning', cid: 20},
    {id: 'c8', name: 'Activation of regional and international support', cid: 21}
  ],
  a3_2: [
    {id: 'c0', name: 'COMMUNITY-BASED DP AND DRR', cid: 22},
    {id: 'c1', name: 'EVACUATION', cid: 23},
    {id: 'c2', name: 'HEALTH IN EMERGENCIES', cid: 24},
    {id: 'c3', name: 'FIRST AID', cid: 25},
    {id: 'c4', name: 'WATER AND SANITATION', cid: 26},
    {id: 'c5', name: 'FOOD SECURITY', cid: 27},
    {id: 'c6', name: 'LIVELIHOOD SECURITY AND SAFETY NETS', cid: 28},
    {id: 'c7', name: 'SEARCH AND RESCUE', cid: 29},
    {id: 'c8', name: 'SHELTER, HOUSEHOLD ITEMS, SETTLEMENTS', cid: 30},
    {id: 'c9', name: 'MANAGEMENT OF DEAD BODIES TO FACILITATE THEIR IDENTIFICATION', cid: 31},
    {id: 'c10', name: 'RESTORING FAMILY LINKS (RFL)', cid: 32},
    {id: 'c11', name: 'TRANSITION TO RECOVERY', cid: 33},
    {id: 'c12', name: 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) EMERGENCY PREPAREDNESS', cid: 34},
    {id: 'c13', name: 'COMMUNITY BASED HEALTH & FIRST AID (CBHFA)', cid: 35}
  ],
  a4: [
    {id: 'c0', name: 'Coordination with Movement', cid: 36},
    {id: 'c1', name: 'Coordination with authorities', cid: 37},
    {id: 'c2', name: 'Coordination with External Agencies and NGOs', cid: 38},
    {id: 'c3', name: 'Civil Military Relations', cid: 39},
    {id: 'c4', name: 'Coordination with local community level responders', cid: 40},
    {id: 'c5', name: 'Cooperation with private sector', cid: 41}
  ],
  a5: [
    {id: 'c0', name: 'Safety and security management', cid: 42},
    {id: 'c1', name: 'Operations Monitoring, Evaluation, Reporting and Learning', cid: 43},
    {id: 'c2', name: 'Finance and Admin policy and emergency procedures', cid: 44},
    {id: 'c3', name: 'Information and Communication Technology (ICT)', cid: 45},
    {id: 'c4', name: 'Logistics, procurement and supply chain', cid: 46},
    {id: 'c5', name: 'LOGISTICS MANAGEMENT', cid: 47},
    {id: 'c6', name: 'SUPPLY CHAIN MANAGEMENT', cid: 48},
    {id: 'c7', name: 'PROCUREMENT', cid: 49},
    {id: 'c8', name: 'FLEET AND TRANSPORTATION MANAGEMENT', cid: 50},
    {id: 'c9', name: 'WAREHOUSE AND STOCK MANAGEMENT', cid: 51},
    {id: 'c10', name: 'Staff and volunteer management', cid: 52},
    {id: 'c11', name: 'Communication in emergencies', cid: 53},
    {id: 'c12', name: 'Resource Mobilisation', cid: 54}
  ]
};

export function getPerComponent (code, questionId) {
  code = code.replace(/-/g, '_');
  if (questionId.includes('epi')) {
    return components[code].filter(question => question.id === questionId);
  } else {
    return getShortComponent(code, questionId);
  }
}

export function getShortComponent (code, questionId) {
  code = code.replace(/-/g, '_');
  questionId = questionId.split('q')[0];
  return shortComponents[code].filter(question => question.id === questionId);
}

export function getAllComponents () {
  const allComponents = [];
  Object.keys(shortComponents).forEach((formCode) => {
    shortComponents[formCode].forEach((component) => {
      component.formCode = formCode;
      allComponents.push(component);
    });
  });
  return allComponents;
}

export function getBenchmarksByComponent (componentId) {
  const splittedComponentId = componentId.split('c');
  const formCode = splittedComponentId[0];
  const componentIndex = parseInt(splittedComponentId[1]);
  const benchmarks = [];

  if (formCode === 'a1') {
    a1Form.components[componentIndex].namespaces.forEach((benchmark, index) => {
      benchmarks.push({title: benchmark.nsTitle, index: index});
    });
  } else if (formCode === 'a2') {
    a2Form.components[componentIndex].namespaces.forEach((benchmark, index) => {
      benchmarks.push({title: benchmark.nsTitle, index: index});
    });
  } else if (formCode === 'a3') {
    a3Form.components[componentIndex].namespaces.forEach((benchmark, index) => {
      benchmarks.push({title: benchmark.nsTitle, index: index});
    });
  } else if (formCode === 'a3_2') {
    a32Form.components[componentIndex].namespaces.forEach((benchmark, index) => {
      benchmarks.push({title: benchmark.nsTitle, index: index});
    });
  } else if (formCode === 'a4') {
    a4Form.components[componentIndex].namespaces.forEach((benchmark, index) => {
      benchmarks.push({title: benchmark.nsTitle, index: index});
    });
  } else if (formCode === 'a5') {
    a5Form.components[componentIndex].namespaces.forEach((benchmark, index) => {
      benchmarks.push({title: benchmark.nsTitle, index: index});
    });
  }

  return benchmarks;
}
