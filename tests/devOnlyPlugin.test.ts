import Logsy from '../src/Logsy';
import devOnlyPlugin from '../src/plugins/devOnlyPlugin';

const mockLog = jest.fn();
global.console.log = mockLog;

describe('devOnlyPlugin', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        (Logsy as any)['plugins'] = [];
        global.console.log = mockLog;
    });

    it('should not log anything in production mode', () => {
        process.env.NODE_ENV = 'production';
        Logsy.use(devOnlyPlugin);
        Logsy.log('This should not appear');
        expect(mockLog).not.toHaveBeenCalled();
    });

    it('should log in development mode', () => {
        process.env.NODE_ENV = 'development';
        Logsy.use(devOnlyPlugin);
        Logsy.log('This should appear');
        expect(mockLog).toHaveBeenCalled();
    });

    it('should not log anything if process is undefined', () => {
        process = undefined as any;
        Logsy.use(devOnlyPlugin);
        Logsy.log('This should not appear');
        expect(mockLog).not.toHaveBeenCalled();
    });
});