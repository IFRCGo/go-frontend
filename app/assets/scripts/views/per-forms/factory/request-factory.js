export default class RequestFactory {
  newFormRequest () {
    return {
      code: 'A1',
      name: 'Nemo',
      language: 1,
      data: []
    };
  }

  addAreaQuestionData (request) {
    const formHeadQuestions = document.getElementsByName('a1');

    if (formHeadQuestions.length > 0) {
      document.querySelector('[name=\'a1\']:checked') !== null 
        ? request.data.push({id: 'a1', op: document.querySelector('[name=\'a1\']:checked').value, nt: 'no ti'}) 
        : null;
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
    let questionIndex = 0;

    while (document.getElementsByName('q' + componentIndex + '' + questionIndex).length > 0) {
      let answer = document.querySelector('[name=\'q' + componentIndex + '' + questionIndex + '\']:checked') !== null
        ? document.querySelector('[name=\'q' + componentIndex + '' + questionIndex + '\']:checked').value
        : null;

      request.data.push({id: 'q' + componentIndex + '' + questionIndex, op: answer, nt: 'no ti'});

      questionIndex++;
    }

    return request;
  }
}
