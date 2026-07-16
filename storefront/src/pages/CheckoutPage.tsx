import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCheckout } from "../hooks/useBasket";
import EmptyState from "../components/common/EmptyState";
import { useAppSelector } from "../app/hook";

const addressSchema = z.object({
  firstName: z.string().min(1, "Ad zorunlu."),
  lastName: z.string().min(1, "Soyad zorunlu."),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin."),
  city: z.string().min(1, "Şehir zorunlu."),
  district: z.string().min(1, "İlçe zorunlu."),
  fullAddress: z.string().min(10, "Adres en az 10 karakter olmalı."),
  zipCode: z.string().min(5, "Posta kodu zorunlu."),
});

const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  sameAsBilling: z.boolean(),
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(["CreditCard", "DebitCard", "BankTransfer", "CashOnDelivery"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  { value: "CreditCard", label: "Kredi Kartı" },
  { value: "DebitCard", label: "Banka Kartı" },
  { value: "BankTransfer", label: "Havale/EFT" },
  { value: "CashOnDelivery", label: "Kapıda Ödeme" },
];

function AddressFields({
  prefix,
  register,
  errors,
}: {
  prefix: "shippingAddress" | "billingAddress";
  register: any;
  errors: any;
}) {
  const e = errors[prefix] || {};

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
        <input
          {...register(`${prefix}.firstName`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        {e.firstName && <p className="text-xs text-red-500 mt-1">{e.firstName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
        <input
          {...register(`${prefix}.lastName`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        {e.lastName && <p className="text-xs text-red-500 mt-1">{e.lastName.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
        <input
          {...register(`${prefix}.phone`)}
          placeholder="05xx xxx xx xx"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        {e.phone && <p className="text-xs text-red-500 mt-1">{e.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
        <input
          {...register(`${prefix}.city`)}
          placeholder="İstanbul"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        {e.city && <p className="text-xs text-red-500 mt-1">{e.city.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
        <input
          {...register(`${prefix}.district`)}
          placeholder="Başakşehir"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        {e.district && <p className="text-xs text-red-500 mt-1">{e.district.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
        <textarea
          {...register(`${prefix}.fullAddress`)}
          rows={2}
          placeholder="Mahalle, sokak, bina no, daire no..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
        />
        {e.fullAddress && <p className="text-xs text-red-500 mt-1">{e.fullAddress.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
        <input
          {...register(`${prefix}.zipCode`)}
          placeholder="34000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        {e.zipCode && <p className="text-xs text-red-500 mt-1">{e.zipCode.message}</p>}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const basket = useAppSelector((state) => state.cart.basket);
  const { mutateAsync: checkout } = useCheckout();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsBilling: true,
      paymentMethod: "CreditCard",
    },
  });

  const sameAsBilling = watch("sameAsBilling");
  const shippingAddress = watch("shippingAddress");

  if (!basket || basket.items.length === 0) {
    return (
      <EmptyState
        title="Sepetiniz boş"
        description="Checkout yapabilmek için sepetinize ürün ekleyin."
        action={
          <button
            onClick={() => navigate("/products")}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm"
          >
            Alışverişe Başla
          </button>
        }
      />
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const billingAddress = data.sameAsBilling ? data.shippingAddress : data.billingAddress!;

      const result = await checkout({
        shippingAddress: data.shippingAddress,
        billingAddress,
        paymentMethod: data.paymentMethod,
        shippingFee: 0,
      });

      navigate(`/orders`, {
        state: { orderNumber: result.orderNumber },
      });
    } catch (err: any) {
      setError("root", {
        message:
          err.response?.data?.detail || err.response?.data?.message || "Sipariş oluşturulamadı.",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Siparişi Tamamla</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol — Adres ve Ödeme */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Teslimat Adresi */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Teslimat Adresi</h2>
              <AddressFields prefix="shippingAddress" register={register} errors={errors} />
            </div>

            {/* Fatura Adresi */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Fatura Adresi</h2>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" {...register("sameAsBilling")} className="rounded" />
                  Teslimat adresiyle aynı
                </label>
              </div>

              {!sameAsBilling && (
                <AddressFields prefix="billingAddress" register={register} errors={errors} />
              )}

              {sameAsBilling && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                  Teslimat adresi kullanılacak.
                </div>
              )}
            </div>

            {/* Ödeme Yöntemi */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Ödeme Yöntemi</h2>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:border-slate-900 has-checked:border-slate-900 has-:checked:bg-slate-50"
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register("paymentMethod")}
                      className="accent-slate-900"
                    />
                    <span className="text-sm font-medium text-gray-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {errors.root && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
                {errors.root.message}
              </p>
            )}
          </div>

          {/* Sağ — Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Sipariş Özeti</h2>

              {/* Ürünler */}
              <div className="flex flex-col gap-3 mb-4">
                {basket.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-medium text-slate-900 shrink-0">
                      {item.totalPrice.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{basket.subTotal.toLocaleString("tr-TR")} ₺</span>
                </div>

                {basket.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim</span>
                    <span>-{basket.discountAmount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>

                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-slate-900 text-base">
                  <span>Toplam</span>
                  <span>{basket.totalAmount.toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-5 bg-slate-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Sipariş oluşturuluyor..." : "Siparişi Onayla"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
