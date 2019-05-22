export default class RequestFactory {
  newFormRequest (formCode, formName, languageCode) {
    return {
      code: formCode,
      name: formName,
      language: languageCode,
      data: []
    };
  }

  addAreaQuestionData (request) {
    const formHeadQuestions = document.getElementsByName('a1');

    if (formHeadQuestions.length > 0) {
      if (document.querySelector('[name=\'a1\']:checked') !== null) {
        request.data.push({
          id: 'a1',
          op: document.querySelector('[name=\'a1\']:checked').value,
          nt: 'no ti'});
      }
    }

    return request;
  }

  addComponentData (request) {
    let componentIndex = 0;

    while (document.getElementsByName('c' + componentIndex + 'q0').length > 0) {
      let questionIndex = 0;

      if (document.querySelector('[name=\'c' + componentIndex + 'epi\']') !== null) {
        let answer = document.querySelector('[name=\'c' + componentIndex + 'epi\']:checked') !== null
          ? document.querySelector('[name=\'c' + componentIndex + 'epi\']:checked').value
          : null;

        if (answer !== null) {
          request.data.push({id: 'c' + componentIndex + 'epi', op: answer, nt: 'no ti'});
        }
      }

      while (document.getElementsByName('c' + componentIndex + 'q' + questionIndex).length > 0) {
        let answer = document.querySelector('[name=\'c' + componentIndex + 'q' + questionIndex + '\']:checked') !== null
          ? document.querySelector('[name=\'c' + componentIndex + 'q' + questionIndex + '\']:checked').value
          : null;
        let questionFeedback = document.querySelector('[name=\'c' + componentIndex + 'q' + questionIndex + 'f\']').value;

        if (answer !== null) {
          request.data.push({id: 'c' + componentIndex + 'q' + questionIndex, op: answer, nt: 'no ti'});
        }

        if (questionFeedback !== '') {
          request.data.push({id: 'c' + componentIndex + 'q' + questionIndex + 'f', op: questionFeedback, nt: 'no ti'});
        }

        questionIndex++;
      }

      componentIndex++;
    }

    return request;
  }
}
