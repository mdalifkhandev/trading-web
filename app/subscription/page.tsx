"use client";

import { AppShell } from "../components/AppShell";
import { getErrorMessage } from "../lib/auth";
import {
  SubscriptionPlan,
  useCancelSubscriptionMutation,
  useChangeSubscriptionMutation,
  useSubscriptionQuery
} from "../lib/subscription";

const fallbackPlans: SubscriptionPlan[] = [
  {
    code: "starter",
    name: "Starter",
    price: 9,
    billingCycle: "monthly",
    description: "For Individual traders building a basic workflow.",
    features: ["1 broker connection", "Core risk dashboard", "5GB cloud storage", "Email support"],
    selected: false
  },
  {
    code: "starter_pro",
    name: "Starter Pro",
    price: 15,
    billingCycle: "monthly",
    description: "For active traders who need more automation.",
    features: ["3 broker connections", "Advanced guardrails", "25GB cloud storage", "Priority support"],
    selected: true,
    popular: true
  },
  {
    code: "enterprise",
    name: "Enterprise",
    price: 35,
    billingCycle: "monthly",
    description: "For teams managing multiple desks and accounts.",
    features: ["Unlimited connections", "Team policy controls", "More Broker Connection", "Dedicated onboarding"],
    selected: false
  }
];

export default function SubscriptionPage() {
  const subscriptionQuery = useSubscriptionQuery();
  const changeSubscription = useChangeSubscriptionMutation();
  const cancelSubscription = useCancelSubscriptionMutation();
  const plans = subscriptionQuery.data?.plans ?? fallbackPlans;
  const current = subscriptionQuery.data?.current;
  const selectedPlan = plans.find((plan) => plan.selected);
  const errorMessage = subscriptionQuery.isError ? getErrorMessage(subscriptionQuery.error) : null;

  async function handleChoosePlan(planCode: SubscriptionPlan["code"], selected: boolean) {
    if (selected) return;
    await changeSubscription.mutateAsync(planCode);
  }

  async function handleBillingPortal() {
    if (!current || current.status === "canceled") return;
    const confirmed = window.confirm("Cancel current subscription?");
    if (!confirmed) return;
    await cancelSubscription.mutateAsync();
  }

  return (
    <AppShell>
      <section className="min-h-[calc(100vh-44px)] bg-[#f7f7fb] pb-8 pt-9">
        <div className="mx-auto w-full max-w-[1160px]">
          <div className="mb-5 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[32px] font-medium leading-tight tracking-normal text-[#101827]">
                Subscription
              </h1>
              <p className="mt-2 text-[15px] text-[#667085]">
                Manage plan access, billing limits, and trading workspace capacity.
              </p>
              {errorMessage ? <p className="mt-2 text-sm text-red-500">{errorMessage}</p> : null}
            </div>

            <div className="mr-0 hidden min-h-[56px] items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-4 shadow-[0_8px_18px_rgba(15,23,42,0.06)] md:flex">
              <span className="grid size-9 place-items-center rounded-full bg-blue-50 text-yellow-400">★</span>
              <span>
                <small className="block text-xs text-slate-500">Current Plan</small>
                <strong className="block text-sm font-medium text-slate-900">{selectedPlan?.name ?? "Loading..."}</strong>
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                className={
                  plan.selected
                    ? "relative rounded-[16px] border-2 border-[#2f65ed] bg-white p-5 shadow-[0_8px_18px_rgba(47,101,237,0.08)]"
                    : "rounded-[16px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                }
                key={plan.code}
              >
                {plan.popular ? (
                  <span className="absolute right-5 top-5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-blue-600">
                    Popular
                  </span>
                ) : null}
                <h2 className="text-xl font-medium text-slate-950">{plan.name}</h2>
                <div className="mt-3 flex items-end">
                  <strong className="text-[38px] font-medium leading-none text-slate-950">${plan.price}</strong>
                  <span className="mb-1 text-sm text-slate-500">/mo</span>
                </div>
                <p className="mt-3 min-h-[40px] text-[15px] leading-5 text-slate-500">{plan.description}</p>
                <div className="my-4 border-t border-slate-200" />
                <ul className="grid gap-3 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li className="flex items-center gap-3" key={feature}>
                      <span
                        className={
                          plan.selected
                            ? "grid size-3.5 place-items-center rounded-full bg-[#2f65ed] text-[9px] font-bold text-white"
                            : "grid size-3.5 place-items-center rounded-full bg-teal-600 text-[9px] font-bold text-white"
                        }
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={
                    plan.selected
                      ? "mt-4 h-10 w-full rounded-full bg-[#2f65ed] text-sm font-medium text-white disabled:opacity-70"
                      : "mt-4 h-10 w-full rounded-full border border-slate-300 bg-neutral-100 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-70"
                  }
                  disabled={changeSubscription.isPending || subscriptionQuery.isLoading || plan.selected}
                  onClick={() => handleChoosePlan(plan.code, plan.selected)}
                  type="button"
                >
                  {plan.selected ? "Selected" : changeSubscription.isPending ? "Saving..." : "Choose Plan"}
                </button>
              </article>
            ))}
          </div>

          <div className="mt-4 flex min-h-[52px] items-center justify-between gap-4 rounded-[8px] border border-slate-200 bg-white px-5 shadow-sm">
            <p className="flex items-center gap-3 text-[13px] text-slate-500">
              <span className="text-blue-600">▣</span>
              Billing changes are encrypted and applied at the next renewal unless upgraded immediately.
            </p>
            <button
              className="h-8 rounded-[7px] border border-blue-600 px-5 text-sm font-medium text-blue-600 disabled:opacity-60"
              disabled={!current || cancelSubscription.isPending}
              onClick={handleBillingPortal}
              type="button"
            >
              {cancelSubscription.isPending ? "Canceling..." : current?.status === "canceled" ? "Canceled" : "Billing Portal"}
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
