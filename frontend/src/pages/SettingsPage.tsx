import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Settings: appearance only (admin sign in lives on its own page: /login). */
export default function SettingsPage() {
  return (
    <div className="max-w-4xl py-8 space-y-6 container-page sm:py-12">
      <SectionHeader eyebrow="Settings" title="Make it yours" />
      <AppearanceSettings />
    </div>
  );
}
