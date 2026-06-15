import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Key,
  ListFilter,
  Pencil,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";

// ─── Provider types ───────────────────────────────────────────────────────────

type ApiKeyConfig = {
  provider: string;
  testPublicKey: string;
  testSecretKey: string;
  livePublicKey: string;
  liveSecretKey: string;
};

type EnvModal = {
  open: boolean;
  provider: string;
  environment: "sandbox" | "live";
  secretKey: string;
  originalKey: string;
  isEdit: boolean;
  isFixed?: boolean;
  grantType?: string;
  clientId?: string;
  clientSecret?: string;
  accountId?: string;
};

// ─── Policy + Rule types ──────────────────────────────────────────────────────

type Policy = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  created_at?: string;
};

type PolicyConditionType = "time_of_day" | "amount_range" | "currency";

type ConditionItem = {
  _id: string;
  condition_type: PolicyConditionType;
  amount_min: string;
  amount_max: string;
  currencies: string;
  time_start: string;
  time_end: string;
};

type Rule = {
  id: string;
  name: string;
  priority: number;
  provider: string;
  payment_channel: string;
  is_active: boolean;
  conditions: Array<{
    condition_type: PolicyConditionType;
    amount_min?: string;
    amount_max?: string;
    currencies?: string;
    time_start?: string;
    time_end?: string;
  }>;
};

type PolicyModalView =
  | "policies-list"
  | "add-policy"
  | "edit-policy"
  | "policy-detail"
  | "add-rule"
  | "edit-rule";

type PolicyForm = { name: string; description: string };

