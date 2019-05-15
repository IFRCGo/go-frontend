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

    while (document.getElementsByName('q' + componentIndex + 'f').length > 0) {
      let answer = document.querySelector('[name=\'q' + componentIndex + 'f\']:checked') !== null
        ? document.querySelector('[name=\'q' + componentIndex + 'f\']:checked').value
        : null;

      request.data.push({id: 'q' + componentIndex + 'f', op: answer, nt: 'no ti'});

      request = this.addComponentQuestions(request, componentIndex);

      componentIndex++;
    }

    return request;
  }

  addComponentQuestions (request, componentIndex) {
    let answer = document.querySelector('[name=\'q' + componentIndex + '\']:checked') !== null
      ? document.querySelector('[name=\'q' + componentIndex + '\']:checked').value
      : null;

    request.data.push({id: 'q' + componentIndex, op: answer, nt: 'no ti'});

    return request;
  }
}
