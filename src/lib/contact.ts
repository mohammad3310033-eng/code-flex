export function getWhatsAppDestination(whatsapp: string | null) {
  const digits = whatsapp?.replace(/\D/g, "") ?? "";
  const localDigits = digits.startsWith("963") ? digits.slice(3) : digits;
  const isPlaceholder = !digits || /^0+$/.test(localDigits);

  return {
    href: isPlaceholder ? "#contact" : `https://wa.me/${digits}`,
    isExternal: !isPlaceholder,
  };
}
