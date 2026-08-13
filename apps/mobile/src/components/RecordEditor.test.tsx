import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { type BillingRecord } from "@landlord/core";
import "../i18n";
import { RecordEditor } from "./RecordEditor";

const record: BillingRecord = {
  id: "record-1",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  waterMeterStart: 100,
  waterMeterEnd: 112,
  waterUnitPrice: 3.5,
  electricMeterStart: 200,
  electricMeterEnd: 225,
  electricUnitPrice: 0.6,
  extraFee: 10,
};

describe("RecordEditor", () => {
  it("renders calculated totals and exposes record actions", async () => {
    const user = userEvent.setup();
    const onPreview = vi.fn();
    const onDelete = vi.fn();
    render(<RecordEditor record={record} onChange={vi.fn()} onPreview={onPreview} onDelete={onDelete} />);

    expect(screen.getByText("¥67.00")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Preview Image" }));
    await user.click(screen.getByRole("button", { name: "Delete record" }));
    expect(onPreview).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("commits edited numeric fields", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RecordEditor record={record} onChange={onChange} onPreview={vi.fn()} onDelete={vi.fn()} />);
    const input = screen.getByLabelText("Water Price");
    await user.clear(input);
    await user.type(input, "4.25");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith({ ...record, waterUnitPrice: 4.25 });
  });
});

