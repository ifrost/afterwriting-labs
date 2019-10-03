# Tech Radar

Date: 09/2019

States: 
* Wait (0)
* Investigate (0) 
* Trial (0)
* Adopt (0) 
* Endure (0) 
* Reject (0)

Review each tech with:
1) What problems does it solve?
2) What problems does it introduce?
3) Are there any alternatives? 

Goals: performance, security, easy to work with

| ### | Name                 | State |
|-----|----------------------|-------|
| 001 | NPM                  | A     |
| 002 | require.js           | E     | webpack/es6/ts
| 003 | handlebars           | E     | 
| 004 | grunt                | AR    | webpack
| 005 | mocha                | A     |
| 006 | chai                 | A     |
| 007 | sinon                | A     |
| 008 | istanbul             | ER    | ?
| 009 | phantomjs            | R     | chromium
| 010 | express.js           | A     |
| 011 | protoplast           | AR    | rewrite in react
| 012 | jsdoc                | AER   | type script
| 013 | eslint               | A     |
| 014 | Travis               | AE    | github actions?

NPM
Solves package/dependency management; build setup. Very common, easy to integrate and well documented. 
Adopt

require.js
Dated way of managing modules. It's easy to use but it doesn't help moving forward - using es6, typescript. It makes it harder to use it for CLI and web and current implementation is hard to follow and a bit clunky. Could keep using it for a while but would be much easier to use webpack. Maybe there's a way to move gradually? Migration shouldn't be problematic. The problem is that it's impossible to "endure" the tech as adding new feautres would require it. The only option is Adopt or Reject and there can only be one decision.
Reject. 
