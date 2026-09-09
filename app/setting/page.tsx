"use client";

import { type FormEvent, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "../components/AppShell";
import { 
  getErrorMessage, 
  useChangePasswordMutation, 
  useLogoutAllSessionsMutation,
  useLogoutMutation
} from "../lib/auth";
import {
  SettingsOverview,
  useDeleteAccountMutation,
  useResetRestrictionsMutation,
  useSettingsQuery,
  useUpdateRestrictionSettingsMutation,
  useUpdateAccountSettingsMutation,
  useDevicesQuery,
  useRevokeDeviceMutation
} from "../lib/settings";
import { useCancelSubscriptionMutation, useChangeSubscriptionMutation } from "../lib/subscription";
import { useAuthStore } from "../store/auth-store";

const accountItems = [
  { label: "Change Password", icon: "▣", extra: "›" },
  { label: "Two-Factor Authentication", icon: "⬟", extra: "ACTIVE" },
  { label: "Device Management", icon: "▰", extra: "›" },
  { label: "Login Sessions", icon: "◴", extra: "›" }
];

export default function SettingPage() {
  const settingsQuery = useSettingsQuery();
  const resetRestrictions = useResetRestrictionsMutation();
  const deleteAccount = useDeleteAccountMutation();
  const updateRestrictions = useUpdateRestrictionSettingsMutation();
  const changeSubscription = useChangeSubscriptionMutation();
  const cancelSubscription = useCancelSubscriptionMutation();
  const logoutState = useAuthStore((state) => state.logout);
  const backendLogout = useLogoutMutation();
  const router = useRouter();

  const settings = settingsQuery.data;
  const errorMessage = settingsQuery.isError ? getErrorMessage(settingsQuery.error) : null;

  async function handleResetRestrictions() {
    const confirmed = window.confirm("Reset all active restrictions and trade limit?");
    if (!confirmed) return;
    await resetRestrictions.mutateAsync();
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm("Delete your account permanently?");
    if (!confirmed) return;
    await deleteAccount.mutateAsync();
    logoutState();
    router.push("/signup");
  }

  async function handleLogout() {
    try {
      await backendLogout.mutateAsync();
    } catch (error) {
      // Ignore backend error, still proceed with frontend logout
    }
    logoutState();
    router.push("/login");
  }

  return (
    <AppShell>
      <section className="min-h-[calc(100vh-44px)] bg-[#f7f7fb] pb-6 pt-5">
        {errorMessage ? (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="grid content-start gap-[60px]">
            <ProfileCard settings={settings} isLoading={settingsQuery.isLoading} />
            <SubscriptionCard
              cancelPending={cancelSubscription.isPending}
              changePending={changeSubscription.isPending}
              isLoading={settingsQuery.isLoading}
              onCancel={() => cancelSubscription.mutateAsync()}
              onUpgrade={() => changeSubscription.mutateAsync("starter_pro")}
              settings={settings}
            />
          </aside>

          <div className="grid gap-4">
            <BrokerConnections settings={settings} isLoading={settingsQuery.isLoading} />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
              <ActiveRestrictions
                isLoading={settingsQuery.isLoading}
                onUpdate={(input) => updateRestrictions.mutateAsync(input)}
                settings={settings}
                updatePending={updateRestrictions.isPending}
              />
              <AccountSettings settings={settings} />
            </div>
          </div>
        </div>

        <SystemInformation settings={settings} isLoading={settingsQuery.isLoading} />
        <DangerZone
          deletePending={deleteAccount.isPending}
          onDeleteAccount={handleDeleteAccount}
          onLogout={handleLogout}
          onResetRestrictions={handleResetRestrictions}
          resetPending={resetRestrictions.isPending}
        />
      </section>
    </AppShell>
  );
}

function ProfileCard({ settings, isLoading }: { settings?: SettingsOverview; isLoading: boolean }) {
  const user = settings?.user;

  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4">
        <span className="grid size-[50px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#2f65ed] text-xl text-white">
          {user?.avatar ? <img alt={user.name} className="size-full object-cover" src={user.avatar} /> : "◒"}
        </span>
        <div>
          <h2 className="text-[15px] font-medium text-slate-950">{isLoading ? "Loading..." : user?.name ?? "Unknown"}</h2>
          <p className="text-[12px] text-slate-500">{user?.email ?? ""}</p>
          <span className="mt-2 inline-flex rounded-full border border-orange-300 px-2 py-0.5 text-[9px] font-semibold text-orange-500">
            {(user?.subscription ?? "starter").replaceAll("_", " ").toUpperCase()}
          </span>
        </div>
      </div>
      <div className="my-4 border-t border-dashed border-slate-600" />
      <dl className="grid gap-3 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="font-bold text-slate-900">Member Since</dt>
          <dd>{user?.createdAt ? formatDate(user.createdAt) : "--"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-bold text-slate-900">Role</dt>
          <dd>Trader</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-bold text-slate-900">Status</dt>
          <dd>Active</dd>
        </div>
      </dl>
    </article>
  );
}

function SubscriptionCard({
  cancelPending,
  changePending,
  settings,
  isLoading,
  onCancel,
  onUpgrade
}: {
  cancelPending: boolean;
  changePending: boolean;
  settings?: SettingsOverview;
  isLoading: boolean;
  onCancel: () => Promise<unknown>;
  onUpgrade: () => Promise<unknown>;
}) {
  const subscription = settings?.subscription;
  const isStarterPro = subscription?.code === "starter_pro";
  const isCanceled = subscription?.status === "canceled";

  async function handleCancel() {
    const confirmed = window.confirm("Cancel current subscription?");
    if (!confirmed) return;
    await onCancel();
  }

  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] uppercase text-slate-700">Subscription</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-slate-950">{isLoading ? "Loading..." : subscription?.plan ?? "Starter"}</h2>
          <p className="text-sm text-slate-900">
            <span className="text-[#00c773]">${(subscription?.price ?? 9).toFixed(2)}</span> / {subscription?.billingCycle ?? "monthly"}
          </p>
          <p className="text-xs font-semibold text-slate-900">{subscription?.daysLeft ?? "--"} Days left</p>
        </div>
        <span className="text-3xl text-yellow-400">♕</span>
      </div>
      <dl className="mt-9 grid gap-3 text-xs">
        <div className="flex justify-between">
          <dt className="font-bold">Started</dt>
          <dd>{subscription?.startedAt ? formatDate(subscription.startedAt) : "--"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-bold">Expires</dt>
          <dd>{subscription?.expiresAt ? formatDate(subscription.expiresAt) : "--"}</dd>
        </div>
      </dl>
      <button
        className="mt-3 h-8 w-full rounded-[8px] border border-blue-200 text-xs font-medium tracking-wide text-blue-600 disabled:opacity-60"
        disabled={isLoading || changePending || isStarterPro}
        onClick={onUpgrade}
        type="button"
      >
        {changePending ? "UPGRADING..." : isStarterPro ? "UPGRADED" : "UPGRADE"}
      </button>
      <button
        className="mt-2 h-8 w-full rounded-[8px] border border-red-200 text-xs font-medium tracking-wide text-red-500 disabled:opacity-60"
        disabled={isLoading || cancelPending || isCanceled}
        onClick={handleCancel}
        type="button"
      >
        {cancelPending ? "CANCELING..." : isCanceled ? "CANCELED" : "CANCEL"}
      </button>
    </article>
  );
}

function BrokerConnections({ settings, isLoading }: { settings?: SettingsOverview; isLoading: boolean }) {
  const brokers = settings?.brokerConnections.brokers ?? [];

  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-slate-950">Broker Connections</h2>
        <Link className="text-xs font-medium text-blue-600" href="/connect">
          Manage Connections
        </Link>
      </div>
      <div className="grid gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <BrokerConnectionRow
                broker={null}
                key={index}
              />
            ))
          : brokers.slice(0, 3).map((broker) => (
              <BrokerConnectionRow
                broker={broker}
                key={broker.id}
              />
            ))}
      </div>
    </article>
  );
}

