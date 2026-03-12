import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { Toolbar } from './Toolbar';
import i18n from '../i18n';
import type { AppData } from '../types';

const runtimeState = vi.hoisted(() => ({ isWechat: false }));

vi.mock('../runtime/wechat', () => ({
  isWechatRuntime: () => runtimeState.isWechat,
}));

const data: AppData = {
  units: [],
  settings: {
    defaultWaterUnitPrice: 3.5,
    defaultElectricUnitPrice: 0.6,
    defaultExtraFee: 10,
    defaultDatePeriod: 'monthly',
  },
};

describe('Toolbar', () => {
  const createObjectUrlMock = vi.fn(() => 'blob:mock-url');
  const revokeObjectUrlMock = vi.fn();
  const openMock = vi.fn();
  const alertMock = vi.fn();
  let anchorClickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    runtimeState.isWechat = false;
    vi.clearAllMocks();
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: createObjectUrlMock,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: revokeObjectUrlMock,
    });
    Object.defineProperty(window, 'open', {
      writable: true,
      value: openMock,
    });
    Object.defineProperty(window, 'alert', {
      writable: true,
      value: alertMock,
    });
    anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    anchorClickSpy.mockRestore();
  });

  it('downloads JSON directly on web runtime', async () => {
    const user = userEvent.setup();

    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <Toolbar data={data} onDataLoad={vi.fn()} />
        </I18nextProvider>
      </ChakraProvider>
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(createObjectUrlMock).toHaveBeenCalledTimes(1);
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
    expect(openMock).not.toHaveBeenCalled();
    expect(alertMock).not.toHaveBeenCalled();
    expect(revokeObjectUrlMock).toHaveBeenCalledTimes(1);
  });

  it('uses WeChat fallback on wechat runtime', async () => {
    runtimeState.isWechat = true;
    const user = userEvent.setup();

    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <Toolbar data={data} onDataLoad={vi.fn()} />
        </I18nextProvider>
      </ChakraProvider>
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(openMock).toHaveBeenCalledWith('blob:mock-url', '_blank', 'noopener,noreferrer');
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(anchorClickSpy).not.toHaveBeenCalled();
  });
});
