import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Building2,
  CheckCircle,
  CreditCard as CreditCardIcon,
  FileText,
  Settings as SettingsIcon,
  Settings2,
  Shield,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { COUNTRIES } from "../../data/countries";
import { api } from "../../lib/api";

function Settings() {
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "general");

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
    queryKey: ["settings", userEmail],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/accounts/user/details/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Extract configured providers
  const apiClients = merchant?.api_clients || [];
  const providers = Array.from(
    new Set(
      apiClients.flatMap((client: any) =>
        (client.providers || []).map((p: any) => {
          if (!p || !p.provider) return null;
          return (
            p.provider.charAt(0).toUpperCase() +
            p.provider.slice(1).toLowerCase()
          );
        }),
      ),
    ),
  ).filter(Boolean) as string[];

  const [providerToggles, setProviderToggles] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (providers.length > 0) {
      const initialToggles: Record<string, boolean> = {};
      providers.forEach((p) => {
        // Toggled on by default if more than one provider, else off
        initialToggles[p] = providers.length > 1;
      });
      setProviderToggles(initialToggles);
    }
  }, [providers.length]);

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
        queryClient.invalidateQueries({ queryKey: ["settings", userEmail] });
        setTimeout(() => setBusinessSaveStatus("idle"), 3000);
      },
      onError: () => {
        setBusinessSaveStatus("error");
        setTimeout(() => setBusinessSaveStatus("idle"), 3000);
      },
    });

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

            { id: "kyc", label: "KYC Documents", icon: FileText },
            { id: "configuration", label: "Configuration", icon: Settings2 },
            { id: "billing", label: "Billing Plans", icon: CreditCardIcon },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
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
                        <div className="w-20 h-20 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-semibold shadow-md shrink-0">
                          {firstName?.[0]?.toUpperCase() || "U"}
                          {lastName?.[0]?.toUpperCase() || ""}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            First Name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="emailAddress"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Email Address
                          </label>
                          <input
                            id="emailAddress"
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
                          <label
                            htmlFor="businessName"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Business Name
                          </label>
                          <input
                            id="businessName"
                            type="text"
                            value={businessForm.business_name}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="businessEmail"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Business Email
                          </label>
                          <input
                            id="businessEmail"
                            type="email"
                            value={businessForm.business_email}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="businessPhone"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Business Phone
                          </label>
                          <input
                            id="businessPhone"
                            type="tel"
                            value={businessForm.business_phone}
                            readOnly
                            className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="businessType"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Business Type
                          </label>
                          <input
                            id="businessType"
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
                          <label
                            htmlFor="website"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Website
                          </label>
                          <input
                            id="website"
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
                          <label
                            htmlFor="registrationNumber"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Registration Number
                          </label>
                          <input
                            id="registrationNumber"
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
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Address
                          </label>
                          <input
                            id="address"
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
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Country
                          </label>
                          <select
                            id="country"
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
                          <label
                            htmlFor="stateProvince"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            State/Province
                          </label>
                          <input
                            id="stateProvince"
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
                          type="button"
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

              {/* Configuration Tab Content */}
              {activeTab === "configuration" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50/60 font-black">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shrink-0">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Smart Routes
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manage automated routing preferences for each
                          provider.
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {providers.length === 0 ? (
                        <div className="p-12 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings2 className="w-6 h-6 text-slate-300" />
                          </div>
                          <p className="text-sm font-medium text-slate-900 mb-1">
                            No providers configured
                          </p>
                          <p className="text-xs text-slate-500">
                            Configure providers in the Providers tab to manage
                            smart routing.
                          </p>
                        </div>
                      ) : (
                        providers.map((p) => (
                          <div
                            key={p}
                            className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 shrink-0 font-['Outfit'] font-black">
                                {p[0]}
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {p}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setProviderToggles((prev) => ({
                                  ...prev,
                                  [p]: !prev[p],
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                                                            ${providerToggles[p] ? "bg-blue-600" : "bg-slate-200"}
                                                        `}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                                                                ${providerToggles[p] ? "translate-x-5" : "translate-x-0"}
                                                            `}
                              />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-4 bg-blue-50/50 border-t border-slate-100 italic">
                      <p className="text-[10px] text-blue-600 flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        {providers.length > 1
                          ? "Smart Routes is enabled by default because multiple providers are detected."
                          : "Smart Routes is disabled because only one provider is configured."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State for other tabs */}
              {activeTab !== "general" &&
                activeTab !== "business" &&
                activeTab !== "kyc" &&
                activeTab !== "configuration" &&
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
