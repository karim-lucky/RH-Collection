const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923365884894";

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function getGeneralWhatsAppMessage(): string {
  return "Hello, I am interested in your watches.";
}

export function getProductWhatsAppMessage(
  productName: string,
  price: string,
  quantity: number,
  color?: string
): string {
  return `Hello,

I want to purchase:

Product: ${productName}
Price: ${price}
${color ? `Color: ${color}\n` : ""}Quantity: ${quantity}

Please guide me further.`;
}

export function getOrderWhatsAppMessage(
  productName: string,
  price: string,
  color: string,
  quantity: number
): string {
  return `Hello, I want to order:

Product Name: ${productName}
Price: ${price}
Color: ${color}
Quantity: ${quantity}`;
}
