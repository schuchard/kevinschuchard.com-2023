describe("Home Page", () => {
  beforeEach(() => {
    // actual url is "baseUrl" in "cypress.json"
    cy.visit("/");
  });

  it("should load the site", () => {
    cy.contains("Latest Posts");
  });

  it("should display posts", () => {
    cy.get("div.home-post").should("have.length.gt", 3);
  });
});

describe("Direct URLs", () => {
  it("should display a post", () => {
    cy.visit("blog/2018-07-17-jest-schematic/");
    cy.contains("h1", "Building an Angular Schematic for Jest");
  });
});

describe("Tags", () => {
  it("should display all tags", () => {
    cy.visit("tags").contains("h1", "Tags");
    cy.get("ul.taglist > li").should("have.length.gt", 3);
  });

  it("should display tag groups", () => {
    cy.visit("tags/angular").contains("h3", "posts tagged with “angular”");
    cy.get("ul.taglist > li").should("have.length.gt", 3);
  });
});

describe("Events", () => {
  it("should display events", () => {
    cy.visit("events");
    cy.get("li.event").should("have.length.gt", 3);
    cy.contains("li.event", "NgConf - Schematics: an untapped frontier");
  });
});

describe("About", () => {
  it("should display about", () => {
    cy.visit("about");
    cy.contains("h2", "About Me");
  });
});
