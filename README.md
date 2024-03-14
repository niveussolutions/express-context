[![Npm package version](https://badgen.net/npm/v/@niveus/express-context)](https://www.npmjs.com/package/@niveus/express-context)
[![Npm package monthly downloads](https://badgen.net/npm/dm/@niveus/express-context)](https://www.npmjs.com/package/@niveus/express-context)
[![GitHub issues](https://badgen.net/github/issues/niveussolutions/express-context)](https://github.com/niveussolutions/express-context/issues/)
[![GitHub contributors](https://img.shields.io/github/contributors/niveussolutions/express-context.svg)](https://github.com/niveussolutions/express-context/graphs/contributors/)



# Express Context
Express middleware to get and set request-scoped context. It uses [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) under the hood (forked from [express-http-context](https://github.com/skonves/express-http-context)). Context is preserved over async/await (in node 8+).

## Usage

Installation: `npm i --save @niveus/express-context`

Use the middleware before the first middleware that needs access to the context. Any middleware used before this won't have access to the `expressContext`.

Note that some popular middlewares (such as body-parser, express-jwt) may cause context to get lost. To workaround such issues, you are advised to use any third party middleware that does NOT need the context BEFORE you use this middleware.

``` js
const express = require('express');
const expressContext = require('@niveus/express-context');

const app = express();

// Use any third-party middleware here.

app.use(expressContext.expressContextMiddleware());

// all code from here on has access to the same context for each request

```
### set()

Set values for the incomming request
``` js
// Example auth middleware
app.use((req, res, next) => {
    try {
        const token = authService.Authenticate(req.body);

        expressContext.set('userToken', token);

        next();
    } catch(err) {
        next(err);
    }
})
```

### get()
Get the value from the block of code that does not have access to the `req` object.

>⚠️ If there is no value available for the key, the default value will be `undefined`.

``` js
const expressContext = require('@niveus/express-context');



function invalidateToken() {
    const token = expressContext.get('userToken');

    await userService.invalidateToken(token);

    // ...
}
```

### getNs()

To access the namespace directly, use this.
``` js
const expressContext = require('@niveus/express-context');

let ns = expressContext.getNs();
```

### setMany()

TO set multiple values at the same time, pass an object to the `setMany` function. The data will be set in the context using the key and value of the object.
``` js
// Example middleware
app.use((req, res, next) => {
    try {
        const {userId, sessionId} = authService.getUserDetails(req.data);


        expressContext.setMany({userId: userId, sessionId: sessionId});

    } catch(err) {
        next(err);
    }
})
```

### getMany()

To get multiple values from the context, pass an array containing the key name (as string) to `getMany` function. The function returns an array with the values of the keys in the same order as the input array.

>⚠️ If there is no value available for the key, the default value will be `undefined`.

``` js
const expressContext = require('@niveus/express-context');



function invalidateToken() {
    const [userId, sessionId] = expressContext.getMany(['userId', 'sessionId']);

    await userService.invalidateToken(userId, sessionId);

    // ...
}
```

## Additional Options
`@niveus/express-context` gives the option to create custom context namespaces if required. To use custom namespace, pass the `ExpressContextOptions` as the last option in the functions.

``` js
// ExpressContextOptions example

let expressContextOptions = { nsid: 'custom namespace id'};
```

Examples

``` js 
// ExpressContextOptions in the middleware.

let expressContextOptions = { nsid: 'custom namespace id'};

app.use(expressContext.expressContextMiddleware(expressContextOptions));

```

``` js
// ExpressContextOptions in set, get, setMany, getMany, getNs functions

const expressContext = require('@niveus/express-context');

// ExpressContextOptions object
let expressContextOptions = { nsid: 'custom namespace id'};

// set
expressContext.set('userToken', 'value', expressContextOptions);

// get
const token = expressContext.get('userToken', expressContextOptions);

// setMany
expressContext.setMany({userId: userId, sessionId: sessionId}, expressContextOptions);


// getMany
const [userId, sessionId] = expressContext.getMany(['userId', 'sessionId'], expressContextOptions);

// getNs
let ns = expressContext.getNs(expressContextOptions);

```

## Troubleshooting
To avoid weird behavior with express:
1. Make sure you require `@niveus/express-context` in the first row of your app. Some popular packages use async which breaks CLS.

For users of Node 10
1. Node 10.0.x - 10.3.x are not supported.  V8 version 6.6 introduced a bug that breaks async_hooks during async/await.  Node 10.4.x uses V8 v6.7 in which the bug is fixed.  See: https://github.com/nodejs/node/issues/20274.


## Credits
This code is derived from `https://github.com/skonves/express-http-context`
License(MIT) https://github.com/skonves/express-http-context/blob/b141fd3fb6a408c3c4ec37fd74ab08fab41ea27f/LICENSE