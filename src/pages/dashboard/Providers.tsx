import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Key, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";

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

function Providers() {
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [envModal, setEnvModal] = useState<EnvModal>(DEFAULT_ENV_MODAL);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

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
      await queryClient.invalidateQueries({
        queryKey: ["settings", userEmail],
      });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
          Providers
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Manage your payment provider integrations and API credentials.
        </p>
      </div>

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
                Click the Add Key button to integrate a new provider.
              </p>
            </div>
          ) : (
            apiKeys.map((config) => (
              <div key={config.provider} className="p-6">
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
                      type="button"
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
                          type="button"
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
                          type="button"
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
                          type="button"
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
                          type="button"
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

      {/* Environment Key Modal */}
      {envModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={closeEnvModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                closeEnvModal();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
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
                    <span className="ml-auto text-xs text-slate-400">
                      Locked
                    </span>
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

              {/* Conditionally reveal fields for Nomba */}
              {envModal.provider === "Nomba" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="grant-type"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Grant Type
                    </label>
                    <input
                      id="grant-type"
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
                    <label
                      htmlFor="client-id"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Client ID
                    </label>
                    <input
                      id="client-id"
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
                    <label
                      htmlFor="client-secret"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Client Secret
                    </label>
                    <div className="relative">
                      <input
                        id="client-secret"
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
                    <label
                      htmlFor="account-id"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Account ID
                    </label>
                    <input
                      id="account-id"
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
                  <label
                    htmlFor="secret-key"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      id="secret-key"
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
      {/* Delete Confirmation Modal */}
      {keyToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setKeyToDelete(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setKeyToDelete(null);
              }
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
    </div>
  );
}

export default Providers;
