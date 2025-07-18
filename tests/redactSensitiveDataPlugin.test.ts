import Logsy from '../src/Logsy';
import { redactSensitiveDataPlugin } from '../src/plugins/redactSensitiveDataPlugin';

const mockInfo = jest.fn();
const mockLog = jest.fn();

global.console.info = mockInfo;
global.console.log = mockLog;

describe('redactSensitiveDataPlugin', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (Logsy as any)['plugins'] = [];
      Logsy.use(redactSensitiveDataPlugin);
    });

    it('should redact sensitive data in nested structures', () => {
      const payload = {
        email: 'user@example.com',
        password: 'hunter2',
        token: 'abc123xyz',
        apiKey: 'secretkey123',
        profile: {
          creditCard: '4111111111111111',
          cvv: 123,
          other: 'safeValue',
        },
      };

      Logsy.info('Redacting...', payload);

      const args = mockInfo.mock.calls[0];
      const redacted = args[3];

      expect(redacted.email).toBe('user@example.com');
      expect(redacted.password).toBe('********');
      expect(redacted.token).toBe('********');
      expect(redacted.apiKey).toBe('********');
      expect(redacted.profile.creditCard).toBe('********');
      expect(redacted.profile.cvv).toBe('****');
      expect(redacted.profile.other).toBe('safeValue');
    });

    it('should handle circular references', () => {
      const obj: any = { password: 'pass' };
      obj.self = obj;

      Logsy.log('Circular test', obj);

      const args = mockLog.mock.calls[0];
      const redacted = args[3];

      expect(redacted.password).toBe('********');
      expect(redacted.self).toBe('[CIRCULAR]');
    });

    it('should process arrays with sensitive fields', () => {
      const payload = [
        { token: 'tok1' },
        { password: 'pass2', note: 'hi' },
      ];

      Logsy.info('Array test', payload);

      const redacted = mockInfo.mock.calls[0][3];

      expect(redacted[0].token).toBe('********');
      expect(redacted[1].password).toBe('********');
      expect(redacted[1].note).toBe('hi');
    });

    it('should keep primitives as is', () => {
      Logsy.log('Primitives test', 123);

      const redacted = mockLog.mock.calls[0][3];

      expect(redacted).toBe(123);
    });

    it('should redact deep nested sensitive keys', () => {
      const payload = {
        level1: {
          level2: {
            apiKey: 'deepsecret',
            meta: 'ok',
          },
        },
      };

      Logsy.info('Nested test', payload);

      const redacted = mockInfo.mock.calls[0][3];

      expect(redacted.level1.level2.apiKey).toBe('********');
      expect(redacted.level1.level2.meta).toBe('ok');
    });

    it('should not redact keys that are not in the default list', () => {
      const payload = {
        username: 'testuser',
        age: 25,
      };

      Logsy.info('Non-sensitive test', payload);

      const redacted = mockInfo.mock.calls[0][3];

      expect(redacted).toEqual(payload);
    });

    it('should redact known object types like Date and RegExp', () => {
      const payload = {
        created: new Date('2023-01-01'),
        regex: /abc/,
      };

      Logsy.log('Special objects', payload);

      const redacted = mockLog.mock.calls[0][3];

      expect(typeof redacted.created).toBe('string');
      expect(redacted.regex).toBe('/abc/');
    });

    it('should handle Map and Set with placeholder text', () => {
      const payload = {
        tokens: new Set(['a', 'b']),
        mapData: new Map([['x', 1]]),
      };

      Logsy.info('MapSet test', payload);

      const redacted = mockInfo.mock.calls[0][3];

      expect(redacted.tokens).toBe('[Set]');
      expect(redacted.mapData).toBe('[Map]');
    });

    it('should limit recursion by depth', () => {
      const deep = {} as any;
      let current = deep;
      for (let i = 0; i < 101; i++) {
        current.next = {};
        current = current.next;
      }

      Logsy.log('Deep object test', deep);

      const redacted = mockLog.mock.calls[0][3];
      let walker: any = redacted;
      for (let i = 0; i < 100; i++) {
        walker = walker.next;
      }

      expect(walker.next).toBe('[MAX_DEPTH_REACHED]');
    });
});