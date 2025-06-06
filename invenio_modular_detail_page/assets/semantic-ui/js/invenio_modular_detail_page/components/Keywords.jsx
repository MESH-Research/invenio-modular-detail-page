import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";

function Keywords({ passedClassNames, keywords }) {
  return keywords?.map((keyword) => (
    <ul className="ui horizontal list no-bullets subjects" key={keyword}>
      <li className="item">
        <a
          href={`/search?q=custom_fields['kcr:user_defined_tags']:"${keyword}"`}
          className="subject ui label basic secondary"
          title={i18next.t("Search results for ") + keyword}
        >
          {keyword}
        </a>
      </li>
    </ul>
  ));
}

export { Keywords };
