// Utilities for Creatibutors merging, identifiers, and scheme info

export const identifiersList = (ids) => {
	if (ids !== undefined) {
		ids = ids.reduce((x, y) => {
			(x[y.scheme] = x[y.scheme] || []).push(y);
			return x;
		}, {});
		ids = Object.values(ids).reduce((acc, idlist) => [...acc, ...idlist], []);
	} else {
		ids = [];
	}
	return ids;
};

export const toSchemeMap = (ids) => {
	const map = {};
	(ids || []).forEach(({ scheme, identifier }) => {
		(map[scheme] = map[scheme] || new Set()).add(identifier);
	});
	return map;
};

export const hasOverlap = (aMap, bMap) =>
	Object.keys(aMap).some((s) => bMap[s] && [...aMap[s]].some((id) => bMap[s].has(id)));

export const hasConflicts = (aMap, bMap) =>
	Object.keys(aMap).some((s) => {
		if (!bMap[s]) return false;
		if (aMap[s].size !== bMap[s].size) return true;
		for (const id of aMap[s]) if (!bMap[s].has(id)) return true;
		return false;
	});

export const canMergeByIdentifiers = (a, b) => {
	const aMap = toSchemeMap(a?.person_or_org?.identifiers);
	const bMap = toSchemeMap(b?.person_or_org?.identifiers);
	if (!Object.keys(aMap).length || !Object.keys(bMap).length) return false;
	return hasOverlap(aMap, bMap) && !hasConflicts(aMap, bMap);
};

export const uniqueBy = (arr, keyFn) => {
	const seen = new Set();
	return arr.filter((item) => {
		const k = keyFn(item);
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
};

export const mergeUniqueProp = (a, b, prop, keyFn, extraItems = []) => {
	const fromA = Array.isArray(a[prop]) ? a[prop] : [];
	const fromB = Array.isArray(b[prop]) ? b[prop] : [];
	return uniqueBy([...fromA, ...fromB, ...extraItems], keyFn);
};

export const mergeCreatibutorsData = (a, b) => {
	const roles = mergeUniqueProp(
		a,
		b,
		"roles",
		(r) => r?.title || "",
		[...(a.role ? [a.role] : []), ...(b.role ? [b.role] : [])],
	).filter((r) => r?.title);

	const affiliations = mergeUniqueProp(
		a,
		b,
		"affiliations",
		(x) => (Array.isArray(x) ? x.join("|") : String(x)),
	);

	const identifiers = uniqueBy(
		[
			...(a.person_or_org?.identifiers || []),
			...(b.person_or_org?.identifiers || []),
		],
		(id) => `${id.scheme}:${id.identifier}`,
	);

	const pick = (p) => (p?.type === "personal" && p?.family_name ? 2 : 1);
	const person = pick(b.person_or_org) > pick(a.person_or_org) ? b.person_or_org : a.person_or_org;

	return {
		...a,
		roles,
		role: roles[0] || null,
		affiliations,
		person_or_org: { ...person, identifiers },
	};
};

export const buildMergedCreatibutors = (creators, contributors) => {
	const list = (creators?.creators || []).concat(contributors?.contributors || []);
	return list.reduce((acc, item) => {
		const idx = acc.findIndex((x) => canMergeByIdentifiers(x, item));
		if (idx === -1) return acc.concat({ ...item });
		acc[idx] = mergeCreatibutorsData(acc[idx], item);
		return acc;
	}, []);
};

export const makeSchemeInfo = (
	iconsGnd,
	iconsKcUsername,
	iconsIsni,
	iconsOrcid,
	iconsRor,
	landingUrls,
) => {
	return {
		orcid: ["ORCID", iconsOrcid, landingUrls.orcid],
		ror: ["ROR", iconsRor, landingUrls.ror],
		gnd: ["GND", iconsGnd, landingUrls.gnd],
		hc_username: ["Knowledge Commons", iconsKcUsername, landingUrls.kcommons_username],
		kc_username: ["Knowledge Commons", iconsKcUsername, landingUrls.kcommons_username],
		isni: ["ISNI", iconsIsni, landingUrls.isni],
		email: ["Email", "mail", "mailto:"],
	};
};


