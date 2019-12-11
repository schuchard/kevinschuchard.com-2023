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
    cy.visit("/blog/2018-07-17-jest-schematic/");
    cy.contains("h1", "Building an Angular Schematic for Jest");
  });
});

describe("Tags", function() {
  it("should display all tags", function() {
    cy.visit("/tags");
    cy.contains("h1", "Tags");
    cy.get("ul.taglist > li").should("have.length.gt", 3);
  });

  it("should display tag groups", function() {
    cy.visit("/tags/angular");
    cy.contains("h3", "8 posts tagged with “angular”");
    cy.get("ul.taglist > li").should("have.length.gt", 3);
  });
});

describe("Events", function() {
  it("should display events", function() {
    cy.visit("/events");
    cy.get("li.event").should("have.length.gt", 3);
    cy.contains("li.event", "NgConf - Schematics: an untapped frontier");
  });
});

describe("About", function() {
  it("should display about", function() {
    cy.visit("/about");
    cy.contains("h2", "About Me");
  });
});
