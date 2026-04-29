"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

interface BillingInfo {
  plan: string;
  subscription: {
    status: string;
    current_period_end: number;
  } | null;
}

export default function Billing() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function fetchBilling() {
    const res = await fetch("/api/billing");
    const data = await res.json();
    setBilling(data);
  }

  useEffect(() => {
    fetchBilling();
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      fetchBilling();
      Swal.fire({
        icon: "success",
        title: "Payment successful!",
        text: "Your plan has been upgraded.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.replace("/dashboard/billing");
    }

    if (searchParams.get("canceled") === "true") {
      Swal.fire({
        icon: "error",
        title: "Payment canceled",
        timer: 2000,
        showConfirmButton: false,
      });
      router.replace("/dashboard/billing");
    }
  }, [searchParams]);

  async function handleUpgrade(plan: string) {
    try {
      setLoadingPlan(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1THkftAWhKURbcQixQFmDx5W", // monthly only
          plan: "pro",
          successUrl: `${window.location.origin}/dashboard/billing?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
        }),
      });

      const data = await res.json();

      if (!data.url) {
        Swal.fire("Error", "Payment failed", "error");
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      Swal.fire("Error", "Payment failed", "error");
      setLoadingPlan(null);
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Up to 5 clients",
        "Up to 10 proposals",
        "Basic analytics",
        "Email support",
      ],
      current: billing?.plan === "free",
      buttonText: billing?.plan === "pro" ? "You're using Pro" : "Current Plan",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited clients",
        "Unlimited proposals",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
      ],
      current: billing?.plan === "pro", // ✅ simple check
      buttonText: billing?.plan === "pro" ? "Current Plan" : "Upgrade to Pro",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Billing & Plans
        </h1>
        <p className="text-gray-600">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Active Subscription */}
      {billing?.plan === "pro" && (
        <motion.div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="text-green-600" size={24} />
            <h2 className="text-lg font-semibold text-green-800">
              Active Subscription
            </h2>
          </div>
          <p className="text-green-700">Your Pro plan is active 🚀</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-xl shadow-lg p-8 border-2 relative flex flex-col ${
              plan.current ? "border-indigo-500" : "border-gray-200"
            }`}
          >
            {/* ✅ Only ONE badge */}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-gray-800">
                  {plan.price}
                </span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Check className="text-green-500 shrink-0" size={18} />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.name.toLowerCase())}
              disabled={billing?.plan === "pro" || loadingPlan === plan.name}
              className={`w-full mt-auto py-3 px-6 rounded-lg font-medium transition ${
                billing?.plan === "pro"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loadingPlan === plan.name ? "Processing..." : plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
