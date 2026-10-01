import {
  formatContainerCitation,
  formatJournalCitation,
  getImprint,
  getResourceTypeId,
  imprintDisplayForRecord,
  isUrlLike,
} from "./imprintDisplay";

describe("isUrlLike", () => {
  it("detects http(s) and www titles", () => {
    expect(isUrlLike("https://example.org/path")).toBe(true);
    expect(isUrlLike("http://example.org")).toBe(true);
    expect(isUrlLike("www.example.org")).toBe(true);
  });

  it("rejects ordinary titles and empty values", () => {
    expect(isUrlLike("The Cambridge Companion")).toBe(false);
    expect(isUrlLike("")).toBe(false);
    expect(isUrlLike(null)).toBe(false);
    expect(isUrlLike(undefined)).toBe(false);
  });
});

describe("formatContainerCitation", () => {
  it("formats MLA container fragment with title and pages", () => {
    expect(
      formatContainerCitation({
        title: "My Book",
        pages: "12-34",
        place: "Chicago",
        isbn: "978-0-00-000000-0",
      }),
    ).toBe("<em>My Book</em>, pp. 12-34");
  });

  it("includes edition between title and pages", () => {
    expect(
      formatContainerCitation({
        title: "My Book",
        edition: "2",
        pages: "12-34",
      }),
    ).toBe("<em>My Book</em>, 2 ed., pp. 12-34");
    expect(
      formatContainerCitation({
        title: "My Book",
        edition: "2nd ed.",
        pages: "12",
      }),
    ).toBe("<em>My Book</em>, 2nd ed., p. 12");
    expect(
      formatContainerCitation({
        title: "My Book",
        edition: "Revised edition",
      }),
    ).toBe("<em>My Book</em>, Revised edition");
    expect(
      formatContainerCitation(
        { title: "My Book", pages: "12-34" },
        "3",
      ),
    ).toBe("<em>My Book</em>, 3 ed., pp. 12-34");
  });

  it("formats title only when pages are missing", () => {
    expect(formatContainerCitation({ title: "My Book" })).toBe(
      "<em>My Book</em>",
    );
  });

  it("uses p. for a single page", () => {
    expect(formatContainerCitation({ title: "My Book", pages: "12" })).toBe(
      "<em>My Book</em>, p. 12",
    );
  });

  it("suppresses URL-like titles", () => {
    expect(
      formatContainerCitation({
        title: "https://example.org/book",
        pages: "1-2",
      }),
    ).toBeNull();
  });

  it("returns null without a title", () => {
    expect(formatContainerCitation({ pages: "1-2", place: "NY" })).toBeNull();
    expect(
      formatContainerCitation({ edition: "2", pages: "1-2" }),
    ).toBeNull();
    expect(formatContainerCitation(null)).toBeNull();
  });

  it("escapes HTML in titles", () => {
    expect(formatContainerCitation({ title: 'A <B> & "C"' })).toBe(
      "<em>A &lt;B&gt; &amp; &quot;C&quot;</em>",
    );
  });
});

describe("formatJournalCitation", () => {
  it("formats an MLA journal container fragment", () => {
    expect(
      formatJournalCitation(
        { title: "Some Journal", volume: 1, issue: 2, pages: "3-4" },
        "2023",
      ),
    ).toBe("<em>Some Journal</em>, vol. 1, no. 2, 2023, pp. 3-4");
  });

  it("allows title with any subset of vol, year, and pages", () => {
    expect(formatJournalCitation({ title: "Some Journal" }, null)).toBe(
      "<em>Some Journal</em>",
    );
    expect(
      formatJournalCitation({ title: "Some Journal", volume: 10 }, "2023"),
    ).toBe("<em>Some Journal</em>, vol. 10, 2023");
    expect(
      formatJournalCitation({ title: "Some Journal", pages: "15-22" }, null),
    ).toBe("<em>Some Journal</em>, pp. 15-22");
  });

  it("uses no. for numeric issues and bare text for seasonal issues", () => {
    expect(
      formatJournalCitation({ title: "Some Journal", issue: "2" }, null),
    ).toBe("<em>Some Journal</em>, no. 2");
    expect(
      formatJournalCitation({ title: "Some Journal", issue: "2a" }, null),
    ).toBe("<em>Some Journal</em>, no. 2a");
    expect(
      formatJournalCitation(
        { title: "Some Journal", issue: "Spring" },
        null,
      ),
    ).toBe("<em>Some Journal</em>, Spring");
    expect(
      formatJournalCitation(
        { title: "Some Journal", volume: 49, issue: "Summer/Fall" },
        "2023",
      ),
    ).toBe("<em>Some Journal</em>, vol. 49, Summer/Fall, 2023");
  });

  it("returns null without a title even when pages or year exist", () => {
    expect(
      formatJournalCitation({ volume: 10, pages: "15-22" }, "2023"),
    ).toBeNull();
    expect(formatJournalCitation({ pages: "15-22" }, "2023")).toBeNull();
  });
});

describe("getImprint / getResourceTypeId", () => {
  it("reads imprint and resource type from the record", () => {
    const record = {
      custom_fields: {
        "imprint:imprint": { title: "Book", pages: "1" },
      },
      metadata: { resource_type: { id: "textDocument-bookSection" } },
    };
    expect(getImprint(record)).toEqual({ title: "Book", pages: "1" });
    expect(getResourceTypeId(record)).toBe("textDocument-bookSection");
  });

  it("falls back to ui.resource_type.id", () => {
    expect(
      getResourceTypeId({
        ui: { resource_type: { id: "textDocument-book" } },
      }),
    ).toBe("textDocument-book");
  });
});

