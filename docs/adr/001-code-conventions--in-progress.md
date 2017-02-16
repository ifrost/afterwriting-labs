# ADR001: Code Conventions

# Context

The whole codebase should be easy to read and follow. To achieve this, it should follow well-defined code conventions.

# Decision

Brief description of used conventions. Details TBD in a separate README file.

## General

* 4 spaces
* CamelCases

## Tests

* 3A convention (http://xp123.com/articles/3a-arrange-act-assert/)
  Clear distinction should quickly point out fragments that can be extracted, for acceptance tests: GIVEN/WHEN/THEN marks should map to GIVEN/WHEN/THEN in description
  arrange/act/assert could be used but it should be clear in acceptance test which fragment is linked to description; drawback - it's not that obvious that THEN should contain only asserts
  
* Acceptance/Integration/Unit tests names: GIVEN something AND something WHEN something happens AND something else happens THEN something happens AND something else happens
  Above may seem to be too much but it prevents from writing sloppy descriptions and help to make clear what is tested. What is more, if one sees the description is too complex it may be a sign that too many things are tested. It's not important to list all GIVEN, WHEN, THEN - only these that are crucial. Especially GIVEN section may be omitted if WHEN section clearly identifies GIVEN section (e.g. GIVEN the button WHEN the button is clicked...)
 For multi WHEN-THEN tests: GIVEN aaa WHEN bbb THEN ccc AND WHEN ddd THEN eee

* When to write a unit, integration, acceptance test. Unit for controllers, utils

* Each bug needs to have a regression acceptance test

* Assertions should be as generic as possible

# Status: In Progress

# Consequences

It may not be possible to follow the rules strictly, e.g. dependencies/libraries may use different naming conventions (underscores instead of CamelCases). Hence it's not required to follow conventions defined here for libraries extracted to separate projects.
