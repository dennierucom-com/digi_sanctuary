import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWAInstall } from '../../src/hooks/usePWAInstall';

describe('usePWAInstall', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => usePWAInstall());
    
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
    expect(typeof result.current.promptInstall).toBe('function');
  });

  it('should become installable when beforeinstallprompt is triggered', () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const eventParams = {
      preventDefault: vi.fn(),
    };
    
    act(() => {
      // Simulate the beforeinstallprompt event
      const event = new Event('beforeinstallprompt');
      Object.assign(event, eventParams);
      window.dispatchEvent(event);
    });

    expect(result.current.isInstallable).toBe(true);
  });

  it('should trigger prompt when promptInstall is called', async () => {
    const { result } = renderHook(() => usePWAInstall());
    
    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });
    
    act(() => {
      const event = new Event('beforeinstallprompt') as any;
      event.preventDefault = vi.fn();
      event.prompt = mockPrompt;
      event.userChoice = mockUserChoice;
      window.dispatchEvent(event);
    });

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(mockPrompt).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(false);
  });
  
  it('should update state when appinstalled is triggered', () => {
    const { result } = renderHook(() => usePWAInstall());
    
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });
});
