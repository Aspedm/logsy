import { Logsy, LogTags } from '../src';

// Mock LOG_METHODS directly
const mockLog = jest.fn();
const mockInfo = jest.fn();
const mockWarn = jest.fn();
const mockError = jest.fn();
const mockClear = jest.fn();

// Override the console methods with mocks
global.console = {
  ...global.console,
  log: mockLog,
  info: mockInfo,
  warn: mockWarn,
  error: mockError,
  clear: mockClear,
};

describe('Logsy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log a message with default style', () => {
    Logsy.log('Test message');
    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining('%cDEV MODE MESSAGE%cTest message'),
      expect.any(String),
      'color: inherit',
    );
  });

  it('should log a message with custom options', () => {
    const options = {
      logsy: true,
      style: 'color: purple',
      label: LogTags.INFO,
    };
    Logsy.log('Custom message', options);
    expect(mockLog).toHaveBeenCalledWith(
      '%cINFO%cCustom message',
      'color: purple',
      'color: inherit',
    );
  });

  it('should handle additional primitive arguments', () => {
    const additionalArgs = ['arg1', 123, true];
    Logsy.log('Test message', ...additionalArgs);
    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining('Test message'),
      expect.any(String),
      'color: inherit',
      ...additionalArgs,
    );
  });

  it('should log info message', () => {
    Logsy.info('Info message');
    expect(mockInfo).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%cInfo message',
      expect.any(String),
      'color: inherit',
    );
  });

  it('should log warning message', () => {
    Logsy.warn('Warning message');
    expect(mockWarn).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%cWarning message',
      expect.any(String),
      'color: inherit',
    );
  });

  it('should log error message', () => {
    Logsy.error('Error message');
    expect(mockError).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%cError message',
      expect.any(String),
      'color: inherit',
    );
  });

  it('should handle message with custom tag', () => {
    Logsy.log('Test message', { logsy: true, label: LogTags.WARNING });
    expect(mockLog).toHaveBeenCalledWith(
      '%cWARNING%cTest message',
      expect.any(String),
      'color: inherit',
    );
  });

  it('should handle custom style', () => {
    const customStyle = 'background: red; color: white;';
    Logsy.log('Style message', { logsy: true, style: customStyle });
    expect(mockLog).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%cStyle message',
      customStyle,
      'color: inherit',
    );
  });

  it('should parse args correctly when no message is provided but options are', () => {
    const options = { logsy: true, style: 'color: red', label: LogTags.ERROR };
    Logsy.log(options);
    expect(mockLog).toHaveBeenCalledWith(
      '%cERROR%c',
      'color: red',
      'color: inherit',
    );
  });

  it('should treat object with style property as options and pass subsequent args as data', () => {
    const dataArg = 'extra arg';
    Logsy.log('With options and args', { logsy: true, style: 'color: blue' }, dataArg);
    expect(mockLog).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%cWith options and args',
      'color: blue',
      'color: inherit',
      dataArg,
    );
  });

  // Новые кейсы для «чистого» объекта и массива без ключей options
  it('should pass plain object as data when no option keys are present', () => {
    const plainObj = { foo: 'bar' };
    Logsy.log(plainObj);
    expect(mockLog).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%c',
      expect.any(String),
      'color: inherit',
      plainObj,
    );
  });

  it('should pass arrays as data when no message string is provided', () => {
    const arr = [1, 2, 3];
    Logsy.info(arr);
    expect(mockInfo).toHaveBeenCalledWith(
      '%cDEV MODE MESSAGE%c',
      expect.any(String),
      'color: inherit',
      arr,
    );
  });

  describe('spinner', () => {
    let mockPromise: Promise<string>;

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should show spinner while promise is pending and then success', async () => {
      let resolvePromise!: (value: string) => void;
      mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      const spinnerPromise = Logsy.spinner('Loading...', mockPromise);

      jest.advanceTimersByTime(200);
      expect(mockClear).toHaveBeenCalled();
      expect(mockLog).toHaveBeenCalled();

      resolvePromise('success');
      const result = await spinnerPromise;
      expect(result).toBe('success');

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ Loading...'),
        expect.any(String),
        'color: inherit',
        'success',
      );
    });

    it('should handle promise rejection and return undefined', async () => {
      let rejectPromise!: (reason?: any) => void;
      mockPromise = new Promise((_, reject) => {
        rejectPromise = reject;
      });

      const spinnerPromise = Logsy.spinner('Loading...', mockPromise);

      jest.advanceTimersByTime(200);
      rejectPromise!(new Error('Failed'));
      await expect(spinnerPromise).resolves.toBeUndefined();

      expect(mockError).toHaveBeenCalledWith(
        expect.stringContaining('❌ Loading...'),
        expect.any(String),
        'color: inherit',
        expect.any(Error),
      );
    });

    it('should use custom options for spinner frames and final output', async () => {
      let resolvePromise!: (value: string) => void;
      mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      const options = {
        logsy: true,
        label: LogTags.DEBUG,
        style: 'color: orange',
      };

      Logsy.spinner('Custom spinner', mockPromise, options);
      jest.advanceTimersByTime(200);

      expect(mockLog).toHaveBeenCalledWith(
        expect.stringContaining('%cDEBUG%c'),
        'color: orange',
        'color: inherit',
      );

      resolvePromise('done');
      await mockPromise;
    });
  });
});