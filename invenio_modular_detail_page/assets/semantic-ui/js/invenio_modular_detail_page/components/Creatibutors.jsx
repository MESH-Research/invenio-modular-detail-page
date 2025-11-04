import React, { useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Card, Icon, Label, List } from "semantic-ui-react";
import { AffiliationsAccordion } from "./AffiliationsAccordion";
import {
	identifiersList,
	buildMergedCreatibutors,
	makeSchemeInfo,
	identifierForUrl,
} from "./CreatibutorsHelper";
import { DetailContext } from "../contexts/DetailContext";

const CreatibutorIcon = ({ creatibutor, schemeInfo }) => {
	let ids = identifiersList(creatibutor.person_or_org.identifiers);

	return (
		<>
			{!!ids
				? ids.map(({ scheme, identifier }) => (
						<a
							href={`${schemeInfo[scheme][2]}${identifierForUrl(scheme, identifier)}`}
							className={`no-text-decoration ${scheme}-icon-link`}
							key={`${scheme}-${identifier}`}
							aria-label={`${creatibutor.person_or_org.name}'s ${
								schemeInfo[scheme][0]
							} ${i18next.t("profile")}`}
						>
							{scheme === "email" ? (
								<Icon
									name="mail outline"
									aria-label={`${creatibutor.person_or_org.name}'s email`}
									alt={`${creatibutor.person_or_org.name}'s email`}
									className="ml-5 inline-id-icon"
								/>
							) : (
								<img
									className={`ml-5 inline-id-icon ${scheme}`}
									src={schemeInfo[scheme][1]}
									alt={`${schemeInfo[scheme][0]} icon`}
									title={`${creatibutor.person_or_org.name}'s ${
										schemeInfo[scheme][0]
									} ${i18next.t("profile")}`}
								/>
							)}
						</a>
					))
				: ""}
			{!!ids && creatibutor.person_or_org.type == "organizational" ? (
				<Icon name="group" />
			) : (
				""
			)}
		</>
	);
};

const Creatibutor = ({
	creatibutor,
	show_affiliations,
	show_ids = true,
	show_roles,
	schemeInfo,
	itemIndex,
	listLength,
}) => {
	let extra_props = {};
	if (show_affiliations && creatibutor.affiliations) {
		extra_props["data-tooltip"] = creatibutor.affiliations
			.map((a) => a[1])
			.join("; ");
	}
	return (
		<dd className="creatibutor-wrap separated">
			<List.Content as={"span"} className="creatibutor-name">
				<a
					className="ui creatibutor-link"
					href={`../search?q=metadata.creators.person_or_org.name:"${creatibutor.person_or_org.name}"`}
					{...extra_props}
				>
					<span>
						{creatibutor.person_or_org.type === "personal" &&
						creatibutor.person_or_org.family_name
							? `${creatibutor.person_or_org.given_name} ${creatibutor.person_or_org.family_name}`
							: creatibutor.person_or_org.name}
					</span>
				</a>
			</List.Content>
			{!!show_roles &&
			creatibutor.role &&
			creatibutor.role.title !== "Other" ? (
				<Label className="creatibutor-role">{creatibutor.role.title}</Label>
			) : (
				""
			)}
			{!!show_ids && creatibutor?.person_or_org?.identifiers && (
				<CreatibutorIcon creatibutor={creatibutor} schemeInfo={schemeInfo} />
			)}
		</dd>
	);
};

