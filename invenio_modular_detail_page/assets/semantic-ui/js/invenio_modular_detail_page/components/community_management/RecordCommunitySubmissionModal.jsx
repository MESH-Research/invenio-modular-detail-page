import React, { useState } from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Message } from "semantic-ui-react";
import { http } from "react-invenio-forms";
import {
  CommunitySelectionModalComponent,
} from "@js/invenio_modular_deposit_form/replacement_components/CommunitySelectionModal/CommunitySelectionModal";
import {
  SubmitReviewModal,
} from "@js/invenio_modular_deposit_form/replacement_components/PublishButton/SubmitReviewModal";

const RecordCommunitySubmissionModal = ({
  userCommunitiesMemberships,
  modalOpen = false,
  toggleModal,
  permissionsPerField,
  recordCommunityEndpoint,
  recordCommunitySearchConfig,
  recordUserCommunitySearchConfig,
  handleClose,
  record,
}) => {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeSelectedCommunity = (community) => {
    setSelectedCommunity(community);
    setError(null);
    openConfirmModal();
  };

  const canIncludeDirectly = () => {
    const userMembership = userCommunitiesMemberships[selectedCommunity?.id];
    return userMembership && selectedCommunity?.access.review_policy === "open";
  };

  const isIncludedDirectly = (requestData) => {
    return requestData["is_closed"] && requestData["status"] === "accepted";
  };

  const handleSuccessSubmit = (data) => {
    const { handleSuccessAction } = this.props;
    this.closeConfirmModal();
    if (isIncludedDirectly(data.processed[0].request)) {
      handleSuccessAction(data, i18next.t("Record submitted"));
    } else handleSuccessAction(data, i18next.t("Review requested"));
  };

  const submitCommunity = async (reviewComment) => {
    setLoading(true);
    setError(null);

    try {
      let data = { communities: [ { id: selectedCommunity.id } ] };

      if (reviewComment) {
        data = {
          communities: [
            {
              id: selectedCommunity.id,
              comment: {
                payload: {
                  content: reviewComment,
                  format: "html",
                },
              },
            },
          ],
        };
      }
      const response = await http.post(recordCommunityEndpoint, data);
      handleSuccessSubmit(response.data);
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = () => setConfirmationModalOpen(true);
  const closeConfirmModal = () => setConfirmationModalOpen(false);

  const apiConfigs = {
    allCommunities: {
      ...recordCommunitySearchConfig,
      toggleText: i18next.t("Search in all collections"),
    },
    myCommunities: {
      ...recordUserCommunitySearchConfig,
      toggleText: i18next.t("Search in my collections"),
    },
  };

  return (
    <>
      <CommunitySelectionModalComponent
        onCommunityChange={changeSelectedCommunity}
        chosenCommunity={selectedCommunity}
        modalOpen={modalOpen}
        userCommunitiesMemberships={userCommunitiesMemberships}
        onModalChange={toggleModal}
        modalHeader={i18next.t("Select a collection")}
        apiConfigs={apiConfigs}
        handleClose={handleClose}
        record={record}
        isInitialSubmission={false}
      />
      {confirmationModalOpen && (
        <SubmitReviewModal
          loading={loading}
          errors={error && <Message error>{error}</Message>}
          isConfirmModalOpen={confirmationModalOpen}
          onSubmit={({ reviewComment }) => submitCommunity(reviewComment)}
          community={selectedCommunity}
          onClose={() => closeConfirmModal()}
          directPublish={canIncludeDirectly()}
          record={record}
          permissionsPerField={permissionsPerField}
        />
      )}
    </>
  );
}

RecordCommunitySubmissionModal.propTypes = {
  modalOpen: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  userCommunitiesMemberships: PropTypes.object.isRequired,
  handleSuccessAction: PropTypes.func.isRequired,
  recordCommunityEndpoint: PropTypes.string.isRequired,
  recordCommunitySearchConfig: PropTypes.object.isRequired,
  recordUserCommunitySearchConfig: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired,
};

RecordCommunitySubmissionModal.defaultProps = {
  modalOpen: false,
};

export { RecordCommunitySubmissionModal };
