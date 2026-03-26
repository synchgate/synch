import {
  Bell,
  Building2,
  CheckCircle,
  CreditCard as CreditCardIcon,
  Eye,
  EyeOff,
  FileText,
  Key,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { COUNTRIES } from "../../data/countries";

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

function Settings() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "general");
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [envModal, setEnvModal] = useState<EnvModal>(DEFAULT_ENV_MODAL);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_type: "",
    website: "",
    address: "",
    country: "",
    state: "",
    registration_number: "",
  });
  const [businessSaveStatus, setBusinessSaveStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/accounts/user/details/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("=== SETTINGS RAW RESPONSE ===", response.data);
      return response.data;
    },
  });

  const settingsRaw = settingsResponse?.data || settingsResponse || {};
  const settingsData = settingsRaw?.user || settingsRaw;

  const merchantsData = settingsRaw?.merchants;
  const merchant = Array.isArray(merchantsData)
    ? merchantsData[0]
    : merchantsData;

  console.log("=== SETTINGS DATA ===", settingsData);
  console.log("=== PROFILE ===", settingsData?.profile);

  const firstName =
    settingsData?.profile?.first_name || settingsData?.first_name || "";
  const lastName =
    settingsData?.profile?.last_name || settingsData?.last_name || "";
  const emailAddress =
    settingsData?.profile?.email || settingsData?.email || "";

  useEffect(() => {
    // Populate businessForm from loaded merchant data
    if (merchant) {
      setBusinessForm({
        business_name: merchant.business_name || "",
        business_email: merchant.business_email || merchant.email || "",
        business_phone: merchant.business_phone || merchant.phone || "",
        business_type: merchant.merchant_type || merchant.business_type || "",
        website: merchant.website || "",
        address: merchant.address || "",
        country: merchant.country || "",
        state: merchant.state || merchant.state_province || "",
        registration_number: merchant.registration_number || "",
      });
    }
  }, [settingsResponse]);

  useEffect(() => {
    // Navigate directly to data > merchants > api_clients
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
          // Set to masked dots if provider exists, showing it's configured.
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

  const { mutateAsync: setupProvider, isPending: isSettingUpProvider } =
    useMutation({
      mutationFn: async (payload: any) => {
        const token = localStorage.getItem("authToken");
        const response = await api.post(
          "/api/client-provider/setup/",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return response.data;
      },
    });

  const { mutateAsync: updateMerchant, isPending: isUpdatingBusiness } =
    useMutation({
      mutationFn: async (payload: typeof businessForm) => {
        const token = localStorage.getItem("authToken");
        const merchantId = merchant?.id || settingsData?.id || "";
        const response = await api.patch(
          `/merchants/merchant/${merchantId}/update/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
      },
      onSuccess: () => {
        setBusinessSaveStatus("success");
        queryClient.invalidateQueries({ queryKey: ["settings"] });
        setTimeout(() => setBusinessSaveStatus("idle"), 3000);
      },
      onError: () => {
        setBusinessSaveStatus("error");
        setTimeout(() => setBusinessSaveStatus("idle"), 3000);
      },
    });

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
          : {
              secret_key: envModal.secretKey,
            };

      await setupProvider({
        merchant_id: merchantId.toString(),
        environment: envModal.environment,
        provider: envModal.provider.toLowerCase(),
        credential_type: "api_key",
        credentials,
      });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
          Settings
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Manage your account settings, team members, and preferences.
        </p>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:w-64 shrink-0 no-scrollbar">
          {[
            { id: "general", label: "General", icon: User },
            { id: "business", label: "Business Profile", icon: Building2 },
            { id: "apikeys", label: "Providers", icon: Key },
            { id: "kyc", label: "KYC Documents", icon: FileText },
            { id: "billing", label: "Billing Plans", icon: CreditCardIcon },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
                                    ${
                                      activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                `}
              >
                <TabIcon
                  className={`w-4 h-4 ${activeTab === tab.id ? "text-blue-600" : "text-slate-400"}`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <>
              {/* General Tab Content */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Personal Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Update your photo and personal details.
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-semibold shadow-md shrink-0">
                          {firstName?.[0]?.toUpperCase() || "U"}
                          {lastName?.[0]?.toUpperCase() || ""}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={emailAddress}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Profile Tab Content */}
              {activeTab === "business" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Business Profile
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Update your business details and contact information.
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={businessForm.business_name}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                business_name: e.target.value,
                              })
                            }
                            placeholder="Enter your business name"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business Email
                          </label>
                          <input
                            type="email"
                            value={businessForm.business_email}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                business_email: e.target.value,
                              })
                            }
                            placeholder="Enter your business email"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business Phone
                          </label>
                          <input
                            type="tel"
                            value={businessForm.business_phone}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                business_phone: e.target.value,
                              })
                            }
                            placeholder="Enter your business phone number"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business Type
                          </label>
                          <input
                            type="text"
                            value={businessForm.business_type}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                business_type: e.target.value,
                              })
                            }
                            placeholder="e.g. E-commerce, SaaS, LLC..."
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            value={businessForm.website}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                website: e.target.value,
                              })
                            }
                            placeholder="https://yourwebsite.com"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            value={businessForm.registration_number}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                registration_number: e.target.value,
                              })
                            }
                            placeholder="Enter your registration number"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            value={businessForm.address}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                address: e.target.value,
                              })
                            }
                            placeholder="Enter your business address"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Country
                          </label>
                          <select
                            value={businessForm.country}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                country: e.target.value,
                              })
                            }
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm appearance-none cursor-pointer"
                          >
                            <option value="">Select a country...</option>
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            value={businessForm.state}
                            onChange={(e) =>
                              setBusinessForm({
                                ...businessForm,
                                state: e.target.value,
                              })
                            }
                            placeholder="Enter your state or province"
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                      {businessSaveStatus === "success" && (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Changes saved successfully
                        </span>
                      )}
                      {businessSaveStatus === "error" && (
                        <span className="text-sm text-red-600 font-medium">
                          Failed to save. Please try again.
                        </span>
                      )}
                      <div className="ml-auto">
                        <button
                          onClick={() => updateMerchant(businessForm)}
                          disabled={isUpdatingBusiness}
                          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-500/20 text-sm flex items-center gap-2 cursor-pointer"
                        >
                          {isUpdatingBusiness ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save changes"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Documents Tab Content */}
              {activeTab === "kyc" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center border border-indigo-200 shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          KYC Documents
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Business verification &amp; compliance documents.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                      {/* Animated icon stack */}
                      <div className="relative mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shadow-md">
                          <FileText className="w-9 h-9 text-indigo-400" />
                        </div>
                        <span className="absolute -top-2 -right-2 flex h-6 w-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-50"></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500 items-center justify-center">
                            <span className="text-white text-[9px] font-bold">
                              !
                            </span>
                          </span>
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        Coming Soon
                      </span>

                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        KYC Verification is on its way
                      </h4>
                      <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                        We're building a seamless document verification flow.
                        You'll soon be able to upload your business documents
                        right here to unlock live payments.
                      </p>

                      <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
                        {[
                          "Certificate of Incorporation",
                          "Director's ID",
                          "Utility Bill",
                        ].map((doc) => (
                          <div
                            key={doc}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">
                              {doc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State for other tabs */}
              {activeTab !== "general" &&
                activeTab !== "business" &&
                activeTab !== "kyc" &&
                activeTab !== "apikeys" && (
                  <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <SettingsIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1 capitalize">
                      {activeTab} Settings
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                      {activeTab === "billing" ||
                      activeTab === "security" ||
                      activeTab === "notifications"
                        ? "We are currently building out this module. Check back later for updates!"
                        : "These configuration options would be connected to the backend API via your data provider."}
                    </p>
                    {(activeTab === "billing" ||
                      activeTab === "security" ||
                      activeTab === "notifications") && (
                      <span className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Coming Soon
                      </span>
                    )}
                  </div>
                )}

              {/* API Keys Tab (Provider Integration Status MVP) */}
              {activeTab === "apikeys" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Provider Integrations
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Your API keys are highly encrypted, very safe, and
                          secure.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const configuredProviders = apiKeys.map(
                            (k) => k.provider,
                          );
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
                            Click the Add Key button to integrate a new
                            provider.
                          </p>
                        </div>
                      ) : (
                        apiKeys.map((config, index) => (
                          <div key={index} className="p-6">
                            {/* Provider Header */}
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
                                <Key className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900">
                                  {config.provider}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span className="text-xs font-medium text-emerald-700">
                                    Connected
                                  </span>
                                </div>
                              </div>
                              {/* Top-right delete (coming soon) */}
                              <div className="ml-auto">
                                <button
                                  disabled
                                  className="p-2 text-slate-300 cursor-not-allowed rounded-lg"
                                  title="Delete Provider (Coming Soon)"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Sandbox tile */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                                    Sandbox Environment
                                  </span>
                                  {config.testSecretKey ? (
                                    <button
                                      onClick={() =>
                                        openEnvModal(
                                          config.provider,
                                          "sandbox",
                                          config.testSecretKey,
                                        )
                                      }
                                      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                      <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        openEnvModal(
                                          config.provider,
                                          "sandbox",
                                          undefined,
                                          true,
                                        )
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
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
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
                                      onClick={() =>
                                        openEnvModal(
                                          config.provider,
                                          "live",
                                          config.liveSecretKey,
                                        )
                                      }
                                      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                      <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        openEnvModal(
                                          config.provider,
                                          "live",
                                          undefined,
                                          true,
                                        )
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
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
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
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Environment Key Modal */}
      {envModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
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
                onClick={closeEnvModal}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Provider selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Provider
                </label>
                {envModal.isEdit || envModal.isFixed ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-700 text-sm">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{envModal.provider}</span>
                    <span className="ml-auto text-xs text-slate-400">
                      Locked
                    </span>
                  </div>
                ) : (
                  <select
                    value={envModal.provider}
                    onChange={(e) =>
                      setEnvModal({ ...envModal, provider: e.target.value })
                    }
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {AVAILABLE_PROVIDERS.map((p) => {
                      const alreadyAdded = apiKeys.some(
                        (k) => k.provider === p,
                      );
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
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

              {/* Conditionally reveal fields for Nomba */}
              {envModal.provider === "Nomba" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Grant Type
                    </label>
                    <input
                      type="text"
                      value={envModal.grantType}
                      onChange={(e) =>
                        setEnvModal({ ...envModal, grantType: e.target.value })
                      }
                      placeholder="e.g. client_credentials"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={envModal.clientId}
                      onChange={(e) =>
                        setEnvModal({ ...envModal, clientId: e.target.value })
                      }
                      placeholder="Enter Client ID"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Client Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showKey ? "text" : "password"}
                        value={envModal.clientSecret}
                        onChange={(e) =>
                          setEnvModal({
                            ...envModal,
                            clientSecret: e.target.value,
                          })
                        }
                        placeholder="Enter Client Secret"
                        className="block w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account ID
                    </label>
                    <input
                      type="text"
                      value={envModal.accountId}
                      onChange={(e) =>
                        setEnvModal({ ...envModal, accountId: e.target.value })
                      }
                      placeholder="Enter Account ID"
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-slate-900 sm:text-sm"
                    />
                  </div>
                </div>
              ) : (
                /* Existing Secret key input for other providers */
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={envModal.secretKey}
                      onKeyDown={(e) => {
                        // If the field still holds the original masked value,
                        // clear it entirely on the first backspace/delete or printable key
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {envModal.isEdit && (
                    <p className="mt-2 text-xs text-slate-400">
                      Clear the field and enter a new key. Key must be more than
                      10 characters.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={closeEnvModal}
                className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
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
      {/* Delete Confirmation Modal */}
      {keyToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Remove Integration
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to remove the{" "}
                <span className="font-semibold">{keyToDelete}</span>{" "}
                integration? You can re-add it later.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setKeyToDelete(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
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
    </div>
  );
}

export default Settings;
