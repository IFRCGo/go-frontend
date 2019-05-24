export default class RequestFactory {
  newFormRequest (formCode, formName, languageCode) {
    return {
      code: formCode,
      name: formName,
      language: 1,
      started_at: '2019-04-11 11:42:22.278796+00',
      submitted_at: '2019-04-11 09:42:52.278796+00',
      user_id: 111,
      country_id: 47,
      ns: 'Hungarian Society',
      data: []
    };
  }

  addAreaQuestionData (request) {
    const formHeadQuestions = document.getElementsByName('a1');

    if (formHeadQuestions.length > 0) {
      if (document.querySelector('[name=\'a1\']:checked') !== null) {
        request.data.push({
          id: 'a1',
          op: parseInt(document.querySelector('[name=\'a1\']:checked').value),
          nt: 'no ti'});
      }
    }

    return request;
  }

  addComponentData (request) {
    let componentIndex = 0;

    while (document.querySelectorAll('#c' + componentIndex + 'title').length > 0) {
      let questionIndex = 0;

      if (document.querySelectorAll('[name=\'c' + componentIndex + 'epi\']').length > 0) {
        let answer = document.querySelectorAll('[name=\'c' + componentIndex + 'epi\']:checked').length > 0
          ? document.querySelector('[name=\'c' + componentIndex + 'epi\']:checked').value
          : null;

        if (answer !== null) {
          request.data.push({
            id: 'c' + componentIndex + 'epi',
            op: parseInt(answer),
            nt: 'no ti'});
        }
      }

      while (document.getElementsByName('c' + componentIndex + 'q' + questionIndex).length > 0) {
        let answer = document.querySelector('[name=\'c' + componentIndex + 'q' + questionIndex + '\']:checked') !== null
          ? document.querySelector('[name=\'c' + componentIndex + 'q' + questionIndex + '\']:checked').value
          : null;
        let questionFeedback = document.querySelector('[name=\'c' + componentIndex + 'q' + questionIndex + 'f\']').value;

        if (answer !== null) {
          request.data.push({
            id: 'c' + componentIndex + 'q' + questionIndex,
            op: parseInt(answer),
            nt: questionFeedback});
        }

        questionIndex++;
      }

      componentIndex++;
    }

    return request;
  }

  stringAnswerToNum (answer) {
    if (answer.toLowerCase() === 'no') {
      return 0;
    } else if (answer.toLowerCase() === 'non') {
      return 0;
    } else if (answer.toLowerCase() === 'yes') {
      return 1;
    } else if (answer.toLowerCase() === 'si') {
      return 1;
    } else if (answer.toLowerCase() === 'oui') {
      return 1;
    } else if (answer.toLowerCase() === 'not reviewed') {
      return 2;
    } else if (answer.toLowerCase() === 'no revisado') {
      return 2;
    } else if (answer.toLowerCase() === 'pas évalué') {
      return 2;
    } else if (answer.toLowerCase() === 'does not exist') {
      return 3;
    } else if (answer.toLowerCase() === 'no existe') {
      return 3;
    } else if (answer.toLowerCase() === 'n\'existe pas') {
      return 3;
    } else if (answer.toLowerCase() === 'partially exists') {
      return 4;
    } else if (answer.toLowerCase() === 'existe parcialmente') {
      return 4;
    } else if (answer.toLowerCase() === 'existe partiellement') {
      return 4;
    } else if (answer.toLowerCase() === 'need improvements') {
      return 5;
    } else if (answer.toLowerCase() === 'necesita mejoras') {
      return 5;
    } else if (answer.toLowerCase() === 'nécessite une amélioration') {
      return 5;
    } else if (answer.toLowerCase() === 'exist, could be strengthened') {
      return 6;
    } else if (answer.toLowerCase() === 'existir, se podría fortalecer.') {
      return 6;
    } else if (answer.toLowerCase() === 'existe, peut être renforcé') {
      return 6;
    } else if (answer.toLowerCase() === 'high performance') {
      return 7;
    } else if (answer.toLowerCase() === 'alto rendimiento') {
      return 7;
    } else if (answer.toLowerCase() === 'performance élevée') {
      return 7;
    }
  }

  numAnswerToString (answer) {
    if (answer === 0) {
      return 'no';
    } else if (answer === 1) {
      return 'yes';
    } else if (answer === 2) {
      return 'Not Reviewed';
    } else if (answer === 3) {
      return 'Does not exist';
    } else if (answer === 4) {
      return 'Partially exists';
    } else if (answer === 5) {
      return 'Need improvements';
    } else if (answer === 6) {
      return 'Exist, could be strengthened';
    } else if (answer === 7) {
      return 'High performance';
    }
  }
}
