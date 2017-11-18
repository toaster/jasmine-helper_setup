# jasmine-helper_setup
Tool for convenient setup of Jasmine helpers


## Installation

```sh
> npm install --save-dev code_cowboy-jasmine-helper_setup
```


## Usage

To your executable script add:

```javascript
const helperSetup = require('code_cowboy-jasmine-helper_setup');
helperSetup('<name of your helper>', '<complete code of your helper>');
```


### Example

```javascript
#!/usr/bin/env node

const helperSetup = require('code_cowboy-jasmine-helper_setup');

content =
`'use strict';

const MyHelperModule = require('my_helper_module');
MyHelperModule.initialize();
`

helperSetup('my_helper', content);
```
