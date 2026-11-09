import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { ParsedReceipt, ExpenseCategory } from '../../types';
import {
  ScanLine,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  Store,
} from 'lucide-react';

export const ReceiptScanner: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<ParsedReceipt | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  // Editable Form fields
  const [merchant, setMerchant] = useState<string>('');
  const [receiptDate, setReceiptDate] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [savingTransaction, setSavingTransaction] = useState<boolean>(false);

  React.useEffect(() => {
    api.expenses.getCategories().then((res) => {
      if (res.data?.success && res.data.data) {
        setCategories(res.data.data);
      }
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const processSelectedFile = (selected: File) => {
    setFile(selected);
    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    setParsedData(null);
  };

  const handleScanReceipt = async () => {
    if (!file) {
      toast.error('Please choose a receipt file to scan');
      return;
    }

    setScanning(true);
    try {
      const res = await api.expenses.uploadReceipt(file);
      if (res.data?.success && res.data.data) {
        const data = res.data.data;
        setParsedData(data);
        setMerchant(data.merchantName || '');
        setReceiptDate(data.receiptDate || new Date().toISOString().split('T')[0]);
        setTotalAmount(data.totalAmount || 0);

        // Find matching category
        if (data.predictedCategory) {
          const match = categories.find(
            (c) => c.name.toLowerCase() === data.predictedCategory?.toLowerCase()
          );
          if (match) setSelectedCategoryId(match.id);
        }

        toast.success('OCR scan complete! Please review and verify extracted details.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to scan receipt');
    } finally {
      setScanning(false);
    }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTransaction(true);

    try {
      const res = await api.expenses.createTransaction({
        receiptId: parsedData?.receiptId,
        categoryId: selectedCategoryId,
        type: 'EXPENSE',
        amount: totalAmount,
        currency: parsedData?.currency || 'INR',
        transactionDate: receiptDate,
        merchant,
        notes: notes || `Extracted from ${file?.name}`,
        isRecurring: false,
      });

      if (res.data?.success) {
        toast.success('Receipt successfully verified and saved as transaction!');
        navigate('/expenses/transactions');
      }
    } catch (err: any) {
      toast.error('Failed to commit transaction');
    } finally {
      setSavingTransaction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <ScanLine className="w-6 h-6 text-brand-600" />
          <span>Smart OCR Receipt Scanner</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload receipt images. OCR and AI extract merchants, dates, and amounts with confidence ratings. Review before committing to your ledger.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Upload & Preview */}
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900 shadow-sm"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-brand-600 mx-auto mb-2" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop receipt photo here or click to browse
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP, and PDF up to 15MB
            </p>
          </div>

          {file && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <FileText className="w-6 h-6 text-brand-600 flex-shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                onClick={handleScanReceipt}
                disabled={scanning}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing OCR...</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Run Smart Scan</span>
                  </>
                )}
              </button>
            </div>
          )}

          {previewUrl && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Receipt Image Preview
              </span>
              <img
                src={previewUrl}
                alt="Receipt Preview"
                className="max-h-80 w-auto mx-auto rounded-xl object-contain shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Right Column: Extracted Form & Verification */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Extracted Data Verification
              </h2>
              {parsedData && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  OCR Confidence: {parsedData.confidence}%
                </span>
              )}
            </div>

            {parsedData?.warnings && parsedData.warnings.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Review Alerts:</span>
                </div>
                {parsedData.warnings.map((w, i) => (
                  <p key={i} className="text-[11px]">• {w}</p>
                ))}
              </div>
            )}

            {parsedData ? (
              <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Merchant / Store Name
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Receipt Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        required
                        value={receiptDate}
                        onChange={(e) => setReceiptDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {parsedData.lineItems && parsedData.lineItems.length > 0 && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Detected Line Items ({parsedData.lineItems.length})
                    </label>
                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-800/40">
                      {parsedData.lineItems.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between text-[11px]">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{item.itemName}</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400">₹{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Weekly family grocery run"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingTransaction}
                  className="w-full mt-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  {savingTransaction ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Transaction...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save as Verified Expense</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">
                <ScanLine className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Upload and scan a receipt on the left to verify its data here.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Images stored securely outside public web roots. No payment card details are stored.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
