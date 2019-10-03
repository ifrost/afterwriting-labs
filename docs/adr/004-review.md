# ADR004: Review

## Status

Work In Progress

## Context

This ADR is to review:
* used technologies
* current code base
* build/deployment process
* documentation

### Used technologies

- npm (but some dependencies in libs/)
- require.js
- handlebars
- grunt (build, minification, docs, testing, development)
- mocha/chai/sinon/istanbul
- phantomjs
- express
- protoplast.js
- jsdoc
- eslint

### Code base

- custom framework
- requirejs for nodejs hacks

### Build/deployment

- Travis

### Documentation

- Some docs in progress

## Decision

Some technologies are dated, some seem okay, but there's a need to evaluate them. Decision is to create Tech Radar using following framework:

WAITER Framework

Each assesed technology can have one of the following states:
* Wait
* Adopt
* Investigate
* Trial
* Endure
* Reject

Transitions:
Wait -> Investigate -> Trial -> Adopt -> Endure -> Reject
                                                   
Wait - new technology that is too early to assess
Investigate - new technology worth experimenting, spend 10% of time on it but don't use it officially
Trial - investigation of a new technology was promising, test it on non-critical area of the product
Adopt - trial was successful and technology should be used to solve problems
Endure - existing technology that is not the best anymore, don't invest in it, migrate when possible
Reject - schedule decomissioning old technology OR new technology that is not suitable to be used

Assesment

- performance (any known security problems)
- security (any known security issues)
- easy to work with (how easy it is to learn, modify, find help)

1) What problems does it solve?
2) What problems does it introduce?
3) Are there any alternatives? 

## Consequences

If reviewed regularily, e.g. each 3-4 months it can help improve the stack. On the other hand if neglected it will become useless.
