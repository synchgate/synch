import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Key,
  Shield,
  ShieldAlert,
  Loader2,
  Webhook,
  RefreshCw,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

function MyApiKey() {
  const [showLiveSecret, setShowLiveSecret] = useState(false);
  const [showTestSecret, setShowTestSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookUrlLive, setWebhookUrlLive] = useState("");
  const [webhookUrlTest, setWebhookUrlTest] = useState("");
  const [webhookSavedLive, setWebhookSavedLive] = useState(false);
  const [webhookSavedTest, setWebhookSavedTest] = useState(false);
  const [webhookSavingLive, setWebhookSavingLive] = useState(false);
  const [webhookSavingTest, setWebhookSavingTest] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState<
    "live" | "test" | null
  >(null);
  const [confirmRegenerateModal, setConfirmRegenerateModal] = useState<
    "live" | "test" | null
  >(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/accounts/user/details/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const settingsRaw = settingsResponse?.data || settingsResponse || {};
  const merchantsData = settingsRaw?.merchants;
  const merchant = Array.isArray(merchantsData)
    ? merchantsData[0]
    : merchantsData;
  const apiClients = merchant?.api_clients || [];

  const liveClient = apiClients.find(
    (c: any) => c.environment?.toLowerCase() === "live",
  );
  const testClient = apiClients.find(
    (c: any) =>
      c.environment?.toLowerCase() === "sandbox" ||
      c.environment?.toLowerCase() === "test",
  );

  const apiKeys = {
    livePublicKey: liveClient?.client_public_key || "",
    liveSecretKey: liveClient?.client_secret_key || "",
    testPublicKey: testClient?.client_public_key || "",
    testSecretKey: testClient?.client_secret_key || "",
  };

  useEffect(() => {
    if (liveClient?.webhook_url) setWebhookUrlLive(liveClient.webhook_url);
    if (testClient?.webhook_url) setWebhookUrlTest(testClient.webhook_url);
  }, [liveClient?.webhook_url, testClient?.webhook_url]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const updateWebhookMutation = useMutation({
    mutationFn: async ({
      clientId,
      url,
    }: {
      clientId: string;
      url: string;
    }) => {
      const token = localStorage.getItem("authToken");
      const response = await api.patch(
        `/api/client/${clientId}/webhook-url/`,
        {
          webhook_url: url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const saveWebhook = async (env: "live" | "test") => {
    const url = env === "live" ? webhookUrlLive : webhookUrlTest;
    const clientId = env === "live" ? liveClient?.id : testClient?.id;

    if (!url.trim() || !clientId) {
      if (!clientId) {
        showNotification(
          "error",
          `Error: ${env === "live" ? "Live" : "Test"} Client ID not found`,
        );
      }
      return;
    }

    if (env === "live") setWebhookSavingLive(true);
    else setWebhookSavingTest(true);

    try {
      await updateWebhookMutation.mutateAsync({ clientId, url });

      if (env === "live") {
        setWebhookSavedLive(true);
        setTimeout(() => setWebhookSavedLive(false), 3000);
        showNotification("success", "Live webhook URL updated successfully");
      } else {
        setWebhookSavedTest(true);
        setTimeout(() => setWebhookSavedTest(false), 3000);
        showNotification("success", "Test webhook URL updated successfully");
      }
    } catch (error) {
      console.error("Failed to save webhook:", error);
      showNotification("error", "Error saving webhook URL");
    } finally {
      if (env === "live") setWebhookSavingLive(false);
      else setWebhookSavingTest(false);
    }
  };

  const handleRegenerate = async (env: "live" | "test") => {
    setConfirmRegenerateModal(env);
  };

  const regenerateMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        `/api/client/${clientId}/regenerate-keys/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      // Refresh the settings to grab the newly generated keys
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const confirmRegeneration = async () => {
    if (!confirmRegenerateModal) return;
    const env = confirmRegenerateModal;
    setConfirmRegenerateModal(null);
    setRegeneratingKey(env);

    try {
      // Find the proper ID based on the environment they clicked
      const clientId = env === "live" ? liveClient?.id : testClient?.id;
      if (clientId) {
        await regenerateMutation.mutateAsync(clientId);
        showNotification(
          "success",
          `API ${env === "live" ? "Live" : "Test"} keys successfully regenerated`,
        );
      } else {
        console.warn("Client ID not found for", env);
        showNotification(
          "error",
          `Error: ${env === "live" ? "Live" : "Test"} Client ID not found`,
        );
      }
    } catch (error) {
      console.error("Failed to regenerate key:", error);
      showNotification("error", "Error in regenerating API key");
    } finally {
      setRegeneratingKey(null);
    }
  };

  const renderKeyField = (
    label: string,
    value: string,
    id: string,
    isSecret: boolean,
    showSecret: boolean,
    toggleSecret?: () => void,
  ) => {
    const isCopied = copiedKey === id;

    return (
      <div className="mb-6 last:mb-0">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type={isSecret && !showSecret ? "password" : "text"}
              value={value || ""}
              readOnly
              className="block w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50 font-mono text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            {isSecret && toggleSecret && (
              <button
                type="button"
                onClick={toggleSecret}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                title={showSecret ? "Hide key" : "Show key"}
              >
                {showSecret ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <button
            onClick={() => copyToClipboard(value, id)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] sm:w-auto w-full group cursor-pointer shadow-sm"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-black mb-1">
          My API Keys
        </h1>
        <p className="text-slate-600 text-sm">
          Use these keys to authenticate your requests to the SynchGate API.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live Mode Keys */}
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-emerald-100 flex items-center justify-between gap-4 bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center border border-emerald-200 shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Live Mode
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keys for processing real transactions. Keep your secret key
                    safe.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRegenerate("live")}
                disabled={regeneratingKey === "live"}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-100/50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${regeneratingKey === "live" ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            </div>
            <div className="p-6 flex-1">
              {renderKeyField(
                "Public Key",
                apiKeys.livePublicKey,
                "live_public",
                false,
                true,
              )}
              {renderKeyField(
                "Secret Key",
                apiKeys.liveSecretKey,
                "live_secret",
                true,
                showLiveSecret,
                () => setShowLiveSecret(!showLiveSecret),
              )}
            </div>
          </div>

          {/* Test Mode Keys */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-amber-100 flex items-center justify-between gap-4 bg-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center border border-amber-200 shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Test Mode
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                      Sandbox
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keys for testing your integration. No real money is moved.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRegenerate("test")}
                disabled={regeneratingKey === "test"}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-100/50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${regeneratingKey === "test" ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            </div>
            <div className="p-6 flex-1">
              {renderKeyField(
                "Public Key",
                apiKeys.testPublicKey,
                "test_public",
                false,
                true,
              )}
              {renderKeyField(
                "Secret Key",
                apiKeys.testSecretKey,
                "test_secret",
                true,
                showTestSecret,
                () => setShowTestSecret(!showTestSecret),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Webhook Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shrink-0">
            <Webhook className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Webhook Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Receive real-time event notifications at your endpoint URL.
            </p>
          </div>
        </div>
        <div className="p-6">
          {/* Live Webhook */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <label
                htmlFor="webhook-url-live"
                className="block text-sm font-medium text-slate-700"
              >
                Live Webhook URL
              </label>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="webhook-url-live"
                  type="url"
                  value={webhookUrlLive}
                  onChange={(e) => setWebhookUrlLive(e.target.value)}
                  placeholder="https://yourdomain.com/webhooks/synchgate/live"
                  className="block w-full pl-4 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => saveWebhook("live")}
                disabled={webhookSavingLive || !webhookUrlLive.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] sm:w-auto w-full shadow-sm cursor-pointer"
              >
                {webhookSavingLive ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : webhookSavedLive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Live Webhook</span>
                )}
              </button>
            </div>
          </div>

          {/* Test Webhook */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label
                htmlFor="webhook-url-test"
                className="block text-sm font-medium text-slate-700"
              >
                Test Webhook URL
              </label>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                Sandbox
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="webhook-url-test"
                  type="url"
                  value={webhookUrlTest}
                  onChange={(e) => setWebhookUrlTest(e.target.value)}
                  placeholder="https://yourdomain.com/webhooks/synchgate/test"
                  className="block w-full pl-4 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => saveWebhook("test")}
                disabled={webhookSavingTest || !webhookUrlTest.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] sm:w-auto w-full shadow-sm cursor-pointer"
              >
                {webhookSavingTest ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : webhookSavedTest ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Test Webhook</span>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
            We'll send POST requests with event payloads to these URLs. Make
            sure your endpoints return a{" "}
            <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">
              200
            </code>{" "}
            status to acknowledge receipt.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <Key className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 mb-1">
            Key Security Principles
          </h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>
              Never share your secret keys in publicly accessible areas (GitHub,
              client-side code).
            </li>
            <li>
              Your public keys can be safely used in front-end applications or
              mobile apps.
            </li>
            <li>
              If you suspect your secret key has been compromised, you should
              roll it immediately.
            </li>
          </ul>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  Regenerate{" "}
                  {confirmRegenerateModal === "live" ? "Live" : "Test"} Key?
                </h3>
              </div>
              <button
                onClick={() => setConfirmRegenerateModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Are you absolutely sure you want to regenerate your{" "}
                <strong>
                  {confirmRegenerateModal === "live" ? "Live" : "Test"}
                </strong>{" "}
                keys?
              </p>

              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-800">
                <strong>Warning:</strong> Any active applications or
                integrations currently using the old{" "}
                {confirmRegenerateModal === "live" ? "Live" : "Test"} keys will
                immediately be <strong>disconnected</strong> and will fail to
                authenticate until they are updated with the new keys.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setConfirmRegenerateModal(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmRegeneration}
                className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-500/20 text-sm flex items-center gap-2 cursor-pointer"
              >
                Yes, Regenerate Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border ${notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
              }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className={`ml-2 p-1 rounded-md transition-colors cursor-pointer ${notification.type === "success"
                  ? "hover:bg-emerald-100/80 text-emerald-600"
                  : "hover:bg-red-100/80 text-red-600"
                }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApiKey;
