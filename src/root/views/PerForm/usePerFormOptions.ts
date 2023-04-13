import React from 'react';
import { PartialForm } from '@togglecorp/toggle-form';

import { ListResponse, useRequest } from '#utils/restRequest';
import { Answer, Component } from './Assessment/CustomActivityInput';

export interface AssessmentQuestion {
  component: Component;
  question: string;
  question_num: number;
  answer: Answer[];
  is_epi: boolean;
  is_benchmark: boolean;
  description: string | null;
  id: string;
}

function usePerFormOptions() {
  const {
    pending: fetchingAssessmentOptions,
    response: assessmentResponse,
  } = useRequest<ListResponse<AssessmentQuestion>>({
    url: 'api/v2/per-formquestion/',
  });
  console.warn('title', assessmentResponse?.results.map((i) => i.component?.map((i) => i.title)));

  return {
    fetchingAssessmentOptions,
    assessmentResponse,
  };
}

export default usePerFormOptions;
