import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Keywords } from "../components/Keywords";
import { SubjectHeadings } from "../components/Subjects";
import Overridable from "react-overridable";

function SidebarSubjectsSection({ record, showKeywords = true, show }) {
  const subjects = record.metadata.subjects;

  const subjectHeadings = subjects?.filter((subject) => !!subject.scheme);
  const subjectLabels = subjectHeadings?.map(({ subject }) =>
    subject.toLowerCase()
  );

  const keywords = subjects
    ?.filter((subject) => !subject.scheme)
    ?.map(({ subject }) => subject)
    ?.concat(record.custom_fields["kcr:user_defined_tags"])
    ?.filter((keyword) => !subjectLabels.includes(keyword?.toLowerCase()));

  //FIXME: restore optional grouping of subject headings
  // const groupedSubjects = subjectHeadings?.reduce((groups, subject) => {
  //   if (!groups[subject.scheme]) {
  //     groups[subject.scheme] = [];
  //   }
  //   groups[subject.scheme].push(subject);
  //   return groups;
  // }, {});

  return (
    <Overridable id="InvenioModularDetailPage.SidebarSubjectsSection.layout">
      {subjectHeadings?.length ? (
        <div
          id="subjects"
          className={`sidebar-container ${show}`}
          aria-label={i18next.t("Record subject headings")}
        >
          <h2 className="ui medium top attached header mt-0">
            {i18next.t("Subjects")}
          </h2>
          <SubjectHeadings
            passedClassNames="ui bottom attached segment rdm-sidebar pr-0 pt-0"
            subjectHeadings={subjectHeadings}
            keywords={keywords}
            showKeywords={showKeywords}
          />
        </div>
      ) : (
        ""
      )}
    </Overridable>
  );
}

export { SidebarSubjectsSection };
