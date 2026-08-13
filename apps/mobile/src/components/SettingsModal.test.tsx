import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { defaultSettings } from "@landlord/core";
import "../i18n";
import { SettingsModal } from "./SettingsModal";

describe("SettingsModal", () => {
  it("changes the date period and saves settings", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsModal visible settings={defaultSettings} onSave={onSave} onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Weekly" }));
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith({ ...defaultSettings, defaultDatePeriod: "weekly" });
  });
});
