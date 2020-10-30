export default class RequestFactory {
  // TODO: remove this after it's not used anywhere
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
