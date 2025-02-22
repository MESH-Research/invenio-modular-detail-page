import React, { Component } from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Message } from "semantic-ui-react";
import { http } from "react-invenio-forms";
import {
  CommunitySelectionModalComponent,
} from "@js/invenio_modular_deposit_form/replacement_components/CommunitySelectionModal/CommunitySelectionModal";
import {
  SubmitReviewModal,
} from "@js/invenio_modular_deposit_form/replacement_components/PublishButton/SubmitReviewModal";

export class RecordCommunitySubmissionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationModalOpen: false,
      selectedCommunity: null,
      loading: false,
      error: null,
    };
  }

  changeSelectedCommunity = (community) => {
    this.setState({
      selectedCommunity: community,
      error: null,
    });
    this.openConfirmModal();
  };

  canIncludeDirectly = () => {
    const { selectedCommunity } = this.state;
    const { userCommunitiesMemberships } = this.props;
    const userMembership = userCommunitiesMemberships[selectedCommunity?.id];
    return userMembership && selectedCommunity?.access.review_policy === "open";
  };

  isIncludedDirectly = (requestData) => {
    return requestData["is_closed"] && requestData["status"] === "accepted";
  };

  handleSuccessSubmit = (data) => {
    const { handleSuccessAction } = this.props;
    this.closeConfirmModal();
    if (this.isIncludedDirectly(data.processed[0].request)) {
      handleSuccessAction(data, i18next.t("Record submitted"));
    } else handleSuccessAction(data, i18next.t("Review requested"));
  };

  submitCommunity = async (reviewComment) => {
    const { recordCommunityEndpoint } = this.props;
    const { selectedCommunity } = this.state;

    this.setState({
      loading: true,
      error: null,
    });

    try {
      let data = {
        communities: [
          {
            id: selectedCommunity.id,
          },
        ],
      };

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
      this.handleSuccessSubmit(response.data);
    } catch (error) {
      console.error(error);
      this.setState({
        error: error.response.data.errors[0].message,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  openConfirmModal = () => this.setState({ confirmationModalOpen: true });
  closeConfirmModal = () => this.setState({ confirmationModalOpen: false });

  render() {
    const { selectedCommunity, confirmationModalOpen, loading, error } = this.state;
    const {
      userCommunitiesMemberships,
      modalOpen,
      toggleModal,
      recordUserCommunitySearchConfig,
      recordCommunitySearchConfig,
      handleClose,
      record,
    } = this.props;
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
          onCommunityChange={this.changeSelectedCommunity}
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
            onSubmit={({ reviewComment }) => this.submitCommunity(reviewComment)}
            community={selectedCommunity}
            onClose={() => this.closeConfirmModal()}
            directPublish={this.canIncludeDirectly()}
            record={record}
          />
        )}
      </>
    );
  }
}

RecordCommunitySubmissionModal.propTypes = {
  modalOpen: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  userCommunitiesMemberships: PropTypes.object.isRequired,
  handleSuccessAction: PropTypes.func.isRequired,
  recordCommunityEndpoint: PropTypes.string.isRequired,
  recordCommunitySearchConfig: PropTypes.object.isRequired,
  recordUserCommunitySearchConfig: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired,
};

RecordCommunitySubmissionModal.defaultProps = {
  modalOpen: false,
};
