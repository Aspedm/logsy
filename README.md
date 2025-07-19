# Logsy

## About
Logsy is a lightweight and zero dependency library for stylized logging in the browser console. It helps developers easily output structured and visually distinctive messages with custom styles, tags, and plugin support.

## 📦 Installation
```sh
yarn add @wyeg/logsy
```

## 🚀 Quick Start
```js
import { Logsy } from '@wyeg/logsy';

Logsy.log('App init completed');
```

## 📕 Documentation
### Available Log Methods
| Name             | Description                   |
|------------------|-------------------------------|
|`Logsy.log()`     | General-purpose logging       |
|`Logsy.info()`    | Informational messages        |
|`logsy.warn()`    | Warnings                      |
|`Logsy.error()`   | Errors and exceptions         |
|`Logsy.spinner()` | Async operation spinner       |

### API Reference
All methods (except Logsy.spinner()) use the same API interface as console.log().

```js
import { Logsy } from '@wyeg/logsy';

Logsy.log('Foo', { foo: 'bar' });
Logsy.info('Foo', { foo: 'bar' });
Logsy.warn('Foo', { foo: 'bar' });
Logsy.error('Foo', { foo: 'bar' }); 
// or 
Logsy.error('Foo', new Error('Error Message'));
```

Use Logsy.spinner() to indicate progress during asynchronous operations. The spinner message updates automatically when the promise resolves or rejects.
```js
import { Logsy } from '@wyeg/logsy';

const fetchData = () => new Promise((resolve) => setTimeout(() => resolve({ user: 'Tom' }), 2000));
Logsy.spinner('User', fetchData());
```

### Available options
| Name          | Type              | Description                                            |
|---------------|-------------------|--------------------------------------------------------|
|`logsy`        | boolean           | Required flag to identify the object as Logsy options  |
|`style`        | string            | Custom CSS rules to style the message                  |
|`label`        | string | LogTags  | Predefined or custom label used to tag the message     |

```js
import { Logsy } from '@wyeg/logsy';

Logsy.warn('Deprecated method', { logsy: true, label: LogTags.DEPRECATED });

Logsy.warn(
  'Field "card" is deprecated',
  { logsy: true, label: LogTags.DEPRECATED },
  { card: 123, cardNumber: 123 }
);
```

To customize label color, use the getLabelStyle() helper:
```js
import { Logsy, getLabelStyle } from '@wyeg/logsy';

Logsy.error('Something failed', { logsy: true, style: getLabelStyle('red') });
Logsy.log('Styled message', {
  logsy: true,
  style: 'color: lightgreen; background-color: darkgrey;',
});
```

### Plugins
#### Built-in

🕵️ **1. redactSensitiveDataPlugin**
Automatically redacts sensitive fields from log data:

```js
import { Logsy, redactSensitiveDataPlugin } from '@wyeg/logsy';

Logsy.use(redactSensitiveDataPlugin);

Logsy.log('User', {
  email: 'user@example.com',
  password: 'hunter2',
  token: 'abc123xyz',
  apiKey: 'secretkey123',
  profile: {
    creditCard: '4111111111111111',
    cvv: 123,
    other: 'safeValue',
  },
});
```
Output:
```js
{
  email: 'user@example.com',
  password: '********',
  token: '********',
  apiKey: '********',
  profile: {
    creditCard: '********',
    cvv: '****',
    other: 'safeValue'
  }
}
```

Sensitive fields:
- phone
- address
- creditcardnumber
- password
- secret
- token
- apikey
- accesskey
- privatekey
- sensitive
- confidential
- creditcard
- ssn
- socialsecuritynumber
- bankaccount
- bankaccountnumber
- routingnumber
- iban
- pin
- cvv
- cvc
- otp
- onetimepassword
- securitycode
- authcode
- authtoken
- authsecret
- authkey
- jwt

🚧 **2. devOnlyPlugin**
Prevents logging in non-development environments (NODE_ENV !== 'development'):

```js
import { Logsy, devOnlyPlugin } from '@wyeg/logsy';

Logsy.use(devOnlyPlugin);

Logsy.log('This will only be logged in development');
```

#### Create new plugin
You can create custom plugins that transform log data or hook into the logging lifecycle.

```ts
export interface ILogsyPlugin {
    /**
     * Transform the log message and its arguments.
     * @param message The log message.
     * @param rest The rest of the arguments.
     * @returns An object containing the transformed message and arguments.
     */
    transform?: (message: string, rest: unknown[]) => {
        message: string;
        rest: unknown[];
    };

    /**
     * Called before the log message is emitted.
     * @param level The log level.
     * @param message The log message.
     * @param rest The rest of the arguments.
     */
    beforeLog?: (level: TLogLevel, message: string, rest: unknown[]) => void;

    /**
     * Called after the log message is emitted.
     * @param level The log level.
     * @param message The log message.
     * @param rest The rest of the arguments.
     */
    afterLog?: (level: TLogLevel, message: string, rest: unknown[]) => void;
}
```
Avaiables log levels are `log`, `info`, `warn`, `error`.

## 📜 License
Further details see [LICENSE](LICENSE) file.

## 📧 Contact
If you have any questions, suggestions, or issues, please create an issue in the GitHub repository or contact me at [aspedm@gmail.com](mailto:aspedm@gmail.com).
