import {
  stateInflight,
  stateError,
  stateSuccess,
} from '../utils/reducer-utils';

import lang from '#lang';

const initialState = {
  current: 'en',
  strings: {
    en: {
      ...lang,
    },
    fr: {
      rcActivities: 'Activités de la Croix-Rouge et du Croissant-Rouge',
      langSelectLabel: 'Langue: {currentLanguage}',
      menuHome: 'Accueil',
      menuEmergencies: 'Urgence',
      menuDeployments: 'Déploiements',
      menuPreparedness: 'Préparation',
    },
    es: {
      rcActivities: 'Actividades de la Cruz Roja / Media Luna Roja',
      langSelectLabel: 'Idioma: {currentLanguage}',
      menuHome: 'Casa',
      menuEmergencies: 'Emergencias',
      menuDeployments: 'Implementaciones',
      menuPreparedness: 'Preparación',
    },
    ar: {
      rcActivities: 'أنشطة الصليب الأحمر والهلال الأحمر',
      langSelectLabel: 'لغة: {currentLanguage}',
      menuHome: 'الصفحة الرئيسية',
      menuEmergencies: 'الطوارئ',
      menuDeployments: 'عمليات النشر',
      menuPreparedness: 'التأهب',
    }
  }
};

export default function reducer (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case 'GET_LANGUAGE_INFLIGHT':
      newState = stateInflight(state, action);
      break;
    case 'GET_LANGUAGE_FAILED':
      newState = stateError(state, action);
      break;
    case 'GET_LANGUAGE_SUCCESS':
      newState = stateSuccess(state, action);
      break;
    case 'SET_CURRENT_LANGUAGE':
      newState.current = action.language;
      break;
  }

  return newState;
}
