import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HorseHeadIcon, HorseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useState } from "react";
import { definePluginApp, useComposer, useRealtime, useRpc } from "@get-bb/plugin-sdk/app";
import { toast } from "sonner";
import { ponytailModes, type PonytailMode } from "./modes.ts";
import { ponytailMessageMode } from "./mode-message.ts";
import type { rpcContract } from "./server.ts";
import "./app.css";

const descriptions: Record<PonytailMode, string> = {
  off: "Disable Ponytail",
  lite: "Build it, mention the lazier path",
  full: "The practical default ladder",
  ultra: "YAGNI with the reins off",
};

let cachedAvailability: boolean | null = null;

function ModeIcon({ mode, size = 20 }: { mode: PonytailMode; size?: number }) {
  const icon = mode === "off" || mode === "lite" ? HorseHeadIcon : HorseIcon;
  if (mode === "ultra") {
    return (
      <span className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_2px_color-mix(in_srgb,var(--primary)_20%,transparent),0_0_10px_color-mix(in_srgb,var(--primary)_45%,transparent)]">
        <HugeiconsIcon icon={HorseHeadIcon} size={Math.min(size, 18)} strokeWidth={2.5} aria-hidden="true" />
        <span aria-hidden="true" className="absolute -right-0.5 -top-1 text-[9px] text-primary">✦</span>
      </span>
    );
  }
  return (
    <span className="relative inline-flex shrink-0">
      <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} className={mode === "off" ? "opacity-45" : ""} aria-hidden="true" />
      {mode === "off" ? <span aria-hidden="true" className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" /> : null}
    </span>
  );
}

function ManeControl() {
  const composer = useComposer();
  const rpc = useRpc<typeof rpcContract>();
  const threadId = composer.scope.kind === "thread" ? composer.scope.threadId : null;
  const [mode, setMode] = useState<PonytailMode>("full");
  const [pending, setPending] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(cachedAvailability);
  const [open, setOpen] = useState(false);
  const ready = available === true;

  const refresh = useCallback(() => {
    if (threadId === null) return;
    rpc.call("get_mode", { threadId }).then(({ mode: current, available: found }) => {
      setMode(current);
      cachedAvailability = found;
      setAvailable(found);
    }, () => {
      cachedAvailability = false;
      setAvailable(false);
    });
  }, [rpc, threadId]);

  useEffect(refresh, [refresh]);
  useEffect(() => {
    if (!ready) setOpen(false);
  }, [ready]);
  useRealtime("mode-changed", refresh);

  const choose = async (next: PonytailMode) => {
    if (threadId === null || pending || next === mode) return;
    if (available === false) {
      toast.error("Ponytail is required. Install and enable it before using Mane Control.");
      return;
    }
    setPending(true);
    try {
      const result = await rpc.call("set_mode", { threadId, mode: next });
      setMode(result.mode);
      toast.success(`Ponytail ${result.mode === "off" ? "off" : `set to ${result.mode}`}`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Could not change Ponytail mode");
    } finally {
      setPending(false);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={(next) => setOpen(ready && next)}>
      <DropdownMenu.Trigger asChild>
        <button type="button" disabled={pending || !ready} aria-label={!ready ? "Ponytail required" : `Ponytail mode: ${mode}`} title={!ready ? "Install Ponytail to use Mane Control" : `Ponytail: ${mode}`} className="inline-flex h-8 items-center gap-1 rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          <ModeIcon mode={ready ? mode : "off"} />
          <span className="text-[10px] font-semibold uppercase">{ready ? mode : "required"}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="top" align="end" sideOffset={8} className="z-50 min-w-56 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md">
          <DropdownMenu.Label className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Ponytail mode</DropdownMenu.Label>
          {ponytailModes.map((candidate) => (
            <DropdownMenu.Item key={candidate} onSelect={() => void choose(candidate)} className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground">
              <ModeIcon mode={candidate} size={18} />
              <div>
                <div className="text-sm font-medium capitalize">{candidate}</div>
                <div className="text-xs text-muted-foreground">{descriptions[candidate]}</div>
              </div>
              <span aria-hidden="true" className="ml-auto w-3 text-sm">{candidate === mode ? "✓" : ""}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default definePluginApp((app) => {
  app.contentScripts.register({
    id: "style-mode-messages",
    mount({ signal }) {
      const decorate = (root: ParentNode) => {
        const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
        for (const element of elements) {
          if (element.closest("button, textarea, [contenteditable='true']")) continue;
          const mode = ponytailMessageMode(element.textContent ?? "");
          if (mode === null) continue;
          const childHasExactCommand = [...element.children].some((child) => ponytailMessageMode(child.textContent ?? "") !== null);
          if (!childHasExactCommand) {
            element.setAttribute("data-mane-control-message", mode);
            if (element instanceof HTMLElement) {
              element.style.setProperty("--mane-control-icon", `url(/api/v1/plugins/mane-control/assets/icons/${mode}.svg)`);
            }
          }
        }
      };

      decorate(document.body);
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (node instanceof Element) decorate(node);
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      signal.addEventListener("abort", () => observer.disconnect(), { once: true });
      return () => {
        observer.disconnect();
        document.querySelectorAll("[data-mane-control-message]").forEach((element) => {
          element.removeAttribute("data-mane-control-message");
          if (element instanceof HTMLElement) element.style.removeProperty("--mane-control-icon");
        });
      };
    },
  });

  app.composer.customize({
    id: "mane-control",
    scopes: ["thread"],
    actions: [{ id: "ponytail-mode", component: ManeControl }],
  });
});
