# service-profile-tool

[![CI](https://github.com/andorsk/service-profile-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/andorsk/service-profile-tool/actions/workflows/ci.yml)

Service profile tool is a tool that supports the [Service Profile Specification](https://github.com/trustoverip/tswg-trust-registry-service-profile) at ToIP.

## Features

### CLI 

- [x] Profile Generation
- [x] Profile Validation
- [x] DID Resolution w/ Profile Support
- [ ] Indexing Service / Profile Search
- [ ] Signature Validation
- [ ] Profile Hosting Service

### Web UI 

- [x] Profile Validation
- [ ] Profile Generation
- [ ] DID Resolution w/ Profile Support
- [ ] Indexing Service / Profile Search
- [ ] Signature Validation
- [ ] Profile Hosting Service


## Outputs

- [ ] CLI tool located at ./dist/bin/cli
- [ ] Website ( not hosted yet )
 
## Build

To build: 

`yarn build`

## Run

### CLI Tool

_yarn commands run against the builds in the ./bin folder_

#### Help

```sh
yarn cli --help
```

### Validate

```sh
yarn cli --validate -url <path-to-url>
```

## Screenshots

### Web UI

![./imgs/00_ss.png](./imgs/00_ss.png)

### CLI

![./imgs/demo.gif](./imgs/demo.gif)


## Code Structure

All code is in the `src` directory.

- `lib` is for library tools
- `bin` are entry points/executables
- `schemas` are schemas
