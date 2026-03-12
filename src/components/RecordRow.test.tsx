import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import html2canvas from 'html2canvas';
import { RecordRow } from './RecordRow';
import i18n from '../i18n';
import type { Record } from '../types';

const runtimeState = vi.hoisted(() => ({ isWechat: false }));

vi.mock('../runtime/wechat', () => ({
  isWechatRuntime: () => runtimeState.isWechat,
}));

vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

const record: Record = {
  id: 'record-1',
  startDate: '2026-02-01',
  endDate: '2026-02-28',
  waterMeterStart: 100,
  waterMeterEnd: 130,
  waterUnitPrice: 3.5,
  electricMeterStart: 500,
  electricMeterEnd: 560,
  electricUnitPrice: 0.6,
  extraFee: 10,
};

describe('RecordRow', () => {
  const openMock = vi.fn();
  const alertMock = vi.fn();
  let anchorClickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    runtimeState.isWechat = false;
    vi.clearAllMocks();
    Object.defineProperty(window, 'open', {
      writable: true,
      value: openMock,
    });
    Object.defineProperty(window, 'alert', {
      writable: true,
      value: alertMock,
    });
    anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    vi.mocked(html2canvas).mockResolvedValue({
      toDataURL: () => 'data:image/png;base64,mock',
    } as unknown as HTMLCanvasElement);
  });

  it('downloads image directly on web runtime', async () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <RecordRow
            record={record}
            unitName="Unit A"
            onChange={vi.fn()}
            onDelete={vi.fn()}
          />
        </I18nextProvider>
      </ChakraProvider>
    );

    await userEvent.click(screen.getByTitle('Preview Image'));
    await userEvent.click(await screen.findByRole('button', { name: /download as image/i }));

    await waitFor(() => {
      expect(anchorClickSpy).toHaveBeenCalledTimes(1);
    });
    expect(openMock).not.toHaveBeenCalled();
    expect(alertMock).not.toHaveBeenCalled();
  });

  it('uses WeChat fallback for image download on wechat runtime', async () => {
    runtimeState.isWechat = true;

    render(
      <ChakraProvider value={defaultSystem}>
        <I18nextProvider i18n={i18n}>
          <RecordRow
            record={record}
            unitName="Unit A"
            onChange={vi.fn()}
            onDelete={vi.fn()}
          />
        </I18nextProvider>
      </ChakraProvider>
    );

    await userEvent.click(screen.getByTitle('Preview Image'));
    await userEvent.click(await screen.findByRole('button', { name: /download as image/i }));

    await waitFor(() => {
      expect(openMock).toHaveBeenCalledWith('data:image/png;base64,mock', '_blank', 'noopener,noreferrer');
    });
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(anchorClickSpy).not.toHaveBeenCalled();
  });
});
