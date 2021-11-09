import React from 'react';
import LanguageContext from '#root/languageContext';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

interface iProp {
  asa: boolean;
  asp: boolean;
  nsr: boolean;
  nsrf: boolean;
  specify: string;
  drt: string;
  ll: string;
}

function PrevOprTable(prop: iProp) {
  const { strings } = React.useContext(LanguageContext);

  return (
    <table>
      <tr>
        <td> {strings.drefFormPdfAffectedAreas}</td>
        <td>{prop.asa}</td>
      </tr>
      <tr>
        <td> {strings.drefFormAffectedthePopulationTitle} </td>
        <td>{prop.asp}</td>
      </tr>
      <tr>
        <td> {strings.drefFormNsRespond}</td>
        <td>{prop.nsr}</td>
      </tr>
      <tr>
        <td> {strings.drefFormNsRequest}</td>
        <td>{prop.drt}</td>
      </tr>
      {/* <tr>
        <td> {strings.specify}</td>
        <td></td>
      </tr> */}
      <tr>
        <td> {strings.drefFormRecurrentText}</td>
        <td>{prop.nsrf}</td>
      </tr>
      <tr>
        <td> {strings.drefFormLessonsLearnedTitle}{strings.drefFormLessonsLearnedDescription}</td>
        <td>{prop.ll}</td>
      </tr>

    </table>
  );

}

export default PrevOprTable;