const CreatibutorsShortList = () => {
	const contextStore = useContext(DetailContext);
	const creators = contextStore.creators;
	const contributors = contextStore.contributors;

    const show_affiliations = false;
    const show_roles = false;
    const mergedCreatibutors = buildMergedCreatibutors(creators, contributors);

    // Get first three creatibutors and count remaining from merged list
    const firstThreeCreatibutors = mergedCreatibutors?.slice(0, 3) || [];
    const remainingCount = mergedCreatibutors
        ? Math.max(0, mergedCreatibutors.length - 3)
        : 0;

	const schemeInfo = makeSchemeInfo(
		contextStore.iconsGnd,
		contextStore.iconsKcUsername,
		contextStore.iconsIsni,
		contextStore.iconsOrcid,
		contextStore.iconsRor,
		contextStore.landingUrls,
	);

	return contextStore.isPreviewSubmissionRequest ? null : (
		<section
			id="creatibutors-list-section"
			className="ui mb-10 mt-10 sixteen wide mobile twelve wide tablet thirteen wide computer column"
		>
			<dl className="creatibutors" aria-label={i18next.t("Contributors list")}>
				{firstThreeCreatibutors?.length
					? firstThreeCreatibutors.map((creator, idx) => (
							<Creatibutor
								creatibutor={creator}
								key={creator.person_or_org.name}
								show_affiliations={show_affiliations}
								show_roles={show_roles}
								schemeInfo={schemeInfo}
							/>
						))
					: ""}
				{remainingCount > 0 && (
					<dd className="creatibutor-wrap separated">
						<List.Content as={"span"} className="creatibutor-name">
							{remainingCount > 1
								? i18next.t("and {{count}} others", { count: remainingCount })
								: i18next.t("and {{count}} other", { count: remainingCount })}
						</List.Content>
					</dd>
				)}
			</dl>
		</section>
	);
};

const CreatibutorCard = ({ creator, show_affiliations, schemeInfo }) => {
	return (
		<Card fluid>
			<Card.Content className="pb-5">
				<Card.Header>
					<Creatibutor
						creatibutor={creator}
						key={creator.person_or_org.name}
						show_affiliations={show_affiliations}
						show_ids={false}
						schemeInfo={schemeInfo}
					/>
				</Card.Header>
				<Card.Meta>
					{creator.roles?.length ? (
						<>
							{creator.roles.map((r, idx) => (
								<span key={`role-${r.title}-${idx}`}>
									{r.title}
									{idx < creator.roles.length - 1 ? <span>, </span> : null}
								</span>
							))}
						</>
					) : (
						!!creator.role && <span>{creator.role.title}</span>
					)}
				</Card.Meta>
				<Card.Description className="mt-0">
					{!!creator.affiliations &&
						show_affiliations &&
						creator.affiliations.map((a) => (
							<small className="creator-affiliation">{a[1]}</small>
						))}
				</Card.Description>
			</Card.Content>
			<Card.Content extra className="mt-0 pt-5">
				{identifiersList(creator.person_or_org.identifiers)?.map(
					({ scheme, identifier }) => (
						<a
					href={`${schemeInfo[scheme][2]}${identifierForUrl(scheme, identifier)}`}
							className="no-text-decoration"
							key={`${scheme}-${identifier}`}
							aria-label={`${creator.person_or_org.name}'s ${
								schemeInfo[scheme][0]
							} ${i18next.t("profile")}`}
						>
							<img
								className="mr-5 inline-id-icon"
								src={schemeInfo[scheme][1]}
								alt={`${schemeInfo[scheme][0]} icon`}
								title={`${creator.person_or_org.name}'s ${
									schemeInfo[scheme][0]
								} ${i18next.t("profile")}`}
							/>
							<small>
								{schemeInfo[scheme][0]} {i18next.t("profile")}
							</small>
						</a>
					),
				)}
			</Card.Content>
		</Card>
	);
};

const Creatibutors = ({
	creators,
	contributors,
	iconsRor,
	iconsOrcid,
	iconsGnd,
	iconsKcUsername,
	iconsIsni,
	landingUrls,
	section,
	subsections,
}) => {
	const show_affiliations = true;
	const creatibutors = buildMergedCreatibutors(creators, contributors);
	const schemeInfo = makeSchemeInfo(
		iconsGnd,
		iconsKcUsername,
		iconsIsni,
		iconsOrcid,
		iconsRor,
		landingUrls,
	);
	return (
		<div className="">
			{creatibutors?.map((creator) => (
				<CreatibutorCard
					creator={creator}
					show_affiliations={show_affiliations}
					schemeInfo={schemeInfo}
				/>
			))}
		</div>
	);
};

export { Creatibutors, CreatibutorsShortList };