describe("imprintDisplayForRecord", () => {
  const fullImprint = {
    title: "Container Title",
    pages: "99-101",
    place: "London",
    isbn: "978-1-234567-89-0",
  };

  const recordWith = (resourceTypeId, fields = {}) => ({
    metadata: {
      resource_type: { id: resourceTypeId },
      ...fields.metadata,
    },
    custom_fields: fields.custom_fields ?? {},
  });

  it("maps book-section-like types to Published in + discrete ISBN/place", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-bookSection", {
          custom_fields: { "imprint:imprint": fullImprint },
        }),
      ),
    ).toEqual({
      publishedIn: "<em>Container Title</em>, pp. 99-101",
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });

  it("pulls edition from kcr:edition into the container citation", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-bookSection", {
          custom_fields: {
            "imprint:imprint": fullImprint,
            "kcr:edition": "2",
          },
        }),
      ),
    ).toEqual({
      publishedIn: "<em>Container Title</em>, 2 ed., pp. 99-101",
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });

  it("omits Published in when book section has pages but no title", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-bookSection", {
          custom_fields: {
            "imprint:imprint": {
              pages: "12-34",
              place: "NY",
              isbn: "978-0-00-000000-0",
            },
          },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: null,
      isbn: "978-0-00-000000-0",
      issn: null,
      place: "NY",
      suppressPublicationDate: false,
    });
  });

  it("maps proceedingsPaper to In proceedings", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-proceedingsPaper", {
          custom_fields: { "imprint:imprint": fullImprint },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: "<em>Container Title</em>, pp. 99-101",
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });

  it("maps whole-book types to ISBN and Place only", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-book", {
          custom_fields: { "imprint:imprint": fullImprint },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });

  it("uses journal citation for journal-like types; discrete fields still come from raw data", () => {
    const journalFields = {
      metadata: { publication_date: "2023-03-02" },
      custom_fields: {
        "journal:journal": {
          title: "Some Journal",
          volume: 1,
          issue: 2,
          pages: "3-4",
        },
        "imprint:imprint": fullImprint,
      },
    };
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-journalArticle", journalFields),
      ),
    ).toEqual({
      publishedIn: "<em>Some Journal</em>, vol. 1, no. 2, 2023, pp. 3-4",
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: true,
    });
    expect(
      imprintDisplayForRecord(recordWith("textDocument-preprint", journalFields)),
    ).toEqual({
      publishedIn: "<em>Some Journal</em>, vol. 1, no. 2, 2023, pp. 3-4",
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: true,
    });
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-journalArticle", {
          metadata: { publication_date: "2023-03-02" },
          custom_fields: {
            "journal:journal": {
              title: "The Effects of Climate Change",
              volume: 10,
              issue: 2,
              pages: "15-22",
              issn: "1234-5678",
            },
          },
        }),
      ),
    ).toEqual({
      publishedIn:
        "<em>The Effects of Climate Change</em>, vol. 10, no. 2, 2023, pp. 15-22",
      inProceedings: null,
      isbn: null,
      issn: "1234-5678",
      place: null,
      suppressPublicationDate: true,
    });
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-journalArticle", {
          custom_fields: {
            "journal:journal": { title: "Some Journal", issue: "Spring" },
            "imprint:imprint": { place: "Lagos" },
          },
        }),
      ),
    ).toEqual({
      publishedIn: "<em>Some Journal</em>, Spring",
      inProceedings: null,
      isbn: null,
      issn: null,
      place: "Lagos",
      suppressPublicationDate: false,
    });
  });

  it("omits Published in without journal title but still shows ISSN and Place", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-journalArticle", {
          metadata: { publication_date: "2023-03-02" },
          custom_fields: {
            "journal:journal": {
              volume: 10,
              pages: "15-22",
              issn: "1234-5678",
            },
            "imprint:imprint": { place: "Berlin" },
          },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: null,
      isbn: null,
      issn: "1234-5678",
      place: "Berlin",
      suppressPublicationDate: false,
    });
  });

  it("omits citations for thesis/default families but still surfaces discrete fields", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-thesis", {
          custom_fields: {
            "imprint:imprint": {
              title: "https://thesis.example/abs/123",
              place: "Ann Arbor",
            },
          },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: null,
      isbn: null,
      issn: null,
      place: "Ann Arbor",
      suppressPublicationDate: false,
    });
    expect(
      imprintDisplayForRecord(
        recordWith("presentation-slides", {
          custom_fields: { "imprint:imprint": fullImprint },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });

  it("omits citations for unknown resource types; discrete fields still surface", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("other-somethingWeird", {
          custom_fields: { "imprint:imprint": fullImprint },
        }),
      ),
    ).toEqual({
      publishedIn: null,
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });

  it("uses imprint Published in for bookSection even when journal is present", () => {
    expect(
      imprintDisplayForRecord(
        recordWith("textDocument-bookSection", {
          custom_fields: {
            "imprint:imprint": fullImprint,
            "journal:journal": { title: "Other", volume: 9 },
          },
        }),
      ),
    ).toEqual({
      publishedIn: "<em>Container Title</em>, pp. 99-101",
      inProceedings: null,
      isbn: "978-1-234567-89-0",
      issn: null,
      place: "London",
      suppressPublicationDate: false,
    });
  });
});