function BrokerConnectionRow({
  broker
}: {
  broker: SettingsOverview["brokerConnections"]["brokers"][number] | null;
}) {
  const connected = broker?.status === "connected";

  return (
    <div className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-blue-50 text-blue-600">▥</span>
        <span>
          <strong className="block text-sm font-medium text-slate-900">
            {broker?.displayName ?? "Loading..."}
          </strong>
          <small className="block text-xs text-slate-500">{broker?.subtitle ?? ""}</small>
        </span>
      </div>
      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${connected ? "border-slate-300 text-[#00a852]" : "border-slate-300 text-slate-400"}`}>
        ● {broker?.statusLabel ?? "LOADING"}
      </span>
    </div>
  );
}

function ActiveRestrictions({
  settings,
  isLoading,
  onUpdate,
  updatePending
}: {
  settings?: SettingsOverview;
  isLoading: boolean;
  onUpdate: (input: { maxPositionSize?: number | null; instruments?: string; riskLevel?: string }) => Promise<unknown>;
  updatePending: boolean;
}) {
  const restrictions = settings?.restrictions;
  const tradeLimit = restrictions?.tradeLimit;
  const statusText = restrictions?.status === "locked" ? "LOCKED" : restrictions?.status === "active" ? "ACTIVE" : "INACTIVE";
  const warning = restrictions?.lockoutStatus.locked
    ? restrictions.lockoutStatus.reason
    : tradeLimit?.isEnabled
      ? "Trade limit protection is active"
      : "No active restriction";
  const restrictionItems = [
    { label: "Daily Trade Limit", value: tradeLimit ? `${tradeLimit.dailyLimit} trades` : "Not configured", editable: false as const },
    {
      label: "Max Position Size",
      value: restrictions?.maxPositionSize ? `$${restrictions.maxPositionSize.toLocaleString()}` : "Not configured",
      editable: true as const,
      field: "maxPositionSize" as const
    },
    {
      label: "Instruments",
      value: restrictions?.instruments ?? "Single/Stocks",
      editable: true as const,
      field: "instruments" as const
    },
    {
      label: "Risk Level",
      value: restrictions?.riskLevel ?? "Unknown",
      editable: true as const,
      field: "riskLevel" as const
    }
  ];

  async function handleEdit(field: "maxPositionSize" | "instruments" | "riskLevel") {
    if (field === "maxPositionSize") {
      const currentValue = restrictions?.maxPositionSize?.toString() ?? "";
      const value = window.prompt("Max Position Size", currentValue);
      if (value === null) return;

      const trimmed = value.trim();
      await onUpdate({ maxPositionSize: trimmed ? Number(trimmed) : null });
      return;
    }

    const currentValue = field === "instruments" ? restrictions?.instruments : restrictions?.riskLevel;
    const value = window.prompt(field === "instruments" ? "Instruments" : "Risk Level", currentValue ?? "");
    if (value === null || !value.trim()) return;
    await onUpdate({ [field]: value.trim() });
  }

  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-slate-950">Active Restrictions</h2>
        <span className="rounded-full border border-slate-300 px-3 py-0.5 text-[9px] font-bold text-[#00a852]">
          STATUS: {isLoading ? "LOADING" : statusText}
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {restrictionItems.map((item) => (
          <button
            className="rounded-[8px] border border-slate-200 bg-white p-3 text-left shadow-sm transition enabled:hover:border-blue-200 enabled:hover:bg-blue-50 disabled:cursor-default disabled:opacity-80"
            disabled={!item.editable || updatePending}
            key={item.label}
            onClick={() => item.editable ? handleEdit(item.field) : undefined}
            type="button"
          >
            <p className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{item.label}</span>
              {item.editable ? <span className="text-blue-500">{updatePending ? "Saving..." : "Edit"}</span> : null}
            </p>
            <strong className="mt-1 block text-sm font-medium text-black">{item.value}</strong>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-[7px] border border-orange-300 bg-orange-100 px-3 py-3 text-sm text-red-500">
        ⚠ {warning}
      </div>
    </article>
  );
}

function AccountSettings({ settings }: { settings?: SettingsOverview }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [twoFactorModal, setTwoFactorModal] = useState<{
    open: boolean;
    nextValue: boolean;
    password: string;
    error: string | null;
  }>({ open: false, nextValue: false, password: "", error: null });
  const changePassword = useChangePasswordMutation();
  const updateAccountSettings = useUpdateAccountSettingsMutation();
  const logoutAllSessions = useLogoutAllSessionsMutation();
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [logoutSessionsModalOpen, setLogoutSessionsModalOpen] = useState(false);
  const devicesQuery = useDevicesQuery();
  const revokeDevice = useRevokeDeviceMutation();

  function handleItemClick(label: string) {
    if (label === "Change Password") {
      setIsPasswordModalOpen(true);
    } else if (label === "Two-Factor Authentication") {
      const current = settings?.accountSettings.twoFactorAuthentication ?? false;
      setTwoFactorModal({
        open: true,
        nextValue: !current,
        password: "",
        error: null
      });
    } else if (label === "Device Management") {
      setIsDeviceModalOpen(true);
    } else if (label === "Login Sessions") {
      const activeSessions = settings?.accountSettings.loginSessions ?? 1;
      if (activeSessions <= 1) {
        window.alert("You only have 1 active session.");
        return;
      }
      setLogoutSessionsModalOpen(true);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      window.alert("Passwords do not match!");
      return;
    }

    try {
      await changePassword.mutateAsync(passwordForm);
      window.alert("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  }

  async function handleTwoFactorSubmit(e: FormEvent) {
    e.preventDefault();
    setTwoFactorModal((current) => ({ ...current, error: null }));

    try {
      await updateAccountSettings.mutateAsync({
        twoFactorAuthentication: twoFactorModal.nextValue,
        password: twoFactorModal.password
      });
      setTwoFactorModal({ open: false, nextValue: false, password: "", error: null });
    } catch (error) {
      setTwoFactorModal((current) => ({
        ...current,
        error: getErrorMessage(error)
      }));
    }
  }

  return (
    <>
      <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <h2 className="mb-3 text-xl font-medium text-slate-950">Account settings</h2>
      <div className="grid gap-1.5">
        {accountItems.map((item) => {
          const extra = item.label === "Two-Factor Authentication"
            ? settings?.accountSettings.twoFactorAuthentication ? "ACTIVE" : "OFF"
            : item.label === "Login Sessions"
              ? `${settings?.accountSettings.loginSessions ?? 1}`
              : item.extra;

          return (
            <button 
              className="flex min-h-10 items-center justify-between rounded-[8px] bg-white px-3 text-left text-sm shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 disabled:opacity-50" 
              type="button" 
              key={item.label}
              onClick={() => handleItemClick(item.label)}
              disabled={
                (item.label === "Change Password" && changePassword.isPending) ||
                (item.label === "Two-Factor Authentication" && updateAccountSettings.isPending) ||
                (item.label === "Login Sessions" && logoutAllSessions.isPending)
              }
            >
              <span className="flex items-center gap-3">
                <span className="text-slate-500">{item.icon}</span>
                {item.label}
              </span>
              <span className={extra === "ACTIVE" || extra === "OFF" ? "rounded-full border border-slate-300 px-2 py-0.5 text-[9px] font-bold text-[#00a852]" : "text-xl text-slate-500"}>
                {extra}
              </span>
            </button>
          );
        })}
      </div>
      </article>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm rounded-[12px] bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Old Password</label>
                <input
                  type="password"
                  required
                  className="w-full rounded-[6px] border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full rounded-[6px] border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full rounded-[6px] border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-[6px] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="rounded-[6px] bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  {changePassword.isPending ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {twoFactorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm rounded-[12px] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              {twoFactorModal.nextValue ? "Enable Two-Factor Authentication" : "Disable Two-Factor Authentication"}
            </h3>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Security change confirm korte current password din.
            </p>

            <form className="mt-5 grid gap-4" onSubmit={handleTwoFactorSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Current Password</label>
                <input
                  autoFocus
                  className="w-full rounded-[6px] border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setTwoFactorModal((current) => ({ ...current, password: e.target.value }))}
                  required
                  type="password"
                  value={twoFactorModal.password}
                />
              </div>

              {twoFactorModal.error ? (
                <p className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {twoFactorModal.error}
                </p>
              ) : null}

              <div className="mt-2 flex justify-end gap-3">
                <button
                  className="rounded-[6px] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => setTwoFactorModal({ open: false, nextValue: false, password: "", error: null })}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-[6px] bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                  disabled={updateAccountSettings.isPending}
                  type="submit"
                >
                  {updateAccountSettings.isPending
                    ? "Checking..."
                    : twoFactorModal.nextValue
                      ? "Enable"
                      : "Disable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Management Modal */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold">Device Management</h3>
            {devicesQuery.isLoading ? (
              <p className="py-4 text-center text-slate-500">Loading devices...</p>
            ) : devicesQuery.isError ? (
              <p className="py-4 text-center text-red-500">Failed to load devices.</p>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div className="flex flex-col gap-3">
                  {devicesQuery.data?.map((device) => (
                    <div key={device.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                      <div>
                        <div className="font-medium text-slate-900">{device.device}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          IP: {device.ipAddress || "Unknown"} • Active {new Date(device.lastActive).toLocaleString()}
                        </div>
                      </div>
                      <button
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to revoke this session?")) {
                            revokeDevice.mutate(device.id);
                          }
                        }}
                        disabled={revokeDevice.isPending}
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                  {devicesQuery.data?.length === 0 && (
                    <p className="text-center text-sm text-slate-500">No active devices found.</p>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
                onClick={() => setIsDeviceModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout All Sessions Modal */}
      {logoutSessionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-xl font-bold">Logout Other Sessions</h3>
            <p className="mb-6 text-sm text-slate-500">
              You currently have {settings?.accountSettings.loginSessions} active sessions. Are you sure you want to securely log out of all other devices?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200"
                onClick={() => setLogoutSessionsModalOpen(false)}
                disabled={logoutAllSessions.isPending}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                onClick={() => {
                  logoutAllSessions.mutateAsync()
                    .then(() => {
                      setLogoutSessionsModalOpen(false);
                      window.alert("Successfully logged out of all other devices.");
                    })
                    .catch((err) => window.alert(getErrorMessage(err)));
                }}
                disabled={logoutAllSessions.isPending}
              >
                {logoutAllSessions.isPending ? "Logging out..." : "Logout All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 

function SystemInformation({ settings, isLoading }: { settings?: SettingsOverview; isLoading: boolean }) {
  const systemInfo = [
    ["OS", settings?.system.os ?? "--"],
    ["Version", settings?.system.version ?? "--"],
    ["Last Login", settings?.system.lastLogin ? formatDateTime(settings.system.lastLogin) : "Today"],
    ["Account Type", settings?.system.accountType ?? "Professional Trader (Active)"]
  ];

  return (
    <article className="mt-4 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <h2 className="text-[15px] font-medium text-slate-950">System Information</h2>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {systemInfo.map(([label, value]) => (
          <div className="rounded-[7px] border border-slate-200 bg-[#f7f7fb] px-3 py-3" key={label}>
            <p className="text-[11px] text-slate-400">{label}</p>
            <strong className="mt-1 block text-sm font-medium text-slate-900">{isLoading ? "Loading..." : value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function DangerZone({
  deletePending,
  onDeleteAccount,
  onLogout,
  onResetRestrictions,
  resetPending
}: {
  deletePending: boolean;
  onDeleteAccount: () => void;
  onLogout: () => void;
  onResetRestrictions: () => void;
  resetPending: boolean;
}) {
  return (
    <article className="mt-4 rounded-[8px] bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <h2 className="text-sm font-bold text-red-500">⚠ Danger Zone</h2>
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <button className="min-h-[60px] rounded-[7px] border border-orange-200 bg-orange-50 px-4 text-left disabled:opacity-60" disabled={resetPending} onClick={onResetRestrictions} type="button">
          <strong className="block text-sm font-medium text-orange-500">⊘ {resetPending ? "Resetting..." : "Reset All Restrictions"}</strong>
          <span className="text-xs text-slate-500">Align all active locks & trade limits. Action can't be undone.</span>
        </button>
        <button className="min-h-[60px] rounded-[7px] border border-red-200 bg-red-50 px-4 text-left disabled:opacity-60" disabled={deletePending} onClick={onDeleteAccount} type="button">
          <strong className="block text-sm font-medium text-red-500">▣ {deletePending ? "Deleting..." : "Delete Account"}</strong>
          <span className="text-xs text-slate-500">Permanently removes profile and all trading history.</span>
        </button>
        <button className="min-h-[60px] rounded-[7px] border border-blue-200 bg-blue-50 px-4 text-left" onClick={onLogout} type="button">
          <strong className="block text-sm font-medium text-blue-600">↪ Logout</strong>
          <span className="text-xs text-slate-500">Disconnects all sessions and returns to login screen.</span>
        </button>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA").format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
