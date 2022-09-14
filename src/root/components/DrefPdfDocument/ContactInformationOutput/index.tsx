import React from 'react';
import {
  Link,
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import ContactSection from './ContactSection';
import { resolveUrl } from '#utils/resolveUrl';

interface Props {
  data: DrefApiFields;
  strings: Strings;
}
function ContactInformationOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <>
      {(isDefined(data.national_society_contact_name)
        || isDefined(data.national_society_contact_title)
        || isDefined(data.national_society_contact_email)
        || isDefined(data.national_society_contact_phone_number)
        || isDefined(data.ifrc_appeal_manager_name)
        || isDefined(data.ifrc_appeal_manager_title)
        || isDefined(data.ifrc_appeal_manager_email)
        || isDefined(data.ifrc_appeal_manager_phone_number)
        || isDefined(data.ifrc_project_manager_name)
        || isDefined(data.ifrc_project_manager_title)
        || isDefined(data.ifrc_project_manager_email)
        || isDefined(data.ifrc_project_manager_phone_number)
        || isDefined(data.ifrc_appeal_manager_name)
        || isDefined(data.ifrc_appeal_manager_title)
        || isDefined(data.ifrc_appeal_manager_email)
        || isDefined(data.ifrc_appeal_manager_phone_number)
        || isDefined(data.ifrc_project_manager_name)
        || isDefined(data.ifrc_project_manager_title)
        || isDefined(data.ifrc_project_manager_email)
        || isDefined(data.ifrc_project_manager_phone_number)
        || isDefined(data.ifrc_emergency_name)
        || isDefined(data.ifrc_emergency_title)
        || isDefined(data.ifrc_emergency_email)
        || isDefined(data.ifrc_emergency_phone_number)
        || isDefined(data.media_contact_name)
        || isDefined(data.media_contact_title)
        || isDefined(data.media_contact_email)
        || isDefined(data.media_contact_phone_number)
      ) && (
          <>
            <View
              style={pdfStyles.contactSection}
              wrap={false}
            >
              <Text style={pdfStyles.sectionHeading}>
                {strings.drefExportContactInformation}
              </Text>
              <Text style={pdfStyles.description}>
                {strings.drefExportContactDescription}
              </Text>
              <View style={pdfStyles.contactList}>
                <ContactSection
                  title={strings.drefFormNationalSocietyContact}
                  contacts={[
                    data.national_society_contact_name,
                    data.national_society_contact_title,
                    data.national_society_contact_email,
                    data.national_society_contact_phone_number,
                  ]}
                />
                <ContactSection
                  title={strings.drefFormAppealManager}
                  contacts={[
                    data.ifrc_appeal_manager_name,
                    data.ifrc_appeal_manager_title,
                    data.ifrc_appeal_manager_email,
                    data.ifrc_appeal_manager_phone_number,
                  ]}
                />
                <ContactSection
                  title={strings.drefFormProjectManager}
                  contacts={[
                    data.ifrc_project_manager_name,
                    data.ifrc_project_manager_title,
                    data.ifrc_project_manager_email,
                    data.ifrc_project_manager_phone_number,
                  ]}
                />
                <ContactSection
                  title={strings.drefFormIfrcEmergency}
                  contacts={[
                    data.ifrc_emergency_name,
                    data.ifrc_emergency_title,
                    data.ifrc_emergency_email,
                    data.ifrc_emergency_phone_number,
                  ]}
                />
                <ContactSection
                  title={strings.drefFormMediaContact}
                  contacts={[
                    data.media_contact_name,
                    data.media_contact_title,
                    data.media_contact_email,
                    data.media_contact_phone_number,
                  ]}
                />
              </View>
            </View>
            <View style={pdfStyles.section}>
              <Link src={resolveUrl(window.location.origin, 'emergencies')}>
                {strings.drefExportReference}
              </Link>
            </View>
          </>)}
    </>
  );
}

export default ContactInformationOutput;
