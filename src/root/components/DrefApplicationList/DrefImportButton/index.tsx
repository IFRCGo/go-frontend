import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import { History } from 'history';
import {
  IoCloudUploadSharp,
  IoCloudDownload,
} from 'react-icons/io5';

import LanguageContext from '#root/languageContext';
import Button from '#components/Button';
import Modal from '#components/BasicModal';
import FileInput from '#components/FileInput';
import ButtonLikeLink from '#components/ButtonLikeLink';
import Loading from '#components/block-loading';

import { useLazyRequest } from '#utils/restRequest';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.scss';

const SLOW_SUDDEN = "slow-sudden";
const IMMINENT = "imminent";
const ASSESSMENT = "assessment";

type IMPORT_TYPE = 'slow-sudden' | 'imminent' | 'assessment';

const importUrlsByType: Record<IMPORT_TYPE, string> = {
  [SLOW_SUDDEN]: 'api/v2/dref-file-slow-sudden/',
  [IMMINENT]: 'api/v2/dref-file-imminent/',
  [ASSESSMENT]: 'api/v2/dref-file-assessment/',
};

interface DrefImportFields {
  file: number;
  dref: number;
  id: number;
}

interface Props {
  history: History;
  className?: string;
}

function DrefImportButton(props: Props) {
  const {
    history,
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const [showModal, setShowModal] = React.useState(false);
  const alert = useAlert();

  const {
    pending: drefImportPending,
    trigger: postDrefImport,
  } = useLazyRequest<DrefImportFields, { type: IMPORT_TYPE, file: File | undefined }>({
    formData: true,
    url: (ctx) => importUrlsByType[ctx.type],
    body: (ctx) => ({ file: ctx.file }),
    method: 'POST',
    onSuccess: (response) => {
      if (isDefined(response.id)) {
        history.push(`/dref-application/${response.dref}/edit/`);
      }
    },

    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p> {strings.drefLoadPdfFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        }
      );
    }
  });

  const handleDocumentImport = React.useCallback((newValue: File | undefined, name: IMPORT_TYPE) => {
    if (newValue) {
      postDrefImport({
        type: name,
        file: newValue,
      });
    }
  }, [postDrefImport]);

  const handleModalCloseButtonClick = React.useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <Button
        className={_cs(styles.drefImportButton, className)}
        name={true}
        onClick={setShowModal}
      >
        Import from Document
      </Button>
      {showModal && (
        <Modal
          className={styles.importModal}
          heading="Import from document"
          bodyClassName={styles.content}
          onCloseButtonClick={handleModalCloseButtonClick}
          hideCloseButton={drefImportPending}
        >
          {drefImportPending && <Loading className={styles.loading} />}
          {!drefImportPending && (
            <>
              <div className={styles.inputSection}>
                <div>
                  Please select an appropriate type of DREF and select the document you want to upload.
                </div>
                <div className={styles.inputs}>
                  <FileInput
                    type='file'
                    accept='.docx'
                    name={SLOW_SUDDEN}
                    value={undefined}
                    onChange={handleDocumentImport}
                    icons={<IoCloudUploadSharp />}
                    variant="primary"
                    disabled={drefImportPending}
                  >
                    {strings.drefDocumentImportSlowSuddenLabel}
                  </FileInput>
                  <FileInput
                    type='file'
                    accept='.docx'
                    name={IMMINENT}
                    value={undefined}
                    icons={<IoCloudUploadSharp />}
                    onChange={handleDocumentImport}
                    variant="primary"
                    disabled={drefImportPending}
                  >
                    {strings.drefDocumentImportImminentLabel}
                  </FileInput>
                  <FileInput
                    type='file'
                    accept='.docx'
                    name={ASSESSMENT}
                    value={undefined}
                    onChange={handleDocumentImport}
                    icons={<IoCloudUploadSharp />}
                    variant="primary"
                    disabled={drefImportPending}
                  >
                    {strings.drefDocumentImportAssessmentLabel}
                  </FileInput>
                </div>
              </div>
              <div>
                You will be redirected to the newly created DREF application if the import process is successful!
              </div>
              <div className={styles.templateSection}>
                <div>
                  You can create a DREF application from the document using the provided templates.
                </div>
                  <div className={styles.templates}>
                    <ButtonLikeLink
                      to="https://go.ifrc.org"
                      external
                      variant="secondary"
                      icons={<IoCloudDownload />}
                      disabled
                    >
                      {strings.drefDocumentImportSlowSuddenLabel}
                    </ButtonLikeLink>
                    <ButtonLikeLink
                      to="https://go.ifrc.org"
                      external
                      variant="secondary"
                      icons={<IoCloudDownload />}
                      disabled
                    >
                      {strings.drefDocumentImportImminentLabel}
                    </ButtonLikeLink>
                    <ButtonLikeLink
                      to="https://go.ifrc.org"
                      external
                      variant="secondary"
                      icons={<IoCloudDownload />}
                      disabled
                    >
                      {strings.drefDocumentImportAssessmentLabel}
                    </ButtonLikeLink>
                  </div>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

export default DrefImportButton;