type RuleForm = {
  name: string;
  priority: string;
  provider: string;
  payment_channel: string;
  is_active: boolean;
  conditions: ConditionItem[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const AVAILABLE_PROVIDERS = ["Paystack", "Flutterwave", "Nomba"];

const DEFAULT_ENV_MODAL: EnvModal = {
  open: false,
  provider: AVAILABLE_PROVIDERS[0],
  environment: "sandbox",
  secretKey: "",
  originalKey: "",
  isEdit: false,
  isFixed: false,
  grantType: "",
  clientId: "",
  clientSecret: "",
  accountId: "",
};

const DEFAULT_POLICY_FORM: PolicyForm = { name: "", description: "" };

const DEFAULT_RULE_FORM: RuleForm = {
  name: "",
  priority: "1",
  provider: "",
  payment_channel: "string",
  is_active: true,
  conditions: [],
};

const CONDITION_CONFIG: Record<
  PolicyConditionType,
  { label: string; Icon: React.ElementType }
> = {
  time_of_day: { label: "Time Range", Icon: Clock },
  amount_range: { label: "Amount Range", Icon: DollarSign },
  currency: { label: "Currency", Icon: Globe },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getConditionSummary(c: Rule["conditions"][number]): string {
  if (c.condition_type === "time_of_day") return `${c.time_start} — ${c.time_end}`;
  if (c.condition_type === "amount_range") return `${c.amount_min} — ${c.amount_max}`;
  if (c.condition_type === "currency") return c.currencies || "";
  return "";
}

// ─── Component ────────────────────────────────────────────────────────────────

function Providers() {
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();

  // ── Provider state ──────────────────────────────────────────────────────────
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [envModal, setEnvModal] = useState<EnvModal>(DEFAULT_ENV_MODAL);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  // ── Policy / Rule modal state ───────────────────────────────────────────────
  const [policiesModalOpen, setPoliciesModalOpen] = useState(false);
  const [policyView, setPolicyView] = useState<PolicyModalView>("policies-list");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [policyForm, setPolicyForm] = useState<PolicyForm>(DEFAULT_POLICY_FORM);
  const [ruleForm, setRuleForm] = useState<RuleForm>(DEFAULT_RULE_FORM);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null);
  const [togglingPolicyId, setTogglingPolicyId] = useState<string | null>(null);
  const [isDeletingPolicy, setIsDeletingPolicy] = useState(false);
  const [isDeletingRule, setIsDeletingRule] = useState(false);

  // ── Provider query ──────────────────────────────────────────────────────────

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings", userEmail],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/accounts/user/details/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!userEmail,
  });

  const settingsRaw = settingsResponse?.data || settingsResponse || {};
  const settingsData = settingsRaw?.user || settingsRaw;
  const merchantsData = settingsRaw?.merchants;
  const merchant = Array.isArray(merchantsData)
    ? merchantsData[0]
    : merchantsData;

  useEffect(() => {
    const clients = merchant?.api_clients || [];
    if (clients && Array.isArray(clients) && clients.length > 0) {
      const providerMap = new Map<string, ApiKeyConfig>();
      clients.forEach((client: any) => {
        const isTest =
          client.environment?.toLowerCase() === "sandbox" ||
          client.environment?.toLowerCase() === "test";
        const providers = client.providers || [];
        providers.forEach((p: any) => {
          if (!p || !p.provider) return;
          const providerName =
            p.provider.charAt(0).toUpperCase() +
            p.provider.slice(1).toLowerCase();
          if (!providerMap.has(providerName)) {
            providerMap.set(providerName, {
              provider: providerName,
              testPublicKey: "",
              testSecretKey: "",
              livePublicKey: "",
              liveSecretKey: "",
            });
          }
          const config = providerMap.get(providerName)!;
          if (isTest) {
            config.testPublicKey = "••••••••••••••••";
            config.testSecretKey = "••••••••••••••••";
          } else {
            config.livePublicKey = "••••••••••••••••";
            config.liveSecretKey = "••••••••••••••••";
          }
        });
      });
      setApiKeys(Array.from(providerMap.values()));
    }
  }, [settingsResponse]);

  // ── Policy queries + mutations ──────────────────────────────────────────────

  const {
    data: policiesData,
    isLoading: isLoadingPolicies,
    refetch: refetchPolicies,
  } = useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/merchants/policies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: policiesModalOpen,
  });

  const policies: Policy[] = policiesData?.data || policiesData || [];

  const { mutateAsync: createPolicy, isPending: isCreatingPolicy } =
    useMutation({
      mutationFn: async (payload: PolicyForm) => {
        console.log("[createPolicy] POST /merchants/policies/", payload);
        const token = localStorage.getItem("authToken");
        const response = await api.post(
          "/merchants/policies/",
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
      },
    });

  const { mutateAsync: updatePolicy, isPending: isUpdatingPolicy } =
    useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload: PolicyForm }) => {
        console.log(`[updatePolicy] PUT /merchants/policies/${id}`, payload);
        const token = localStorage.getItem("authToken");
        const response = await api.put(
          `/merchants/policies/${id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
      },
    });

  const { mutateAsync: deletePolicy } = useMutation({
    mutationFn: async (id: string) => {
      console.log(`[deletePolicy] DELETE /merchants/policies/${id}/`);
      const token = localStorage.getItem("authToken");
      await api.delete(`/merchants/policies/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  });

  const { mutateAsync: activatePolicy } = useMutation({
    mutationFn: async (id: string) => {
      console.log(`[activatePolicy] POST /merchants/policies/${id}/activate/`, {});
      const token = localStorage.getItem("authToken");
      await api.post(
        `/merchants/policies/${id}/activate/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
  });

  const { mutateAsync: deactivatePolicy } = useMutation({
    mutationFn: async (id: string) => {
      console.log(`[deactivatePolicy] POST /merchants/policies/${id}/deactivate/`, {});
      const token = localStorage.getItem("authToken");
      await api.post(
        `/merchants/policies/${id}/deactivate/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
  });

  // ── Rule queries + mutations ────────────────────────────────────────────────

  const {
    data: rulesData,
    isLoading: isLoadingRules,
    refetch: refetchRules,
  } = useQuery({
    queryKey: ["rules", selectedPolicy?.id],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get(
        `/merchants/policies/${selectedPolicy!.id}/rules/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    enabled: !!selectedPolicy,
  });

  const rules: Rule[] = rulesData?.data || rulesData || [];

  const { mutateAsync: createRule, isPending: isCreatingRule } = useMutation({
    mutationFn: async ({ policyId, payload }: { policyId: string; payload: any }) => {
      console.log(`[createRule] POST /merchants/policies/${policyId}/rules/`, payload);
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        `/merchants/policies/${policyId}/rules/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
  });

  const { mutateAsync: updateRule, isPending: isUpdatingRule } = useMutation({
    mutationFn: async ({
      policyId,
      ruleId,
      payload,
    }: {
      policyId: string;
      ruleId: string;
      payload: any;
    }) => {
      console.log(`[updateRule] PUT /merchants/policies/${policyId}/rules/${ruleId}/`, payload);
      const token = localStorage.getItem("authToken");
      const response = await api.put(
        `/merchants/policies/${policyId}/rules/${ruleId}/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
  });

  const { mutateAsync: deleteRule } = useMutation({
    mutationFn: async ({
      policyId,
      ruleId,
    }: {
      policyId: string;
      ruleId: string;
    }) => {
      console.log(`[deleteRule] DELETE /merchants/policies/${policyId}/rules/${ruleId}/`);
      const token = localStorage.getItem("authToken");
      await api.delete(
        `/merchants/policies/${policyId}/rules/${ruleId}/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
  });

  // ── Provider mutations ──────────────────────────────────────────────────────

  const { mutateAsync: setupProvider, isPending: isSettingUpProvider } =
    useMutation({
      mutationFn: async (payload: any) => {
        const token = localStorage.getItem("authToken");
        const response = await api.post(
          "/api/client-provider/setup/",
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
      },
    });

  // ── Provider handlers ───────────────────────────────────────────────────────

  const openEnvModal = (
    provider: string,
    environment: "sandbox" | "live",
    existingKey?: string,
    isFixed?: boolean,
  ) => {
    setEnvModal({
      open: true,
      provider,
      environment,
      secretKey: existingKey || "",
      originalKey: existingKey || "",
      isEdit: !!existingKey,
      isFixed: !!isFixed,
      grantType: "",
      clientId: "",
      clientSecret: "",
      accountId: "",
    });
  };

  const closeEnvModal = () => {
    setEnvModal(DEFAULT_ENV_MODAL);
    setShowKey(false);
  };

  const handleSaveEnvKey = async () => {
    const merchantId =
      merchant?.merchant_id || settingsData?.merchant_id || "165714267";
    try {
      const credentials =
        envModal.provider === "Nomba"
          ? {
              grant_type: envModal.grantType,
              client_id: envModal.clientId,
              client_secret: envModal.clientSecret,
              accountId: envModal.accountId,
            }
          : { secret_key: envModal.secretKey };

      await setupProvider({
        merchant_id: merchantId.toString(),
        environment: envModal.environment,
        provider: envModal.provider.toLowerCase(),
        credential_type: "api_key",
        credentials,
      });
      await queryClient.invalidateQueries({ queryKey: ["settings", userEmail] });
      closeEnvModal();
    } catch (error) {
      console.error("Failed to setup provider:", error);
    }
  };

  const handleDeleteKey = () => {
    if (keyToDelete) {
      setApiKeys((prev) => prev.filter((k) => k.provider !== keyToDelete));
      setKeyToDelete(null);
    }
  };

  // ── Policy handlers ─────────────────────────────────────────────────────────

  const closePoliciesModal = () => {
    setPoliciesModalOpen(false);
    setPolicyView("policies-list");
    setSelectedPolicy(null);
    setSelectedRule(null);
    setPolicyForm(DEFAULT_POLICY_FORM);
    setRuleForm(DEFAULT_RULE_FORM);
  };

  const goToPoliciesList = () => {
    setPolicyView("policies-list");
    setSelectedPolicy(null);
    setSelectedRule(null);
    setPolicyForm(DEFAULT_POLICY_FORM);
    setRuleForm(DEFAULT_RULE_FORM);
  };

  const goToPolicyDetail = (policy: Policy) => {
    setSelectedPolicy(policy);
    setSelectedRule(null);
    setRuleForm(DEFAULT_RULE_FORM);
    setPolicyView("policy-detail");
  };

  const openAddPolicy = () => {
    setPolicyForm(DEFAULT_POLICY_FORM);
    setPolicyView("add-policy");
  };

  const openEditPolicy = (policy: Policy, e: React.MouseEvent) => {
    e.stopPropagation();
    setPolicyForm({ name: policy.name, description: policy.description });
    setSelectedPolicy(policy);
    setPolicyView("edit-policy");
  };

  const handleSavePolicy = async () => {
    try {
      if (policyView === "edit-policy" && selectedPolicy) {
        await updatePolicy({ id: selectedPolicy.id, payload: policyForm });
      } else {
        await createPolicy(policyForm);
      }
      await refetchPolicies();
      goToPoliciesList();
    } catch (error) {
      console.error("Failed to save policy:", error);
    }
  };

  const handleConfirmDeletePolicy = async () => {
    if (!policyToDelete) return;
    setIsDeletingPolicy(true);
    try {
      await deletePolicy(policyToDelete.id);
      await refetchPolicies();
      setPolicyToDelete(null);
    } catch (error) {
      console.error("Failed to delete policy:", error);
    } finally {
      setIsDeletingPolicy(false);
    }
  };

  const handleTogglePolicy = async (policy: Policy, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingPolicyId(policy.id);
    try {
      if (policy.status === "active") {
        await deactivatePolicy(policy.id);
      } else {
        await activatePolicy(policy.id);
      }
      await refetchPolicies();
      // Update selectedPolicy status if we're on detail view
      if (selectedPolicy?.id === policy.id) {
        setSelectedPolicy((prev) =>
          prev
            ? { ...prev, status: prev.status === "active" ? "inactive" : "active" }
            : prev,
        );
      }
    } catch (error) {
      console.error("Failed to toggle policy:", error);
    } finally {
      setTogglingPolicyId(null);
    }
  };

  // ── Rule handlers ───────────────────────────────────────────────────────────

  const condIdRef = useRef(0);
  const nextCondId = () => `cond-${++condIdRef.current}`;

  const openAddRule = () => {
    setRuleForm({
      ...DEFAULT_RULE_FORM,
      // pre-fill provider with first configured provider if available
      provider: apiKeys[0]?.provider.toLowerCase() || "",
    });
    setSelectedRule(null);
    setPolicyView("add-rule");
  };

  const openEditRule = (rule: Rule) => {
    setSelectedRule(rule);
    setRuleForm({
      name: rule.name || "",
      priority: rule.priority?.toString() || "1",
      provider: rule.provider || "",
      payment_channel: rule.payment_channel || "string",
      is_active: rule.is_active ?? true,
      conditions: (rule.conditions || []).map((c) => ({
        _id: nextCondId(),
        condition_type: c.condition_type,
        amount_min: c.amount_min || "",
        amount_max: c.amount_max || "",
        currencies: c.currencies || "",
        time_start: c.time_start || "",
        time_end: c.time_end || "",
      })),
    });
    setPolicyView("edit-rule");
  };

  const goBackFromRule = () => {
    setPolicyView("policy-detail");
    setSelectedRule(null);
    setRuleForm(DEFAULT_RULE_FORM);
  };

  const addCondition = (type: PolicyConditionType) => {
    setRuleForm((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          _id: nextCondId(),
          condition_type: type,
          amount_min: "",
          amount_max: "",
          currencies: "",
          time_start: "",
          time_end: "",
        },
      ],
    }));
  };

  const removeCondition = (id: string) => {
    setRuleForm((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((c) => c._id !== id),
    }));
  };

  const updateCondition = (id: string, patch: Partial<ConditionItem>) => {
    setRuleForm((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c) =>
        c._id === id ? { ...c, ...patch } : c,
      ),
    }));
  };

  const handleSaveRule = async () => {
    if (!selectedPolicy) return;
    try {
      const payload = {
        name: ruleForm.name.trim(),
        priority: Number(ruleForm.priority),
        provider: ruleForm.provider.toLowerCase(),
        payment_channel: ruleForm.payment_channel,
        is_active: ruleForm.is_active,
        conditions: ruleForm.conditions.map(({ _id: _unused, ...c }) => ({
          condition_type: c.condition_type,
          ...(c.condition_type === "amount_range"
            ? { amount_min: c.amount_min, amount_max: c.amount_max }
            : {}),
          ...(c.condition_type === "time_of_day"
            ? { time_start: c.time_start, time_end: c.time_end }
            : {}),
          ...(c.condition_type === "currency"
            ? { currencies: c.currencies.trim().toUpperCase() }
            : {}),
        })),
      };

      console.log("[handleSaveRule] payload", payload);

      if (policyView === "edit-rule" && selectedRule) {
        await updateRule({
          policyId: selectedPolicy.id,
          ruleId: selectedRule.id,
          payload,
        });
      } else {
        await createRule({ policyId: selectedPolicy.id, payload });
      }
      await refetchRules();
      goBackFromRule();
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  const handleConfirmDeleteRule = async () => {
    if (!ruleToDelete || !selectedPolicy) return;
    setIsDeletingRule(true);
    try {
      await deleteRule({ policyId: selectedPolicy.id, ruleId: ruleToDelete.id });
      await refetchRules();
      setRuleToDelete(null);
    } catch (error) {
      console.error("Failed to delete rule:", error);
    } finally {
      setIsDeletingRule(false);
    }
  };

  // Condition types already in the current rule form (one per type max)
  const addedConditionTypes = ruleForm.conditions.map((c) => c.condition_type);

  // Form validity
  const isPolicyFormValid =
    policyForm.name.trim() !== "" && policyForm.description.trim() !== "";

  const isRuleFormValid =
    ruleForm.name.trim() !== "" &&
    ruleForm.provider !== "" &&
    ruleForm.conditions.length > 0 &&
    ruleForm.conditions.every((c) => {
      if (c.condition_type === "amount_range")
        return c.amount_min !== "" && c.amount_max !== "";
      if (c.condition_type === "time_of_day")
        return c.time_start !== "" && c.time_end !== "";
      if (c.condition_type === "currency") return c.currencies.trim() !== "";
      return false;
    });

  // ── Loading state ───────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
            Providers
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Manage your payment provider integrations and API credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPoliciesModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors shadow-sm text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 cursor-pointer shrink-0"
        >
          <Shield className="w-4 h-4" />
          Set Policies
        </button>
      </div>

      {/* Provider Integrations Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Provider Integrations
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your API keys are highly encrypted, very safe, and secure.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const configuredProviders = apiKeys.map((k) => k.provider);
              const firstUnconfigured =
                AVAILABLE_PROVIDERS.find(
                  (p) => !configuredProviders.includes(p),
                ) || AVAILABLE_PROVIDERS[0];
              openEnvModal(firstUnconfigured, "sandbox");
            }}
            disabled={apiKeys.length >= AVAILABLE_PROVIDERS.length}
            className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors shadow-sm text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add Provider
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {apiKeys.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-slate-400" />
              </div>
              <p className="font-medium text-slate-900 mb-1">
                No providers configured
              </p>
              <p className="text-sm">
                Click the Add Provider button to integrate a new provider.
              </p>
            </div>
          ) : (
            apiKeys.map((config) => (
              <div key={config.provider} className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {config.provider}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-700">
                        Connected
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <button
                      type="button"
                      disabled
                      className="p-2 text-slate-300 cursor-not-allowed rounded-lg"
                      title="Delete Provider (Coming Soon)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sandbox tile */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                        Sandbox Environment
                      </span>
                      {config.testSecretKey ? (
                        <button
                          type="button"
                          onClick={() =>
                            openEnvModal(config.provider, "sandbox", config.testSecretKey)
                          }
                          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openEnvModal(config.provider, "sandbox", undefined, true)
                          }
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                    <div>
                      {config.testSecretKey ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Not Configured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Live tile */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                        Live Environment
                      </span>
                      {config.liveSecretKey ? (
                        <button
                          type="button"
                          onClick={() =>
                            openEnvModal(config.provider, "live", config.liveSecretKey)
                          }
                          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openEnvModal(config.provider, "live", undefined, true)
                          }
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                    <div>
                      {config.liveSecretKey ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Not Configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Provider credential modal ─────────────────────────────────────────── */}
      {envModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeEnvModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") closeEnvModal();
            }}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {envModal.isEdit
                    ? `Edit ${envModal.environment === "sandbox" ? "Sandbox" : "Live"} Key — ${envModal.provider}`
                    : envModal.isFixed
                      ? `Add ${envModal.environment === "sandbox" ? "Sandbox" : "Live"} Key — ${envModal.provider}`
                      : "Add Provider"}
                </h3>
                {envModal.isEdit && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    The new key will replace the existing one.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeEnvModal}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Provider selector */}
              <div>
                <label
                  htmlFor="provider-select"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Provider
                </label>
                {envModal.isEdit || envModal.isFixed ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-700 text-sm">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{envModal.provider}</span>
                    <span className="ml-auto text-xs text-slate-400">Locked</span>
                  </div>
                ) : (
                  <select
                    id="provider-select"
                    value={envModal.provider}
                    onChange={(e) =>
                      setEnvModal({ ...envModal, provider: e.target.value })
                    }
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {AVAILABLE_PROVIDERS.map((p) => {
                      const alreadyAdded = apiKeys.some((k) => k.provider === p);
                      return (
                        <option key={p} value={p} disabled={alreadyAdded}>
                          {p}
                          {alreadyAdded ? " (already added)" : ""}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* Environment */}
              <div>
                <label
                  htmlFor="env-select"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Environment
                </label>
                {envModal.isEdit || envModal.isFixed ? (
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      envModal.environment === "sandbox"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        envModal.environment === "sandbox"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    {envModal.environment === "sandbox" ? "Sandbox" : "Live"}
                  </div>
                ) : (
                  <select
                    id="env-select"
                    value={envModal.environment}
                    onChange={(e) =>
                      setEnvModal({
                        ...envModal,
                        environment: e.target.value as "sandbox" | "live",
                      })
                    }
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="sandbox">🟡 Sandbox (Test)</option>
                    <option value="live">🟢 Live (Production)</option>
                  </select>
                )}
              </div>

              {/* Nomba-specific fields */}
              {envModal.provider === "Nomba" ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="grant-type" className="block text-sm font-medium text-slate-700 mb-2">
                      Grant Type
                    </label>
                    <input
                      id="grant-type"
                      type="text"
                      value={envModal.grantType}
                      onChange={(e) => setEnvModal({ ...envModal, grantType: e.target.value })}
                      placeholder="e.g. client_credentials"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="client-id" className="block text-sm font-medium text-slate-700 mb-2">
                      Client ID
                    </label>
                    <input
                      id="client-id"
                      type="text"
                      value={envModal.clientId}
                      onChange={(e) => setEnvModal({ ...envModal, clientId: e.target.value })}
                      placeholder="Enter Client ID"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="client-secret" className="block text-sm font-medium text-slate-700 mb-2">
                      Client Secret
                    </label>
                    <div className="relative">
                      <input
                        id="client-secret"
                        type={showKey ? "text" : "password"}
                        value={envModal.clientSecret}
                        onChange={(e) => setEnvModal({ ...envModal, clientSecret: e.target.value })}
                        placeholder="Enter Client Secret"
                        className="block w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="account-id" className="block text-sm font-medium text-slate-700 mb-2">
                      Account ID
                    </label>
                    <input
                      id="account-id"
                      type="text"
                      value={envModal.accountId}
                      onChange={(e) => setEnvModal({ ...envModal, accountId: e.target.value })}
                      placeholder="Enter Account ID"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="secret-key" className="block text-sm font-medium text-slate-700 mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      id="secret-key"
                      type={showKey ? "text" : "password"}
                      value={envModal.secretKey}
                      onKeyDown={(e) => {
                        if (
                          envModal.isEdit &&
                          envModal.secretKey === envModal.originalKey
                        ) {
                          if (
                            e.key === "Backspace" ||
                            e.key === "Delete" ||
                            e.key.length === 1
                          ) {
                            e.preventDefault();
                            setEnvModal({ ...envModal, secretKey: "" });
                          }
                        }
                      }}
                      onChange={(e) =>
                        setEnvModal({ ...envModal, secretKey: e.target.value })
                      }
                      placeholder={
                        envModal.environment === "sandbox"
                          ? "sk_test_..."
                          : "sk_live_..."
                      }
                      className="block w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {envModal.isEdit && (
                    <p className="mt-2 text-xs text-slate-400">
                      Clear the field and enter a new key. Key must be more than 10 characters.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={closeEnvModal}
                className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEnvKey}
                disabled={
                  isSettingUpProvider ||
                  (envModal.provider === "Nomba"
                    ? !envModal.grantType ||
                      !envModal.clientId ||
                      !envModal.clientSecret ||
                      !envModal.accountId
                    : envModal.secretKey.length < 10 ||
                      (envModal.isEdit &&
                        envModal.secretKey === envModal.originalKey))
                }
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-500/20 text-sm flex items-center gap-2"
              >
                {isSettingUpProvider ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : envModal.isEdit ? (
                  "Update Key"
                ) : (
                  "Save Key"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete provider confirmation ──────────────────────────────────────── */}
      {keyToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setKeyToDelete(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setKeyToDelete(null);
            }}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Remove Integration</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to remove the{" "}
                <span className="font-semibold">{keyToDelete}</span> integration?
                You can re-add it later.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKeyToDelete(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteKey}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm shadow-red-500/20 transition-colors cursor-pointer text-sm"
                >
                  Remove Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          POLICIES MODAL
          Backdrop does NOT close the modal.
          Views: policies-list → policy-detail → add/edit rule
                               → add/edit policy
      ══════════════════════════════════════════════════════════════════════════ */}
      {policiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Inert backdrop — intentionally has no onClick */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

          <div className="relative bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">

            {/* ── VIEW: policies-list ─────────────────────────────────────────── */}
            {policyView === "policies-list" && (
              <>
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Routing Policies</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Click a policy to manage its rules.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openAddPolicy}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Policy
                    </button>
                    <button
                      type="button"
                      onClick={closePoliciesModal}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                  {isLoadingPolicies ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-7 h-7 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    </div>
                  ) : policies.length === 0 ? (
                    <div className="flex flex-col items-center py-16 px-6 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-900 mb-1">No policies yet</p>
                      <p className="text-sm text-slate-500">
                        Click "Add Policy" to create your first routing policy.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {policies.map((policy) => {
                        const isToggling = togglingPolicyId === policy.id;
                        return (
                          <button
                            key={policy.id}
                            type="button"
                            onClick={() => goToPolicyDetail(policy)}
                            className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                    {policy.name}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                                      policy.status === "active"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        policy.status === "active"
                                          ? "bg-emerald-500"
                                          : "bg-slate-400"
                                      }`}
                                    />
                                    {policy.status === "active" ? "Active" : "Inactive"}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1">
                                  {policy.description}
                                </p>
                              </div>

                              {/* Row actions — stop propagation so they don't trigger the card click */}
                              <div
                                className="flex items-center gap-1 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => handleTogglePolicy(policy, e)}
                                  disabled={isToggling}
                                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 ${
                                    policy.status === "active"
                                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                      : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  }`}
                                >
                                  {isToggling ? (
                                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                                  ) : policy.status === "active" ? (
                                    "Deactivate"
                                  ) : (
                                    "Activate"
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => openEditPolicy(policy, e)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                  title="Edit policy"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPolicyToDelete(policy);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  title="Delete policy"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                  <p className="text-[11px] text-slate-400">
                    {policies.length} {policies.length === 1 ? "policy" : "policies"} configured
                  </p>
                </div>
              </>
            )}

            {/* ── VIEW: add-policy / edit-policy ──────────────────────────────── */}
            {(policyView === "add-policy" || policyView === "edit-policy") && (
              <>
                <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPoliciesList}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {policyView === "edit-policy" ? "Edit Policy" : "New Policy"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {policyView === "edit-policy"
                        ? "Update the policy name and description."
                        : "Give this policy a name and description."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePoliciesModal}
                    className="ml-auto text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label
                      htmlFor="policy-name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Policy Name
                    </label>
                    <input
                      id="policy-name"
                      type="text"
                      value={policyForm.name}
                      onChange={(e) =>
                        setPolicyForm({ ...policyForm, name: e.target.value })
                      }
                      placeholder="e.g. Business Hours Routing"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="policy-desc"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="policy-desc"
                      value={policyForm.description}
                      onChange={(e) =>
                        setPolicyForm({ ...policyForm, description: e.target.value })
                      }
                      placeholder="Describe what this policy does..."
                      rows={4}
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={goToPoliciesList}
                    className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePolicy}
                    disabled={
                      !isPolicyFormValid ||
                      isCreatingPolicy ||
                      isUpdatingPolicy
                    }
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-500/20 text-sm flex items-center gap-2"
                  >
                    {isCreatingPolicy || isUpdatingPolicy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : policyView === "edit-policy" ? (
                      "Update Policy"
                    ) : (
                      "Create Policy"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* ── VIEW: policy-detail ─────────────────────────────────────────── */}
            {policyView === "policy-detail" && selectedPolicy && (
              <>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPoliciesList}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {selectedPolicy.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                            selectedPolicy.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              selectedPolicy.status === "active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {selectedPolicy.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {selectedPolicy.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closePoliciesModal}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Rules section */}
                <div className="overflow-y-auto max-h-[60vh]">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ListFilter className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">Rules</span>
                      {!isLoadingRules && (
                        <span className="text-xs text-slate-400">
                          ({rules.length} / 3)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={openAddRule}
                      disabled={rules.length >= 3}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                      Add Rule
                    </button>
                  </div>

                  {isLoadingRules ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    </div>
                  ) : rules.length === 0 ? (
                    <div className="flex flex-col items-center py-12 px-6 text-center">
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <ListFilter className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-1">
                        No rules yet
                      </p>
                      <p className="text-xs text-slate-500">
                        Add rules to define when this policy applies.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {rules.map((rule) => (
                        <div key={rule.id} className="px-6 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {/* Rule name + badges */}
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-sm font-medium text-slate-900">
                                  {rule.name}
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                                  Priority {rule.priority}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                                    rule.is_active
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {rule.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>
                              {/* Provider + channel */}
                              <p className="text-xs text-slate-500 mb-2">
                                {rule.provider}
                              </p>
                              {/* Condition chips */}
                              {(rule.conditions || []).length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {rule.conditions.map((c, i) => {
                                    const cfg = CONDITION_CONFIG[c.condition_type];
                                    if (!cfg) return null;
                                    const summary = getConditionSummary(c);
                                    return (
                                      <span
                                        key={i}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium"
                                      >
                                        <cfg.Icon className="w-2.5 h-2.5" />
                                        {cfg.label}
                                        {summary ? `: ${summary}` : ""}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => openEditRule(rule)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                title="Edit rule"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRuleToDelete(rule)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                title="Delete rule"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                  <p className="text-[11px] text-slate-400">
                    Each condition type can only be set once per policy.
                  </p>
                </div>
              </>
            )}

            {/* ── VIEW: add-rule / edit-rule ───────────────────────────────────── */}
            {(policyView === "add-rule" || policyView === "edit-rule") && (
              <>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goBackFromRule}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {policyView === "edit-rule" ? "Edit Rule" : "Add Rule"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedPolicy?.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closePoliciesModal}
                    className="ml-auto text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form body */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[62vh]">

                  {/* Name */}
                  <div>
                    <label htmlFor="rule-name" className="block text-sm font-medium text-slate-700 mb-2">
                      Rule Name
                    </label>
                    <input
                      id="rule-name"
                      type="text"
                      value={ruleForm.name}
                      onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                      placeholder="e.g. High-value card routing"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                      autoFocus
                    />
                  </div>

                  {/* Priority + Provider row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rule-priority" className="block text-sm font-medium text-slate-700 mb-2">
                        Priority
                      </label>
                      <select
                        id="rule-priority"
                        value={ruleForm.priority}
                        onChange={(e) => setRuleForm({ ...ruleForm, priority: e.target.value })}
                        className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm appearance-none cursor-pointer"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rule-provider" className="block text-sm font-medium text-slate-700 mb-2">
                        Provider
                      </label>
                      <select
                        id="rule-provider"
                        value={ruleForm.provider}
                        onChange={(e) => setRuleForm({ ...ruleForm, provider: e.target.value })}
                        className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select provider</option>
                        {apiKeys.map((k) => (
                          <option key={k.provider} value={k.provider.toLowerCase()}>
                            {k.provider}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment channel + Is active row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rule-channel" className="block text-sm font-medium text-slate-700 mb-2">
                        Payment Channel
                      </label>
                      <input
                        id="rule-channel"
                        type="text"
                        value={ruleForm.payment_channel}
                        onChange={(e) => setRuleForm({ ...ruleForm, payment_channel: e.target.value })}
                        className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Is Active
                      </label>
                      <button
                        type="button"
                        onClick={() => setRuleForm({ ...ruleForm, is_active: !ruleForm.is_active })}
                        className={`flex items-center gap-2 px-3 py-2.5 w-full rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                          ruleForm.is_active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            ruleForm.is_active ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {ruleForm.is_active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">
                        Conditions
                        <span className="ml-1.5 text-xs text-slate-400 font-normal">
                          (at least one required)
                        </span>
                      </label>
                    </div>

                    {/* Existing condition cards */}
                    {ruleForm.conditions.length > 0 && (
                      <div className="space-y-3 mb-3">
                        {ruleForm.conditions.map((cond) => {
                          const { label, Icon } = CONDITION_CONFIG[cond.condition_type];
                          return (
                            <div
                              key={cond._id}
                              className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-slate-700">{label}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCondition(cond._id)}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Time range */}
                              {cond.condition_type === "time_of_day" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                      Start Time
                                    </label>
                                    <input
                                      type="time"
                                      value={cond.time_start}
                                      onChange={(e) =>
                                        updateCondition(cond._id, { time_start: e.target.value })
                                      }
                                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                      End Time
                                    </label>
                                    <input
                                      type="time"
                                      value={cond.time_end}
                                      onChange={(e) =>
                                        updateCondition(cond._id, { time_end: e.target.value })
                                      }
                                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 text-sm"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Amount range */}
                              {cond.condition_type === "amount_range" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                      Minimum
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      value={cond.amount_min}
                                      onChange={(e) =>
                                        updateCondition(cond._id, { amount_min: e.target.value })
                                      }
                                      placeholder="e.g. 100"
                                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                      Maximum
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      value={cond.amount_max}
                                      onChange={(e) =>
                                        updateCondition(cond._id, { amount_max: e.target.value })
                                      }
                                      placeholder="e.g. 50000"
                                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 text-sm"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Currency */}
                              {cond.condition_type === "currency" && (
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                    Currency Code
                                  </label>
                                  <input
                                    type="text"
                                    value={cond.currencies}
                                    onChange={(e) =>
                                      updateCondition(cond._id, {
                                        currencies: e.target.value,
                                      })
                                    }
                                    placeholder="e.g. NGN, USD, GBP"
                                    maxLength={3}
                                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 text-sm uppercase"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add condition buttons */}
                    {addedConditionTypes.length < 3 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Add condition:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(["time_of_day", "amount_range", "currency"] as PolicyConditionType[]).map(
                            (type) => {
                              const { label, Icon } = CONDITION_CONFIG[type];
                              const alreadyAdded = addedConditionTypes.includes(type);
                              return (
                                <button
                                  key={type}
                                  type="button"
                                  disabled={alreadyAdded}
                                  onClick={() => addCondition(type)}
                                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                                    alreadyAdded
                                      ? "border-slate-200 bg-slate-50 opacity-40 cursor-not-allowed"
                                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  }`}
                                >
                                  <Icon
                                    className={`w-4 h-4 ${alreadyAdded ? "text-slate-400" : "text-blue-500"}`}
                                  />
                                  <span className="text-[11px] font-medium text-slate-600 leading-tight">
                                    {label}
                                  </span>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    {ruleForm.conditions.length === 0 && (
                      <p className="text-xs text-slate-400 mt-2">
                        Select a condition type above to get started.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={goBackFromRule}
                    className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRule}
                    disabled={!isRuleFormValid || isCreatingRule || isUpdatingRule}
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-500/20 text-sm flex items-center gap-2"
                  >
                    {isCreatingRule || isUpdatingRule ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : policyView === "edit-rule" ? (
                      "Update Rule"
                    ) : (
                      "Add Rule"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Delete policy confirmation (z-60, over the policies modal) ─────────── */}
      {policyToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Delete Policy</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{policyToDelete.name}</span>?
                This will also remove all its rules.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPolicyToDelete(null)}
                  disabled={isDeletingPolicy}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeletePolicy}
                  disabled={isDeletingPolicy}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm shadow-red-500/20 transition-colors cursor-pointer text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeletingPolicy ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete rule confirmation (z-60, over the policies modal) ──────────── */}
      {ruleToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Delete Rule</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete the rule{" "}
                <span className="font-semibold">{ruleToDelete.name}</span>?
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRuleToDelete(null)}
                  disabled={isDeletingRule}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteRule}
                  disabled={isDeletingRule}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm shadow-red-500/20 transition-colors cursor-pointer text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeletingRule ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Providers;
