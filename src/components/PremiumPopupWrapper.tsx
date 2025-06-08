"use client";

import dynamic from "next/dynamic";

// Dynamically import the premium popup to avoid SSR issues with sessionStorage
const PremiumPromoPopup = dynamic(
  () => import("@/components/PremiumPromoPopup"),
  { ssr: false }
);

export default function PremiumPopupWrapper(props: {
  delay?: number;
  showOnce?: boolean;
}) {
  return <PremiumPromoPopup {...props} />;
} 