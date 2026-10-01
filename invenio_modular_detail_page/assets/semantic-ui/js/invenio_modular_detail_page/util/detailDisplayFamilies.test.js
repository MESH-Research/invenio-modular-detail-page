import {
  resolveDisplayFamily,
  resolveFamilySubsections,
} from "./detailDisplayFamilies";

describe("resolveDisplayFamily", () => {
  it("maps known types via the provided family map", () => {
    expect(
      resolveDisplayFamily("textDocument-journalArticle", {
        "textDocument-journalArticle": "journal",
      }),
    ).toBe("journal");
  });

  it("falls back to the built-in map when none is provided", () => {
    expect(resolveDisplayFamily("textDocument-bookSection")).toBe(
      "book_section",
    );
    expect(resolveDisplayFamily("textDocument-proceedingsPaper")).toBe(
      "proceedings_paper",
    );
  });

  it("returns default for unknown or missing types", () => {
    expect(resolveDisplayFamily("other-somethingWeird")).toBe("default");
    expect(resolveDisplayFamily(null)).toBe("default");
  });
});

describe("resolveFamilySubsections", () => {
  const byFamily = {
    journal: [{ section: "Published in" }, { section: "DOI" }],
    book_section: [
      { section: "Published in" },
      { section: "Place" },
      { section: "ISBN" },
    ],
    default: [{ section: "Publisher" }, { section: "DOI" }],
  };

  it("returns arrays unchanged", () => {
    const plain = [{ section: "DOI" }];
    expect(resolveFamilySubsections(plain, "textDocument-journalArticle")).toBe(
      plain,
    );
  });

  it("selects the matching family list", () => {
    expect(
      resolveFamilySubsections(
        byFamily,
        "textDocument-journalArticle",
      ).map((s) => s.section),
    ).toEqual(["Published in", "DOI"]);
    expect(
      resolveFamilySubsections(
        byFamily,
        "textDocument-bookSection",
      ).map((s) => s.section),
    ).toEqual(["Published in", "Place", "ISBN"]);
  });

  it("falls back to default for unknown types", () => {
    expect(
      resolveFamilySubsections(byFamily, "other-weird").map((s) => s.section),
    ).toEqual(["Publisher", "DOI"]);
  });

  it("returns an empty array for invalid subsections", () => {
    expect(resolveFamilySubsections(null, "textDocument-book")).toEqual([]);
    expect(resolveFamilySubsections({}, "textDocument-book")).toEqual([]);
  });
});
